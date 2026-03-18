# Task 003: Add Safety, Grounding, and Confidence Gates

## Goal
Prevent harmful or hallucinated outputs and surface confidence signals before users publish.

## Deliverables
- [ ] Moderation checks run on transcript and generated output before review screen render
- [ ] Grounding checks ensure generated statements map back to transcript evidence
- [ ] Confidence score is stored and exposed to UI with low-confidence fallback behavior

## Notes
Prefer deterministic rule checks in addition to model-based moderation to keep behavior auditable and predictable.

## Verification
Test unsafe and ambiguous inputs and confirm content is blocked/flagged with clear user guidance.
