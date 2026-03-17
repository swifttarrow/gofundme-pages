# GoWithMe
*Building socially-intelligent fundraising surfaces with deterministic graph methodology*

## Before You Start: Pre-Search ([time: 1-2 hours])

You must complete the Pre-Search appendix before writing code. This is a required gate for this sprint because your architecture, data model, and instrumentation choices directly impact every page and integration in this build.

Your completed Pre-Search output is part of the final submission. Save the artifact to `docs/pre-search.md` and keep it updated as your stack and assumptions evolve.

This week emphasizes a **Research -> Plan -> Implement -> Validate** methodology. Pre-Search is the research gate that prevents overbuilding, clarifies tradeoffs early, and forces explicit choices for performance, observability, privacy, and scalability.

## Background

Modern fundraising products like GoFundMe, Kickstarter, and DonorsChoose win on emotional clarity, trust signals, and fast UX under high traffic spikes. The strongest products blend content, social context, and confidence-building metadata (progress, organizer credibility, impact framing) while still keeping donation flows fast on mobile and desktop.

You must build an integrated three-page platform (fundraiser, community, profile) with a social graph layer, achievement badges, and a charity starter system. The core technical challenge is orchestrating graph-driven context and advice-assisted features without sacrificing deterministic behavior, observability, privacy safety, or deployment simplicity.

## Gate Statement

Gate: **Project completion + interviews** required for Austin admission.

## Project Overview

One-week sprint with three checkpoints:

| Checkpoint | Deadline | Focus |
|---|---|---|
| Pre-Search | Day 0 (before implementation) | Lock requirements, architecture, metrics, cost assumptions |
| Build Checkpoint | Tuesday (24 hours) | End-to-end skeleton across 3 pages with core data/event plumbing |
| Early Submission | Friday (4 days) | Feature completeness, hardening, instrumentation, tests |
| Final Submission | Sunday (7 days) | Production-ready polish, docs, runbooks, demo narrative |

## Build Checkpoint Requirements (24 Hours)

Progress gate. All items required for this checkpoint:

- ☐ Responsive shells exist for fundraiser, community, and profile pages with shared navigation.
- ☐ Database schema includes core entities: users, fundraisers, communities, charities, badges, graph nodes/edges.
- ☐ At least one write path persists fundraiser creation and returns a readable fundraiser page.
- ☐ Social graph ingestion handles at least 3 events (`donation_created`, `community_joined`, `fundraiser_viewed`) idempotently.
- ☐ Summary query endpoint exists for at least one page (`/api/graph/user/:userId/summary` or equivalent).
- ☐ Observability baseline is live: request logs, error logs, latency metric, and one funnel metric.
- ☐ Graceful fallback is implemented when graph or advice services fail.
- ☐ Minimum test suite runs in CI (unit + one integration test for donation or graph edge write).
- ☐ Application is deployed and publicly accessible.

A simple integrated donor experience with reliable page loads beats a complex intelligence layer with broken reliability.

## Core Technical Requirements

### Product Surfaces and User Experience

| Feature | Requirements |
|---|---|
| Fundraiser hero and trust layer | Show title, hook, progress, organizer, trust signals, and visible donation CTA above the fold. |
| Dual creation flow | Support Quick mode (including voice dictation) and Form mode with editable user-authored content and mode switching. |
| Page advice action | Add an advice button on fundraiser, community, and profile pages that returns 1-2 recommendations. |
| Media handling | Allow up to 3 media items per fundraiser and support image-to-video animation fallback behavior. |
| Story compression | Render story collapsed by default with progressive disclosure and scan-friendly content. |
| Community mission dashboard | Show one active mission, progress bar, and CTAs for donate/start/follow/share. |
| Structured activity feed | Categorize and rank community posts using deterministic heuristics. |
| Supporter participation | Support non-donation actions like follow/share/support and reflect counts in UI. |
| Profile social context | Show cause footprint, connected communities, and graph-derived recommendations. |
| Badge placement | Surface 3-5 prioritized badges based on trust, momentum, social proof, then engagement. |

### Data, Graph, and Domain Models

