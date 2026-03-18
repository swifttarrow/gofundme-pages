# Milestone 1: Foundations - Repo Bootstrap and Core Contracts

## Overview
Create the application skeleton and core contracts shared by all product surfaces and event processors.

## Dependencies
- [ ] Milestone 0
- [ ] Architecture and stack decisions finalized

## Changes Required
Bootstrap `apps/web`, `apps/api`, shared contracts, and initial database schema per [Phase 1 in the source plan](../2026-03-17-implementation-plan.md#phase-1-foundations---repo-bootstrap-and-core-contracts).

## Success Criteria

### Automated Verification
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`

### Manual Verification
- [ ] App routes render base shells on desktop and mobile widths
- [ ] API validates malformed event payloads with stable error responses
- [ ] Database migrations apply cleanly on local and preview environments
- [ ] Human confirmation is captured before proceeding

## Tasks
- [001-bootstrap-monorepo-app-scaffolds](./001-bootstrap-monorepo-app-scaffolds.md)
- [002-define-core-contracts-and-initial-schema](./002-define-core-contracts-and-initial-schema.md)
