# Task 002: Implement Donation API Validation and Telemetry

## Goal
Enforce server-side donation correctness and instrument donation write-path observability.

## Deliverables
- [ ] `apps/api/src/routes/donations.ts` validates amount/tip totals and emits `donation.created`
- [ ] `apps/api/src/services/telemetry.ts` captures donation metrics, structured logs, and trace correlation IDs

## Notes
Treat all money values as integer cents and reject malformed or inconsistent totals before persistence.

## Verification
Pass donation validation tests, confirm one canonical event per successful donation, and validate trace/log linkage for a sample request.
