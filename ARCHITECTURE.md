# Enterprise Architecture: HomeCare Grid Marketplace

This document outlines the Domain-Driven Design (DDD), Clean Architecture, and SOLID design principles governing the HomeCare Marketplace platform.

---

## 1. Architectural Style & Design Patterns

The platform implements **Clean Architecture** to maintain clear separation of concerns, flexibility, and robust testability. All business transactions flow through decoupled layers in a unidirectional pipeline:

```
[UI Layer (Next.js Client Components)]
       │
       ▼
[Route Handlers / API Controller Layer]
       │
       ▼
[Services Layer (Pure Business Logic & State Machines)]
       │
       ▼
[Repositories Layer (Persistence & Transaction Management)]
       │
       ▼
[Database / State (Snowflake schemas / Cloud SQL / In-Memory Sandbox)]
```

### Key Pillars:
- **Domain-Driven Design (DDD)**: The application is structured into bounded contexts (Domains) that completely isolate their respective entities, validation logic, and workflows.
- **Service-Repository Pattern**:
  - **Services** are the sole custodians of domain logic, state rules, validations, and third-party API orchestrations (e.g., Gemini AI, notifications).
  - **Repositories** handle data access, transaction isolation, and schema mapping. No raw SQL or queries ever leak into Route Handlers or UI Views.
- **Dependency Inversion Principle (DIP)**: High-level modules do not depend on low-level modules. Both depend on abstractions.
- **Strict Tenant Isolation**: All multi-tenant configurations, routing contexts, and database schemas are bound by Tenant ID tracking, enforced automatically at the middleware level.

---

## 2. Domain Decomposition (Bounded Contexts)

The platform is decomposed into 18 highly specialized domains:

1. **Authentication**: Manages JWT lifecycle (Access Tokens, Refresh Tokens), multi-channel OTP, RBAC permissions, and Google OAuth callbacks.
2. **Marketplace**: High-performance agency directory, search indexes, and specialized pricing grids.
3. **Patients**: Manages clinical histories, emergency contacts, medication plans, and Family Representative authorization links.
4. **Agencies**: Onboarding, license registries, and corporate workspace configurations.
5. **Staff**: Certifications tracking, biometric profiles, experience catalogs, and roles (Nurse, Caregiver, etc.).
6. **Booking**: Core 15-step booking state machine tracking care delivery transitions with full audits and transactional notifications.
7. **Scheduling**: Shift rosters, conflict detectors, travel optimization calculations, and automated matches.
8. **Visits**: GPS coordinate validations, liveness checking (selfies), vitals recording, and digital signature sign-offs.
9. **Clinical**: Care directives, medication compliance, allergies, diagnosis charts, and unified electronic health timelines.
10. **Payments**: SaaS subscription billing, transactional invoicing, commission splits, and caregiver payroll tracking.
11. **Notifications**: central notification hub (SMS, Email, Push) with retry queues, standard template engines, and logging.
12. **Analytics**: Gross Merchandise Value (GMV), active retention metrics, cancellation charts, and ranking scores.
13. **AI**: LLM-powered clinical advisors, matchmaking optimization, automated vitals summaries, and fraud checks using Gemini models.
14. **CMS**: Corporate brand customizers, regional franchise nodes, and legal compliance disclosures.
15. **Reports**: System-wide Snowflake trace reports, operational analytical outputs, and compliance audit exports.
16. **Support**: Ticket lifecycles, complaints logs, and automated escalation pipelines.
17. **Settings**: Feature flags, maintenance switches, and tenant-level configurations.
18. **Audit**: System wide secure ledgers tracking security logs, GPS bypasses, and credential changes.

---

## 3. Tech Stack & Infrastructure Boundaries

- **Frontend & Routing**: Next.js 15 App Router (Strict React 19 / TypeScript 5).
- **Styling & Animations**: Tailwind CSS with Framer Motion transitions.
- **AI Integrations**: Server-side Google GenAI SDK (`@google/genai`) invoking `gemini-3.5-flash` model.
- **Database Engine**: Multi-schema Snowflake analytics warehouse backed by transactional repositories.
- **Security Engine**: JWT + Refresh tokens, RBAC guardrails, and CSRF prevention layers.
