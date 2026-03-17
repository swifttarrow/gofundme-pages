# Task 001: Extend graph schema and summary tables

## Goal
Add persistent graph and summary storage structures required for deterministic read APIs.

## Deliverables
- [ ] Schema additions for `graph_nodes`, `graph_edges`, and `idempotency_keys`.
- [ ] Summary tables exist for user, fundraiser, and community context reads.
- [ ] Migrations are generated and checked into source control.

## Notes
Design indexes for expected lookup paths (`eventId`, actor/subject ids, and summary keys) to support read performance goals.

## Verification
Run migrations and inspect resulting tables/indexes in local Postgres.
