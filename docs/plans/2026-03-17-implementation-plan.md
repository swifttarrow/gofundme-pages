# Implementation Plan

## Overview
Build a GoFundMe-inspired fundraising platform with three integrated surfaces (fundraiser, community, profile) and one shared event-driven orchestration layer that powers notifications, badges, and recommendations with idempotent event processing and observable critical paths.

This plan follows the PRD sequence: stabilize event contracts first, then ship conversion-critical donation flow, then complete trust and engagement loops, then harden for reliability, mobile responsiveness, and operations.

## Current State Analysis
- Product scope, requirements, and acceptance criteria are defined in `docs/prd.md`.
- No implementation code was identified in this repository yet, so this is a greenfield plan.
- The PRD requires Pre-Search completion before coding; implementation should not begin until `docs/pre-search.md` is completed.
- Architecture decisions (stack, event bus, deployment topology) are intentionally open in the PRD and must be explicitly chosen during Phase 0.
- High-risk requirements are event idempotency, notification dedupe/bundling, recommendation explainability, and mobile-safe donation UX under strict checkpoint deadlines.

## Desired End State
One deployable web application with:
- Fully functional fundraiser, community, and profile pages.
- Event ingestion and fan-out pipeline for notifications, badge evaluation, and recommendation signal updates.
- At least 4 deep-section capabilities implemented (dedupe/bundling, badge evaluator, recommendation signal updater, notification reason generator, replay endpoint, backfill job).
- Transparent donation + tipping flow with explicit total charge and server-side money validation.
- Documented architecture, reliability strategy, runbooks, observability, and AI cost analysis.
- Test coverage for ranking/eligibility logic and integration coverage for core end-to-end flows.

Verification definition:
- All Build Checkpoint requirements in `docs/prd.md` are demonstrably complete.
- All required deliverables in submission checklist are present.
- Critical performance and correctness targets are instrumented and validated in staging/demo environment.

## What We're NOT Doing
- Learned ranking models or complex ML training pipelines (heuristic ranking only for this sprint).
- Multi-region active-active deployment.
- Full payment processor/payout production compliance implementation (simulate payment lifecycle safely for MVP if needed).
- Non-essential UI polish before end-to-end correctness and observability are stable.
- Mobile voice transcription / dictation for fundraiser creation in this scope.

## Architecture Direction (For Confirmation)
- Backend: Node.js + Fastify (REST) with Zod contracts.
- Frontend: Next.js App Router.
- Data: Postgres for canonical state + Redis for event stream/queue and caching.
- Event model: canonical `PlatformEvent` persisted before fan-out.
- Worker model: background processors for notifications, badges, recommendation signals.
- Deploy: frontend + API + worker + Postgres + Redis on Railway.

If you want a different stack, update this section before implementation starts.

## Phase 0: Pre-Search and Architecture Lock
### Overview
Finalize constraints, stack choices, domain model, and reliability decisions before writing application code.

### Changes Required
**File**: `docs/pre-search.md`  
**Changes**: Complete all checklist sections from PRD appendix, including scale model, cost envelope, risk posture, architecture decisions, and testing approach.

**File**: `docs/developer-log.md`  
**Changes**: Add final architecture decisions and rejected alternatives.

**File**: `docs/architecture.md`  
**Changes**: Draft required architecture document (system diagram, contracts, reliability, observability, AI cost controls).

### Success Criteria
#### Automated Verification:
- [ ] Markdown lint/check passes for all docs

#### Manual Verification:
- [ ] Every Pre-Search prompt in PRD appendix has an explicit answer
- [ ] Event contract and idempotency strategy are finalized
- [ ] One stack/deployment path is selected with rationale

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 1: Foundations - Repo Bootstrap and Core Contracts
### Overview
Create application skeleton and implement core domain contracts that all surfaces and processors depend on.

### Changes Required
**File**: `apps/web/*`  
**Changes**: Initialize frontend app shell, shared responsive layout, route scaffolds for fundraiser/community/profile.

**File**: `apps/api/*`  
**Changes**: Initialize API service with health checks, request ID middleware, logging/tracing scaffolding.

**File**: `packages/contracts/src/events.ts`  
**Changes**: Define `PlatformEvent` schema and event type union with Zod runtime validation.

**File**: `packages/contracts/src/money.ts`  
**Changes**: Define integer-cent money model and tip validation contracts.

