# Runbook: Donation failures

## Impact

Users cannot complete donations; fundraiser totals and downstream events (notifications, badges) may not run.

## Symptoms

- Alert **DonationFailureRateHigh** firing, or rising `donation_fail_total` vs `donation_attempts_total`.
- Support reports failed checkouts or 4xx/5xx on `POST /api/donations`.
- `http_request_errors_total` increasing for route `/api/donations`.

## Metrics to inspect first

1. `rate(donation_attempts_total[5m])` vs `rate(donation_success_total[5m])` and `rate(donation_fail_total[5m])`.
2. `http_request_duration_seconds_bucket` for `route="/api/donations"` (latency spike).
3. `platform_events_persisted_total` — if donations succeed but events stall, fan-out may be involved (check worker metrics).
4. API `/health` — database `connected` vs `disconnected`.

## Log filters

Structured logs are single-line JSON (stdout).

- Failed persistence: `message="donation.persist_failed"` — includes `request_id`, `event_id`, `fundraiser_id`, `error_name`, `error_message`.
- Completed requests: `message="request.completed"` and `route="/api/donations"` — includes `status_code`, `duration_ms`, `request_id`, and `event_id` when set.
- Unhandled errors: `message="request.unhandled_error"`.

Correlate a single attempt: copy `request_id` from the response header `x-request-id` (or log field `request_id`), then search logs for that id. On success, use `event_id` from the JSON body and follow `worker.job.*` logs with the same `event_id`.

## Common root causes

- **Database errors** — connection pool exhausted, migration drift, constraint violations (see `donation.persist_failed`).
- **Invalid totals** — client bugs or tampering (`totalCents` mismatch); usually 400 with validation logs, not `persist_failed`.
- **Missing fundraiser** — inactive or unknown id (404); check `Fundraiser not found` responses.
- **Redis unavailable** — donation may persist but `fanOutEvent` fails; look for errors after transaction in API logs.

## Immediate mitigation

- Verify Postgres and Redis reachable from the API host.
- If a bad deploy: roll back API to last known good version.
- If traffic spike: scale API replicas and review DB connection limits.

## Escalation / follow-up

- Capture a failing `request_id` and `event_id` for post-incident review.
- Reconcile donation rows vs `platform_events` for affected fundraisers if data integrity is questioned.
- Adjust alert ratio/threshold in `docs/observability/prometheus-alerts.yml` if noisy.
