# Voice-First MVP Validation Runbook

## Funnel Events

Event names emitted during the voice-first creation flow:

- `voice.recording.started`
- `voice.processing.started`
- `voice.processing.completed`
- `voice.processing.failed`
- `voice.review.regenerated`
- `voice.review.start_over`
- `voice.publish.completed`
- `voice.share.copy_link`

Payload baseline:

- `eventId`
- `occurredAt`
- `source`
- `stage`

## Dashboard Queries (MVP)

Use `platform_events` for stage and quality tracking:

```sql
SELECT type, COUNT(*) AS event_count
FROM platform_events
WHERE occurred_at >= NOW() - INTERVAL '24 hours'
  AND type LIKE 'voice.%'
GROUP BY type
ORDER BY event_count DESC;
```

```sql
SELECT
  AVG((payload->>'confidence')::numeric) AS avg_confidence,
  SUM(CASE WHEN (payload->>'lowConfidence')::boolean THEN 1 ELSE 0 END) AS low_confidence_count
FROM platform_events
WHERE type = 'voice.processing.completed'
  AND occurred_at >= NOW() - INTERVAL '24 hours';
```

## Risk Mitigation Map

- **Rambling input**: guided recording prompts and fallback typing mode
- **Hallucination risk**: transcript grounding check with low-confidence flag
- **Unsafe content**: deterministic moderation blocklist and hard stop
- **Voice discomfort**: visible "Type instead" at entry
- **Authenticity risk**: per-section regeneration and tone controls

## Performance / Error Recovery Checks

Manual checks for each release candidate:

1. Mobile viewport end-to-end publish in under 2 minutes
2. Permission denial still allows typed fallback
3. Transcription/generation failure returns actionable retry guidance
4. Start-over from review resets and completes a second successful pass

## Launch Go/No-Go

Go only if all are true:

- Completion funnel events observed for recording -> publish
- No sustained increase in `voice.processing.failed` over 15%
- Low-confidence share under 30% of completions
- Recovery paths validated on mobile and throttled network
