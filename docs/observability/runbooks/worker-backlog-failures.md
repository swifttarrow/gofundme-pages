# Runbook: Worker backlog or repeated job failures

## Impact

Asynchronous work (notifications, badge evaluation, recommendations) is delayed or failing. Users may see stale feeds, missing notifications, or delayed badges.

## Symptoms

- Alert **WorkerBacklogOrFailuresHigh** firing.
- `worker_queue_backlog{state="waiting"}` or `delayed` rising across `notification-queue`, `badge-queue`, or `recommendation-queue`.
- `rate(worker_jobs_failed_total[5m])` elevated for `processor` labels `notifications`, `badges`, or `recommendations`.
- Logs with `message="worker.job.retry_scheduled"` repeating for the same `job_id` / `event_id`.

## Metrics to inspect first

1. `worker_queue_backlog` by `queue` and `state` (waiting, delayed, active, failed).
2. `rate(worker_jobs_completed_total[5m])` vs `rate(worker_jobs_failed_total[5m])` by `processor`.
3. `histogram_quantile(0.95, sum(rate(worker_job_duration_seconds_bucket[5m])) by (le, processor))` for slow processors.
4. API `/health` and Redis connectivity (workers use the same `REDIS_URL` as the API for BullMQ).

## Log filters

- Job lifecycle: `message` in `worker.job.started`, `worker.job.completed`, `worker.job.failed`, `worker.job.retry_scheduled`.
- Each line includes `processor`, `queue`, `job_id`, `attempt`, and `event_id` when the job payload carries an event.
- Notification DB errors: `message="notification.insert_failed"`.

Filter by `event_id` to trace one donation from HTTP through workers (matches donation `event_id` returned to the client).

## Common root causes

- **Redis down or flaky** — workers cannot claim jobs; backlog grows.
- **Poison messages** — bad payload or DB state causes repeated failures; check `worker.job.failed` `error_message`.
- **DB overload** — slow queries in processors increase `worker_job_duration_seconds` and backlog.
- **Processor bugs** — uncaught exceptions increment `worker_jobs_failed_total` and BullMQ retries.

## Immediate mitigation

- Confirm Redis is healthy and `REDIS_URL` is correct for all API/worker instances.
- Scale worker concurrency or add worker replicas (stateless; horizontal scale).
- For a known poison `event_id`: replay after fix using operational tools, or remove/discard the job in BullMQ (admin) after documenting impact.

## Escalation / follow-up

- Identify which `processor` label is unhealthy before deep-diving code paths.
- If failures correlate with a deploy, roll back worker and API together.
- Tune alert thresholds in `docs/observability/prometheus-alerts.yml` after observing baseline traffic.
