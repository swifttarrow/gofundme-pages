# Task 003: Enforce Recording Limits and Fallback Typing Mode

## Goal
Guarantee recording duration constraints and preserve a frictionless text fallback.

## Deliverables
- [x] Soft guidance appears at 60 seconds and hard stop occurs at 90 seconds
- [x] Validation blocks processing when no usable input is captured
- [x] `Type instead` path uses the same downstream AI generation contract

## Notes
Typing fallback should remain visible and equivalent in capability so users who avoid voice are never blocked.

## Verification
Attempt recordings under/over time limits and confirm fallback typing can still complete the flow through processing.
