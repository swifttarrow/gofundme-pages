# Milestone 2: Graph/Event Data Model and Read APIs

## Overview
Implement idempotent event ingestion and graph summary read APIs needed by page modules.

## Dependencies
- [ ] Milestone 1: Foundation and Build Checkpoint Skeleton

## Changes Required
Add graph schema entities and summary tables, implement ingestion and summary APIs, enforce Zod validation and server auth for writes, add worker jobs for edge and summary updates with `eventId` dedupe, and seed demo fixtures with overlap-rich relationships.

Source section: `docs/plans/implementation-plan.md` (Phase 2)

## Success Criteria

### Automated Verification
- [ ] `pnpm db:migrate`
- [ ] `pnpm db:seed`
- [ ] `pnpm test --filter api`
- [ ] Event idempotency integration tests pass.

### Manual Verification
- [ ] Duplicate events with same `eventId` do not duplicate edges.
- [ ] Summary endpoints return deterministic data and reason labels.
- [ ] Private donor events produce aggregate-only output.

## Tasks
- [001-extend-graph-schema-and-summary-tables](./001-extend-graph-schema-and-summary-tables.md)
- [002-build-graph-ingest-and-summary-routes](./002-build-graph-ingest-and-summary-routes.md)
- [003-add-graph-worker-jobs-with-dedupe](./003-add-graph-worker-jobs-with-dedupe.md)
- [004-seed-demo-graph-data-and-idempotency-tests](./004-seed-demo-graph-data-and-idempotency-tests.md)
