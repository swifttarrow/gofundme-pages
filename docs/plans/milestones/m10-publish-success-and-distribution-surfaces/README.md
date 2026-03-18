# Milestone 10: Publish, Success, and Distribution Surfaces

## Overview
Complete the publish path with pre-publish preview, optional distribution toggles, and a post-publish success/share experience.

## Dependencies
- [ ] Milestone 9
- [ ] Draft persistence endpoint available for final publish write

## Changes Required
Implement publish preview card, publish CTA, share toggles, and success actions per [Publish Screen and Success State](../../requirements/voice-dictation-for-creating-fundraisers.md#-5-publish-screen).

## Success Criteria

### Automated Verification
- [ ] Publish API tests validate required fields and successful draft-to-fundraiser conversion
- [ ] UI tests verify optional toggles are persisted correctly
- [ ] Share-link generation tests pass for created fundraisers

### Manual Verification
- [ ] User can preview exactly how fundraiser appears before publishing
- [ ] Publishing succeeds from mobile flow without losing edited content
- [ ] Success screen offers copy link and social/contact share actions

## Tasks
- [001-build-publish-preview-and-submit-action](./001-build-publish-preview-and-submit-action.md)
- [002-add-success-state-and-share-actions](./002-add-success-state-and-share-actions.md)
- [003-wire-distribution-toggles-and-surface-integrations](./003-wire-distribution-toggles-and-surface-integrations.md)
