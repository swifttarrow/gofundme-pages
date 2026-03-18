# Milestone 9: Review, Edit, and Regeneration Experience

## Overview
Ship the core review screen where users edit AI output inline, tune tone, and regenerate sections without restarting the entire flow.

## Dependencies
- [ ] Milestone 8
- [ ] Draft generation response contract is stable

## Changes Required
Implement editable title/summary/story/goal/breakdown modules, per-section regeneration, tone controls, and start-over flow per [Review and Edit Screen](../../requirements/voice-dictation-for-creating-fundraisers.md#-4-review--edit-screen-core-screen).

## Success Criteria

### Automated Verification
- [ ] UI tests cover inline editing and save behavior across all editable fields
- [ ] Regeneration tests ensure only the targeted section changes
- [ ] State management tests preserve user edits when toggling sections

### Manual Verification
- [ ] User can edit every generated section inline without context loss
- [ ] Tone toggles produce meaningful content variation while preserving factual details
- [ ] User can start over with voice from review without dead-end states

## Tasks
- [001-build-review-screen-with-inline-editing](./001-build-review-screen-with-inline-editing.md)
- [002-add-per-section-regeneration-and-tone-controls](./002-add-per-section-regeneration-and-tone-controls.md)
- [003-implement-re-record-and-start-over-from-review](./003-implement-re-record-and-start-over-from-review.md)
