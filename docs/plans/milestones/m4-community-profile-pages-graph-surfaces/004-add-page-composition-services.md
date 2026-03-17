# Task 004: Add page composition services

## Goal
Create backend composition services that merge graph, badge, and charity context into page-ready payloads.

## Deliverables
- [ ] `packages/api/src/services/composition` includes service methods for fundraiser, community, and profile payload assembly.
- [ ] Composition outputs are stable and typed for web consumption.
- [ ] Failure paths return safe fallback payload fragments instead of hard errors.

## Notes
This is the integration seam for read performance and reliability hardening in later phases.

## Verification
Call composition services for all three page types and verify complete payloads are returned even when one dependency is unavailable.
