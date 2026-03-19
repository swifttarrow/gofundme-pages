# MVP Observability Spec

## Summary
Define a lightweight observability baseline for the GoSupportMe MVP so an operator can quickly answer:
- Is the system healthy?
- Are the core user journeys working?
- Where are failures happening?
- Can we trace one bad experience across the web app, API, database-backed event write, and worker processing?

This spec favors a small number of high-value signals over a large amount of low-signal telemetry.

---

## Goals
- Make the core pages and donation flow observable in local development and demo environments.
- Detect regressions in availability, latency, and error rate within minutes.
- Correlate a single request across `apps/web`, `apps/api`, and worker processors.
- Expose enough telemetry to support dashboards, alerts, and simple runbooks.

## Non-Goals
- Full enterprise distributed tracing across every function call.
- Vendor-specific APM lock-in.
- Long-term retention or advanced log analytics requirements.
- Complex SLO management beyond a small set of MVP thresholds.

---

## Scope

### In scope
- Page and API health for:
  - fundraiser page
  - community page
  - profile page
- Core mutation and fan-out flows:
  - donation creation
  - event persistence
  - notification generation
  - badge evaluation
- Operational surfaces:
  - `GET /health`
  - `GET /metrics`
  - structured application logs
  - worker processor telemetry
  - dashboards
  - alerts
  - runbooks

### Out of scope
- Revenue analytics and product experimentation platforms
- Session replay tools
- Per-user behavioral analytics beyond operational business counters

---

## Core Questions
The implemented observability layer must make it easy to answer these questions during a demo or incident:

1. Is the API reachable and connected to the database?
2. Are key routes succeeding at an acceptable latency?
3. Are donations being created successfully?
4. Are platform events being persisted and fanned out?
5. Are worker jobs succeeding, retrying, or backing up?
6. Are notifications and badges being produced after the source event?
7. If something fails, what `requestId` or `eventId` should be followed in logs and metrics?

---

## Core Principles
- Prefer correlated logs plus Prometheus metrics over prematurely adding a full tracing stack.
- Instrument user-critical flows first, especially the donation pipeline.
- Capture both technical and business signals.
- Avoid duplicate telemetry for the same event.
- Never log secrets, auth tokens, raw cookies, or payment details.

---

## Functional Requirements

## FR1. Health and readiness
The system must expose a health endpoint that confirms API liveness and verifies required dependencies for MVP operation, at minimum database connectivity.

## FR2. Prometheus metrics
The system must expose a metrics endpoint in Prometheus format for API and worker telemetry.

## FR3. Request metrics
Every API route must emit:
- request count
- error count
- request duration
- route and method labels
- status code class labels

This supports request rate, error rate, and latency tracking for each user-facing route.

## FR4. Correlation identifiers
Every inbound request must have a `requestId`.

When a request creates or processes a domain event, logs and metrics must preserve the associated `eventId` so operators can follow the flow from HTTP request to async worker execution.

## FR5. Structured logs
API and worker logs must be structured JSON and include, when available:
- timestamp
- level
- message
- service name
- environment
- `requestId`
- `eventId`
- route or processor name
- user id or organizer id when safe to log
- duration
- error name and error message

## FR6. Error observability
All handled and unhandled errors in API routes and worker processors must emit:
- an error log entry
- an error counter increment
- enough context to identify the failing route, processor, and correlated request or event

## FR7. Worker telemetry
Each queue processor must emit:
- jobs started
- jobs completed
- jobs failed
- job duration
- retry count where available

Metrics must be segmented by processor type such as notifications, badges, and recommendations.

## FR8. Business flow metrics
The system must emit business-relevant counters for the highest-value flows:
- fundraiser page views
- community page views
- profile page views
- donation attempts
- donation successes
- donation failures
- events persisted
- notifications created
- badge evaluations completed

## FR9. Queue and backlog visibility
The system must expose enough telemetry to detect async backlog and saturation, such as queue depth, delayed jobs, or oldest job age.

## FR10. Dashboard coverage
At least one dashboard must exist for local or demo use with panels for:
- API availability
- p50 and p95 latency by route
- error rate by route
- donation success vs failure
- worker throughput and failures by processor
- queue backlog

## FR11. Alerts
At least two actionable alerts must be defined:
- donation failure rate above threshold over a rolling window
- worker backlog or repeated job failures above threshold over a rolling window

Alerts must describe the likely impact and link to a runbook or troubleshooting steps.

## FR12. Runbooks
The project must document a short runbook for each critical alert explaining:
- how to confirm the issue
- which metrics to inspect
- which logs to filter
- which identifiers to correlate
- what immediate mitigation is appropriate

## FR13. Demo traceability
The system must support a demo where one donation can be followed end-to-end using telemetry from:
- request log
- request latency metric
- stored event identifier
- worker processor logs or metrics
- derived side effects such as notifications or badge updates

---

## Key Metrics

## API Metrics
- `http_requests_total`
  - Why: establishes request volume and powers error-rate calculations.
