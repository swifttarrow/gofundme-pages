# Pre-Search Checklist: GoWithMe

Complete this before writing code. This artifact is required for submission and should be updated when architecture assumptions change.

## Phase 1: Define Your Constraints

### 1) Scale, Traffic, and Usage Profile

1. What are expected daily active users for week-one demo and stretch scenario?
2. What concurrent page viewers must fundraiser/community/profile APIs handle?
3. What peak event ingest rate (events/sec) should graph writes tolerate?
4. What dataset size do you expect for seed data vs organic data by final demo?
5. Which modules must still load within SLA under peak traffic?

### 2) Budget and Cost Boundaries

1. What is your hard monthly spend cap for advice/media/dictation APIs, hosting, and observability?
2. What cost per active fundraiser creation flow is acceptable?
3. Which advice/media/dictation features must have low-cost fallbacks if spend exceeds budget?
4. What percent of requests can use premium providers before breaching budget?
5. What is your logging retention target given observability cost constraints?

### 3) Timeline and Delivery Risk

1. Which subsystem is riskiest: graph ingest, advice/dictation flows, or multi-surface UI integration?
2. What must be complete by the 24-hour checkpoint to avoid schedule collapse?
3. What can be deferred if charity starter or badge logic slips?
4. Which dependencies are external and could block progress (advice/media/dictation APIs)?
5. What explicit no-scope list keeps this within one week?

### 4) Privacy, Compliance, and Data Sensitivity

1. What donor visibility states exist and how do they map to UI output rules?
2. Which fields are sensitive and must never appear in logs or analytics payloads?
3. What data retention policy applies to donation and social graph events?
4. Where must PII be redacted before sending content to advice/dictation endpoints?
5. What safeguards prevent private donor identity leakage in recommendation text?

### 5) Team Capability and Tooling Readiness

1. Which parts of the stack are you strongest in, and where is execution risk highest?
2. Do you already have tested patterns for queues/jobs/caching in this stack?
3. Which test frameworks and observability tools can you ship fastest with confidence?
4. Who owns architecture decisions, and how will you document unresolved tradeoffs?
5. What coding standards enforce minimal diffs and correctness under time pressure?

## Phase 2: Architecture Discovery

### 1) Social Graph Data Architecture

1. Will you model graph as generic node/edge tables, typed tables, or hybrid summary blobs?
2. How will you encode edge weights and evolve weighting rules safely?
3. What indexes are required for key graph read APIs?
4. How will you partition or namespace seeded data vs real activity?
5. What schema constraints enforce data integrity across node and edge writes?

### 2) Event Ingestion and Idempotency Design

1. What is the canonical event envelope (`eventId`, `timestamp`, actor, entity, metadata)?
2. Where will idempotency keys be stored and validated?
3. Which events are synchronous writes vs asynchronous queued tasks?
4. How are retries handled without duplicate edges or badge awards?
5. How will you observe event lag, dead-letter rates, and replay operations?

### 3) Ranking, Explainability, and Privacy Logic

1. What deterministic scoring formulas drive related fundraisers and communities?
2. How will you map scoring factors to concise explanation strings?
3. What wording templates are safe for private donor contexts?
4. What confidence thresholds suppress weak recommendations?
5. How will you test ranking outputs for relevance and policy compliance?

### 4) Advice, Dictation, and Media Pipeline

1. Which provider/services will power advice recommendations and voice dictation?
2. What response/transcript constraints enforce concise, actionable output and safe rendering?
3. How will you validate dictation transcript quality before publish?
4. What is the timeout/fallback path when image animation fails?
5. How will you cache or reuse advice responses to reduce cost and latency?

### 5) Page Integration and Read API Strategy

1. Should each page call dedicated composition endpoints or aggregate from modular services?
2. Which data is server-rendered versus hydrated client-side after load?
3. How do you guarantee responsive behavior for both edit and view states?
4. What empty states are required when graph/badge/charity data is sparse?
5. How will you avoid UI business logic drift across three page surfaces?

### 6) Observability, Testing, and Reliability Architecture

1. Which golden signals (latency, error, throughput, saturation) will you track per service?
2. What product funnel events prove graph features increase meaningful engagement?
3. Which tests are required per subsystem (graph, fundraiser, community, profile, advice/dictation)?
4. What synthetic checks verify deployment health and fallback correctness?
5. What runbook triggers map to automated alerts and operator actions?

## Phase 3: Post-Stack Refinement

### 1) Security and Failure Modes

1. What are top failure modes for graph cache miss, queue outage, and advice/dictation timeout?
2. How will authentication and authorization be enforced on server-side APIs?
3. What abuse scenarios exist (badge farming, spam charities, event floods)?
4. Which safeguards throttle or block malicious write patterns?

### 2) Test Plan Finalization

1. What are the minimal must-pass tests before each checkpoint?
2. Which integration tests validate end-to-end donation -> graph -> UI flows?
3. How will you test mobile responsiveness for all create/edit/view paths?
4. Which regression tests cover privacy-safe rendering and explanation generation?

### 3) Tooling, CI/CD, and Developer Workflow

1. Which linting/type/test gates are mandatory in CI before deploy?
2. How will you enforce incremental commits and checkpoint-tagged milestones?
3. What seed scripts and fixtures are required for reproducible local demos?
4. Which branch and release strategy keeps merges low-risk during the sprint?

### 4) Deployment and Horizontal Scalability

1. What is your target deployment topology for API, workers, cache, and database?
2. How will stateless services autoscale under traffic spikes?
3. What connection pooling and caching strategy protects database performance?
4. Which rollback strategy is fastest if a release degrades core donation flows?

### 5) Metrics, Dashboards, and Operational Readiness

1. Which dashboard panels map directly to rubric categories (observability, reliability, test coverage)?
2. What SLOs and alert thresholds are set for page latency and 5xx rate?
3. How will you monitor recommendation CTR and donation-after-exposure funnels?
4. What daily operational checks ensure demo readiness and runbook completeness?
