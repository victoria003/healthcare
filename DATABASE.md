# Database Architecture: Snowflake Warehousing

The HomeCare Grid platform utilizes separate Snowflake schemas to decouple transactional processing, historical audit trails, security ledgers, and operational AI analytics.

---

## 1. Schema Classification & Layout

The Snowflake data warehouse is segmented into 12 secure, isolated schemas:

```
[SNOWFLAKE WAREHOUSE]
 ├── IDENTITY       - Core authentication tables, passwords, and JWT sessions.
 ├── MARKETPLACE    - Agency profiles, ratings cache, and geopoint ranges.
 ├── PATIENTS       - Patient medical indexes, family mappings, and emergency keys.
 ├── STAFF          - Caregiver certifications, biometric profiles, and experiences.
 ├── BOOKINGS       - 15-step state machine tables, payment flags, and audit notes.
 ├── VISITS         - Check-in GPS locations, selfie liveness scores, and signatures.
 ├── CLINICAL       - Care plans, medications, allergy registers, and timelines.
 ├── PAYMENTS       - SaaS billing subscriptions, agency invoice details, and payroll.
 ├── NOTIFICATIONS  - Template layouts, outbound retry channels, and histories.
 ├── AUDIT          - Decentralized security ledgers and system audit logs.
 ├── REPORTING      - Aggregated analytical summaries, metrics, and forecasting.
 └── AI             - Fraud flags, scheduling scores, and matching telemetry.
```

---

## 2. Table Schematics (Key Relations)

All tables strictly enforce row-level **`tenant_id`** or agency tracking to isolate agency data.

### Schema `IDENTITY`
- **`USERS`**: `user_id` (PK), `tenant_id`, `email`, `phone`, `password_hash`, `role`, `full_name`, `created_at`.

### Schema `MARKETPLACE`
- **`AGENCIES`**: `agency_id` (PK), `name`, `owner_name`, `city`, `pincode`, `rating`, `review_count`, `verified`, `status`.

### Schema `BOOKINGS`
- **`BOOKINGS`**: `booking_id` (PK), `tenant_id`, `patient_id`, `agency_id`, `assigned_staff_id`, `status`, `amount`, `date`, `time_slot`, `created_at`.

### Schema `VISITS`
- **`VISITS_OPERATIONS`**: `visit_id` (PK), `booking_id`, `tenant_id`, `staff_id`, `check_in_time`, `check_out_time`, `gps_latitude`, `gps_longitude`, `liveness_score`.

### Schema `CLINICAL`
- **`CARE_PLANS`**: `care_plan_id` (PK), `tenant_id`, `patient_id`, `diagnosis`, `medications`, `allergies`, `status`, `created_at`.
- **`TIMELINE_EVENTS`**: `event_id` (PK), `patient_id`, `category`, `title`, `description`, `timestamp`.

---

## 3. Row-Level Tenant Isolation Rules

Tenant safety is maintained through a mandatory `tenant_id` column present in every non-global transactional database table:
1. **Repository Layer Enforcement**: When writing queries, all repositories must append the current session’s `tenant_id` parameter to `WHERE` clauses.
2. **Middleware Interception**: The `middleware.ts` system parses subdomain configurations, checks JWT credentials, and places the active `x-tenant-id` in downstream request contexts.
3. **Cross-Tenant Prevention**: High-security procedures inside Snowflake automatically block queries where the query user’s tenant profile does not match the record's `tenant_id`.
