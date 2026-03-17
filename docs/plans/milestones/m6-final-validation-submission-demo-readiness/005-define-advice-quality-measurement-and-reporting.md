# Task 005: Define advice quality measurement and reporting

## Goal
Define and implement a lightweight reporting model for the page advice feature that tracks reliability, recommendation quality signals, and user interaction outcomes.

## Deliverables
- [ ] Advice interaction telemetry is documented (`advice_requested`, `advice_rendered`, `advice_failed`, `advice_applied`).
- [ ] Reporting slices are defined for per-page and aggregate usage (fundraiser, community, profile).
- [ ] Quality guardrails are documented (max 1-2 recommendations, concise phrasing, actionable wording).
- [ ] Output/report format is defined for demo validation and ongoing monitoring.

## Notes
Keep this task focused on trust-preserving advice behavior rather than auto-generation metrics.

## Verification
Run one sample telemetry-to-report walkthrough and confirm outputs include per-page usage, fallback rate, and interaction outcomes.
