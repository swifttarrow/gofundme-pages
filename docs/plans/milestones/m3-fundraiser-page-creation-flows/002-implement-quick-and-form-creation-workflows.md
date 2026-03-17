# Task 002: Implement quick/form creation and advice workflow

## Goal
Deliver both Quick and Form mode fundraiser creation/edit paths, including voice dictation in Quick mode, plus an advice action that returns 1-2 recommendations for improving fundraiser content.

## Deliverables
- [ ] `apps/web/src/features/fundraiser/create` contains mode switch and state orchestration.
- [ ] Quick mode supports fast drafting without auto-generated content requirements.
- [ ] Quick mode supports voice dictation with editable transcript and permission-denied fallback handling.
- [ ] Form mode create/edit path works for required fundraiser fields.
- [ ] Advice button call returns 1-2 recommendations and displays fallback copy on timeout/failure.
- [ ] Publish action persists data and returns route-ready result.

## Notes
Keep advice optional, user-triggered, and non-blocking for persistence. Keep voice dictation optional and fully editable before persistence.

## Verification
Complete one publish flow in each mode, test Quick-mode voice dictation with transcript edits and permission fallback, then click advice and verify recommendation rendering plus failure fallback behavior on both mobile and desktop.
