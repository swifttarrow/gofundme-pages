# GoSupportMe — Architecture Document

*Updated: 2026-03-19*

## System Overview

GoSupportMe is a TypeScript monorepo with:

- `apps/web`: Next.js App Router frontend
- `apps/api`: Fastify API plus BullMQ worker startup
- `packages/contracts`: shared Zod-based event and money contracts
- `infra/scripts`: local database migrate/reset/seed utilities
- `e2e`: Playwright end-to-end coverage

## Runtime Topology

```
┌──────────────────────────────────────────────────────────────┐
│ Browser                                                     │
│ Next.js App Router pages and client components              │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ `apps/web`                                                  │
│ Server components, route handlers, auth-aware page loading  │
│ Routes include `/`, `/community`, `/fundraiser/[id]`,       │
│ `/profile/[id]`, `/notifications`, `/favorites`,            │
│ `/charity/new`, `/charity/request`, `/sign-in`, `/sign-up`  │
└──────────────────────────────┬───────────────────────────────┘
                               │ REST calls
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ `apps/api` Fastify server                                   │
│ Routes: auth, donations, fundraisers, feed, notifications,  │
│ recommendations, badges, follows, charities, events         │
│ Cross-cutting concerns: CORS, Fastify JWT, rate limiting,   │
│ metrics, request logging, Zod validation in route handlers  │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
┌──────────────────────────────┐   ┌───────────────────────────┐
│ Postgres                     │   │ Redis / BullMQ            │
│ Source of truth for users,   │   │ Queue transport for       │
│ fundraisers, donations,      │   │ notifications, badges,    │
│ follows, notifications,      │   │ and recommendations       │
│ recommendations, events,     │   └──────────────┬────────────┘
│ charity requests, communities│                  │
└──────────────────────────────┘                  ▼
                                   ┌───────────────────────────┐
                                   │ Worker processors         │
                                   │ Started by `startWorkers` │
                                   │ from the API process,     │
                                   │ with a standalone entry   │
                                   │ path also available       │
                                   └───────────────────────────┘
```

## Frontend Surface

The web app is organized around a small set of core journeys:

- Fundraiser discovery: `/`, `/community`, `/favorites`
- Fundraiser detail and donations: `/fundraiser/[id]`
- Fundraiser creation: `/fundraiser/new`
- Profile browsing and editing: `/profile/[id]`, `/profile/settings`
- Auth: `/sign-in`, `/sign-up`
- Charity onboarding and status: `/charity/new`, `/charity/request`
- Notifications: `/notifications`

The fundraiser detail page also derives share/SEO description text from the stored fundraiser story rather than calling a separate summary service.

## API Surface

Current registered route groups in `apps/api/src/index.ts`:

- `auth`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `GET /api/auth/users/:id`
  - `PATCH /api/auth/profile`
  - `POST /api/auth/logout`
- `fundraisers`
  - `GET /api/fundraisers`
  - `GET /api/fundraisers/:id`
  - `POST /api/fundraisers`
- `donations`
  - `POST /api/donations`
  - `GET /api/donations`
- `feed`
  - `GET /api/feed`
  - `GET /api/feed/communities`
- `follows`
  - `GET /api/follows/status`
  - `POST /api/follows`
  - `DELETE /api/follows`
- `notifications`
  - `GET /api/notifications`
  - `PATCH /api/notifications/:id/read`
  - `PATCH /api/notifications/mark-all-read`
  - `POST /api/notifications/preview`
- `recommendations`
  - `GET /api/recommendations`
- `badges`
  - `POST /api/badges/evaluate`
  - `GET /api/badges/:userId`
- `events`
  - `POST /api/events`
  - `POST /api/replay`
  - `GET /api/events/:eventId`
- `charities`
  - `GET /api/charities/requests/eligibility`
  - `POST /api/charities/requests`
  - `GET /api/charities/requests/mine`
  - `POST /api/charities/requests/:id/resubmit`
  - `POST /api/charities/requests/:id/decision`
  - `POST /api/charities`
  - `GET /api/charities/:id`
  - `PATCH /api/charities/:id/fundraisers/:fid`