- `http_request_duration_seconds`
  - Why: shows route-level latency and supports p50 and p95 tracking.
- `http_requests_in_flight`
  - Why: helps spot traffic spikes or stuck requests.

## Worker Metrics
- `worker_jobs_started_total`
  - Why: confirms processors are receiving work.
- `worker_jobs_completed_total`
  - Why: confirms successful throughput.
- `worker_jobs_failed_total`
  - Why: detects broken processors or poison jobs.
- `worker_job_duration_seconds`
  - Why: reveals slow processors and retry pressure.
- `worker_queue_backlog`
  - Why: gives a saturation signal for async workloads.

## Business Metrics
- `page_views_total{page_type="fundraiser|community|profile"}`
  - Why: connects frontend journeys to backend health.
- `donation_attempts_total`
  - Why: indicates attempted conversion activity.
- `donation_success_total`
  - Why: confirms the most important user action is succeeding.
- `donation_fail_total`
  - Why: highlights revenue-impacting failures.
- `platform_events_persisted_total`
  - Why: verifies event storage is occurring after successful writes.
- `notifications_created_total`
  - Why: confirms downstream fan-out side effects.
- `badge_evaluations_total`
  - Why: shows derived user progression logic is running.

---

## Logging Requirements

## API logging
- Log one structured event at request start and one at request completion or failure.
- Include `requestId`, route template, method, status code, and duration.
- Include `eventId` on mutation flows that create domain events.

## Worker logging
- Log job start, success, retry, and failure.
- Include processor name, queue name, job id, attempt number, `eventId`, and duration.

## Security and privacy
- Do not log passwords, JWTs, cookies, raw payment payloads, or free-form user secrets.
- If user identifiers are logged, prefer stable ids over personal profile data.

---

## Dashboard Requirements
The MVP dashboard should answer these questions in under two minutes:
- Is the system up?
- Are the main routes slow?
- Are donations failing?
- Are workers backed up?
- Which processor is unhealthy?

Recommended dashboard sections:
- Service health
- API latency and error rate by route
- Donation pipeline
- Worker throughput and failures
- Queue saturation

---

## Alerting Requirements

## Alert 1. Donation failure spike
Trigger when donation failures exceed an agreed threshold, such as more than 5% of attempts over 5 minutes.

Expected operator action:
- confirm with donation success and failure counters
- inspect recent donation route logs by `requestId`
- verify database health and event persistence

## Alert 2. Worker backlog or failure spike
Trigger when queue backlog grows continuously or job failures exceed an agreed threshold for a processor.

Expected operator action:
- identify affected processor
- inspect queue depth and worker failure counters
- filter worker logs by processor name and `eventId`

---

## Runbook Requirements
Each runbook must contain:
- impact statement
- symptom checklist
- metrics to inspect first
- exact log filters to use
- common root causes
- immediate mitigation
- escalation or follow-up actions

Minimum required runbooks:
- donation failures
- worker backlog or repeated job failures

---

## Demo Scenario
The recommended observability demo for this MVP is the donation flow:

1. Open a fundraiser page and confirm page-view and request metrics increment.
2. Submit a donation and capture the `requestId`.
3. Confirm a successful API response and request latency metric.
4. Confirm a `platform event` was persisted with an `eventId`.
5. Confirm worker jobs were enqueued and processed for notifications and badges.
6. Confirm worker completion metrics and logs reference the same `eventId`.
7. Optionally trigger a controlled validation or worker failure and show the corresponding error metric, structured log, and alert condition.

---

## Non-Functional Requirements

## NFR1. Low overhead
Instrumentation must add minimal operational overhead and should not materially degrade page or API latency.

## NFR2. Freshness
Metrics should be available quickly enough for local debugging and demos, with scrape and dashboard refresh intervals appropriate for minute-level troubleshooting.

## NFR3. Reliability
Metrics and logs must be emitted consistently even during handled failures.

## NFR4. Privacy
Observability data must avoid sensitive user data and secrets.

## NFR5. Local usability
A developer must be able to run the app locally and inspect health, metrics, logs, and dashboards without requiring production-only infrastructure.

## NFR6. Simplicity
The observability stack should remain understandable to a new engineer in less than 30 minutes.

---

## Success Criteria
This spec is satisfied when a reviewer can:
- inspect `GET /health` and confirm service readiness
- inspect `GET /metrics` and see meaningful API and worker metrics
- locate a donation failure or slowdown within a dashboard
- correlate one donation across logs and async processing using `requestId` and `eventId`
- follow a runbook to diagnose the likely cause of a failure

---

## Risks

### Risk 1. Too much instrumentation
Mitigation:
- instrument only core journeys first
- keep the dashboard focused on high-signal panels

### Risk 2. Missing correlation
Mitigation:
- require `requestId` for all requests
- carry `eventId` into async jobs and logs

### Risk 3. Noisy alerts
Mitigation:
- alert only on user-impacting symptoms
- document thresholds and expected response actions

### Risk 4. Sensitive data leakage
Mitigation:
- standardize redaction rules
- review structured log payloads before release
