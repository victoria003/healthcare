# Multi-Tenant Architecture & Data Isolation

The HomeCare Grid platform is built from the ground up as a multi-tenant Software-as-a-Service (SaaS) application. It provides absolute data isolation, customized brand matching, and individual billing limits for each healthcare agency.

---

## 1. Tenant Resolution Mechanism

Every incoming web request is analyzed by `middleware.ts` to identify the active tenant context:

```
                  [ Incoming HTTP Request ]
                             │
                             ▼
                [ Parse Host / Subdomain ]
              (e.g., nisarga.homecaregrid.com)
                             │
                             ▼
           [ Match Tenant ID in Agency Directory ]
                             │
                             ▼
         [ Inject 'X-Tenant-ID' in Request Header ]
                             │
                             ▼
        [ Service and Database Operations Isolated ]
```

---

## 2. Multi-Tenant Custom Brand Support

The layout adapts to the active tenant’s brand specifications, which are retrieved dynamically via `TenantRepository`:

- **White-Labeling**: Primary theme colors, logos, portal page titles, and compliance footers are matched to the agency profile.
- **Subdomain Routing**: Support for custom domains (e.g., `agency-portal.nisargacare.com`).
- **Feature Flagging**: Different features can be activated or deactivated per tenant (e.g., activating AI-based scheduling for Premium tier agencies).

---

## 3. Data Isolation and Storage Safeguards

1. **Logical Isolation**: Every transaction table includes a `tenant_id` column as a partition key.
2. **Access Safeguards**:
   - Platform admins can search across all records for compliance and diagnostic reports.
   - Agency owners, admins, and caregivers are strictly restricted to records where `tenant_id` matches their verified organization.
   - Any query attempting to access or edit another tenant’s data without authentication will immediately generate a high-severity `TENANT_BREACH_ALERT` in the audit ledger.
