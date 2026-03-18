# Task 001: Implement Canonical Event Ingestion

## Goal
Build an ingestion path that validates and persists one canonical event record per unique `eventId`.

## Deliverables
- [ ] `apps/api/src/routes/events.ts` exposes `POST /api/events` with uniqueness guard and stable validation errors
- [ ] `apps/api/src/services/event-ingestion.ts` persists event transactionally before enqueueing downstream work

## Notes
Use strict Zod contract validation and transactional boundaries so fan-out cannot happen without canonical persistence.

## Verification
Add duplicate-event tests showing repeated submissions of one `eventId` do not create second-order side effects.
