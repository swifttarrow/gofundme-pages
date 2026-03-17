# Task 005: Define AI cost calculation and reporting

## Goal
Establish and implement a concrete AI cost calculation model that maps usage telemetry to per-feature and total monthly spend.

## Deliverables
- [ ] Cost formula spec is documented for text, media, trust-scoring, and retry costs.
- [ ] Required metering fields are defined (provider, model, prompt tokens, completion tokens, media seconds/calls, retries, environment, feature key).
- [ ] Aggregation rules are documented for per-request, per-feature, per-environment, and monthly totals.
- [ ] Output/report format is defined for PRD projection comparison and ongoing monitoring.

## Notes
Anchor this task to `docs/prd.md` AI cost analysis requirements and ensure implementation assumptions are explicit (pricing version, unit conversions, cache-hit treatment, and fallback path costing).

## Verification
Run one sample calculation from captured telemetry and confirm outputs include per-feature totals plus grand total that can be compared against projected monthly budget bands.
