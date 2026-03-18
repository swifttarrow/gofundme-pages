# Milestone 13: Review Decisioning and Status Tracking

## Overview
Implement manual review outcomes and user-facing status tracking so creators can monitor requests and act on decisions.

## Dependencies
- [ ] Milestone 12 intake and submission flow complete
- [ ] Internal review workflow (staff-side) can write request decisions
- [ ] Notification delivery channel available

## Changes Required
Support request lifecycle transitions (`under_review`, `approved`, `rejected`), expose status UI in profile, and automate charity creation on approval.

## Success Criteria

### Automated Verification
- [ ] State machine tests validate legal transitions and reject invalid transitions
- [ ] Approval workflow tests create charity record and assign owner atomically
- [ ] Notification tests verify user receives decision updates for approve/reject events

### Manual Verification
- [ ] Profile shows "Your Charity Request" with accurate status labels
- [ ] Approved flow confirms charity is live and prompts sharing
- [ ] Rejected flow shows reason and supports edit/resubmit action

## Tasks
- [001-implement-review-state-machine-and-decision-endpoints](./001-implement-review-state-machine-and-decision-endpoints.md)
- [002-build-user-status-tracking-and-resubmission-flow](./002-build-user-status-tracking-and-resubmission-flow.md)
