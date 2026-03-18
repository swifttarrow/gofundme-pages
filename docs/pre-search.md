# Pre-Search: GoSupportMe

*Completed before implementation begins — 2026-03-17*

## Phase 1: Define Your Constraints

### 1) Scale and Load Model

**Daily active users:**
- Day 1: ~50 (internal testing, seed data)
- Month 1: ~500 (early adopters, viral campaigns)
- Month 6: ~5,000 (steady organic growth)

**Peak writes per minute (viral campaign scenario):**
- Donation events: ~100 writes/min during spike (e.g., matching challenge going viral)
- Notification fan-out events: ~500 writes/min (1 donation → 5 follower notifications avg)
- Burst assumptions: single popular campaign can trigger 10× normal traffic for 15–30 min windows

**Read-heavy vs write-heavy:**
- Read-heavy: Community feed, fundraiser page, profile page, notification center
- Write-heavy: Donation submit, event ingestion, badge evaluation triggers
- Burst traffic expected at: `POST /api/events`, `GET /api/recommendations`, fundraiser hero

**Latency budgets that matter for trust:**
- Donation confirmation: < 2s (trust-critical — user must feel secure)
- Notification display: < 3s from event trigger (in-app)
- Community feed initial load: < 1.5s
- Profile page load: < 1.5s

### 2) Budget and Cost Envelope

**Monthly hosting budget:**
- MVP target: $50–100/month (Railway Hobby plan + Vercel free tier)
- Can exceed briefly to: $200/month for demo/submission period

**Maximum AI spend:**
- Cap at 20% of total infra spend (≈$10–20/month during MVP)
- Production: degrade gracefully to deterministic heuristics when AI budget exhausted

**Expensive operations — caching/batching/deferral strategy:**
- Recommendation scoring: precompute hourly batch job, cache in Redis (TTL 5 min)
- Campaign summaries (AI): cache per fundraiser (TTL 1 hour), regenerate on update
- Badge evaluation: event-triggered worker, not request-time
- Community feed: paginated, cursor-based, cached for 30s

**Cost kill-switches:**
- Redis flag `ai_summaries_enabled` — disable AI calls instantly
- Recommendation falls back to chronological feed
- Notification reason falls back to template strings

### 3) Timeline and Delivery Scope

**Strict MVP (must have by Sunday):**
- Fundraiser page with transparent donation + tipping flow
- Community feed with category filters
- Profile page with badges
- Event ingestion with idempotency
- Notification center with dedupe
- Charity starter wizard
- Deployed + publicly accessible

**Stretch goals (nice to have):**
- Email notifications (in-app is MVP)
- Advanced recommendation ML (heuristic is MVP)
- Admin dashboard
- Real payment processing (simulated for MVP)

**24-hour checkpoint proof of architecture viability:**
1. Fundraiser page renders with live data
2. Donation flow writes event with unique ID
3. Notification center shows seeded data with reasons
4. Community page renders feed with filters

**Scope cuts that preserve trust and correctness:**
- Use seeded/mock data for initial demo, replace with real DB queries incrementally
- Simulate payment step (no Stripe integration) — show "demo mode" banner
- Badge evaluation via API endpoint (not real-time, trigger manually)

**Polish deferred until after reliability:**
- Animation, dark mode, advanced search, localization

### 4) Compliance, Data Sensitivity, and Risk

**PII storage:**
- Donors: name, email stored in `users` table
- Logs: email/name redacted using structured log scrubbing middleware
- Traces: PII fields excluded from span attributes

**Audit trails required:**
- Donations: immutable event record with `eventId`, `timestamp`, `actorUserId`
- Notification preference changes: logged in events table
- No payouts in MVP (no payout audit trail needed)

**Access control for restricted fundraiser info:**
- Private fundraisers: visibility check on every request (middleware)
- Organizer-only actions: JWT role claim checked server-side
- No public exposure of donor emails

**Retention strategy:**
- Events: retain indefinitely (source of truth for replay)
- Notification history: 90 days
- Debugging traces: 30 days
- Redis cache: TTL-based eviction (5–60 min depending on freshness needs)

### 5) Team and Skills Reality

**Strongest areas (will anchor architecture):**
- TypeScript, Node.js/Fastify, Next.js App Router
- SQL/Postgres schema design
- Event-driven patterns

