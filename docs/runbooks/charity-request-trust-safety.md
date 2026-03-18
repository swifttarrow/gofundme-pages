# Charity Request Trust/Safety Operations

## Review Queue SLAs

- **Initial review target**: within 24 hours
- **Hard escalation threshold**: any request older than 72 hours
- **Daily queue check**: at least twice per day

Queue-age query:

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'under_review') AS pending_count,
  MIN(created_at) FILTER (WHERE status = 'under_review') AS oldest_pending_at,
  EXTRACT(EPOCH FROM (NOW() - MIN(created_at))) / 3600 AS oldest_pending_hours
FROM charity_requests;
```

## Decision Taxonomy (Rejected)

Use one clear reason label in `decision_reason`:

- Incomplete mission clarity
- Unclear beneficiary scope
- Unverified fund usage details
- Policy/safety concern
- Identity verification required

## Suspicious Submission Handling

If `suspicious_content = true` or `identity_check_needed = true`:

1. Hold in `under_review` (do not approve)
2. Route to trust/safety reviewer
3. Request additional supporting context from creator
4. Resolve with approve/reject and explicit reason

## Approval / Rejection Operations

- Approve only through staff decision endpoint
- Approval must atomically:
  - set request status to `approved`
  - create active charity record
  - assign creator as owner
- Rejections must include concise, human-readable reason

## Post-Launch Reporting / Escalation

- Reported live charity concerns: respond within 24 hours
- Critical safety reports: acknowledge within 1 hour and triage immediately
- Owner:
  - **Primary**: Trust/Safety reviewer on-call
  - **Secondary**: Product owner for creator experience

## Success Metrics Snapshot

```sql
SELECT
  DATE_TRUNC('day', created_at) AS day,
  COUNT(*) AS submissions,
  COUNT(*) FILTER (WHERE status = 'approved') AS approved,
  COUNT(*) FILTER (WHERE status = 'rejected') AS rejected
FROM charity_requests
GROUP BY 1
ORDER BY 1 DESC;
```