Operational endpoints:

- `GET /health`
- `GET /metrics`

## Core Flows

### Authentication

- The API uses Fastify JWT to sign a `gosupportme_session` cookie.
- Session state is cookie-based and stateless from the server perspective.
- `register`, `login`, and `logout` mutate the cookie; `me` and protected flows read it back and verify claims.

### Donations and Event Fan-Out

1. The client submits a donation payload using integer cents.
2. The donations route validates the payload with Zod and writes the donation.
3. A `PlatformEvent` is stored in Postgres through `insertEvent`.
4. New events are fanned out to BullMQ queues for notification, badge, and recommendation processing.
5. Worker processors consume those jobs and update derived read models.

## Event Model

Shared contracts live in `packages/contracts`.

### `PlatformEvent`

```typescript
type PlatformEvent =
  | { type: "donation.created"; eventId: string; occurredAt: string; payload: DonationCreatedPayload }
  | { type: "fundraiser.update_posted"; eventId: string; occurredAt: string; payload: FundraiserUpdatePostedPayload }
  | { type: "fundraiser.followed"; eventId: string; occurredAt: string; payload: FundraiserFollowedPayload }
  | { type: "profile.updated"; eventId: string; occurredAt: string; payload: ProfileUpdatedPayload };
```

### Money Contract

```typescript
type MoneyAmount = {
  amountCents: number;
  tipCents: number;
  totalCents: number;
  tipPercent: 0 | 5 | 10 | 15 | 20 | "custom";
};
```

Invariant: `totalCents === amountCents + tipCents`

### Charity Request Review Flow

The shipped charity model is review-gated rather than direct self-serve creation:

1. Users submit `POST /api/charities/requests`.
2. Only one in-flight request is allowed per organizer, enforced in the API and DB reads.
3. Admins review with `POST /api/charities/requests/:id/decision`.
4. Approval creates a `communities` record inside the same database transaction.
5. Direct `POST /api/charities` currently returns `410 Gone` and points callers to the request flow.

## Reliability Characteristics

- Input validation is route-local and Zod-based.
- Multi-step write paths use `db.transaction(...)`.
- Event storage is idempotent via `ON CONFLICT (event_id) DO NOTHING`.
- Follow creation is idempotent via `ON CONFLICT (follower_id, fundraiser_id) DO NOTHING`.
- Queue jobs use retries with exponential backoff.
- Workers can be started from the API runtime or from the standalone worker entrypoint.

## Observability

See [docs/observability/README.md](./observability/README.md) (aligned with [docs/requirements/add-observability.md](./requirements/add-observability.md)):

- `/health` — liveness plus Postgres connectivity; includes `service` name.
- `/metrics` — Prometheus exposition (`prom-client`): HTTP histograms/counters (including `status_class`), in-flight gauge, donation and page-view counters, worker job lifecycle metrics, queue backlog gauges.
- **Correlation** — `x-request-id` on every request; mutation routes set `observabilityEventId` so `request.completed` logs include `event_id` when applicable.
- **Structured logs** — JSON lines via `structuredLog` / `logError` in `apps/api/src/services/telemetry.ts` (`request.start`, `request.completed`, `worker.job.*`, `donation.*`).
- **Web** — fundraiser, community, and profile pages report views to `POST /api/telemetry/page-view`.
- **Dashboards & alerts** — `docs/observability/grafana-dashboard.json`, `docs/observability/prometheus-alerts.yml`, and runbooks under `docs/observability/runbooks/`.

## AI Status

The current application runtime does not include any production AI endpoints or model-provider integrations. See `docs/ai-cost-analysis.md` for the current cost posture.

## Testing Strategy

- Unit and integration-style tests run with Vitest in both `apps/api` and `apps/web`.
- End-to-end coverage runs with Playwright from `e2e/`.
- The Playwright config boots isolated app and API servers, resets the database, and reseeds before the suite.