**Highest uncertainty areas:**
- Redis Streams vs BullMQ for worker queue — choosing BullMQ for simplicity
- Recommendation signal updates at scale — mitigating with aggressive caching
- Mobile-responsive donation UX at 320px — mitigating with mobile-first CSS

**Templates/boilerplate to avoid custom work:**
- Next.js App Router starter (official template)
- Fastify plugin ecosystem (pino logger, @fastify/cors, @fastify/jwt)
- Zod for contract validation (no custom validation code)

**Integrations stubbed early to unblock UI:**
- Payment processing: stub returning `{ success: true, transactionId: 'demo_...' }`
- Email delivery: stub logger (implement via Resend in final polish)
- AI summaries: stub returning deterministic template text

---

## Phase 2: Architecture Discovery

### 1) Data and Event Modeling

**Canonical entities:**
- `User`: id, name, email, avatar, bio, interests[], joinedAt
- `Fundraiser`: id, title, story, goalCents, raisedCents, organizerId, charityId?, category, status
- `Donation`: id, fundraiserId, donorUserId, amountCents, tipCents, totalCents, eventId, createdAt
- `Notification`: id, userId, type, reason, dedupeKey, fundraiserId?, read, bundledCount, createdAt
- `Badge`: id, type, criteria, earnedAt, userId, visible
- `Follow`: userId, fundraiserId, role (donor/organizer/beneficiary/manual), createdAt
- `PlatformEvent`: eventId, timestamp, eventType, actorUserId, fundraiserId?, payload
- `Recommendation`: userId, fundraiserId, score, reasons[], updatedAt
- `Charity`: id, name, description, organizerId, transparencyNote, fundingMilestones[]

**Event naming convention:**
- Format: `{domain}.{action}` in past tense
- Examples: `donation.created`, `fundraiser.update_posted`, `fundraiser.followed`, `profile.updated`
- Versioning: include `schemaVersion: "1"` in payload for future compatibility

**Every event contains:**
- `eventId`: ULID (sortable, unique) — `evt_01JX...`
- `timestamp`: ISO 8601 UTC
- `actorUserId`: who performed the action
- `fundraiserId`: optional, contextual
- `payload`: action-specific data

**Command vs fact events:**
- Facts (immutable domain events): `donation.created`, `fundraiser.update_posted`
- Commands (triggers work): `badge.evaluate_requested` (internal)
- Why it matters: facts are safe to replay; commands need idempotency guards

### 2) Notification Architecture

**Follow eligibility:**
- `donor`: auto-follow when donation.created
- `organizer`: auto-follow their own fundraiser
- `beneficiary`: explicit follow
- `manual`: user explicitly followed
- All roles receive notifications unless opted out

**Dedupe key generation:**
- Format: `{userId}:{eventType}:{fundraiserId}:{windowHour}`
- Retained: 72 hours in Redis (covers bundling windows + replay safety margin)

**Bundling windows for donation bursts:**
- Window: 1 hour tumbling window
- Threshold: 3+ donations in window → bundle into "X people donated" notification
- Implemented via BullMQ delayed jobs with deduplication

**Fallback when push/email fails:**
- In-app notification is created synchronously (same transaction as event)
- Push/email enqueued separately — failure logged but doesn't fail in-app
- Dead letter queue for failed push/email with 3 retries exponential backoff

### 3) Discovery and Ranking Design

**Heuristic score weights:**
```
score = (interest_match × 0.4) + (donation_similarity × 0.3) + (trending_boost × 0.2) + (recency × 0.1)
```
- `interest_match`: user interests vs fundraiser category (cosine similarity on tag vectors)
- `donation_similarity`: cosine similarity of donor's past donation categories vs fundraiser
- `trending_boost`: (donations last 24h) / (avg daily donations) — capped at 3×
- `recency`: exponential decay from fundraiser creation date (half-life 7 days)

**Precomputed vs request-time:**
- Precomputed (hourly batch): donation_similarity signals, trending_boost per fundraiser
- Request-time: final score composition, interest_match (fast tag lookup), pagination
- Cache: ranked list cached per user for 5 minutes

**Recommendation reasons exposed safely:**
- Stored as structured `reasons[]` array: `{ type: "interest_match", label: "Based on your interest in Emergency Relief" }`
- Never expose raw score weights to frontend — only human-readable labels

