# GoFundMe Three Pages Implementation Plan

## Overview
Build a responsive, demo-ready GoFundMe-inspired experience with three integrated pages (`fundraiser`, `community`, `profile`) plus shared platform capabilities (`social graph`, `achievement badges`, `charity starter kit`) grounded in the existing requirements docs and Pencil mocks.

This plan targets one complete end state with phased checkpoints, not a separate MVP vs final split.

## Current State Analysis
- Repository is currently docs-only (requirements and planning artifacts), with no application code scaffold.
- Requirement coverage exists across:
  - `docs/requirements/fundraiser-page.md`
  - `docs/requirements/community-page.md`
  - `docs/requirements/social-graph.md`
  - `docs/requirements/achievement-badges.md`
  - `docs/requirements/charity-starter-kit.md`
- `docs/requirements/profile-page.md` is empty, so profile scope is inferred from `docs/requirements/index.md`, `docs/requirements/social-graph.md`, and the Pencil mock.
- `docs/requirements/index.md` contains a typo path (`docs/quirements/community-page.md`), but a valid `docs/requirements/community-page.md` file exists and is used as source of truth.
- GoFundMe mock source of truth is available in Pencil at `/Users/swifttarrow/Documents/gofundme-pages.pen` with 6 top-level frames:
  - `fMG5i` / `9aXpX`: Fundraiser Browser/Mobile
  - `mmCkm` / `PMwPm`: Community Browser/Mobile
  - `7LTsR` / `G095N`: Profile Browser/Mobile

## Desired End State
A production-like, horizontally scalable app that:
- renders all three pages responsively across desktop and mobile, aligned to Pencil structure and hierarchy;
- supports both viewing and editing flows for page-specific content;
- provides deterministic, explainable social graph modules with privacy-safe behavior;
- computes and displays achievement badges with idempotent event-driven updates;
- includes a charity starter kit flow that creates persistent charity entities and links fundraisers;
- is instrumented end-to-end with metrics, structured logs, traces, and runbooks;
- has meaningful unit/integration/e2e test coverage and documented operational behavior.

Verification of end state:
- Functionality: all requirement acceptance criteria are met for fundraiser/community/profile plus cross-page graph linkage.
- Performance: page modules backed by precomputed/cached summaries achieve p95 under 500ms for demo dataset.
- Reliability: graph/badge/AI failures degrade gracefully with fallback UI.
- Observability: all key events and error classes are measurable and traceable.

## What We're NOT Doing
- Full social network features (DMs, friend requests, real-time messaging).
- Production-grade legal/compliance onboarding for formal nonprofit incorporation.
- ML-heavy ranking/personalization; ranking remains deterministic and explainable.
- Deep graph infrastructure (no separate graph database in first implementation).
- Advanced payout/custody system changes beyond current fundraiser rails.

## Phase 1: Foundation and Delivery Skeleton
### Overview
Create the initial application and delivery baseline so all subsequent feature work lands in a consistent, testable architecture.

### Changes Required
**File**: `apps/web/*` (new app scaffold)  
**Changes**: Create SSR-first web app shell with routing for `/f/:slug`, `/communities/:slug`, `/u/:handle`, shared layout primitives, and responsive breakpoints derived from Pencil mock frames.

**File**: `packages/domain/*`  
**Changes**: Define shared domain types for users, fundraisers, communities, charities, badges, graph summaries, and analytics event payloads.

**File**: `packages/config/*`  
**Changes**: Centralize runtime config (env schema, feature flags, observability toggles), including Zod validation for all server-side runtime inputs.

**File**: `infra/docker-compose.yml` (or equivalent local infra)  
**Changes**: Add local Postgres + cache service for deterministic local development and integration tests.

**File**: `README.md` and `docs/runbooks/local-development.md`  
**Changes**: Add bootstrap instructions, scripts, and local troubleshooting.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm install`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`

#### Manual Verification:
- [ ] All three route skeletons render on desktop and mobile viewport sizes.
- [ ] Basic health endpoint and error page work.
- [ ] New developer can run app from zero with docs only.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 2: Data Model, Seed Data, and Core APIs
### Overview
Implement persistent schema and core read/write APIs for entities required by the three pages and shared features.

