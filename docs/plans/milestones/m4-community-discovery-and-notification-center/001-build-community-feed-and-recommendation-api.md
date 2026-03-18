# Task 001: Build Community Feed and Recommendation API

## Goal
Implement recommendation retrieval and feed discovery UX with explainable ranking output.

## Deliverables
- [ ] `apps/web/src/app/community/page.tsx` includes featured campaigns, infinite feed, category filters, and sort controls
- [ ] `apps/api/src/routes/recommendations.ts` serves `GET /api/recommendations?user_id=<id>` with heuristic scoring and reason fields
- [ ] `apps/web/src/components/recommendation-card.tsx` safely renders recommendation reasons

## Notes
Ensure recommendation reasons are user-visible and deterministic for trust and debugging.

## Verification
Pass ranking tests and manually confirm recommendation reasons change when user interests are modified.
