# Runbook: Recommendation Failure

## Overview
Covers incidents where the community feed returns empty results, stale data, or errors from the recommendation API.

## Trigger Thresholds
- **Alert**: `GET /api/recommendations` error rate > 5% sustained for > 1 minute
- **Alert**: Recommendation response time p95 > 3 seconds
- **Warning**: Recommendation cache hit rate drops below 50%

## Symptoms
- Community feed shows empty state or "Try again" error
- Feed shows only chronological posts (fallback mode active)
- Users report "all fundraisers look the same" (exploration logic broken)

## Triage Queries

### Check recommendation endpoint health
```bash
curl -v "https://api.gosupportme.com/api/recommendations?user_id=usr_test123" | jq .
```

### Check recommendation data freshness
```sql
SELECT
  user_id,
  MAX(updated_at) as last_updated,
  COUNT(*) as fundraiser_count
FROM recommendations
GROUP BY user_id
ORDER BY last_updated ASC
LIMIT 10;
```

### Check Redis cache for recommendations
```bash
redis-cli -u $REDIS_URL --scan --pattern "rec:*" | head -20
# Check TTL
redis-cli -u $REDIS_URL TTL "rec:<user_id>"
```

### Check recommendation queue
```sql
SELECT * FROM failed_events
WHERE queue_name = 'recommendation-queue'
ORDER BY failed_at DESC
LIMIT 10;
```

### Check if fundraisers table has active data
```sql
SELECT COUNT(*), category
FROM fundraisers
WHERE status = 'active'
GROUP BY category
ORDER BY COUNT(*) DESC;
```

## Mitigation Options

### Option 1: Fallback to chronological feed (immediate)
```bash
# Set Redis flag to bypass recommendation scoring
redis-cli -u $REDIS_URL SET "feature:recommendations_enabled" "false" EX 3600
```

### Option 2: Invalidate stale recommendation cache
```bash
# Flush all recommendation caches to force recomputation
redis-cli -u $REDIS_URL --scan --pattern "rec:*" | xargs redis-cli -u $REDIS_URL del
```

### Option 3: Trigger recommendation recompute for all active users
```bash
# Via API — replay all recent engagement events
curl -X POST https://api.gosupportme.com/api/replay \
  -H "Content-Type: application/json" \
  -d '{"eventIds": ["evt_...", "evt_..."], "processor": "recommendation"}'
```

### Option 4: Postgres query performance degradation
```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE query LIKE '%recommendations%'
ORDER BY mean_time DESC
LIMIT 10;

-- Check missing indexes
EXPLAIN ANALYZE
SELECT * FROM recommendations WHERE user_id = 'usr_test' ORDER BY score DESC;
```

## Rollback Strategy
- If new scoring logic caused regression: redeploy previous version
- If database schema change caused issue: check migration, revert if needed
- Fallback: chronological feed (always available, no recommendations dependency)

## Verification Steps
1. Call `GET /api/recommendations?user_id=<test_user_id>`
2. Verify response includes `reasons[]` array with human-readable labels
3. Verify 15% of results have `reasons: [{type: "exploration"}]`
4. Verify response time < 2 seconds

## Ownership
- Primary: Product engineering
- Escalation: Engineering lead if fallback mode active > 30 minutes
