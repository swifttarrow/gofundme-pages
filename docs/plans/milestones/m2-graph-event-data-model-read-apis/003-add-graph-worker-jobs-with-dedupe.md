# Task 003: Add graph worker jobs with dedupe

## Goal
Process graph events asynchronously while ensuring idempotent edge updates and summary refreshes.

## Deliverables
- [ ] Worker jobs exist for edge upsert and summary refresh.
- [ ] Queue processing dedupes work by `eventId`.
- [ ] Replayed events are safely ignored or no-op applied.

## Notes
Use explicit job id conventions and deterministic transforms to keep workers stateless and horizontally scalable.

## Verification
Replay identical event payloads multiple times and confirm no duplicate edge writes or divergent summary states.
