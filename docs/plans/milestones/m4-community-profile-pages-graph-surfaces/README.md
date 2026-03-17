# Milestone 4: Community and Profile Pages with Graph Surfaces

## Overview
Implement the remaining two page surfaces and complete the minimum four graph modules requirement.

## Dependencies
- [ ] Milestone 3: Fundraiser Page and Creation Flows

## Changes Required
Build community and profile pages from Pencil hierarchy across breakpoints, add profile/community graph modules with deterministic scoring, and implement composition services that merge graph, badge, and charity context into page-ready payloads.

Source section: `docs/plans/implementation-plan.md` (Phase 4)

## Success Criteria

### Automated Verification
- [ ] `pnpm test --filter community`
- [ ] `pnpm test --filter profile`
- [ ] `pnpm test:e2e --grep "community|profile"`

### Manual Verification
- [ ] Community and profile pages match Pencil hierarchy across breakpoints.
- [ ] At least 4 required graph modules are visible and explainable.
- [ ] Empty states render correctly with sparse seed data.

## Tasks
- [001-build-community-page-layout-and-content](./001-build-community-page-layout-and-content.md)
- [002-build-profile-page-layout-and-content](./002-build-profile-page-layout-and-content.md)
- [003-implement-profile-community-graph-modules](./003-implement-profile-community-graph-modules.md)
- [004-add-page-composition-services](./004-add-page-composition-services.md)
