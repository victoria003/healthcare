# HomeCare SaaS Marketplace - Enterprise Multi-Tenant Platform

An enterprise-grade, full-stack Next.js 15 App Router platform optimized for secure healthcare operations and Cloudflare deployment.

---

## IDENTITY
- **Authentication**: JWT-based security model implementing Access (1h) and Refresh (7d) tokens. Supports Password Login, OTP via phone/email, and Google OAuth Callback.
- **Tenant Isolation**: Multi-tenant architecture using host/subdomain identification. The custom `middleware.ts` intercepts incoming requests, extracts the tenant context, and injects secure `x-tenant-id` tracking headers to isolate database sessions at the repository level.

## MARKETPLACE
- **Agency Discovery**: High-performance, low-latency directory of approved home healthcare agencies.
- **Search Filters**: Multi-parameter queries filtering by geographic proximity (state, city, pincode), hourly/daily rates, clinical ratings, spoken languages, gender preferences, and specialization categories (e.g., Geriatrics, Post-Operative ICU Care).

## PATIENTS
- **Patient Dashboard**: Aggregated personal profiles with emergency clinical contacts, medication lists, and saved addresses.
- **Family Accounts**: Seamless multi-member authorization enabling family representatives to oversee, fund, and reschedule care visits for elderly patients.

## AGENCIES
- **Agency Workspace**: Secure multi-tenant onboarding console where healthcare agencies manage their business profile.
- **Verification Workflow**: Integrated platform administrator console to review, approve, reject, or request more information for submitted compliance documents (Operating License, GST, PAN, Bank Details, and Owner KYC). Document files are handled securely via Cloudflare R2 storage.

## STAFF
- **Rostering & Schedules**: Roster management for diverse clinical roles including Nurses, Caregivers, Physiotherapists, and Doctors.
- **Biometric Audits**: Biometric liveness check safeguards, active shifts schedules, certifications database, and payroll calculators.

## BOOKINGS
- **State Machine Engine**: Robust 15-step workflow-driven lifecycle tracking care delivery from creation to checkout:
  `Booking Created` ➔ `Payment Pending` ➔ `Agency Accepted` ➔ `Assign Staff` ➔ `Staff Accepted` ➔ `Travel Started` ➔ `Arrived` ➔ `Check-In` ➔ `Vitals Logged` ➔ `Care Administered` ➔ `Patient Signature` ➔ `Check-Out` ➔ `Invoice Generated` ➔ `Payment Completed` ➔ `Review Submitted`.
- **State Validity**: Enforces unidirectional transitions with full audit trail hooks.

## VISITS
- **Operational Auditing**: GPS-locked check-in logs verifying active staff coordinates against patient registered home locations.
- **Verification Board**: Selfie liveness verification, interactive vitals recording, and a digital canvas for patients or family signatures during checkout.

## CLINICAL
- **Care Plans**: Custom care directives including medication schedules, physical goals, and dietary guides.
- **Medical Timeline**: Unified electronic health timeline capturing vitals fluctuations, surgical recovery milestones, and caregiver observations.

## PAYMENTS
- **SaaS Billing**: Automated invoice generation applying 18% GST and custom agency discount tokens.
- **Financial Split Engine**: Calculates agency commission splits, manages active subscriptions (Basic, Premium, Enterprise), and tracks payroll records.

## NOTIFICATIONS
- **Template Pipeline**: Multi-channel notification pipeline supporting in-app dashboard toasts, email, and SMS triggers.
- **State Hooks**: Connected directly to the booking state machine to update patients, family members, and caregivers at each transition.

## AUDIT
- **System Ledger**: Central audit log capturing critical events (Logins, SOS triggers, Document approvals, GPS bypasses) with actor ID, time stamps, and IP address.

## REPORTING
- **SaaS Analytics**: Interactive dashboard with real-time analytics displaying Gross Merchandise Value (GMV), active agency distributions, operational revenues, clinical quality compliance, and staff utilization.

## AI
- **Gemini Engine**: Multi-use clinical assistant using the `@google/genai` TypeScript SDK:
  - **Triage Chatbot**: Guides patients on self-care protocols and general symptom assessments.
  - **Clinical Visit Summarizer**: Analyzes vitals logs and notes to compile physician-ready clinical summaries.
  - **Matchmaker AI**: Assesses patient risk categories and maps optimal care providers based on credentials and geography.
