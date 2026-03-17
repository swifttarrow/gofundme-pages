# Milestone 1: Foundation and Build Checkpoint Skeleton

## Overview
Create the monorepo application skeleton, runtime infrastructure, and first vertical slice required by the 24-hour checkpoint.

## Dependencies
- [ ] None

## Changes Required
Initialize the Next.js route shells for fundraiser/community/profile pages, define shared runtime env validation, create baseline relational schema entities, add the first fundraiser write/read path, and stand up local Postgres/Redis infrastructure.

Source section: `docs/plans/implementation-plan.md` (Phase 1)

## Success Criteria

### Automated Verification
- [ ] `pnpm install`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`

### Manual Verification
- [ ] Responsive route shells exist for all three pages.
- [ ] Creating a fundraiser writes data and returns readable page content.
- [ ] Local stack starts with Postgres and Redis.

## Tasks
- [001-initialize-web-app-route-shells](./001-initialize-web-app-route-shells.md)
- [002-add-runtime-env-schema-validation](./002-add-runtime-env-schema-validation.md)
- [003-create-core-schema-and-local-infra](./003-create-core-schema-and-local-infra.md)
- [004-implement-fundraiser-create-vertical-slice](./004-implement-fundraiser-create-vertical-slice.md)