**Exploration percentage:**
- 15% of feed positions filled with random eligible campaigns (not user-scored)
- Prevents filter bubble and surfaces new campaigns

### 4) Badge Evaluation Strategy

**Event-triggered badges:**
- `trust_pioneer`: first donation made
- `momentum_builder`: 5+ donations raised in one week
- `community_champion`: 3+ fundraisers followed
- `top_donor`: donated to 10+ campaigns

**Scheduled re-evaluation:**
- `verified_organizer`: daily check (requires external verification step)
- `milestone_reacher`: checks at 25%, 50%, 75%, 100% of goal

**Anti-spam rules:**
- Maximum 1 badge evaluation per user per event (batch evaluation, not per-donation)
- Quality thresholds: badge requires minimum 24h since last badge grant

**Top 3–5 visible badge ranking:**
- Priority: rarity × recency (newer rare badges first)
- Overflow: show "+N more" indicator with expand modal

**Idempotency under retries/replay:**
- Badge assignment guarded by `INSERT ... ON CONFLICT DO NOTHING` on `(userId, badgeType)`
- Badge evaluator checks current state before writing (read-then-idempotent-write pattern)

### 5) Donation and Tip UX Architecture

**Tip selection as explicit action:**
- Default: no tip selected (0% is shown but not pre-selected)
- UI: segmented control with 0%, 5%, 10%, 15%, 20%, Custom — must click to choose
- "Continue" button disabled until tip choice is made
- Server validates `tipPercent` is present in payload (not null)

**Server-side validation:**
- `totalCents === amountCents + Math.round(amountCents * tipPercent / 100)` — exact integer math
- Reject if totalCents ≠ server-computed total (prevents client-side manipulation)
- All values as integer cents (no floats)

**Money representation:**
- All DB columns: `INTEGER` (cents)
- Display: divide by 100 client-side for formatting
- No `DECIMAL` or `FLOAT` — eliminates rounding bugs

**Transparent tip-use explanation:**
- Show tooltip/expandable section: "Your tip covers: payment processing, platform infrastructure, fraud prevention, customer support"
- Shown inline in the donation flow, not hidden behind settings

### 6) Charity Starter Kit Flow

**Minimum fields for < 2 min launch:**
1. Charity name
2. Mission statement (short description)
3. How funds are used (transparency note)
4. At least one funding milestone
- No logo/media required at launch (can add later)

**Charity–fundraiser linkage:**
- `fundraisers.charityId` FK to `charities.id` — set when creating fundraiser or retroactively
- UI: "Link to charity" step in fundraiser creation flow
- API: `PATCH /api/fundraisers/:id` to set charityId (organizer auth required)

**Mandatory legal disclaimer:**
- "GoSupportMe is not a registered charity. Donations are at donor's discretion. Charities are user-created entities."
- Shown on charity creation screen and charity public page

**AI advice endpoints:**
- `POST /api/charities/advice` — optional, behind `ai_enabled` flag
- Fallback: static tips based on category selection

---

## Phase 3: Post-Stack Refinement

### 1) Security and Failure Modes

**Event store write succeeds but processor fails:**
- Processors read from events table in polling loop (not in-memory queue)
- Failed processor: event remains unprocessed, picked up on next poll (within 30s)
- Dead letter: after 3 failures, event moved to `failed_events` table with error context

**Retry without duplicate notifications/badge grants:**
- Notification: dedupe key checked before insert (`ON CONFLICT DO NOTHING`)
- Badge: idempotent assignment check (existing badge for userId+type → skip)
- Replay: explicit `idempotencyCheck: true` flag in processor options

**Rate limits for abuse prevention:**
- `POST /api/events`: 10 req/min per IP (covers burst donation submissions)
- `POST /api/donations`: 5 req/min per userId
- `GET /api/recommendations`: 30 req/min per userId

**Authorization for profile edits and organizer actions:**
- JWT middleware on all mutation endpoints
- Role checks: `req.user.id === fundraiser.organizerId` for organizer actions
- Profile edits: `req.user.id === params.userId`

### 2) Testing Strategy

**Unit tests first (business rules):**
1. Notification dedupe logic (same dedupeKey → no second notification)
2. Donation amount + tip validation (integer math, total correctness)
3. Recommendation ranking score composition
4. Badge eligibility criteria evaluation

