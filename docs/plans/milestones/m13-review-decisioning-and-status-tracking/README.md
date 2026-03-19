# Milestone 8: Review Decisioning and Status Tracking

## Overview
Implement manual review outcomes and user-facing status tracking so creators can monitor requests and act on decisions.

## Dependencies
- [x] Milestone 7 intake and submission flow complete
- [x] Internal review workflow (staff-side) can write request decisions
- [x] Notification delivery channel available

## Changes Required
Support request lifecycle transitions (`under_review`, `approved`, `rejected`), expose status UI in profile, and automate charity creation on approval.

## Success Criteria

### Automated Verification
- [x] State machine tests validate legal transitions and reject invalid transitions
- [x] Approval workflow tests create charity record and assign owner atomically
- [x] Notification tests verify user receives decision updates for approve/reject events

### Manual Verification
- [x] Profile shows "Your Charity Request" with accurate status labels
- [x] Approved flow confirms charity is live and prompts sharing
- [x] Rejected flow shows reason and supports edit/resubmit action

## Tasks
- [001-implement-review-state-machine-and-decision-endpoints](./001-implement-review-state-machine-and-decision-endpoints.md)
- [002-build-user-status-tracking-and-resubmission-flow](./002-build-user-status-tracking-and-resubmission-flow.md)
