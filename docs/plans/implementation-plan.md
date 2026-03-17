# GoWithMe Implementation Plan

## Overview
Build a responsive, deployable three-page fundraising experience (`fundraiser`, `community`, `profile`) with shared social graph, badge, and charity-starter capabilities. The implementation prioritizes deterministic ranking, idempotent event handling, privacy-safe rendering, and fast page reads through precomputed summaries.

This plan defines one complete end state and uses phased checkpoints to reach it.

## Current State Analysis
- Repository currently contains requirements and planning artifacts, but no application scaffold or runtime code.
- Product and technical requirements are defined in `docs/prd.md`.
- Research gate checklist exists in `docs/pre-search.md`, but architecture decisions are not yet captured there as answers.
- Pencil design source for responsive parity is available in `gofundme-pages.pen` with these page frames:
  - Fundraiser: browser `fMG5i`, mobile `9aXpX`
  - Community: browser `mmCkm`, mobile `PMwPm`
  - Profile: browser `7LTsR`, mobile `G095N`
- Hard constraints from requirements:
  - Event writes must be idempotent via `eventId` and `timestamp`.
  - Recommendation output must be explainable and privacy-safe.
  - Services must remain stateless and horizontally scalable.
  - Build checkpoint must be reachable in 24 hours with an end-to-end skeleton.

## Desired End State
A publicly accessible app that:
- ships all three pages aligned to Pencil hierarchy across desktop and mobile;
- supports fundraiser creation/editing in Quick AI and Form modes;
- persists graph nodes/edges and idempotent events, then serves cached or precomputed summaries;
- renders at least four graph modules with explanation labels and privacy-safe text;
- computes badges without duplicate awards on replayed events;
- links charities to fundraisers and exposes aggregate context on pages;
- includes observability baselines, reliability fallbacks, and runbooks.

Verification of the end state:
- Functional: all PRD checklist scenarios pass (creation, edit, graph updates, fallbacks, badges, observability).
- Performance: p95 page APIs < 350 ms and graph summary p95 < 500 ms for demo dataset.
- Reliability: fallback payloads prevent page crashes on AI or graph dependency failures.
- Readiness: deployment, docs, runbooks, and demo flow are complete.

## What We're NOT Doing
- Dedicated graph database adoption in this sprint.
- Realtime chat, DMs, or friend-request features.
- Advanced ML ranking or opaque recommendation models.
- Full nonprofit legal onboarding workflows.
- Native mobile apps (web responsive only).

## Architecture Decisions (Locked for Plan)
- **Application architecture:** SSR-first Next.js App Router with server components for page reads.
- **Backend:** TypeScript API layer (route handlers or service modules) with strict Zod validation at boundaries.
- **Persistence:** PostgreSQL for relational data + Redis for summary and page fragment caching.
- **Eventing:** queue-backed worker pipeline (BullMQ) for graph and badge summary refresh.
- **Ranking:** deterministic weighted scoring with explanation templates stored in code.
- **Deployment:** web + worker services on Railway with managed Postgres and Redis.

## Phase 1: Foundation and Build Checkpoint Skeleton
### Overview
Create the monorepo application skeleton, runtime infrastructure, and first vertical slice required by the 24-hour checkpoint.

### Changes Required
**File**: `apps/web/*`  
**Changes**: Initialize Next.js app with routes `/f/[slug]`, `/communities/[slug]`, `/u/[handle]`, shared navigation, and responsive layout primitives for mobile/tablet/desktop.

**File**: `packages/config/*`  
**Changes**: Add runtime env schema with Zod for web, API, worker, DB, cache, and external AI/media providers.

**File**: `packages/db/schema/*`  
**Changes**: Create core entities (`users`, `fundraisers`, `communities`, `charities`, `badges`) and baseline node/edge tables.

**File**: `packages/api/src/routes/fundraisers/*`  
**Changes**: Implement first write path to create/persist fundraiser and return a readable page payload.

