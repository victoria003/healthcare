/**
 * Snowflake SQL API Client (Production Grade)
 * 
 * Communicates with Snowflake via the REST SQL API over HTTPS.
 * Uses only fetch() and Web Crypto — fully optimized for Cloudflare Workers/Pages edge runtimes.
 * 
 * Features:
 *  - Asymmetric Key-Pair JWT generation cached & reused.
 *  - CryptoKey caching for zero redundant PKCS#8 parser overhead.
 *  - Clock skew buffers on token issue times.
 *  - High-traffic fetch wrapper with client-side timeout & AbortController.
 *  - Robust exponential backoff retry policies for rate-limiting (429) & network failures (5xx).
 *  - Statelessly compliant transaction block batching.
 *  - Automated result set partition loading.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const CLOCK_SKEW_SECONDS = 60;
const TOKEN_LIFETIME_SECONDS = 3600;
const REUSE_THRESHOLD_SECONDS = 300; // Reuse token if valid for >= 5 minutes
const HTTP_REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_INITIAL_DELAY_MS = 1000;

// ─── Cache Storage ───────────────────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // Epoch seconds
let cachedCryptoKey: CryptoKey | null = null;
let cachedFingerprint: string | null = null;
let cachedPrivateKeyPem: string | null = null;

// Thread-safe mutex lock for token generation
let jwtPromise: Promise<string> | null = null;

// Reusable TextEncoder for performance
const textEncoder = new TextEncoder();

// ─── Types & Interfaces ──────────────────────────────────────────────────────

export interface SnowflakeConfig {
  account: string;
  username: string;
  privateKey: string;
  password?: string;
  warehouse: string;
  database: string;
  schema: string;
  role?: string;
  publicKeyFingerprint?: string;
}

export interface SQLAPIStatementRequest {
  statement: string;
  timeout?: number;
  database?: string;
  schema?: string;
  warehouse?: string;
  role?: string;
  bindings?: Record<string, { type: string; value: string | null }>;
  parameters?: Record<string, string | number | boolean>;
}

export interface SQLAPIResponse {
  resultSetMetaData?: {
    numRows: number;
    format: string;
    rowType: Array<{ name: string; type: string }>;
    partitionInfo?: Array<{ rowCount: number; compressedSize: number }>;
  };
  data?: string[][];
  code?: string;
  statementHandle?: string;
  statementStatusUrl?: string;
  message?: string;
  sqlState?: string;
  createdOn?: number;
}

// ─── Error Handling ──────────────────────────────────────────────────────────

export class SnowflakeError extends Error {
  public statusCode: number;
  public sqlState?: string;
  public code?: string;

  constructor(message: string, statusCode: number, sqlState?: string, code?: string) {
    super(message);
    this.name = "SnowflakeError";
    this.statusCode = statusCode;
    this.sqlState = sqlState;
    this.code = code;
  }
}

// ─── Configuration & Validation ──────────────────────────────────────────────

export function getSnowflakeConfig(): SnowflakeConfig {
  return {
    account: process.env.SNOWFLAKE_ACCOUNT || "",
    username: process.env.SNOWFLAKE_USERNAME || process.env.SNOWFLAKE_USER || "",
    privateKey: process.env.SNOWFLAKE_PRIVATE_KEY || "",
    password: process.env.SNOWFLAKE_PASSWORD || "",
    warehouse: process.env.SNOWFLAKE_WAREHOUSE || "",
    database: process.env.SNOWFLAKE_DATABASE || "",
    schema: process.env.SNOWFLAKE_SCHEMA || "",
    role: process.env.SNOWFLAKE_ROLE || "",
    publicKeyFingerprint: process.env.SNOWFLAKE_PUBLIC_KEY_FINGERPRINT || "",
  };
}

export function isSnowflakeConfigured(): boolean {
  const config = getSnowflakeConfig();
  return !!(config.account && config.username && config.privateKey);
}

/**
 * Validates database environment variables dynamically at runtime.
 */
export function validateSnowflakeConfig(config: SnowflakeConfig): void {
  const missing: string[] = [];
  if (!config.account) missing.push("SNOWFLAKE_ACCOUNT");
  if (!config.username) missing.push("SNOWFLAKE_USERNAME / SNOWFLAKE_USER");
  if (!config.privateKey) missing.push("SNOWFLAKE_PRIVATE_KEY");
  if (!config.warehouse) missing.push("SNOWFLAKE_WAREHOUSE");
  if (!config.database) missing.push("SNOWFLAKE_DATABASE");
  if (!config.schema) missing.push("SNOWFLAKE_SCHEMA");

  if (missing.length > 0) {
    throw new SnowflakeError(
      `Missing required Snowflake configuration parameters: ${missing.join(", ")}`,
      500
    );
  }
}