### Changes Required
**File**: `packages/db/schema/*`  
**Changes**: Create relational tables for users, communities, fundraisers, charities, charity-fundraiser linkage, badges, and `graph_edges` + summary tables (`user_graph_summary`, `fundraiser_graph_summary`, `community_graph_summary`).

**File**: `packages/db/migrations/*`  
**Changes**: Add forward-only migrations and rollback notes for core schema.

**File**: `packages/api/src/routes/*`  
**Changes**: Implement baseline APIs including:
- `POST /api/charities`
- `GET /api/charities/:charityId`
- `POST /api/charities/:charityId/fundraisers`
- `GET /api/graph/user/:userId/summary`
- `GET /api/graph/fundraiser/:fundraiserId/context`
- `GET /api/graph/community/:communityId/summary`
- badge read/evaluate endpoints from requirements.

**File**: `packages/api/src/validation/*`  
**Changes**: Add Zod request/response validation and server-side auth guards for all write operations.

**File**: `packages/db/seeds/demo/*`  
**Changes**: Seed intentionally overlapping wildfire/medical/animal clusters for polished social graph behavior in demos.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm db:migrate`
- [ ] `pnpm db:seed`
- [ ] `pnpm test --filter api`
- [ ] Contract tests pass for all public API shapes.

#### Manual Verification:
- [ ] Seed dataset creates visible cross-entity links used by all three pages.
- [ ] API endpoints return deterministic data and explanation strings.
- [ ] Private donor visibility rules return aggregate-safe output.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 3: Social Graph and Badge Evaluation Services
### Overview
Add event ingestion and idempotent background computation for graph summaries and badge assignment.

### Changes Required
**File**: `packages/events/src/contracts/*`  
**Changes**: Define idempotent event schema including required `eventId` and `timestamp` for donation/view/share/save/join/update actions.

**File**: `packages/workers/src/graph/*`  
**Changes**: Build deterministic scoring jobs and summary refresh workflows; prioritize precompute + cache over runtime traversal.

**File**: `packages/workers/src/badges/*`  
**Changes**: Implement idempotent badge criteria evaluation with assignment dedupe and optional expiration handling.

**File**: `packages/cache/*`  
**Changes**: Add cache strategy for summary payloads and fallback behavior when backend services degrade.

**File**: `docs/runbooks/graph-service.md` and `docs/runbooks/badge-service.md`  
**Changes**: Document refresh logic, failure modes, replay procedures, and operator checks.

### Success Criteria
#### Automated Verification:
- [ ] Worker unit tests for scoring and badge criteria pass.
- [ ] Event idempotency tests (duplicate event replay) pass.
- [ ] Integration tests validate summary refresh and cache invalidation.

#### Manual Verification:
- [ ] Triggering seed events changes graph modules and badges as expected.
- [ ] Duplicate events do not create duplicate edges or badges.
- [ ] Service failures degrade gracefully without blocking page rendering.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 4: Page Implementation Against Pencil Mocks
### Overview
Build the actual page UIs and editing/view interactions aligned to mock structure for both desktop and mobile.

### Changes Required
**File**: `apps/web/src/pages/fundraiser/*`  
**Changes**: Implement hero, hook, collapsible story, donation panel/sticky donation bar, social proof modules, and AI-assisted creation/editing controls matching `fMG5i` and `9aXpX`.

**File**: `apps/web/src/pages/community/*`  
**Changes**: Implement mission dashboard, structured activity feed, highlights rail, supporter participation layer, and retained directory/leaderboard matching `mmCkm` and `PMwPm`.

**File**: `apps/web/src/pages/profile/*`  
**Changes**: Implement profile header, badges strip/grid, connected fundraisers, cause footprint, related communities, similar supporters, and network summary matching `7LTsR` and `G095N`.

**File**: `apps/web/src/components/graph/*`  
**Changes**: Reusable explainable recommendation cards with privacy-safe labels and fallback states.

**File**: `apps/web/src/components/badges/*`  
**Changes**: Badge strip, badge grid, tooltip/modal explanations, and top-N display prioritization.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm test --filter web`
- [ ] `pnpm test:e2e` for core journeys (view + edit for each page).
- [ ] Visual regression checks for desktop/mobile breakpoints.

#### Manual Verification:
- [ ] Each page visually aligns with corresponding Pencil frame hierarchy.
- [ ] Editing flows persist data and update read views.
- [ ] Cross-page navigation feels seamless and context-preserving.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Phase 5: Observability, Error Handling, and Final Hardening
### Overview
Finalize instrumentation, reliability behavior, documentation, and operational readiness for review criteria.

### Changes Required
**File**: `packages/observability/*`  
**Changes**: Add telemetry wrapper for logs, traces, and metrics with page and module dimensions.

**File**: `apps/web/src/telemetry/events.ts` and `packages/api/src/telemetry/events.ts`  
**Changes**: Instrument required events:
- graph module events (`graph_module_impression`, clicks, tooltip opens)
- badge interaction/earn events
- community and fundraiser funnel events
- conversion-after-exposure events.

**File**: `docs/runbooks/incident-response.md`  
**Changes**: Define failure diagnosis flow for graph/badge/API regressions and degraded dependency scenarios.

**File**: `docs/testing/strategy.md`  
**Changes**: Document test pyramid and required coverage by domain and page.

**File**: `docs/requirements/traceability-matrix.md`  
**Changes**: Map each requirement to implementation artifact and automated/manual verification.

### Success Criteria
#### Automated Verification:
- [ ] `pnpm lint && pnpm test && pnpm build`
- [ ] Performance checks confirm p95 goals for summary-backed page modules.
- [ ] Error path tests verify graceful fallback and non-blocking rendering.

#### Manual Verification:
- [ ] Dashboards show end-to-end funnel and module metrics.
- [ ] Runbooks are actionable by someone unfamiliar with the code.
- [ ] Final product demo traverses profile → fundraiser → community with coherent social context.

**Note**: Pause for human confirmation after this phase before proceeding.

---

## Architecture and Delivery Decisions Locked for This Plan
- **App architecture**: SSR-first web app plus API/service layer to keep pages fast and SEO-friendly.
- **Data strategy**: Relational schema + precomputed summary tables for graph features (no dedicated graph DB initially).
- **Event model**: Idempotent event contracts with `eventId` and `timestamp`; async workers for graph and badges.
- **Ranking approach**: Deterministic and explainable scoring, not ML, to satisfy clarity and demo reliability.
- **UI source of truth**: Pencil mock frames (`fMG5i`, `9aXpX`, `mmCkm`, `PMwPm`, `7LTsR`, `G095N`) with responsive parity.
- **Quality gates**: Lint, unit/integration/e2e tests, runbooks, and requirement traceability before final sign-off.

## Risks and Mitigations
- **Scope breadth across 3 pages + 3 shared systems**: Enforce phase gates and explicit pause/confirm checkpoints.
- **Empty profile-specific requirements file**: Treat social-graph profile requirements + Pencil profile mocks as authoritative until profile spec is filled.
- **Graph quality with sparse organic activity**: Seed high-quality overlapping demo dataset and precompute summary outputs.
- **Performance regressions from real-time joins**: Serve summary JSON + cache, with asynchronous refresh.
- **Trust/privacy concerns in social modules**: Restrict identity exposure by donor visibility rules and aggregate fallback wording.

## References
- Prompt: `agent/prompts/plan.md`
- Requirements index: `docs/requirements/index.md`
- Fundraiser requirements: `docs/requirements/fundraiser-page.md`
- Community requirements: `docs/requirements/community-page.md`
- Social graph requirements: `docs/requirements/social-graph.md`
- Achievement badges requirements: `docs/requirements/achievement-badges.md`
- Charity starter kit requirements: `docs/requirements/charity-starter-kit.md`
- Pencil mock: `/Users/swifttarrow/Documents/gofundme-pages.pen`