| Feature | Requirements |
|---|---|
| Node model | Persist node types for user, fundraiser, community, and cause tag with stable IDs. |
| Edge model | Persist weighted edges with source/target types, edge type, metadata, and timestamps. |
| Event ingestion | Map core events to edge upserts with idempotent processing and retry-safe writes. |
| Summary tables | Precompute user/fundraiser/community summaries for fast page rendering. |
| Charity starter linkage | Link one charity to many fundraisers and aggregate lifetime totals. |
| Badge criteria engine | Evaluate badge rules from events and avoid duplicate awards. |
| Explainability metadata | Return human-readable recommendation reasons for each graph suggestion. |
| Privacy controls | Honor donor visibility and use aggregate counts when identity disclosure is disallowed. |
| Seeded demo data | Support synthetic overlap data to guarantee meaningful graph modules in demo. |

### Platform Quality, Operations, and Delivery

| Feature | Requirements |
|---|---|
| Responsiveness | All viewing and editing experiences must work across mobile, tablet, and desktop breakpoints. |
| Stateless services | Backend services must stay stateless to allow horizontal scaling behind a load balancer. |
| Error handling | Expose safe user fallbacks and structured internal errors for external dependency failures. |
| Observability | Capture service, API, and user-journey metrics with clear rationale and dashboard mapping. |
| Test coverage | Include unit, integration, and smoke tests for mission-critical flows. |
| Documentation | Ship architecture notes, runbook procedures, and implementation rationale. |
| Runbooks | Provide production incident runbooks for advice service outage, graph lag, and elevated error rate. |
| Deployment | Provide a publicly accessible deployment with reproducible startup instructions. |

### Testing Scenarios

We will test:

1. Creating a fundraiser in Quick mode (text and voice dictation input) and Form mode publishes successfully with manual edits.
2. Creating or editing fundraiser content in Form mode works on both mobile and desktop layouts.
3. A donation event updates progress and graph edge data, then appears in context modules.
4. Community page mission dashboard, structured feed, and supporter layer render with seeded and organic data.
5. Profile page shows graph-based recommendations with explanation labels and privacy-safe wording.
6. If graph summary retrieval fails, pages still load with fallback modules and no crash.
7. Badge assignment remains idempotent when duplicate events are replayed.
8. Core funnels and technical metrics are emitted and visible in observability tooling.

### Performance Targets

| Metric | Target |
|---|---|
| Page API latency (p95) | < 350 ms for fundraiser, profile, and community page data APIs |
| Graph summary fetch (p95) | < 500 ms for demo dataset from cache/precomputed tables |
| Fundraiser publish completion | < 2.5 s from submit to persisted and viewable page |
| Image-to-video animation fallback SLA | 99% request completion or static fallback within 6 s |
| Error budget | < 1.0% 5xx over rolling 1 hour in staging and production |
| Frontend LCP on mobile (p75) | < 2.5 s on throttled 4G test profile |

## Domain-Specific Deep Section

This project's signature challenge is a **deterministic social graph and trust layer** that powers recommendations and context across all three surfaces without requiring full graph infrastructure.

### Required Capabilities

- Ingest platform events and convert them into weighted graph edges.
- Precompute summaries for fast reads on profile, fundraiser, and community pages.
- Generate explanation labels that map ranking logic to human-readable reasons.
- Enforce privacy-safe rendering when donor visibility is restricted.
- Merge graph outputs with badge and charity context into page-ready payloads.

Example event payload:

```json
{
  "eventId": "evt_8f09c2d9",
  "timestamp": "2026-03-17T21:43:00Z",
  "eventType": "donation_created",
  "actorUserId": "usr_102",
  "fundraiserId": "fr_883",
  "communityId": "com_12",
  "metadata": {
    "donationAmountUsd": 45,
    "donorVisibility": "private"
  }
}
```

### Tool Schemas / API Signatures

```ts
type GraphEdgeUpsertInput = {
  eventId: string
  timestamp: string
  fromNodeType: "user" | "fundraiser" | "community" | "cause_tag"
  fromNodeId: string
  toNodeType: "user" | "fundraiser" | "community" | "cause_tag"
  toNodeId: string
  edgeType:
    | "donated_to"
    | "organizes"
    | "member_of"
    | "viewed"
    | "saved"
    | "shared"
    | "belongs_to"
    | "tagged_as"
  weight: number
  metadata?: Record<string, unknown>
}
```

```http
GET /api/graph/user/:userId/summary
GET /api/graph/fundraiser/:fundraiserId/context?viewerId=:viewerId
GET /api/graph/community/:communityId/summary
POST /api/graph/events/ingest
```

### Evaluation Criteria (Input -> Expected Output)