**Mandatory E2E in CI:**
1. Complete donation flow (amount → tip → confirm → event emitted)
2. Notification creation from donation event (one notification, no duplicates)
3. Profile badge display (top 3-5 only)
4. Community feed renders with category filter

**Mobile layout testing:**
- Playwright viewport tests: 320px, 360px, 768px, 1024px
- Screenshot comparison for donation module at 320px

**Synthetic notification timeliness:**
- Test: emit event, poll notification endpoint, assert appears within 5s

### 3) Tooling and Developer Workflow

**Local dev data seed:**
- `npm run db:seed` — seeds 5 users, 10 fundraisers, 30 donations, 15 notifications, badges
- Realistic data: realistic names, amounts, stories from seed file

**Parallel processors in development:**
- `npm run dev` starts: Next.js (port 3000) + Fastify API (port 3001) + worker (port 3002) via `concurrently`
- Environment: single `.env.local` with all connection strings

**Migration strategy:**
- `infra/migrations/` numbered SQL files: `001_initial_schema.sql`, `002_indexes.sql`, etc.
- `npm run db:migrate` applies pending migrations in order
- No ORM migration generation — raw SQL for clarity and control

**Environment secrets:**
- `.env.local` for development (gitignored)
- Railway env vars for production
- Secrets never committed — `.env.example` documents required keys

### 4) Deployment and Scalability

**Deployment topology:**
- Frontend (Next.js): Vercel (automatic deployments from main branch)
- API + Worker (Fastify): Railway (single service with `--mode api|worker`)
- Postgres: Railway managed Postgres
- Redis: Railway managed Redis

**Horizontal scaling first:**
- API: stateless (JWT auth, no local session) — scale by adding Railway instances
- Worker: stateless processor — scale by adding worker replicas (BullMQ handles concurrency)
- Frontend: Vercel handles auto-scaling

**Caching layers:**
- Redis: recommendation scores (5 min TTL), community feed cursor (30s TTL), badge lists (60s TTL)
- Next.js ISR: fundraiser page (revalidate: 60s) for read-heavy campaign pages

**Rollback strategy:**
- Vercel: instant rollback to previous deployment via dashboard
- Railway: redeploy previous commit SHA
- DB: migrations are additive only (no destructive changes without explicit down migration)

### 5) Observability and Operations

**Required dashboards before final submission:**
- Conversion funnel: fundraiser views → donation starts → donation completions
- Latency: p50/p95/p99 for donation, feed, notifications endpoints
- Error rate: 4xx/5xx per endpoint
- Queue lag: worker queue depth and processing latency

**Alert thresholds:**
- Donation endpoint error rate > 1% → PagerDuty (would be, for production)
- Notification queue lag > 30s → alert
- Recommendation timeout rate > 5% → alert

**Runbooks:**
- `docs/runbooks/notification-delay.md`
- `docs/runbooks/recommendation-failure.md`
- `docs/runbooks/donation-degradation.md`

**Correlating user issues to traces:**
- Every response includes `x-request-id` header
- All logs include `requestId`, `userId`, `eventId` as structured fields
- Trace ID propagated from API to worker via event payload metadata

---

## Architecture Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Backend | Node.js + Fastify | Fastest iteration, strong TypeScript support, low latency |
| Frontend | Next.js App Router | SSR for SEO, ISR for campaign pages, streaming for feed |
| Database | Postgres | ACID guarantees for donations, strong SQL for analytics |
| Queue/Cache | Redis + BullMQ | Reliable worker queue, simple caching layer |
| Event IDs | ULID | Sortable, collision-resistant, no coordination needed |
| Money | Integer cents | Eliminates float rounding, standard industry practice |
| Auth | JWT (stateless) | Enables horizontal scaling without session store |
| Deploy | Vercel + Railway | Zero-ops frontend, managed DB+Redis on Railway |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E browser tests |
| AI | Claude API behind flag | Optional enhancement, not in critical path |

## Rejected Alternatives

| Alternative | Rejected Because |
|---|---|
| tRPC | Adds complexity for API that will be tested via HTTP |
| GraphQL | Overkill for this data model, adds resolver complexity |
| Kafka | Over-engineered for MVP scale, Redis Streams simpler |
| ORM (Prisma/Drizzle) | Migrations become harder to reason about; raw SQL is clearer |
| MongoDB | Need ACID transactions for donations |
| Serverless functions for workers | Cold start latency unacceptable for notification SLOs |
