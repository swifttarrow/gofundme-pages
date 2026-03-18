# Runbook: Donation Path Degradation

## Overview
Covers incidents affecting the donation submission flow — the highest-trust critical path in GoSupportMe.

## Trigger Thresholds
- **CRITICAL**: `POST /api/donations` error rate > 1% sustained for > 1 minute → immediate response required
- **CRITICAL**: Donation endpoint p95 latency > 5 seconds
- **Warning**: Donation endpoint p95 latency > 2 seconds (SLO breach)
- **Warning**: Any 5xx on donation endpoint (should be 0 in steady state)

## Symptoms
- Users report "my donation didn't go through"
- Donation form shows error state after submit
- `POST /api/donations` returning 500 or timing out
- `POST /api/events` failing after donation write (orphaned donations)

## Triage Queries

### Check recent donation errors
```bash
# Check API logs for donation errors
curl https://api.gosupportme.com/metrics | grep http_errors_total | grep donations
```

### Verify donation integrity
```sql
-- Donations without matching events (orphaned writes)
SELECT d.id, d.created_at, d.event_id
FROM donations d
LEFT JOIN platform_events pe ON pe.event_id = d.event_id
WHERE pe.event_id IS NULL
AND d.created_at > NOW() - INTERVAL '1 hour';
```

### Check donation write latency
```sql
SELECT
  DATE_TRUNC('minute', created_at) as minute,
  COUNT(*) as donations,
  AVG(EXTRACT(EPOCH FROM (NOW() - created_at))) as avg_age_seconds
FROM donations
WHERE created_at > NOW() - INTERVAL '30 minutes'
GROUP BY 1
ORDER BY 1 DESC;
```

### Check fundraiser totals integrity
```sql
-- Compare raised_cents vs sum of donations
SELECT
  f.id,
  f.title,
  f.raised_cents as stored_raised,
  COALESCE(SUM(d.amount_cents), 0) as computed_raised,
  f.raised_cents - COALESCE(SUM(d.amount_cents), 0) as drift_cents
FROM fundraisers f
LEFT JOIN donations d ON d.fundraiser_id = f.id
GROUP BY f.id, f.title, f.raised_cents
HAVING ABS(f.raised_cents - COALESCE(SUM(d.amount_cents), 0)) > 0;
```

### Check database connection pool
```bash
curl https://api.gosupportme.com/metrics | grep pg_pool
```

## Mitigation Options

### Option 1: Postgres connection pool exhausted
```bash
# Restart API to release pool connections
railway redeploy --service=api

# Reduce max connections temporarily
# Update DATABASE_URL to include ?max_connections=5 env var
```

### Option 2: Orphaned donations (event write failed)
```bash
# Replay events for orphaned donations
# First, identify affected eventIds from donations table
# Then replay via API
curl -X POST https://api.gosupportme.com/api/replay \
  -H "Content-Type: application/json" \
  -d '{"eventIds": ["evt_orphaned_1", "evt_orphaned_2"]}'
```

### Option 3: Fundraiser total drift (raised_cents mismatch)
```sql
-- Recompute raised_cents from actual donations
UPDATE fundraisers f
SET raised_cents = (
  SELECT COALESCE(SUM(amount_cents), 0)
  FROM donations d
  WHERE d.fundraiser_id = f.id
),
donor_count = (
  SELECT COUNT(*)
  FROM donations d
  WHERE d.fundraiser_id = f.id
)
WHERE f.id IN (<affected_ids>);
```

### Option 4: Total validation rejection spike
```bash
# Check if client is sending wrong totalCents values
# Review API logs for 400 validation errors
curl https://api.gosupportme.com/metrics | grep http_errors_total | grep 400
```

## Rollback Strategy
- **Immediate**: If new API code is causing failures, redeploy previous Railway version
- **Data recovery**: Donations table is the source of truth; events can be replayed
- **Nuclear option**: If database is inaccessible, show "Maintenance mode" banner via feature flag

## User Communication Template
> "We're experiencing a temporary issue with donation processing. Your credit card has not been charged. We're working to resolve this within [X] minutes. Please try again shortly."

## Verification Steps
1. Submit a test donation via UI at $10 with 10% tip
2. Verify response: `{ donationId: "...", eventId: "...", totalCents: 1100 }`
3. Query donations table: `SELECT * FROM donations ORDER BY created_at DESC LIMIT 1`
4. Verify event created: `SELECT * FROM platform_events ORDER BY ingested_at DESC LIMIT 1`
5. Wait 10 seconds, verify notification created for fundraiser followers

## Ownership
- Primary: Platform engineering (24/7 on-call for CRITICAL tier)
- Escalation: CTO within 5 minutes of CRITICAL alert
- Customer support: Notify if > 5 affected users
