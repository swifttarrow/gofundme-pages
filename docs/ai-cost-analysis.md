# AI Cost Analysis — GoSupportMe

## Development & Testing Costs

### AI Usage During Development
| Usage Type | Model | Estimated Tokens | Estimated Cost |
|---|---|---|---|
| Code generation (agents) | Claude Sonnet 4.6 | ~500K tokens | ~$7.50 |
| Architecture review | Claude Sonnet 4.6 | ~50K tokens | ~$0.75 |
| Test case generation | Claude claude-haiku-4-5 | ~100K tokens | ~$0.25 |
| **Development total** | | **~650K tokens** | **~$8.50** |

### AI Feature Endpoints in Production

**Feature 1: Campaign Summary Generation**
- Endpoint: `POST /api/fundraisers/:id/summary`
- Model: `claude-haiku-4-5-20251001` (fastest + cheapest)
- Trigger: On first view, cached for 1 hour, regenerated on fundraiser update
- Prompt size: ~500 tokens (system + fundraiser story)
- Completion size: ~200 tokens (summary paragraph)
- Cache hit rate assumption: ~70% (most views hit cache)

**Feature 2: Charity Creation Advice**
- Endpoint: `POST /api/charities/advice`
- Model: `claude-haiku-4-5-20251001`
- Trigger: Optional, user-initiated ("Get advice" button)
- Prompt size: ~300 tokens (system + charity details)
- Completion size: ~300 tokens (actionable tips)
- Usage rate assumption: ~20% of charity creation sessions

**Feature 3: Notification Reason Generation**
- Implementation: **Deterministic template strings** (no AI)
- Rationale: Template strings are reliable, fast, and free
- Examples: "Because you donated to {name}", "Because you follow {name}"

**Feature 4: Recommendation Explanations**
- Implementation: **Heuristic labels** (no AI)
- Rationale: Score components map directly to human-readable reasons
- Examples: "Based on your interest in Emergency Relief", "Trending in your area"

## Production Cost Projections

### Assumptions
- Daily active ratio: 30% of registered users are active on any given day
- Campaign summary: 1 generation per unique fundraiser per day (cached aggressively)
- Charity advice: 20% of charity creation sessions use advice feature
- Recommendation explanation: $0 (heuristic, no AI)
- Token prices (claude-haiku-4-5-20251001): $0.25/1M input, $1.25/1M output

### Cost by User Cohort

| Metric | 100 users | 1K users | 10K users | 100K users |
|---|---|---|---|---|
| DAU (30% ratio) | 30 | 300 | 3,000 | 30,000 |
| Campaign summary API calls/day | ~5 | ~50 | ~500 | ~5,000 |
| Charity advice calls/day | ~0.5 | ~5 | ~50 | ~500 |
| Total AI calls/day | ~5.5 | ~55 | ~550 | ~5,500 |
| Input tokens/day | ~2.75K | ~27.5K | ~275K | ~2.75M |
| Output tokens/day | ~1.1K | ~11K | ~110K | ~1.1M |
| **Monthly AI cost** | **~$5–15** | **~$40–120** | **~$400–1,200** | **~$4,000–12,000** |

### Full Cost Model

| Cost Category | 100 users | 1K users | 10K users | 100K users |
|---|---|---|---|---|
| Campaign summary generation | $5–15/mo | $40–120/mo | $400–1,200/mo | $4,000–12,000/mo |
| Charity advice assist | $1–3/mo | $8–25/mo | $80–250/mo | $800–2,500/mo |
| Optional auto-tag/classification | $0 (disabled) | $5–15/mo | $50–150/mo | $500–1,500/mo |
| Evaluation/test harness | $5/mo | $5–10/mo | $10–20/mo | $20–50/mo |
| **Estimated total AI spend** | **$11–23/mo** | **$58–170/mo** | **$540–1,620/mo** | **$5,320–16,050/mo** |

## Fallback Policy and Budget Controls

### Hard Limits
- Per-request token cap: 500 input + 200 output tokens
- Daily API call limit per feature: enforced via Redis counter with 24h TTL
- Budget kill-switch: `AI_ENABLED=false` environment variable disables all AI calls instantly

### Degradation Behavior
| Scenario | Fallback |
|---|---|
| AI_ENABLED=false | Template-based summaries ("Help the Martinez Family rebuild their home after a devastating fire.") |
| Rate limit exceeded | Return cached summary, extend TTL by 30 min |
| API timeout (> 5s) | Return template summary, log timeout metric |
| Budget exhausted | Fallback active for remainder of day, reset at midnight UTC |

### Cache Strategy
- Campaign summary: Redis with 1-hour TTL, invalidated on `fundraiser.update_posted` event
- Charity advice: Not cached (user-specific, one-time interaction)
- Recommendation explanations: Computed synchronously (< 1ms, no cache needed)

## AI Integration Architecture

```
Client Request
    │
    ▼
API Route: POST /api/fundraisers/:id/summary
    │
    ├─── Check Redis cache ──► HIT: Return cached summary (< 10ms)
    │
    └─── MISS:
          ├─── Check AI_ENABLED flag
          │       └─── FALSE: Return template summary
          │
          └─── TRUE:
                ├─── Check daily rate limit (Redis counter)
                │       └─── EXCEEDED: Return template summary
                │
                └─── WITHIN LIMIT:
                      ├─── Call claude-haiku-4-5 API (< 5s timeout)
                      │       └─── ERROR/TIMEOUT: Return template summary
                      │
                      └─── SUCCESS:
                            ├─── Store in Redis (1h TTL)
                            └─── Return AI summary
```

## Monitoring
- Metric: `ai_calls_total{feature, model, status}` (success/timeout/fallback)
- Metric: `ai_tokens_used_total{feature, type}` (input/output)
- Metric: `ai_cost_usd_estimated` (approximated from token counts)
- Alert: Daily AI spend projection exceeds 150% of budget → notify engineering