// ─── Cryptography & JWT Generation ───────────────────────────────────────────

function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeString(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const normalized = pem.replace(/\\n/g, "\n");
  const b64 = normalized
    .replace(/-----BEGIN (RSA )?PRIVATE KEY-----/g, "")
    .replace(/-----END (RSA )?PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Calculates SHA256 public key fingerprint from PKCS#8 private key
 */
async function calculateFingerprint(privateKeyPem: string): Promise<string> {
  if (cachedFingerprint && cachedPrivateKeyPem === privateKeyPem) {
    return cachedFingerprint;
  }

  const keyData = pemToArrayBuffer(privateKeyPem);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["sign"]
  );

  const jwk = await crypto.subtle.exportKey("jwk", cryptoKey);
  const publicJwk = {
    kty: jwk.kty,
    n: jwk.n,
    e: jwk.e,
  };

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    publicJwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    ["verify"]
  );

  const spki = await crypto.subtle.exportKey("spki", publicKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", spki);
  
  const binary = String.fromCharCode(...new Uint8Array(hashBuffer));
  const base64Hash = btoa(binary);

  cachedFingerprint = `SHA256:${base64Hash}`;
  cachedPrivateKeyPem = privateKeyPem;
  return cachedFingerprint;
}

/**
 * Concurrent/Thread-safe token retrieval
 */
export async function getOrGenerateJWT(config: SnowflakeConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  // Return cached token if valid
  if (cachedToken && now < tokenExpiresAt - REUSE_THRESHOLD_SECONDS) {
    return cachedToken;
  }

  // Mutex lock to avoid multiple requests generating token in parallel
  if (!jwtPromise) {
    jwtPromise = (async () => {
      try {
        const token = await generateSnowflakeJWT(config);
        cachedToken = token;
        tokenExpiresAt = now + TOKEN_LIFETIME_SECONDS;
        return token;
      } finally {
        jwtPromise = null;
      }
    })();
  }

  return jwtPromise;
}

async function generateSnowflakeJWT(config: SnowflakeConfig): Promise<string> {
  const accountUpper = config.account.toUpperCase();
  const usernameUpper = config.username.toUpperCase();
  const qualifiedUsername = `${accountUpper}.${usernameUpper}`;

  let fingerprint = config.publicKeyFingerprint;
  if (!fingerprint) {
    try {
      fingerprint = await calculateFingerprint(config.privateKey);
    } catch {
      console.warn("[Snowflake REST] Unable to derive public fingerprint. Proceeding with user identity.");
    }
  }

  const issuer = fingerprint ? `${qualifiedUsername}.${fingerprint}` : qualifiedUsername;
  const subject = qualifiedUsername;

  const now = Math.floor(Date.now() / 1000);
  const iat = now - CLOCK_SKEW_SECONDS;
  const exp = now + TOKEN_LIFETIME_SECONDS;

  const header = { alg: "RS256", typ: "JWT" };
  const payload = { iss: issuer, sub: subject, iat, exp };

  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Cache imported key to avoid CPU overhead on subsequent calls
  if (!cachedCryptoKey || cachedPrivateKeyPem !== config.privateKey) {
    const keyData = pemToArrayBuffer(config.privateKey);
    cachedCryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      keyData,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
    cachedPrivateKeyPem = config.privateKey;
  }

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cachedCryptoKey,
    textEncoder.encode(signingInput)
  );

  const signature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${signingInput}.${signature}`;
}

// ─── Fetch Client wrapper with Retry and Timeouts ────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryCount: number = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTTP_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const status = response.status;
    const retriableStatuses = [429, 500, 502, 503, 504];

    if (!retriableStatuses.includes(status) || retryCount >= MAX_RETRIES) {
      return response;
    }

    const delay = RETRY_INITIAL_DELAY_MS * Math.pow(2, retryCount);
    console.warn(`[Snowflake REST] Retriable HTTP status ${status} hit. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return fetchWithRetry(url, options, retryCount + 1);
  } catch (error: any) {
    clearTimeout(timeoutId);

    const isTimeout = error.name === "AbortError";
    const isNetworkError = error instanceof TypeError;

    if ((isTimeout || isNetworkError) && retryCount < MAX_RETRIES) {
      const delay = RETRY_INITIAL_DELAY_MS * Math.pow(2, retryCount);
      console.warn(`[Snowflake REST] Request ${isTimeout ? "Timeout" : "Network error"} hit. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retryCount + 1);
    }

    throw error;
  }
}

// ─── SQL Statement Helpers ───────────────────────────────────────────────────

function getAPIBaseUrl(account: string): string {
  return `https://${account}.snowflakecomputing.com`;
}

/**
 * Convert positional `?` binds to Snowflake SQL REST bind syntax (:1, :2, etc.).
 */
export function convertBinds(
  sql: string,
  binds: unknown[]
): { statement: string; bindings: Record<string, { type: string; value: string | null }> } {
  if (!binds || binds.length === 0) {
    return { statement: sql, bindings: {} };
  }

  let paramIndex = 0;
  const statement = sql.replace(/\?/g, () => {
    paramIndex++;
    return `:${paramIndex}`;
  });

  const bindings: Record<string, { type: string; value: string | null }> = {};
  binds.forEach((value, index) => {
    const key = String(index + 1);
    if (value === null || value === undefined) {
      bindings[key] = { type: "TEXT", value: null };
    } else if (typeof value === "number") {
      if (Number.isInteger(value)) {
        bindings[key] = { type: "FIXED", value: String(value) };
      } else {
        bindings[key] = { type: "REAL", value: String(value) };
      }
    } else if (typeof value === "boolean") {
      bindings[key] = { type: "BOOLEAN", value: String(value) };
    } else {
      bindings[key] = { type: "TEXT", value: String(value) };
    }
  });

  return { statement, bindings };
}

/**
 * Maps query column type conversions based on metadata schema.
 */
function transformRows(response: SQLAPIResponse): Record<string, unknown>[] {
  if (!response.data || !response.resultSetMetaData?.rowType) {
    return [];
  }

  const columns = response.resultSetMetaData.rowType;
  return response.data.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      const rawValue = row[index];
      if (rawValue === null || rawValue === undefined) {
        obj[col.name] = null;
      } else {
        const colType = col.type.toUpperCase();
        if (colType === "FIXED" || colType === "NUMBER" || colType === "DECIMAL" || colType === "NUMERIC" || colType === "INT" || colType === "INTEGER" || colType === "BIGINT" || colType === "SMALLINT" || colType === "TINYINT" || colType === "FLOAT" || colType === "DOUBLE" || colType === "REAL") {
          obj[col.name] = Number(rawValue);
        } else if (colType === "BOOLEAN") {
          obj[col.name] = rawValue === "true" || rawValue === "1";
        } else {
          obj[col.name] = rawValue;
        }
      }
    });
    return obj;
  });
}

