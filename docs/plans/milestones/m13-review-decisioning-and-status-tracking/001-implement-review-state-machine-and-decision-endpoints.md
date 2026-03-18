# Task 001: Implement Review State Machine and Decision Endpoints

## Goal
Create reliable, auditable state transitions for charity requests and expose decision APIs for manual staff review actions.

## Deliverables
- [ ] Charity request state machine implemented with explicit transition guards
- [ ] Staff decision endpoints support approve/reject and require authenticated staff authorization
- [ ] Approval path creates charity entity and ownership linkage in one transaction

## Notes
Persist decision reason and timestamps to support creator communication and audit trails.

## Verification
Execute transition tests, authorization tests, and transactional integrity tests for approval and rejection paths.
