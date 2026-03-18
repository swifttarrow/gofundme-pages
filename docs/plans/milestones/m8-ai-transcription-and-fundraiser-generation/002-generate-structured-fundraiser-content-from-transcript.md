# Task 002: Generate Structured Fundraiser Content from Transcript

## Goal
Produce a complete fundraiser draft from transcript text with consistent schema and UX-ready limits.

## Deliverables
- [x] Generation pipeline returns title (<= 80 chars), summary (<= 120 words), full story, goal suggestion, and category
- [x] Entity extraction includes person, cause, urgency, and amount hints
- [x] Processing state API exposes status and generated draft payload

## Notes
Structure prompts and output parsing so each generated field can be independently regenerated later in the review UI.

## Verification
Feed representative transcripts and confirm all required fields are populated within constraints.
