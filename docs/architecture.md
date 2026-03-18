# GoSupportMe — Architecture Document

*Drafted: 2026-03-17*

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│  Next.js App Router — Vercel                                    │
│  /fundraiser/[id]  /community  /profile/[id]  /notifications   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS REST
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Service (Fastify)                       │
│  Railway — stateless, horizontally scalable                     │
│                                                                 │
│  POST /api/events          GET /api/recommendations             │
│  POST /api/donations       POST /api/notifications/preview      │
│  GET  /api/fundraisers     POST /api/badges/evaluate            │
│  POST /api/charities       GET  /api/notifications              │
│  GET  /api/feed            POST /api/replay                     │
│                                                                 │
│  Middleware: requestId, JWT auth, pino logger, rate limiting    │
└──────────┬───────────────────────────────────────┬─────────────┘
           │ SQL                                   │ BullMQ jobs
           ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────────┐
│  Postgres (Railway) │               │    Redis (Railway)       │
│                     │               │                         │
│  users              │               │  BullMQ queues:         │
│  fundraisers        │◄──────────────│  - notification-queue   │
│  donations          │  poll/update  │  - badge-queue          │
│  events             │               │  - recommendation-queue │
│  notifications      │               │                         │
│  badges             │               │  Cache:                 │
│  follows            │               │  - rec scores (5min)    │
│  recommendations    │               │  - feed cursor (30s)    │
│  charities          │               │  - dedupe keys (72h)    │
└─────────────────────┘               └──────────┬──────────────┘
                                                  │ consume
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │    Worker Service (Fastify)  │
                                    │    Railway                   │
                                    │                             │
                                    │  NotificationProcessor      │
                                    │  - dedupe by key            │
                                    │  - bundle donation bursts   │
                                    │  - generate reason text     │
                                    │                             │
                                    │  BadgeProcessor             │
                                    │  - evaluate eligibility     │
                                    │  - idempotent assignment    │
                                    │                             │
                                    │  RecommendationProcessor    │
                                    │  - update signal weights    │
                                    │  - store reason metadata    │
                                    └─────────────────────────────┘
```

## Request Flow: Donation

```
1. User submits donation form (amount + tip)
2. POST /api/donations
   a. Validate amount, tipPercent, compute totalCents (integer math)
   b. Write donation to DB
   c. Emit PlatformEvent { eventType: "donation.created" }
      - Insert to events table (UNIQUE eventId)
      - Enqueue to BullMQ notification-queue, badge-queue, recommendation-queue
   d. Return { donationId, totalCents, eventId }
3. Worker consumes notification-queue job:
   a. Load fundraiser followers
   b. For each follower: check dedupe key in Redis
   c. If new: insert notification (ON CONFLICT DO NOTHING)
   d. If burst: accumulate into bundled notification
4. Worker consumes badge-queue job:
   a. Evaluate actor's badge eligibility
   b. INSERT badge WHERE NOT EXISTS (idempotent)
5. Worker consumes recommendation-queue job:
   a. Update donation_similarity signal for actor
   b. Update trending_boost for fundraiser
```

## Data Contracts

### PlatformEvent
```typescript
type PlatformEvent = {
  eventId: string          // ULID, e.g. "evt_01JX..."
  timestamp: string        // ISO 8601 UTC
  eventType:
    | "donation.created"
    | "fundraiser.update_posted"
    | "fundraiser.followed"
    | "profile.updated"
  actorUserId: string
  fundraiserId?: string
  schemaVersion: "1"
  payload: Record<string, unknown>
}
```

### UserNotification
```typescript
type UserNotification = {
  id: string
  userId: string
  type: "donation_received" | "update_posted" | "goal_reached" | "milestone" | "bundled"
  reason: string           // Human-readable: "Because you donated to this fundraiser"
  dedupeKey: string        // userId:eventType:fundraiserId:windowHour
  fundraiserId?: string
  deepLink?: string        // e.g. "/fundraiser/fr_123#updates"
  bundledCount: number     // 1 for single, N for bundled
  read: boolean
  createdAt: string
}
```

### BadgeCriteria
```typescript
type Badge = {
  id: string
  userId: string
  type:
    | "trust_pioneer"     // First donation
    | "momentum_builder"  // 5+ donations raised in a week
    | "community_champion"// 3+ fundraisers followed
    | "top_donor"         // 10+ campaigns donated to
    | "verified_organizer"// Organizer with verified status
    | "milestone_reacher" // Hit 50%+ of goal
  earnedAt: string
  visible: boolean
  priority: number        // For display ranking (lower = higher priority)
}
```

### RecommendationReason
```typescript
type RecommendationReason = {
  type: "interest_match" | "donation_similarity" | "trending" | "exploration"
  label: string           // "Based on your interest in Emergency Relief"
}

