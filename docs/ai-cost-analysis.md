# AI Cost Analysis — GoSupportMe

## Current Status

GoSupportMe does not currently ship any production AI features.

- No API route in `apps/api/src/routes` calls an LLM provider.
- No AI SDK dependency is present in `package.json`, `apps/api/package.json`, or `apps/web/package.json`.
- No documented AI feature flag such as `AI_ENABLED` exists in the current codebase.

Because of that, the current recurring production AI spend is:

| Category | Current state | Estimated monthly cost |
|---|---|---|
| LLM/API usage | Not implemented | $0 |
| AI caching / rate limiting infra | Not implemented | $0 |
| AI-specific observability | Not implemented | $0 |
| **Total** | **Current shipped product** | **$0/month** |

## What Replaced the Earlier AI Plans

Some product ideas were previously documented as AI-assisted, but the implemented app currently uses deterministic behavior instead:

| Capability | Current implementation | Cost impact |
|---|---|---|
| Fundraiser summary text | Fundraiser metadata/preview text is derived from the stored story content | $0 |
| Charity creation guidance | Form UX and validation only; no generated advice endpoint | $0 |
| Notification reasons | Template-based strings in the notifications preview flow | $0 |
| Recommendation explanations | Stored heuristic reason labels from the recommendations pipeline | $0 |

## Development Cost Note

Development did involve AI-assisted coding workflows, but those costs are not measured anywhere in this repository and should not be represented as audited numbers.

- Treat prior token and dollar figures as planning estimates, not system-of-record cost data.
- If the team wants real development cost tracking, that should come from the model provider dashboard or IDE billing export rather than this repo.

## If AI Features Are Added Later

The PRD and some planning docs still reference optional future AI work, such as fundraiser summaries or charity advice. Those features should be treated as unimplemented roadmap items until all of the following exist in code:

1. A real API route that invokes a model provider.
2. A checked-in dependency or internal client for that provider.
3. Feature flags and fallback behavior.
4. Token, latency, and error instrumentation.
5. A revised cost model based on the actual prompt and completion sizes.

## Recommendation

For now, the most accurate budget statement is simple: production AI cost is `0` because no AI feature is currently wired into the application runtime.