| Input | Expected Output |
|---|---|
| `donation_created` with donor visibility `public` | Upsert `user -> fundraiser` edge with donation weight and allow named social proof where policy permits. |
| `donation_created` with donor visibility `private` | Upsert edge, but return aggregate-only context strings and no donor identity exposure. |
| `community_joined` event | Upsert `user -> community` edge and refresh relevant user/community summary slices. |
| `fundraiser_viewed` replayed with same `eventId` | No duplicate edge mutation due to idempotency check on `eventId`. |
| Profile summary request | Return top causes, related communities, recommended fundraisers, similar users, and explanation strings. |
| Graph backend timeout | Return fallback payload with empty graph modules and a non-fatal warning marker. |

### Implement at least 4 of the following

1. Supporter overlap module on fundraiser page with privacy-safe phrasing.
2. Related communities module on fundraiser page with explanation tooltip.
3. Communities around you module on profile page.
4. Similar users module on profile page with deterministic scoring.
5. Community momentum module using overlap plus recency scoring.
6. Cause cluster module that aggregates by cause tags.

### Deep-Section Performance Targets

| Metric | Target |
|---|---|
| Event ingest write throughput | Sustain 50 events/sec burst on demo infrastructure |
| Event-to-summary freshness | 95% of updates reflected in summaries within 60 seconds |
| Idempotency correctness | 100% duplicate event suppression for same `eventId` |
| Explanation coverage | 100% graph recommendations include a reason label |
| Privacy policy compliance | 0 known leaks of private donor identity in tested scenarios |

## Advice and Media Cost Analysis (Required)

### Development & Testing Costs

Track:

- Advice API usage for recommendation requests by page and environment.
- Average advice request volume, fallback rate, and latency by endpoint.
- Media animation API calls, processing seconds, and retry rates.
- Advice quality-check calls for charity starter and content clarity checks.
- Local and CI test invocations that hit paid advice/media services (or mocks vs real usage split).

### Production Cost Projections

| Cost Category | 100 users | 1K users | 10K users | 100K users |
|---|---:|---:|---:|---:|
| Advice recommendation calls (monthly) | $25 | $220 | $2,000 | $18,000 |
| Image-to-video animation (monthly) | $35 | $320 | $3,100 | $29,000 |
| Observability + logs + traces | $15 | $90 | $600 | $4,500 |
| Graph compute/cache refresh jobs | $10 | $60 | $450 | $3,800 |
| Total projected monthly variable cost | $85 | $690 | $6,150 | $55,300 |

Include assumptions:

- Advice feature adoption rate for fundraiser/community/profile pages.
- Average advice requests per active fundraiser and per community.
- Cache hit ratio and refresh interval for graph summary materialization.

## Technical Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + TypeScript with Fastify or NestJS; alternatively Go with Fiber |
| Frontend | Next.js (App Router) or Remix with React and server components where possible |
| Advice Service | Provider or in-house service for returning 1-2 content recommendations |
| Database / Storage | PostgreSQL + Prisma/Drizzle, Redis for cache, object storage via S3-compatible service |
| Framework / Jobs | BullMQ, Temporal, or native queue workers for summary refresh and badge evaluation |
| Deployment | Railway, Fly.io, Render, or AWS ECS/Fargate with managed Postgres |

Use whatever stack helps you ship. Complete the Pre-Search process to make informed decisions.

## Build Strategy

### Priority Order

1. Implement social graph schema, idempotent event ingestion, and summary materialization first.
2. Build read APIs for profile/fundraiser/community graph context with explanation metadata.
3. Implement fundraiser creation/publish flow (Quick + Form mode with voice dictation), add advice action, and basic media support.
4. Implement community mission dashboard, structured feed ranking, and supporter actions.
5. Implement charity starter flow and charity-to-fundraiser linkage aggregation.
6. Implement badge criteria engine and top-badge selection for surface rendering.
7. Wire observability, alerting hooks, and fallback/error paths for graph + advice dependencies.
8. Expand tests, finalize runbooks/docs, and polish responsive UX before submission.

### Critical Guidance

- Precompute aggressively; avoid real-time multi-hop traversal in this sprint.
- Make events idempotent with `eventId` and `timestamp` on every write path.
- Treat privacy as a product requirement, not a post-processing concern.
- Keep all services stateless and push state to managed storage/cache layers.
- Build clear empty states early so sparse data never breaks UX confidence.
- Instrument funnels from day one to avoid blind spots during final tuning.