**File**: `infra/migrations/*`  
**Changes**: Create initial schema for users, fundraisers, donations, notifications, badges, follows, events, recommendations.

### Success Criteria
#### Automated Verification:
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`

#### Manual Verification:
- [ ] App routes render base shells on desktop and mobile widths
- [ ] API validates malformed event payloads with stable error responses
- [ ] Database migrations apply cleanly on local and preview environments

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 2: Event Ingestion, Idempotency, and Fan-Out
### Overview
Implement the event-driven orchestration core so all downstream trust/engagement behavior is deterministic and replay-safe.

### Changes Required
**File**: `apps/api/src/routes/events.ts`  
**Changes**: Implement `POST /api/events` with event ID uniqueness guard and canonical persistence.

**File**: `apps/api/src/services/event-ingestion.ts`  
**Changes**: Add transactional write path; persist event then enqueue downstream jobs.

**File**: `apps/worker/src/processors/notifications.ts`  
**Changes**: Add notification generation, dedupe key strategy, and bundling window behavior.

**File**: `apps/worker/src/processors/badges.ts`  
**Changes**: Add idempotent badge evaluation and assignment safeguards.

**File**: `apps/worker/src/processors/recommendations.ts`  
**Changes**: Update recommendation signals from events and attach explainability metadata.

**File**: `apps/api/src/routes/replay.ts`  
**Changes**: Add event replay endpoint for recovery/testing with idempotent reprocessing.

### Success Criteria
#### Automated Verification:
- [ ] Event duplicate tests pass (`same eventId` produces no second side effect)
- [ ] Worker processor unit tests pass for dedupe and bundling logic
- [ ] Integration tests validate event -> notification/badge/recommendation fan-out

#### Manual Verification:
- [ ] Posting `donation.created` creates one notification and one signal update
- [ ] Burst donation events produce a bundled notification outcome
- [ ] Replay endpoint reprocesses safely without duplication

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 3: Fundraiser Surface and Transparent Donation Flow
### Overview
Ship the highest-conversion user surface with trust context, explicit tip selection, and instrumented donation flow.

### Changes Required
**File**: `apps/web/src/app/fundraiser/[id]/page.tsx`  
**Changes**: Render hero, story with progressive disclosure, organizer module, trust/safety context, donation feed.

**File**: `apps/web/src/components/donation-module.tsx`  
**Changes**: Add suggested amounts, custom amount, tip selector (`0/5/10/15/20/custom`), explicit total charged UI.

**File**: `apps/web/src/app/fundraiser/new/page.tsx`  
**Changes**: Replace the removed voice-first/mobile dictation flow with a guided fundraiser starter stepper capped at 3 screens (`Basics`, `Story`, `Review & publish`).

**File**: `apps/api/src/routes/donations.ts`  
**Changes**: Validate donation + tip totals server-side, emit `donation.created` event.

**File**: `apps/api/src/services/telemetry.ts`  
**Changes**: Instrument donate write path with metrics, logs, and trace correlation IDs.

### Success Criteria
#### Automated Verification:
- [ ] Donation amount/tip validation tests pass
- [ ] E2E test validates transparent total charged across presets and custom tips
- [ ] Accessibility checks pass for donation controls and keyboard flow

#### Manual Verification:
- [ ] User can complete donation flow at `320px` without layout breakage
- [ ] User can complete the `/fundraiser/new` starter flow in no more than 3 screens on mobile
- [ ] Tip choice is explicit and never hidden/defaulted ambiguously
- [ ] Donation emits one canonical event with traceable ID

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 4: Community Discovery and Notification Center
### Overview
Deliver engagement loops: feed discovery, recommendation reasons, and notification visibility with deep links.

### Changes Required
**File**: `apps/web/src/app/community/page.tsx`  
**Changes**: Build featured campaigns and infinite feed with category filters/sort controls.

**File**: `apps/api/src/routes/recommendations.ts`  
**Changes**: Implement `GET /api/recommendations?user_id=<id>` with heuristic scoring and reason fields.

**File**: `apps/web/src/components/recommendation-card.tsx`  
**Changes**: Render recommendation reason metadata safely and clearly.

**File**: `apps/web/src/app/notifications/page.tsx`  
**Changes**: Build notification center tab with reason text, timestamps, and deep links.

**File**: `apps/api/src/routes/notifications-preview.ts`  
**Changes**: Implement `POST /api/notifications/preview` for debugging/explainability support.

### Success Criteria
#### Automated Verification:
- [ ] Ranking tests pass for weight composition and exploration ratio behavior
- [ ] Notification reason-generation tests pass
- [ ] E2E tests validate feed -> fundraiser navigation and notification deep links

#### Manual Verification:
- [ ] User can edit interests and see recommendation output/reasons change
- [ ] Notification center renders seeded + generated notifications with explanations
- [ ] No duplicate notifications for same dedupe key

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 5: Profile, Badges, and Charity Starter Kit
### Overview
Complete trust surface and creator workflows while preserving idempotent, explainable state transitions.

### Changes Required
**File**: `apps/web/src/app/profile/[id]/page.tsx`  
**Changes**: Render identity, trust stats, fundraiser list, activity stream, editable profile controls.

**File**: `apps/web/src/components/badges.tsx`  
**Changes**: Show top 3-5 prioritized badges with meaning tooltips/modal and mobile-safe wrapping.

**File**: `apps/api/src/routes/badges-evaluate.ts`  
**Changes**: Implement `POST /api/badges/evaluate` for explicit evaluation trigger/testing.

**File**: `apps/web/src/app/charity/new/page.tsx`
**Changes**: Add charity request wizard with eligibility gating, education, submission, and fundraiser linking flow.

**File**: `apps/api/src/routes/charities.ts`  
**Changes**: Persist charity entity and parent-child fundraiser linkage with auth checks.

### Success Criteria
#### Automated Verification:
- [ ] Badge visibility ranking tests pass (max 3-5 badges shown)
- [ ] Charity creation + linkage integration tests pass
- [ ] Authorization tests pass for profile edits and organizer-only actions

#### Manual Verification:
- [ ] Profile with many badges does not overflow on mobile
- [ ] Charity can be created and linked to at least one fundraiser in one session
- [ ] Badge assignments remain stable under event retries/replay

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 6: Reliability, Operations, and Final Submission Hardening
### Overview
Harden reliability and operational readiness to satisfy production-oriented requirements and final submission artifacts.

### Changes Required
**File**: `apps/api/src/observability/*`  
**Changes**: Finalize RED/USE metrics, structured logs, traces, and alert hooks.

**File**: `docs/runbooks/notification-delay.md`  
**Changes**: Incident triage for notification delays.

**File**: `docs/runbooks/recommendation-failure.md`  
**Changes**: Incident triage for recommendation degradation/timeouts.

**File**: `docs/runbooks/donation-degradation.md`  
**Changes**: Incident triage for donation path instability.

**File**: `docs/ai-cost-analysis.md`  
**Changes**: Document dev spend tracking and production cost projection assumptions.

**File**: `README.md`  
**Changes**: Add setup, architecture summary, run/test commands, and deployed URL.

### Success Criteria
#### Automated Verification:
- [ ] CI passes unit, integration, and E2E test suites
- [ ] Performance smoke tests verify latency budgets within acceptable range
- [ ] Synthetic concurrency tests pass idempotency/correctness checks

#### Manual Verification:
- [ ] All required submission deliverables are present and accurate
- [ ] Dashboards/alerts are test-triggered and produce expected signals
- [ ] Demo flow works end-to-end: discovery -> fundraiser -> donation -> notification -> profile

**Note**: Pause for human confirmation after this phase before proceeding.

## Rollout and Risk Strategy
- Keep event ingestion path behind strict schema validation and idempotency checks from day one.
- Feature-flag optional AI enhancements; fallback to deterministic summaries/reasoning on budget or outage.
- Gate each major phase with explicit manual signoff to prevent cascading rework.
- Prioritize correctness over feature breadth when checkpoint timing pressure increases.

## Dependencies and Tooling Additions (Expected)
- Runtime: Fastify/Nest-compatible validation stack with Zod.
- Data: Postgres migration tooling + Redis queue/stream client.
- Testing: Unit + integration + E2E framework and minimal load-test harness.
- Observability: OpenTelemetry-compatible tracing + metrics exporter.

## Open Assumptions to Confirm
- Monorepo structure (`apps/web`, `apps/api`, `apps/worker`, `packages/contracts`) is acceptable.
- Railway-only deployment is acceptable for timeline.
- Simulated donation processor is acceptable if full payment integration is out of scope for one-week sprint.
- One-week schedule prioritizes end-to-end trust loop completeness over advanced visual polish.

## References
- Product requirements: `docs/prd.md`
- Planning prompt: `agent/prompts/plan.md`
