# Booking Workflow & State Machine Engine

The HomeCare Grid platform operates a robust, deterministic state machine tracking the booking journey. This ensures that clinical, financial, and operational operations are correctly synchronized.

---

## 1. Booking State Lifecycle Diagram

The state transitions strictly from initiation to completion:

```
[ Booking Created ]
        │
        ▼
[ Payment Pending ]
        │
        ▼
[ Agency Accepted ]
        │
        ▼
[ Staff Assigned ]
        │
        ▼
[ Staff Accepted ]
        │
        ▼
  [ Travelling ]
        │
        ▼
   [ Arrived ]
        │
        ▼
   [ Check-In ]
        │
        ▼
[ Care Started ]
        │
        ▼
   [ Vitals ]
        │
        ▼
    [ Notes ]
        │
        ▼
[ Patient Signature ]
        │
        ▼
  [ Check-Out ]
        │
        ▼
   [ Invoice ]
        │
        ▼
   [ Payment ]
        │
        ▼
    [ Review ]
        │
        ▼
  [ Completed ]
```

---

## 2. State Validation & Operational Requirements

For each state transition, specific actions must be verified:

| Origin State | Destination State | Event Trigger | Required Validation | Automated Outcome |
|---|---|---|---|---|
| `booking_created` | `payment_pending` | Customer books care | Verify service availability | Auto-generate Invoice and bill amount |
| `payment_pending` | `agency_accepted` | Agency accepts contract | System verifies deposit/approval | Notify coordinating staff |
| `agency_accepted` | `staff_assigned` | Staff member matched | Check for schedule conflicts | Update caregiver calendars |
| `staff_assigned` | `staff_accepted` | Staff confirms via portal | Verify staff availability slot | Send patient-facing profile card |
| `staff_accepted` | `travelling` | Caregiver taps "Travel" | Fetch start coordinates | Share arrival estimate with patient |
| `travelling` | `arrived` | Caregiver arrives on-site | Verify GPS within 50 meters of home | Prompt check-in selfie liveness |
| `arrived` | `check_in` | Liveness and GPS check pass | Capture selfie matching facial profile | Unlock active visit timeline |
| `check_in` | `care_started` | Caregiver begins treatment | Log action timestamp | Notify family representative |
| `care_started` | `vitals` | caregiver logs vitals | Verify vitals within physiological ranges | Trigger supervisor alerts if abnormal |
| `vitals` | `notes` | caregiver submits notes | Form completion check | Sync summaries to Medical Timeline |
| `notes` | `patient_signature` | Patient/representative signs | Digital canvas signature captured | Lock clinical visit entries |
| `patient_signature`| `check_out` | checkout complete | Confirm completion metrics | Log total hours of care delivered |
| `check_out` | `invoice` | billing processed | Apply GST (18%) and calculate commissions | Dispatch final invoice to customer |
| `invoice` | `payment` | Payment validated | Complete payment split distribution | Issue receipts |
| `payment` | `review` | Patient leaves ranking | Star rating validation | Update agency rank metrics |
| `review` | `completed` | Transaction closed | Final audit checksum verification | Append history log to Snowflake schema |

---

## 3. Standard Audit Ledgers & Fail-safes
- Any attempt to skip states (e.g., `booking_created` straight to `check_in`) will throw a `STATE_TRANSITION_VIOLATION` exception.
- All actions are permanently written to the identity/audit log system including IP address, Actor ID, timestamp, and transaction ID.
- In emergencies, coordinators can issue a **`Bypass State Check`** with mandatory reason submission, immediately generating a high-priority Audit Alert flag.