## Required Documentation

Submit a 1-2 page architecture document with this structure:

| Section | Content |
|---|---|
| System Context | Core entities, page surfaces, and integration boundaries |
| Data Model | Tables/types for fundraiser, community, profile, graph, badges, and charity starter |
| Eventing and Idempotency | Event schema, dedupe strategy, retry behavior, failure handling |
| Ranking and Explainability | Deterministic formulas, explanation mapping, privacy-safe wording policy |
| Reliability and Fallbacks | Dependency matrix, degradation strategies, operational limits |
| Observability and Runbooks | Metrics, traces, alerts, and incident playbooks |

## Submission Requirements

Deadline: Sunday 10:59 PM CT

| Deliverable | Requirements |
|---|---|
| GitHub Repository | Complete source code with README, setup instructions, and architecture notes |
| Demo Video (3-5 min) | Show end-to-end user flows, graph context, and fallback/error handling |
| Pre-Search Document | Completed artifact saved at `docs/pre-search.md` |
| Domain-Specific Docs | Graph model, badge criteria, and charity flow decisions documented |
| Advice and Media Cost Analysis | Development tracking + 100/1K/10K/100K projections with assumptions |
| Deployed Application | Publicly accessible URL with responsive behavior across all three pages |
| Social Post | Share your build and tag `@GauntletAI` |

## Interview Preparation (if gate includes interviews)

### Technical Topics

- Why you selected relational graph modeling over a dedicated graph database.
- Event ingestion design: idempotency, retries, and failure containment.
- Tradeoffs in precomputed summaries versus real-time recommendations.
- Privacy-safe recommendation phrasing and policy enforcement in rendering.
- Observability design and how your metrics tie to product outcomes.
- Horizontal scaling strategy for stateless API and background workers.

### Mindset & Growth

- Which assumptions were wrong and how you corrected course.
- Where you intentionally chose simplicity over ambitious complexity.
- How you validated tradeoffs under one-week constraints.
- What you would harden first for production traffic beyond the MVP.

## Final Note

A simple connected fundraising experience with trustworthy signals beats a complex intelligence platform with unreliable behavior.

Gate remains: **Project completion + interviews** required for Austin admission.

## Appendix: Pre-Search Checklist

Complete this before writing code. Save your pre-search notes as a reference document at `docs/pre-search.md`.

### Phase 1: Define Your Constraints

#### 1) Scale, Traffic, and Usage Profile

- What are expected daily active users for week-one demo and stretch scenario?
- What concurrent page viewers must fundraiser/community/profile APIs handle?
- What peak event ingest rate (events/sec) should graph writes tolerate?
- What dataset size do you expect for seed data vs organic data by final demo?
- Which modules must still load within SLA under peak traffic?

#### 2) Budget and Cost Boundaries

- What is your hard monthly spend cap for advice/media APIs, hosting, and observability?
- What cost per active fundraiser creation flow is acceptable?
- Which advice/media features must have low-cost fallbacks if spend exceeds budget?
- What percent of requests can use premium advice providers before breaching budget?
- What is your logging retention target given observability cost constraints?

#### 3) Timeline and Delivery Risk

- Which subsystem is riskiest: graph ingest, advice flows, or multi-surface UI integration?
- What must be complete by the 24-hour checkpoint to avoid schedule collapse?
- What can be deferred if charity starter or badge logic slips?
- Which dependencies are external and could block progress (advice/media APIs)?
- What explicit no-scope list keeps this within one week?

#### 4) Privacy, Compliance, and Data Sensitivity

- What donor visibility states exist and how do they map to UI output rules?
- Which fields are sensitive and must never appear in logs or analytics payloads?
- What data retention policy applies to donation and social graph events?
- Where must PII be redacted before sending content to advice endpoints?
- What safeguards prevent private donor identity leakage in recommendation text?

#### 5) Team Capability and Tooling Readiness

- Which parts of the stack are you strongest in, and where is execution risk highest?
- Do you already have tested patterns for queues/jobs/caching in this stack?
- Which test frameworks and observability tools can you ship fastest with confidence?
- Who owns architecture decisions, and how will you document unresolved tradeoffs?
- What coding standards enforce minimal diffs and correctness under time pressure?

#### 6) Input UX Readiness (Quick Dictation)

