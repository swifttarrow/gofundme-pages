# Observability Overview

This document summarizes the observability signals currently implemented in GoSupportMe and where to inspect them quickly.

## What we added

### API health and metrics endpoints
- `GET /health` for liveness and dependency readiness checks.
- `GET /metrics` for Prometheus-formatted telemetry from API + workers.

### HTTP service metrics
- `http_requests_total`
- `http_request_duration_seconds`
- `http_requests_in_flight`
- `http_request_errors_total`

These metrics provide request volume, latency distribution, in-flight pressure, and error visibility by route/method/status labels.

### Core business flow metrics
- `page_views_total` (fundraiser, community, profile)
- `donation_attempts_total`
- `donation_success_total`
- `donation_fail_total`
- `platform_events_persisted_total`
- `notifications_created_total`
- `badge_evaluations_total`

These counters make the main user journeys and donation funnel health visible.

### Worker and queue metrics
- `worker_jobs_started_total`
- `worker_jobs_completed_total`
- `worker_jobs_failed_total`
- `worker_job_duration_seconds`
- `worker_queue_backlog` (by queue and state)

These metrics help detect worker failures, retries, and queue saturation/backlog.

### Correlation and structured logs
- Per-request `x-request-id` is propagated and logged.
- Event-driven mutation flows preserve `eventId` for API-to-worker correlation.
- Structured JSON logs cover request lifecycle, worker job lifecycle, and donation flow errors.

### Dashboards, alerts, and runbooks
- Dashboard JSON: `docs/observability/grafana-dashboard.json`
- Alert rules: `docs/observability/prometheus-alerts.yml`
- Runbooks:
  - `docs/observability/runbooks/donation-failures.md`
  - `docs/observability/runbooks/worker-backlog-failures.md`

## Snapshot

- Grafana snapshot: [GoSupportMe observability snapshot](https://swifttarrow.grafana.net/dashboard/snapshot/M7ze7aLj9VoeSmNXRysLySbyYTqqtDhO?orgId=0&from=2026-03-20T10:25:18.856Z&to=2026-03-20T16:25:18.856Z&timezone=browser&refresh=30s)

## Related docs

- Requirements spec: `docs/requirements/add-observability.md`
- Implementation details: `docs/observability/README.md`