**File**: `infra/docker-compose.yml`  
**Changes**: Add local Postgres + Redis for deterministic local development.

**File**: `README.md`  
**Changes**: Add bootstrap commands and minimum local run path.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm install`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`

#### Manual Verification:
- [ ] Responsive route shells exist for all three pages.
- [ ] Creating a fundraiser writes data and returns readable page content.
- [ ] Local stack starts with Postgres and Redis.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 2: Graph/Event Data Model and Read APIs
### Overview
Implement idempotent event ingestion and graph summary read APIs needed by page modules.

### Changes Required
**File**: `packages/db/schema/graph/*`  
**Changes**: Add `graph_nodes`, `graph_edges`, `idempotency_keys`, and summary tables for user/fundraiser/community reads.

**File**: `packages/api/src/routes/graph/*`  
**Changes**: Add:
- `POST /api/graph/events/ingest`
- `GET /api/graph/user/:userId/summary`
- `GET /api/graph/fundraiser/:fundraiserId/context`
- `GET /api/graph/community/:communityId/summary`

**File**: `packages/api/src/validation/*`  
**Changes**: Add Zod request/response schemas and server-side auth checks for write endpoints.

**File**: `packages/workers/src/graph/*`  
**Changes**: Add edge upsert and summary refresh jobs with dedupe by `eventId`.

