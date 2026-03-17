# Task 004: Add observability instrumentation and runbooks

## Goal
Instrument golden signals and key funnels, then document operational response paths for major failure modes.

## Deliverables
- [ ] `packages/observability` includes logs, metrics, and traces for graph modules, badge interactions, and key user funnels.
- [ ] `docs/runbooks` includes advice service outage, graph lag, and elevated error rate runbooks.
- [ ] Alert thresholds and service ownership references are documented.

## Notes
Instrument both API and worker paths to trace end-to-end flow from event ingest to page composition.

## Verification
Trigger representative failures in local/staging and confirm telemetry appears with actionable runbook steps.