// ─── SQL Execution Logic ─────────────────────────────────────────────────────

async function submitStatement(
  config: SnowflakeConfig,
  request: SQLAPIStatementRequest
): Promise<SQLAPIResponse> {
  const jwt = await getOrGenerateJWT(config);
  const baseUrl = getAPIBaseUrl(config.account);
  const url = `${baseUrl}/api/v2/statements?async=false`;

  const body: Record<string, unknown> = {
    statement: request.statement,
    timeout: request.timeout || 60,
    database: request.database || config.database,
    schema: request.schema || config.schema,
    warehouse: request.warehouse || config.warehouse,
  };

  if (request.role || config.role) {
    body.role = request.role || config.role;
  }

  if (request.bindings && Object.keys(request.bindings).length > 0) {
    body.bindings = request.bindings;
  }

  if (request.parameters) {
    body.parameters = request.parameters;
  }

  const startTime = Date.now();
  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`,
      "Accept": "application/json",
      "User-Agent": "HomeCare-Marketplace/1.0",
      "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT",
    },
    body: JSON.stringify(body),
  });

  const responseData: SQLAPIResponse = await response.json();
  const duration = Date.now() - startTime;

  if (response.status === 202 && responseData.statementHandle) {
    return await pollForResults(config, responseData.statementHandle);
  }

  if (!response.ok) {
    throw new SnowflakeError(
      responseData.message || `Snowflake REST API execution failure: HTTP ${response.status}`,
      response.status,
      responseData.sqlState,
      responseData.code
    );
  }

  // Structured compliance log (never logs privateKey, JWT, auth headers or credentials)
  console.log(
    `[Snowflake REST] Query completed | Handle: ${responseData.statementHandle || "N/A"} | Status: ${response.status} | Duration: ${duration}ms`
  );

  return responseData;
}

async function pollForResults(
  config: SnowflakeConfig,
  statementHandle: string,
  maxAttempts: number = 60,
  intervalMs: number = 1000
): Promise<SQLAPIResponse> {
  const jwt = await getOrGenerateJWT(config);
  const baseUrl = getAPIBaseUrl(config.account);
  const url = `${baseUrl}/api/v2/statements/${statementHandle}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Accept": "application/json",
        "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT",
      },
    });

    const data: SQLAPIResponse = await response.json();

    if (response.status === 200) {
      return data;
    }

    if (response.status === 202) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      continue;
    }

    throw new SnowflakeError(
      data.message || `Snowflake execution polling failed: HTTP ${response.status}`,
      response.status,
      data.sqlState,
      data.code
    );
  }

  throw new SnowflakeError(
    `Snowflake polling timed out after ${maxAttempts} attempts. Handle: ${statementHandle}`,
    408
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

export { SnowflakeError as SnowflakeAPIError };

/**
 * Execute a parameterized query with '?' bind parameters.
 */
export async function executeQuery<T = any>(
  sql: string,
  binds: unknown[] = []
): Promise<T[]> {
  const config = getSnowflakeConfig();
  validateSnowflakeConfig(config);

  const { statement, bindings } = convertBinds(sql, binds);
  const response = await submitStatement(config, { statement, bindings });
  
  return transformRows(response) as unknown as T[];
}

/**
 * Stateless transaction block execution.
 * Semicolon-separated SQL run under a single REST request using MULTI_STATEMENT_COUNT parameter.
 */
export async function executeTransaction<T = any>(
  statements: string[],
  bindsList: unknown[][] = []
): Promise<T[]> {
  const config = getSnowflakeConfig();
  validateSnowflakeConfig(config);

  const sqlCount = statements.length + 2; // Including BEGIN and COMMIT
  const combinedSql = [
    "BEGIN TRANSACTION;",
    ...statements.map((s) => (s.trim().endsWith(";") ? s.trim() : `${s.trim()};`)),
    "COMMIT;"
  ].join("\n");

  const allBinds = bindsList.reduce((acc, current) => acc.concat(current), []);
  const { statement, bindings } = convertBinds(combinedSql, allBinds);

  try {
    const response = await submitStatement(config, {
      statement,
      bindings,
      parameters: {
        MULTI_STATEMENT_COUNT: sqlCount,
      },
    });
    return transformRows(response) as unknown as T[];
  } catch (error: any) {
    console.error(`[Snowflake REST] Transaction script failed. Executing fallback rollback: ${error.message}`);
    try {
      await executeQuery("ROLLBACK;");
    } catch (rbErr: any) {
      console.error("[Snowflake REST] Rollback failed:", rbErr.message);
    }
    throw error;
  }
}

/**
 * Automatically pages large result sets.
 */
export async function executePaginatedQuery<T = any>(
  sql: string,
  binds: unknown[] = [],
  pageSize: number = 10000
): Promise<T[]> {
  const config = getSnowflakeConfig();
  validateSnowflakeConfig(config);

  const { statement, bindings } = convertBinds(sql, binds);
  const response = await submitStatement(config, {
    statement,
    bindings,
    parameters: { ROWS_PER_RESULTSET: pageSize },
  });

  const allRows = transformRows(response);

  // Retrieve subsequent partitions if result set spans multiple chunks
  if (
    response.resultSetMetaData?.partitionInfo &&
    response.resultSetMetaData.partitionInfo.length > 1 &&
    response.statementHandle
  ) {
    const jwt = await getOrGenerateJWT(config);
    const baseUrl = getAPIBaseUrl(config.account);

    for (let partition = 1; partition < response.resultSetMetaData.partitionInfo.length; partition++) {
      const partitionUrl = `${baseUrl}/api/v2/statements/${response.statementHandle}?partition=${partition}`;
      
      const partResponse = await fetchWithRetry(partitionUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Accept": "application/json",
          "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT",
        },
      });

      if (!partResponse.ok) {
        throw new SnowflakeError(
          `Failed to load query result partition ${partition}`,
          partResponse.status
        );
      }

      const partData: SQLAPIResponse = await partResponse.json();
      allRows.push(...transformRows(partData));
    }
  }

  return allRows as unknown as T[];
}