type Recommendation = {
  fundraiserId: string
  score: number
  reasons: RecommendationReason[]
  updatedAt: string
}
```

### MoneyContract
```typescript
type MoneyAmount = {
  amountCents: number     // Integer, donation amount
  tipCents: number        // Integer, platform tip
  totalCents: number      // Must equal amountCents + tipCents
  tipPercent: number      // 0 | 5 | 10 | 15 | 20 | custom
}
// Invariant: totalCents === amountCents + Math.round(amountCents * tipPercent / 100)
```

## Required API Endpoints

```
POST /api/events                    Ingest PlatformEvent (idempotent by eventId)
GET  /api/recommendations           Heuristic ranked feed for user
POST /api/notifications/preview     Preview/debug notification output
POST /api/badges/evaluate           Trigger badge evaluation for user
POST /api/donations                 Create donation, validate money, emit event
GET  /api/fundraisers/:id           Fundraiser detail with trust context
GET  /api/feed                      Community feed with filters/sorting
POST /api/charities                 Create charity entity
PATCH /api/charities/:id/fundraisers/:fid   Link fundraiser to charity
POST /api/replay                    Replay events safely (idempotent)
GET  /api/health                    Health check
GET  /api/notifications             User notification list
PATCH /api/notifications/:id/read   Mark notification as read
```

## Reliability Plan

### Idempotency Strategy
- **Events**: `UNIQUE(eventId)` in Postgres — duplicate INSERT returns existing record
- **Notifications**: `UNIQUE(userId, dedupeKey)` + `ON CONFLICT DO NOTHING`
- **Badges**: `UNIQUE(userId, type)` — assignment is idempotent by design
- **Donations**: `eventId` generated client-side (ULID) and passed with request

### Retry Policy
- BullMQ default: 3 retries with exponential backoff (2s, 8s, 32s)
- Max age: jobs removed after 24h if not processed
- Dead letter queue: failed jobs logged to `failed_events` table

### Dedupe Model
- Notification dedupe key: `{userId}:{eventType}:{fundraiserId}:{hourBucket}`
- Dedupe TTL in Redis: 72 hours (covers replay + bundling windows)
- Bundling window: 1-hour tumbling, aggregate 3+ events into single notification

### Failure Handling
- Donation fails → 500 with stable error code + `requestId` for correlation
- Notification processor fails → retry, in-app state unaffected
- Recommendation timeout → fallback to chronological feed (empty reasons[])
- AI endpoint fails → fallback to template-based reasons/summaries

## Observability Plan

### Metrics (via `prom-client`)
- **RED metrics** (per endpoint):
  - Rate: `http_requests_total{method, path, status}`
  - Errors: `http_errors_total{method, path, error_type}`
  - Duration: `http_request_duration_seconds{method, path}` (histogram)
- **USE metrics** (per resource):
  - Worker queue depth: `worker_queue_depth{queue_name}`
  - Worker processing latency: `worker_job_duration_seconds{processor}`
  - DB connection pool: `pg_pool_size`, `pg_pool_idle`
  - Redis memory: `redis_memory_used_bytes`

### Structured Logs (pino)
```json
{
  "level": "info",
  "time": "2026-03-17T20:10:12Z",
  "requestId": "req_01JX...",
  "userId": "usr_123",
  "eventId": "evt_01JX...",
  "msg": "donation.created processed",
  "durationMs": 45
}
```
- PII fields (`email`, `name`) are never logged — use IDs only
- Trace ID propagated via `x-request-id` header

### SLOs and Alert Thresholds
| SLO | Target | Alert Threshold |
|-----|--------|-----------------|
| Donation endpoint p95 latency | < 2s | Alert at > 3s |
| Event-to-notification latency | < 3s | Alert at > 10s |
| Feed p95 latency | < 1.5s | Alert at > 3s |
| Donation error rate | < 0.1% | Alert at > 1% |
| Notification duplicate rate | 0 | Alert at any duplicate |

## AI Usage and Cost

### AI Endpoints
1. `POST /api/fundraisers/:id/summary` — Generate AI campaign summary (Claude claude-haiku-4-5-20251001)
2. `POST /api/charities/advice` — Charity creation advice (Claude claude-haiku-4-5-20251001)
3. Recommendation reason labeling — Deterministic (no AI, heuristic labels)

### Controls and Budget Limits
- Feature flag: `AI_ENABLED=true|false` environment variable
- Per-endpoint rate limit: 100 AI calls/day during MVP
- Fallback: Template strings when AI disabled or budget exhausted
- Token caps: max 500 tokens per completion

### Cost Projections (production)
| Users | Monthly AI Cost |
|-------|-----------------|
| 100   | $5–15/month     |
| 1K    | $40–120/month   |
| 10K   | $400–1,200/month|

## Decision Log

| Decision | Choice | Rejected | Rationale |
|----------|--------|----------|-----------|
| Backend framework | Fastify | Express, NestJS | Lowest latency, built-in schema validation |
| Frontend | Next.js App Router | Remix, Vite+React | ISR for campaign pages, streaming for feed |
| Database | Postgres | MongoDB, MySQL | ACID for donations, JSONB for event payloads |
| Queue | BullMQ + Redis | Kafka, SQS, Redis Streams | Simple API, reliable retries, zero ops overhead |
| Event IDs | ULID | UUID v4, auto-increment | Sortable chronologically, URL-safe |
| Money model | Integer cents | Decimal/Float | No rounding errors, industry standard |
| Auth | JWT | Sessions, OAuth-only | Stateless, no session store, horizontal scale |
| Deployment | Vercel + Railway | Fly.io, Render | Best DX for Next.js + managed Postgres/Redis |
| Testing | Vitest + Playwright | Jest, Cypress | Faster unit tests, reliable E2E |