**File**: `packages/db/seeds/demo/*`  
**Changes**: Add overlap-rich seed data for causes, users, communities, and fundraisers.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm db:migrate`
- [ ] `pnpm db:seed`
- [ ] `pnpm test --filter api`
- [ ] Event idempotency integration tests pass.

#### Manual Verification:
- [ ] Duplicate events with same `eventId` do not duplicate edges.
- [ ] Summary endpoints return deterministic data and reason labels.
- [ ] Private donor events produce aggregate-only output.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 3: Fundraiser Page and Creation Flows
### Overview
Ship fundraiser UX from Pencil design with publishing, story controls, and graph-context modules.

### Changes Required
**File**: `apps/web/src/app/f/[slug]/page.tsx`  
**Changes**: Implement browser/mobile layout parity with frames `fMG5i` and `9aXpX`, including hero, trust layer, progress, organizer, donation CTA, and collapsible story.

**File**: `apps/web/src/features/fundraiser/create/*`  
**Changes**: Implement Quick AI and Form mode workflows with editable generated content and mode switching.

**File**: `apps/web/src/features/fundraiser/media/*`  
**Changes**: Support up to 3 media items and image-to-video fallback behavior.

**File**: `apps/web/src/features/graph/modules/fundraiser/*`  
**Changes**: Implement at least two fundraiser modules (supporter overlap, related communities) with explanation tooltips and privacy-safe phrasing.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm test --filter fundraiser`
- [ ] `pnpm test:e2e --grep fundraiser`

#### Manual Verification:
- [ ] Quick mode generates editable content and publishes successfully.
- [ ] Form mode create/edit works on mobile and desktop.
- [ ] Graph modules render explanations and safe fallbacks.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 4: Community and Profile Pages with Graph Surfaces
### Overview
Implement the remaining two page surfaces and complete the minimum four graph modules requirement.

### Changes Required
**File**: `apps/web/src/app/communities/[slug]/page.tsx`  
**Changes**: Implement mission dashboard, progress, CTAs, structured activity feed, and participation layer following frames `mmCkm` and `PMwPm`.

**File**: `apps/web/src/app/u/[handle]/page.tsx`  
**Changes**: Implement profile header, cause footprint, connected communities, badges strip, and recommendation modules following frames `7LTsR` and `G095N`.

**File**: `apps/web/src/features/graph/modules/profile/*`  
**Changes**: Implement communities-around-you and similar-users modules with deterministic scoring.

**File**: `apps/web/src/features/graph/modules/community/*`  
**Changes**: Implement community momentum and/or cause cluster module using overlap + recency.

**File**: `packages/api/src/services/composition/*`  
**Changes**: Add page composition services that merge graph, badges, and charity context into page-ready payloads.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm test --filter community`
- [ ] `pnpm test --filter profile`
- [ ] `pnpm test:e2e --grep "community|profile"`

#### Manual Verification:
- [ ] Community and profile pages match Pencil hierarchy across breakpoints.
- [ ] At least 4 required graph modules are visible and explainable.
- [ ] Empty states render correctly with sparse seed data.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 5: Badges, Charity Starter, and Reliability Hardening
### Overview
Add badge and charity workflows, then harden observability and failure behavior.

### Changes Required
**File**: `packages/workers/src/badges/*`  
**Changes**: Implement badge criteria evaluation with idempotent assignment and dedupe checks.

**File**: `packages/api/src/routes/charities/*`  
**Changes**: Add charity starter and linkage APIs (`POST /api/charities`, `POST /api/charities/:id/fundraisers`, `GET /api/charities/:id`).

**File**: `apps/web/src/features/badges/*`  
**Changes**: Render prioritized 3-5 badges and explanation surfaces in profile and fundraiser contexts.

**File**: `packages/observability/*`  
**Changes**: Add logs, traces, and metrics for golden signals and funnel events; include graph module and badge interactions.

**File**: `docs/runbooks/*.md`  
**Changes**: Add runbooks for AI outage, graph lag, and elevated error rate.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm test --filter workers`
- [ ] `pnpm test --filter observability`
- [ ] `pnpm lint && pnpm test && pnpm build`

#### Manual Verification:
- [ ] Duplicate events do not duplicate badge awards.
- [ ] Charity-fundraiser linkage is persisted and queryable.
- [ ] Graph/AI dependency failures return safe, non-crashing UI fallbacks.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 6: Final Validation, Submission, and Demo Readiness
### Overview
Validate against PRD rubric, finalize docs, and ensure end-to-end demonstration quality.

### Changes Required
**File**: `docs/pre-search.md`  
**Changes**: Fill all sections with final architecture decisions, constraints, and measurable assumptions.

**File**: `docs/testing/strategy.md`  
**Changes**: Document test matrix for unit/integration/e2e and checkpoint gates.

**File**: `docs/requirements/traceability-matrix.md`  
**Changes**: Map each PRD requirement to code path, tests, and manual verification step.

**File**: `README.md`  
**Changes**: Finalize deployment instructions, system context, and demo walkthrough.

### Success Criteria
#### Automated Verification:
- [ ] CI green on lint/type/test/build gates.
- [ ] Smoke tests pass against deployed environment.

#### Manual Verification:
- [ ] End-to-end demo covers fundraiser -> profile -> community navigation with coherent context.
- [ ] Fallback paths are explicitly shown in demo.
- [ ] Submission bundle includes URL, video, docs, and social post checklist items.

**Note**: Pause for human confirmation after this phase before proceeding.

## Risks and Mitigations
- **Graph complexity risk:** keep deterministic formulas and precompute summaries rather than runtime traversal.
- **Checkpoint risk:** enforce Phase 1 strict scope and defer non-critical polish.
- **Privacy leakage risk:** centralize visibility policy templates and add regression tests.
- **Cost risk for AI/media:** enforce timeouts, caching, and static fallback paths.
- **Sparse data UX risk:** ship empty states and seeded overlap fixtures early.

## Rollout Strategy
- Develop on feature branches with small, checkpoint-aligned commits.
- Deploy preview after each phase gate and run smoke tests.
- Promote to production only after Phase 6 validation checklist passes.

## References
- Prompt: `agent/prompts/plan.md`
- PRD: `docs/prd.md`
- Pre-search checklist: `docs/pre-search.md`
- Requirements index: `docs/requirements/index.md`
- Social graph requirements: `docs/requirements/social-graph.md`
- Pencil design source: `gofundme-pages.pen` (frames `fMG5i`, `9aXpX`, `mmCkm`, `PMwPm`, `7LTsR`, `G095N`)
