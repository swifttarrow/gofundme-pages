# Milestone 2: Event Ingestion, Idempotency, and Fan-Out

## Overview
Implement deterministic, replay-safe event orchestration for notifications, badges, and recommendation signals.

## Dependencies
- [ ] Milestone 1
- [ ] Core `PlatformEvent` contract and events table ready

## Changes Required
Implement canonical event ingestion, transactional enqueueing, idempotent processors, and replay support per [Phase 2 in the source plan](../2026-03-17-implementation-plan.md#phase-2-event-ingestion-idempotency-and-fan-out).

## Success Criteria

### Automated Verification
- [ ] Event duplicate tests pass (`same eventId` produces no second side effect)
- [ ] Worker processor unit tests pass for dedupe and bundling logic
- [ ] Integration tests validate event -> notification/badge/recommendation fan-out

### Manual Verification
- [ ] Posting `donation.created` creates one notification and one signal update
- [ ] Burst donation events produce a bundled notification outcome
- [ ] Replay endpoint reprocesses safely without duplication
- [ ] Human confirmation is captured before proceeding

## Tasks
- [001-implement-canonical-event-ingestion](./001-implement-canonical-event-ingestion.md)
- [002-build-idempotent-fanout-processors-and-replay](./002-build-idempotent-fanout-processors-and-replay.md)
