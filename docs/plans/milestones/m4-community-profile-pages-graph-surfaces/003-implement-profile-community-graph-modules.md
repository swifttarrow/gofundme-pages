# Task 003: Implement profile/community graph modules

## Goal
Deliver deterministic graph modules for profile and community pages with explainable ranking outputs.

## Deliverables
- [ ] Profile modules include communities-around-you and similar-users.
- [ ] Community module includes momentum and/or cause-cluster insights.
- [ ] Reason labels and explanation surfaces are rendered for each module.
- [ ] Fallback states are available for low-data and dependency-failure cases.

## Notes
Keep formulas deterministic and capture overlap + recency logic in reusable service helpers.

## Verification
Run seeded scenarios and confirm module ordering and explanation text remain stable across repeated loads.
