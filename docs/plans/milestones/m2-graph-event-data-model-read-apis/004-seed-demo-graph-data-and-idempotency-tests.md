# Task 004: Seed demo graph data and idempotency tests

## Goal
Add realistic overlap-rich demo fixtures and integration tests that prove event idempotency behavior.

## Deliverables
- [ ] `packages/db/seeds/demo` includes causes, users, communities, and fundraisers with overlap.
- [ ] API integration tests cover duplicate ingest behavior by shared `eventId`.
- [ ] Privacy-safe aggregate output cases are represented in tests.

## Notes
Seed data should exercise recommendation explanations and sparse/overlap scenarios used by graph modules.

## Verification
Run `pnpm db:seed` and API integration tests, then manually inspect summary output for expected reason labels.
