# Task 002: Define Core Contracts and Initial Schema

## Goal
Establish canonical event/money contracts and persistable domain schema used across all phases.

## Deliverables
- [ ] `packages/contracts/src/events.ts` contains `PlatformEvent` schema and event type union with Zod validation
- [ ] `packages/contracts/src/money.ts` defines integer-cent model and tip validation contracts
- [ ] `infra/migrations/*` includes initial tables for users, fundraisers, donations, notifications, badges, follows, events, and recommendations

## Notes
Keep event IDs and monetary fields modeled for server-side validation and idempotent downstream processing.

## Verification
Run contract tests and apply migrations on clean local database and preview environment successfully.
