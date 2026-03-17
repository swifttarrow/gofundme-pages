# Task 003: Add media limits and image-video fallbacks

## Goal
Support fundraiser media attachments with defined limits and robust fallback behavior.

## Deliverables
- [ ] Media handling supports up to 3 items per fundraiser.
- [ ] Image-to-video fallback path is implemented for unavailable video generation.
- [ ] UI communicates fallback state without breaking publish flow.

## Notes
Prefer deterministic fallback outputs and timeout-safe handling to control media cost and reliability risk.

## Verification
Test with normal media upload and forced fallback scenario; confirm page rendering remains stable.
