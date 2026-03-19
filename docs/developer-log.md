# Developer Log

Major product and technical decisions are captured here to preserve implementation context.

Use this format for new entries:

## [YYYY-MM-DD] [Short decision title]

**Context:** [What decision was needed and why]
**Options considered:** [Option A vs Option B and core tradeoff]
**Decision:** [Chosen option]
**Rationale:** [Why this option was selected]
**Impact:** [What changes as a result]
**Owner:** [Developer / Agent + developer confirmation]

## [2026-03-19] Deployment simplified to Railway-only

**Context:** The app previously documented and partially encoded a split deployment model with the frontend on a separate host from the backend services. The current goal is to consolidate hosting on Railway and remove the temporary analytics integration.
**Options considered:** (A) Keep a split frontend/backend hosting model and only remove analytics vs (B) move both web and API deployment config to Railway and delete the old platform-specific hooks.
**Decision:** Standardize deployment on Railway for both the web app and API, and remove the temporary analytics integration for now.
**Rationale:** A single hosting platform reduces platform-specific config drift, keeps deployment setup consistent across services, and avoids carrying temporary analytics code that will be replaced later.
**Impact:** The old frontend-host-specific config is removed, Railway Dockerfiles are added for `apps/web` and `apps/api`, the web analytics helper becomes a typed no-op, and operational docs now describe Railway-only deployment.
**Owner:** Agent (requested by developer)

## [2026-03-17] Greenfield architecture direction for GoSupportMe

**Context:** The PRD requires an implementation plan and pre-search decisions before coding, but leaves stack and deployment choices open.
**Options considered:** (A) Node.js + Next.js + Postgres + Redis for rapid full-stack velocity vs (B) Go backend + React/Vite frontend for stricter backend performance tuning with higher integration overhead.
**Decision:** Plan around Option A as the default implementation path, with explicit confirmation checkpoints before coding.
**Rationale:** One-week delivery window and high UI + event-orchestration scope favor faster iteration, shared TypeScript contracts, and lower integration friction while still meeting reliability goals.
**Impact:** Planning artifacts now assume monorepo app split (`web/api/worker`), Zod-validated contracts, event-idempotent ingestion, and staged phase gates for human confirmation.
**Owner:** Agent (pending developer confirmation)

## [2026-03-17] Architecture locked — pre-search complete, implementation starting

**Context:** Pre-search checklist (docs/pre-search.md) and architecture document (docs/architecture.md) completed. All PRD appendix prompts answered. Ready to begin M1 implementation.
**Options considered:** See pre-search.md for full decision matrix.
**Decision:** Proceed with Node.js + Fastify API, Next.js App Router, Postgres + BullMQ + Redis, deployed on Railway.
**Rationale:** Fastest iteration path with strong TypeScript throughout. BullMQ chosen over Redis Streams for simpler worker management. Integer cents chosen for all money. Event ID format later settled on UUIDs during implementation.
**Impact:** M1 implementation begins: monorepo bootstrap, core contracts, initial schema.
**Owner:** Agent + developer confirmed

**Key invariants locked:**
- All money: integer cents (no floats)
- Event IDs: UUIDs
- Notifications: idempotent by `UNIQUE(userId, dedupeKey)`
- Badges: idempotent by `UNIQUE(userId, type)`
- Donation: exactly one canonical event per successful submission

**Design system tokens (from Pencil):**
- Primary: `#00B964` (green)
- Text: `#1A1A1A` / `#6B6B6B` / `#9E9E9E`
- Background: `#FFFFFF` / `#F7F7F7` / `#FAFAFA`
- Border: `#E8E8E8`
- Font: Inter
- Radii: sm=6, md=10, lg=16, xl=24

## [2026-03-17] Event and dedupe idempotency model

**Context:** Donation events can be retried and replayed, so writes must be safe under duplicates while preserving trust-critical correctness.
**Options considered:** (A) Best-effort app-layer dedupe with cache checks vs (B) database-backed idempotency constraints plus conflict-safe inserts.
**Decision:** Adopt DB-enforced idempotency with unique keys and `ON CONFLICT DO NOTHING` semantics for notifications and badges.
**Rationale:** Database constraints are deterministic and resilient to worker retries, process crashes, and replay scenarios in a way cache-only checks are not.
**Impact:** `eventId` uniqueness is canonical, notifications dedupe by `(userId, dedupeKey)`, and badge grants dedupe by `(userId, type)` with replay-safe processing.
**Owner:** Agent + developer confirmed