- How will voice dictation input be captured in Quick mode across desktop and mobile browsers?
- What browser APIs and permission prompts are required for microphone access?
- What fallback path is used when microphone permissions are denied or unsupported?
- How will dictation transcript quality be reviewed before publish?
- Which accessibility considerations are required for dictation controls and status messaging?

### Phase 2: Architecture Discovery

#### 1) Social Graph Data Architecture

- Will you model graph as generic node/edge tables, typed tables, or hybrid summary blobs?
- How will you encode edge weights and evolve weighting rules safely?
- What indexes are required for key graph read APIs?
- How will you partition or namespace seeded data vs real activity?
- What schema constraints enforce data integrity across node and edge writes?

#### 2) Event Ingestion and Idempotency Design

- What is the canonical event envelope (`eventId`, `timestamp`, actor, entity, metadata)?
- Where will idempotency keys be stored and validated?
- Which events are synchronous writes vs asynchronous queued tasks?
- How are retries handled without duplicate edges or badge awards?
- How will you observe event lag, dead-letter rates, and replay operations?

#### 3) Ranking, Explainability, and Privacy Logic

- What deterministic scoring formulas drive related fundraisers and communities?
- How will you map scoring factors to concise explanation strings?
- What wording templates are safe for private donor contexts?
- What confidence thresholds suppress weak recommendations?
- How will you test ranking outputs for relevance and policy compliance?

#### 4) Advice and Media Pipeline

- Which provider/service will power advice recommendations and trust/readability checks?
- What response templates enforce concise, actionable recommendation output?
- How will you validate advice relevance and safety before rendering?
- What is the timeout/fallback path when image animation fails?
- How will you cache or reuse advice responses to reduce cost and latency?

#### 5) Page Integration and Read API Strategy

- Should each page call dedicated composition endpoints or aggregate from modular services?
- Which data is server-rendered versus hydrated client-side after load?
- How do you guarantee responsive behavior for both edit and view states?
- What empty states are required when graph/badge/charity data is sparse?
- How will you avoid UI business logic drift across three page surfaces?

#### 6) Quick Dictation Interaction Design

- How does the Quick creation UI expose start/stop dictation controls and transcript preview?
- How are transcription errors corrected before advice requests or publish actions?
- What debounce/submit rules prevent duplicate publish actions while dictation is active?
- How are dictation analytics captured (started, completed, abandoned) for funnel visibility?
- What deterministic fallback UI appears when dictation fails mid-session?

#### 6) Observability, Testing, and Reliability Architecture

- Which golden signals (latency, error, throughput, saturation) will you track per service?
- What product funnel events prove graph features increase meaningful engagement?
- Which tests are required per subsystem (graph, fundraiser, community, profile, advice)?
- What synthetic checks verify deployment health and fallback correctness?
- What runbook triggers map to automated alerts and operator actions?

### Phase 3: Post-Stack Refinement

#### 1) Security and Failure Modes

- What are top failure modes for graph cache miss, queue outage, and advice timeout?
- How will authentication and authorization be enforced on server-side APIs?
- What abuse scenarios exist (badge farming, spam charities, event floods)?
- Which safeguards throttle or block malicious write patterns?

#### 2) Test Plan Finalization

- What are the minimal must-pass tests before each checkpoint?
- Which integration tests validate end-to-end donation -> graph -> UI flows?
- How will you test mobile responsiveness for all create/edit/view paths?
- Which regression tests cover privacy-safe rendering and explanation generation?
- Which tests validate Quick-mode voice dictation (permissions, unsupported browser fallback, transcript edit, publish)?

#### 3) Tooling, CI/CD, and Developer Workflow

- Which linting/type/test gates are mandatory in CI before deploy?
- How will you enforce incremental commits and checkpoint-tagged milestones?
- What seed scripts and fixtures are required for reproducible local demos?
- Which branch and release strategy keeps merges low-risk during the sprint?

#### 4) Deployment and Horizontal Scalability

- What is your target deployment topology for API, workers, cache, and database?
- How will stateless services autoscale under traffic spikes?
- What connection pooling and caching strategy protects database performance?
- Which rollback strategy is fastest if a release degrades core donation flows?

#### 5) Metrics, Dashboards, and Operational Readiness

- Which dashboard panels map directly to rubric categories (observability, reliability, test coverage)?
- What SLOs and alert thresholds are set for page latency and 5xx rate?
- How will you monitor recommendation CTR and donation-after-exposure funnels?
- What daily operational checks ensure demo readiness and runbook completeness?
