# Observability (MVP)

Implementation follows [Observability requirements](../requirements/observability.md).

## Quick checks (local)

1. **Health** — API liveness and Postgres connectivity:

   ```bash
   curl -s http://localhost:3001/health | jq
   ```

2. **Metrics** — Prometheus text format (scrape this endpoint from Prometheus or inspect manually):

   ```bash
   curl -s http://localhost:3001/metrics | head
   ```

3. **Correlation** — Every API response includes `x-request-id`. Pass `x-request-id` on inbound requests to preserve a client-generated id across hops.

4. **Page views** — Fundraiser, community detail, and profile pages POST once per load to `POST /api/telemetry/page-view`, incrementing `page_views_total`.

## Metrics overview

| Area | Metrics |
|------|---------|
| HTTP | `http_requests_total`, `http_request_duration_seconds`, `http_requests_in_flight`, `http_request_errors_total` |
| Business | `page_views_total`, `donation_attempts_total`, `donation_success_total`, `donation_fail_total`, `platform_events_persisted_total`, `notifications_created_total`, `badge_evaluations_total` |
| Workers | `worker_jobs_started_total`, `worker_jobs_completed_total`, `worker_jobs_failed_total`, `worker_job_duration_seconds` |
| Queues | `worker_queue_backlog` (labels: `queue`, `state`: waiting / delayed / active / failed) |

Queue backlog gauges are refreshed from BullMQ on the **API process** (every 15s). Scrape `/metrics` on the API to see them.

## Prometheus

**Local API** (Prometheus in Docker, API on your machine):

```yaml
scrape_configs:
  - job_name: gosupportme-api
    metrics_path: /metrics
    static_configs:
      - targets: ["host.docker.internal:3001"]
```

**Production (Railway)** — ready-made config scraping  
`https://api-production-4b9f4.up.railway.app/metrics`:  
[prometheus-scrape-production.example.yml](./prometheus-scrape-production.example.yml)  
(run with Docker as documented in the file header, or copy the `scrape_configs` job into your existing `prometheus.yml`).

Verify from your laptop:

```bash
curl -sS "https://api-production-4b9f4.up.railway.app/metrics" | head
```

Alert rule examples: [prometheus-alerts.yml](./prometheus-alerts.yml).

## Grafana

Import [grafana-dashboard.json](./grafana-dashboard.json) and point panels at your Prometheus datasource (dashboard assumes UID `prometheus`; change in Grafana if needed).

### Grafana Cloud

Step-by-step: [grafana-cloud-setup.md](./grafana-cloud-setup.md) (scrape Railway + `remote_write`, import dashboard). Example config: [prometheus-grafana-cloud.example.yml](./prometheus-grafana-cloud.example.yml).

## Runbooks

- [Donation failures](./runbooks/donation-failures.md)
- [Worker backlog or repeated job failures](./runbooks/worker-backlog-failures.md)

## Code map

- Metrics registry: `apps/api/src/observability/metrics.ts`
- HTTP hooks, JSON logs, `/metrics`, global error handler: `apps/api/src/services/telemetry.ts`
- Request id: `apps/api/src/middleware/request-id.ts`
- Worker + job logs/metrics: `apps/api/src/worker/index.ts`
- Queue depth poller: `apps/api/src/worker/queue-metrics.ts`
- Page view API: `apps/api/src/routes/telemetry.ts`
- Web reporter: `apps/web/src/components/observability/page-view-reporter.tsx`