## [2026-03-17] Donation money and tip contract

**Context:** Transparent tipping requires totals users can trust while avoiding arithmetic drift across client/server.
**Options considered:** (A) Decimal/float money math for display convenience vs (B) integer cents with server-side recomputation and strict validation.
**Decision:** Use integer cents for all monetary values and enforce `totalCents === amountCents + tipCents` server-side.
**Rationale:** Integer math avoids rounding bugs and tampering risk, and keeps donation invariants stable across API, DB, and worker flows.
**Impact:** Donation payloads carry `amountCents`, `tipCents`, `totalCents`, and explicit tip selection; server rejects mismatched totals.
**Owner:** Agent + developer confirmed

## [2026-03-17] Recommendation pipeline strategy

**Context:** Community discovery needs relevant ranking without expensive request-time computation under burst load.
**Options considered:** (A) Fully online scoring on each request vs (B) hybrid pipeline with precomputed signals plus lightweight request-time composition.
**Decision:** Use hourly precomputation for heavier signals, request-time final scoring, and short-lived Redis caching.
**Rationale:** Hybrid scoring balances personalization quality with predictable latency and cost, while keeping fallback behavior simple.
**Impact:** Recommendation lists cache per user (5 min), reasons are human-readable labels, and chronological fallback remains available during degradation.
**Owner:** Agent + developer confirmed

## [2026-03-17] Deployment and reliability baseline

**Context:** MVP requires rapid deployment with horizontal scalability and low operational overhead.
**Options considered:** (A) Single-host all-in-one deployment vs (B) Railway-hosted web plus Railway-managed API, worker, and state services.
**Decision:** Deploy frontend, API, worker, Postgres, and Redis on Railway.
**Rationale:** A single hosting platform reduces deployment drift while keeping the app stateless and operationally simple.
**Impact:** API/worker remain stateless, queue retries are managed through BullMQ, and rollback paths are unified across the web and backend services.
**Owner:** Agent + developer confirmed

## [2026-03-19] Session auth standardized on signed cookie JWTs

**Context:** The app now has working sign-up, sign-in, sign-out, current-user lookup, and profile editing flows. Those paths needed one consistent auth transport across browser pages and API routes.
**Options considered:** (A) Bearer tokens stored in client state vs (B) signed JWT session cookies validated on the API.
**Decision:** Use a signed `gosupportme_session` cookie as the primary auth mechanism.
**Rationale:** Cookie-based auth fits the Next.js browser flow well, avoids custom client-side token persistence, and keeps the API stateless while still using Fastify JWT.
**Impact:** Auth and profile routes read/write the same session cookie, and protected actions such as charity request decisions can verify the acting user against the current session.
**Owner:** Agent (documented from implemented code)

## [2026-03-19] Charity creation moved to review-gated request workflow

**Context:** The code now supports charity onboarding, but trust and abuse controls require more oversight than direct self-serve community creation.
**Options considered:** (A) Immediate `POST /api/charities` self-service creation vs (B) submission, review, and approval before a community becomes active.
**Decision:** Ship a request-review-approval workflow and disable direct charity creation.
**Rationale:** The review gate limits duplicate or fraudulent charities, allows admin adjudication with recorded reasons, and keeps organizer eligibility rules explicit.
**Impact:** Users submit `POST /api/charities/requests`, admins decide via `POST /api/charities/requests/:id/decision`, approved requests create `communities` transactionally, and direct `POST /api/charities` returns `410 Gone`.
**Owner:** Agent (documented from implemented code)

## [2026-03-19] E2E validation baseline added for core donor and organizer flows

**Context:** The product now spans auth, fundraiser, profile, and charity request flows across both frontend and backend, making manual verification increasingly fragile.
**Options considered:** (A) Rely on unit tests and manual smoke checks vs (B) add Playwright coverage that boots the full stack against seeded data.
**Decision:** Add Playwright-based end-to-end coverage with isolated local servers and a reset/seed cycle per run.
**Rationale:** Full-stack tests catch regressions across routing, session auth, API wiring, and seeded user journeys that are difficult to cover with unit tests alone.
**Impact:** `playwright.config.ts` now boots the API on `3101` and the web app on `3100`, runs `db:reset` and `db:seed`, and covers fundraiser, profile, and charity request flows in `e2e/`.
**Owner:** Agent (documented from implemented code)
