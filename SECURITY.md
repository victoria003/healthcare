# Security Architecture & Cryptography Guidelines

Security and privacy are critical. The platform implements rigorous end-to-end security measures to satisfy HIPAA alignment, protect patient health information (PHI), and guarantee transaction integrity.

---

## 1. Authentication & Token Management

The platform utilizes a robust JWT architecture for authentication:

### Token Mechanics:
- **Access Tokens**: Short-lived (1 hour), stored in-memory or securely inside HttpOnly, SameSite=Strict cookies.
- **Refresh Tokens**: Long-lived (7 days), stored exclusively in encrypted HttpOnly cookies to defend against Cross-Site Scripting (XSS).
- **Token Signing**: Cryptographically signed using standard HS256/RS256 algorithms. Secrets are stored securely in environment variables and are never committed to code repositories.

---

## 2. Role-Based Access Control (RBAC)

RBAC controls permission scopes on all controllers and services.

### Core Domain Roles:
1. **Platform Admin**: Superuser status. Absolute access to all schemas, tenants, billing matrices, and security audits.
2. **Agency Owner**: Complete authority over their specific agency profile, financial records, subscriptions, and staff rosters.
3. **Agency Admin**: Onboard staff, review incoming bookings, configure local branding, and verify operational files.
4. **Coordinator**: Core booking operations operator, manually assign staff, coordinate scheduling, and escalate support issues.
5. **Nurse / Caregiver / Physiotherapist / Doctor**: Direct care access. Can only read assigned bookings, submit clinical notes, and log patient vitals.
6. **Patient / Family Member**: View care plans, track current visit arrivals, pay invoices, and submit feedback ratings.

---

## 3. OWASP Best Practices & Attack Defenses

- **Input Sanitization**: All incoming data parameters are strictly validated using schemas. This effectively eliminates Injection attacks.
- **Cross-Site Scripting (XSS) Defenses**: All client content displays are sanitized. Secure cookie flags ensure session tokens are inaccessible to client scripts.
- **Cross-Site Request Forgery (CSRF) Prevention**: Custom request headers (e.g., `x-tenant-id`, JWT bearers) are checked on every API transaction.
- **Rate Limiting**: Enforced on all public-facing routes via proxy-level rate limits to protect against brute-force and DDoS attempts.
- **Database Access Security**: No raw string concatenations in Snowflake queries. All query inputs are strictly parameterized or executed via safe, structured service methods.
