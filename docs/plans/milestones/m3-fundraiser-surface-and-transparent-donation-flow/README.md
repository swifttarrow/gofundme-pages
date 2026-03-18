# Milestone 3: Fundraiser Surface and Transparent Donation Flow

## Overview
Ship a conversion-focused fundraiser experience with explicit tipping, transparent totals, and instrumented donation writes.

## Dependencies
- [ ] Milestone 2
- [ ] Event ingestion pipeline available for `donation.created`

## Changes Required
Deliver fundraiser UI, donation module behavior, server-side donation validation, and donation telemetry per [Phase 3 in the source plan](../2026-03-17-implementation-plan.md#phase-3-fundraiser-surface-and-transparent-donation-flow).

## Success Criteria

### Automated Verification
- [ ] Donation amount/tip validation tests pass
- [ ] E2E test validates transparent total charged across presets and custom tips
- [ ] Accessibility checks pass for donation controls and keyboard flow

### Manual Verification
- [ ] User can complete donation flow at `320px` without layout breakage
- [ ] Tip choice is explicit and never hidden/defaulted ambiguously
- [ ] Donation emits one canonical event with traceable ID
- [ ] Human confirmation is captured before proceeding

## Tasks
- [001-build-fundraiser-page-and-donation-module](./001-build-fundraiser-page-and-donation-module.md)
- [002-implement-donation-api-validation-and-telemetry](./002-implement-donation-api-validation-and-telemetry.md)
