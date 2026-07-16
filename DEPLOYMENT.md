# Production Deployment Checklist: Cloudflare Pages

This document provides instructions for compiling, configuring, and releasing the HomeCare Marketplace platform onto Cloudflare Pages and Cloud Run containers.

---

## 1. Automated Build Phase

The production deployment runs via a standard CI/CD pipeline triggered by repository commits:

```bash
# 1. Install all production and dev dependencies
npm ci

# 2. Compile client and static assets using Next.js production build
npm run build
```

This output produces static assets in `dist/` or the optimized `.next` output directory configured for edge runtime optimization.

---

## 2. Environment Configuration (.env)

Ensure the following variables are configured in the Cloudflare Dashboard or target container environment:

```env
# Core Server Configuration
PORT=3000
JWT_SECRET=your_jwt_signing_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_signing_secret_key

# Google Gemini AI SDK Credentials
GEMINI_API_KEY=your_gemini_api_credential_key

# Snowflake Analytical Connection Parameters
SNOWFLAKE_ACCOUNT=your_snowflake_account_identifier
SNOWFLAKE_USERNAME=your_snowflake_user
SNOWFLAKE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...your_key_here...\n-----END RSA PRIVATE KEY-----"
SNOWFLAKE_WAREHOUSE=your_snowflake_warehouse
SNOWFLAKE_DATABASE=your_snowflake_db
SNOWFLAKE_SCHEMA=your_snowflake_schema
```

---

## 3. Deployment Safety Check

Before triggering a release, verify the following:
1. **Linter Check**: Run `npm run lint` (`tsc --noEmit`) to verify that there are no remaining TypeScript compiler errors.
2. **Telemetry Consent**: Confirm Next.js telemetry configurations are set.
3. **Sensitive Keys Checked**: Confirm no active keys or credentials exist inside standard code files.
4. **Cloudflare Edge Adapter**: Ensure the Next.js runtime matches edge configurations.
