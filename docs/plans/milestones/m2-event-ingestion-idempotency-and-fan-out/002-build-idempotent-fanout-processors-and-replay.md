# Task 002: Build Idempotent Fan-Out Processors and Replay

## Goal
Implement notification, badge, and recommendation processors with dedupe/bundling and safe replay behavior.

## Deliverables
- [ ] `apps/worker/src/processors/notifications.ts` supports dedupe keys and bundling windows
- [ ] `apps/worker/src/processors/badges.ts` performs idempotent evaluation and guarded assignment
- [ ] `apps/worker/src/processors/recommendations.ts` updates signals with explainability metadata
- [ ] `apps/api/src/routes/replay.ts` exposes replay endpoint with duplicate-safe reprocessing

## Notes
Prefer deterministic processor outputs from canonical events to keep retries and backfills side-effect safe.

## Verification
Run unit/integration coverage for processor dedupe + bundling and verify replay does not duplicate notifications, badges, or recommendation signals.
