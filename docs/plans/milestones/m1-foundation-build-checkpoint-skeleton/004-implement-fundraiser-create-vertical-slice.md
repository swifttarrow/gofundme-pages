# Task 004: Implement fundraiser create vertical slice

## Goal
Ship the first write path that persists a fundraiser and returns a readable payload for page rendering.

## Deliverables
- [ ] `packages/api/src/routes/fundraisers` includes create endpoint/service.
- [ ] Create flow persists fundraiser records in the database.
- [ ] API returns normalized payload usable by `/f/[slug]` shell.
- [ ] Bootstrap commands are added to `README.md`.

## Notes
Enforce Zod validation and server-side auth checks on write boundaries per project backend rules.

## Verification
Execute a create request locally, confirm database write, and confirm fundraiser route displays returned content.
