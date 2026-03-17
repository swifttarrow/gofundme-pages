# Milestone 5: Badges, Charity Starter, and Reliability Hardening

## Overview
Add badge and charity workflows, then harden observability and failure behavior.

## Dependencies
- [ ] Milestone 4: Community and Profile Pages with Graph Surfaces

## Changes Required
Implement idempotent badge assignment in workers, add charity creation/linkage APIs, surface badges and explanations in web UI, and add observability instrumentation and runbooks for key dependency outages and reliability incidents.

Source section: `docs/plans/implementation-plan.md` (Phase 5)

## Success Criteria

### Automated Verification
- [ ] `pnpm test --filter workers`
- [ ] `pnpm test --filter observability`
- [ ] `pnpm lint && pnpm test && pnpm build`

### Manual Verification
- [ ] Duplicate events do not duplicate badge awards.
- [ ] Charity-fundraiser linkage is persisted and queryable.
- [ ] Graph/advice dependency failures return safe, non-crashing UI fallbacks.

## Tasks
- [001-implement-badge-worker-idempotency](./001-implement-badge-worker-idempotency.md)
- [002-build-charity-starter-and-linkage-apis](./002-build-charity-starter-and-linkage-apis.md)
- [003-render-badges-and-explanations-in-pages](./003-render-badges-and-explanations-in-pages.md)
- [004-add-observability-instrumentation-and-runbooks](./004-add-observability-instrumentation-and-runbooks.md)
