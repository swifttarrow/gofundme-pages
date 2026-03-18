# Milestone 9: Review, Edit, and Regeneration Experience

## Overview
Ship the core review screen where users edit AI output inline, tune tone, and regenerate sections without restarting the entire flow.

## Dependencies
- [x] Milestone 8
- [x] Draft generation response contract is stable

## Changes Required
Implement editable title/summary/story/goal/breakdown modules, per-section regeneration, tone controls, and start-over flow per [Review and Edit Screen](../../requirements/voice-dictation-for-creating-fundraisers.md#-4-review--edit-screen-core-screen).

## Success Criteria

### Automated Verification
- [x] UI tests cover inline editing and save behavior across all editable fields
- [x] Regeneration tests ensure only the targeted section changes
- [x] State management tests preserve user edits when toggling sections

### Manual Verification
- [x] User can edit every generated section inline without context loss
- [x] Tone toggles produce meaningful content variation while preserving factual details
- [x] User can start over with voice from review without dead-end states

## Tasks
- [001-build-review-screen-with-inline-editing](./001-build-review-screen-with-inline-editing.md)
- [002-add-per-section-regeneration-and-tone-controls](./002-add-per-section-regeneration-and-tone-controls.md)
- [003-implement-re-record-and-start-over-from-review](./003-implement-re-record-and-start-over-from-review.md)
