# Milestone 7: Charity Request Intake and Submission

## Overview
Build the creator-facing charity request flow from entry points through submission confirmation, including one-active-request gating.

## Dependencies
- [x] Milestone 5 profile surfaces available
- [x] Shared auth/session primitives stable
- [x] Image upload service available for optional cover image

## Changes Required
Implement the MVP intake experience from the charity starter requirement: eligibility gate, education step, submission form, and confirmation state.

## Success Criteria

### Automated Verification
- [x] Eligibility gate tests prevent duplicate active/under-review requests
- [x] Form validation tests enforce required fields and acceptable cover image payloads
- [x] API contract tests verify idempotent request creation behavior

### Manual Verification
- [x] User can start from profile, fundraiser, and community entry points
- [x] Education step is skimmable and clearly sets trust expectations
- [x] Successful submission shows "under review" confirmation with next-step guidance

## Tasks
- [001-implement-entry-points-and-eligibility-gate](./001-implement-entry-points-and-eligibility-gate.md)
- [002-build-education-screen-and-submission-form](./002-build-education-screen-and-submission-form.md)
