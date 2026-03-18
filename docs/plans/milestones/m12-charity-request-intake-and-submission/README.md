# Milestone 12: Charity Request Intake and Submission

## Overview
Build the creator-facing charity request flow from entry points through submission confirmation, including one-active-request gating.

## Dependencies
- [ ] Milestone 5 profile surfaces available
- [ ] Shared auth/session primitives stable
- [ ] Image upload service available for optional cover image

## Changes Required
Implement the MVP intake experience from the charity starter requirement: eligibility gate, education step, submission form, and confirmation state.

## Success Criteria

### Automated Verification
- [ ] Eligibility gate tests prevent duplicate active/under-review requests
- [ ] Form validation tests enforce required fields and acceptable cover image payloads
- [ ] API contract tests verify idempotent request creation behavior

### Manual Verification
- [ ] User can start from profile, fundraiser, and community entry points
- [ ] Education step is skimmable and clearly sets trust expectations
- [ ] Successful submission shows "under review" confirmation with next-step guidance

## Tasks
- [001-implement-entry-points-and-eligibility-gate](./001-implement-entry-points-and-eligibility-gate.md)
- [002-build-education-screen-and-submission-form](./002-build-education-screen-and-submission-form.md)
