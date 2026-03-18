# Runbook: Notification Delay

## Overview
Covers incidents where in-app notifications are not appearing within the p95 SLO of 3 seconds from the triggering event.

## Trigger Thresholds
- **Alert condition**: Notification creation latency p95 > 10 seconds sustained for > 2 minutes
- **Critical**: Worker queue depth for `notification-queue` > 500 jobs
- **Warning**: Any single notification delayed > 30 seconds

## Symptoms
- Users report "I donated but didn't get a notification"
- Notification center shows no new notifications after donation
- BullMQ dashboard shows high queue depth or stalled jobs

## Triage Queries

### Check queue depth
```bash
# Redis CLI
redis-cli LLEN "bull:notification-queue:wait"
redis-cli LLEN "bull:notification-queue:active"
redis-cli LLEN "bull:notification-queue:failed"
```

### Check recent failed jobs
```sql
SELECT event_id, error_message, failed_at
FROM failed_events
WHERE queue_name = 'notification-queue'
ORDER BY failed_at DESC
LIMIT 20;
```

### Check notification delivery rate
```sql
SELECT
  DATE_TRUNC('minute', created_at) as minute,
  COUNT(*) as notifications_created
FROM notifications
WHERE created_at > NOW() - INTERVAL '30 minutes'
GROUP BY 1
ORDER BY 1 DESC;
```

### Correlate with event
```sql
-- Find event and check if notification was created
SELECT
  pe.event_id,
  pe.type,
  pe.ingested_at,
  n.id as notification_id,
  n.created_at as notification_created_at,
  EXTRACT(EPOCH FROM (n.created_at - pe.ingested_at)) as delay_seconds
FROM platform_events pe
LEFT JOIN notifications n ON n.dedupe_key LIKE '%' || pe.event_id || '%'
WHERE pe.ingested_at > NOW() - INTERVAL '1 hour'
ORDER BY pe.ingested_at DESC
LIMIT 20;
```

## Mitigation Options

### Option 1: Restart worker (most common fix)
```bash
# Railway
railway run --service=api npm run worker:restart

# Or redeploy the service
railway up --service=api
```

### Option 2: Drain and replay stuck jobs
```bash
# Via API endpoint
curl -X POST https://api.gosupportme.com/api/replay \
  -H "Content-Type: application/json" \
  -d '{"eventIds": ["evt_...", "evt_..."]}'
```

### Option 3: Redis connection issues
```bash
# Check Redis connectivity
redis-cli -u $REDIS_URL ping

# If Redis is overloaded, flush dedupe keys (safe — only affects 72h deduplication window)
redis-cli -u $REDIS_URL --scan --pattern "notif:dedupe:*" | xargs redis-cli -u $REDIS_URL del
```

### Option 4: Postgres connectivity issues
```bash
# Check pg pool status via metrics endpoint
curl https://api.gosupportme.com/metrics | grep pg_pool
```

## Rollback Strategy
- If worker code introduced the regression: redeploy previous Railway deployment
- If schema migration caused the issue: check `failed_events` for error messages, revert migration if needed

## Verification Steps
1. Post a test donation via the API
2. Wait 10 seconds
3. Query `SELECT * FROM notifications WHERE created_at > NOW() - INTERVAL '1 minute'`
4. Confirm notification was created with correct reason text and dedupe key

## Ownership
- Primary: Platform engineering
- Escalation: CTO if > 10 min of customer-impacting delay
