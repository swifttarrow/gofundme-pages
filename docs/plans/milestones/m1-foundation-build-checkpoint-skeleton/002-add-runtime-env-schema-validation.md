# Task 002: Add runtime env schema validation

## Goal
Define and enforce runtime environment validation for web, API, worker, database, cache, and provider integrations.

## Deliverables
- [ ] `packages/config` contains Zod schemas for required runtime env variables.
- [ ] Environment parsing utilities fail fast on missing or invalid values.
- [ ] Web/API/worker entrypoints consume the shared config package.

## Notes
Keep schemas centralized and reusable; this unblocks safe deployment and local bootstrap consistency.

## Verification
Run startup with an intentionally missing variable and confirm a clear validation failure, then restore variables and confirm services start.
