# Task 002: Implement Charity Starter and Badge Evaluation API

## Goal
Enable organizers to create charities and link fundraisers while exposing explicit badge evaluation controls.

## Deliverables
- [ ] `apps/api/src/routes/badges-evaluate.ts` implements `POST /api/badges/evaluate` for trigger/testing
- [ ] `apps/web/src/app/charity/new/page.tsx` adds starter wizard with minimum launch fields and linkage flow
- [ ] `apps/api/src/routes/charities.ts` persists charity entity and parent-child fundraiser linkage with auth checks

## Notes
Server-side authorization should guard organizer actions and preserve idempotent outcomes under retries.

## Verification
Run charity linkage integration tests and authorization tests; manually create and link a charity in one session.
