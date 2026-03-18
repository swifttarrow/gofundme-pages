# Task 001: Implement Entry Points and Eligibility Gate

## Goal
Expose the charity starter flow from primary surfaces and block users who already have an active or under-review charity request.

## Deliverables
- [x] Profile, fundraiser, and community surfaces expose "Start a Charity" entry actions
- [x] Server-side eligibility check returns a normalized state (`eligible`, `under_review`, `active_charity`)
- [x] Blocked users see the one-at-a-time message and cannot progress into submission flow

## Notes
Enforce gating on the server to prevent bypass via direct route access.

## Verification
Validate each entry point path and confirm blocked states are consistent across all surfaces and sessions.
