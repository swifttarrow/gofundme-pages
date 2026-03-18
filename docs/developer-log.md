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
**Decision:** Proceed with Node.js + Fastify API, Next.js App Router, Postgres + BullMQ + Redis, deployed on Vercel + Railway.
**Rationale:** Fastest iteration path with strong TypeScript throughout. BullMQ chosen over Redis Streams for simpler worker management. ULID event IDs for sortability. Integer cents for all money.
**Impact:** M1 implementation begins: monorepo bootstrap, core contracts, initial schema.
**Owner:** Agent + developer confirmed

**Key invariants locked:**
- All money: integer cents (no floats)
- Event IDs: ULIDs with `evt_` prefix
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
**Options considered:** (A) Single-host all-in-one deployment vs (B) split deployment: Next.js on Vercel, API/worker + state services on Railway.
**Decision:** Deploy frontend on Vercel and run API, worker, Postgres, and Redis on Railway.
**Rationale:** This split gives strong DX and autoscaling defaults while keeping core backend services managed and close together.
**Impact:** API/worker remain stateless, queue retries are managed through BullMQ, and rollback paths are defined independently for frontend and backend.
**Owner:** Agent + developer confirmed
