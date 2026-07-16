# API Specification: HomeCare Grid v1 Engine

All API endpoints are versioned under `/api/v1` and implement standardized JSON wrappers. This ensures consistency, strict schema validation, and secure tenant-isolated operations.

---

## 1. Global Request & Response Formats

### Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "correlationId": "tx-8f4d92a-b12",
    "timestamp": "2026-07-12T22:21:00Z"
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid vitals parameters supplied.",
    "details": [
      "Systolic blood pressure reading out of physiological bounds."
    ]
  },
  "metadata": {
    "correlationId": "tx-8f4d92a-b12"
  }
}
```

---

## 2. Standard Query Parameters

The platform implements standard query formats for all list endpoints:

| Parameter | Type | Description | Default |
|---|---|---|---|
| `page` | Integer | Active page number | `1` |
| `limit` | Integer | Items per page (Max 100) | `20` |
| `sort` | String | Format: `column:asc` or `column:desc` | `createdAt:desc` |
| `filter` | String | Complex queries (e.g., `city:Bangalore,rating_min:4`) | N/A |

---

## 3. Key Core Routes

### Authentication Domain
- **`POST /api/v1/auth/login`**: Authenticate with password or OTP credentials.
- **`POST /api/v1/auth/refresh`**: Exchange refresh token for a new short-lived access token.
- **`GET /api/v1/auth/callback`**: Secure OAuth listener for Google Identity verification.

### Booking Domain
- **`POST /api/v1/bookings`**: Instantiate a new care booking request.
- **`PATCH /api/v1/bookings/:id`**: Advance the booking state machine (e.g., transition from `travel_started` to `arrived`). Enforces strict state transitions.

### Clinical Domain
- **`POST /api/v1/clinical/care-plans`**: Create clinical intervention plans.
- **`GET /api/v1/clinical/timeline/:patientId`**: Fetch the full electronic health record timeline.

### AI Domain
- **`POST /api/v1/ai/chat`**: Conversational symptom/treatment guide with clinical guards.
- **`POST /api/v1/ai/match`**: Optimization algorithm recommending optimal caregiver matches.
- **`POST /api/v1/ai/summary`**: Summarize visit activity logs into physician summaries.

---

## 4. Rate Limiting & Security
- **Headers**:
  - `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - `X-Tenant-ID: <TENANT_ID>`
- **Rate Limit Thresholds**:
  - Standard Client Views: 60 requests/minute.
  - Public Auth / SOS triggers: 10 requests/minute.
