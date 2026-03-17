# Task 001: Implement badge worker idempotency

## Goal
Evaluate badge criteria and assign awards without duplicates under replayed or retried events.

## Deliverables
- [ ] `packages/workers/src/badges` includes criteria evaluation and assignment flows.
- [ ] Badge assignment dedupes by event identity and user/badge combination.
- [ ] Regression tests cover replay and retry scenarios.

## Notes
Use transactional writes for multi-step checks and inserts to avoid race-condition duplicates.

## Verification
Replay identical qualifying events and confirm only one badge assignment record is produced.
