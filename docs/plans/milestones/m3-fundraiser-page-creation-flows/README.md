# Milestone 3: Fundraiser Page and Creation Flows

## Overview
Ship fundraiser UX from Pencil design with publishing, story controls, and graph-context modules.

## Dependencies
- [ ] Milestone 2: Graph/Event Data Model and Read APIs

## Changes Required
Implement fundraiser page layout parity across breakpoints, build Quick (including voice dictation) and Form mode creation/edit workflows, add an advice button that returns 1-2 recommendations, support media constraints and fallback behavior, and render fundraiser graph modules with explanation and privacy-safe language.

Source section: `docs/plans/implementation-plan.md` (Phase 3)

## Success Criteria

### Automated Verification
- [ ] `pnpm test --filter fundraiser`
- [ ] `pnpm test:e2e --grep fundraiser`

### Manual Verification
- [ ] Quick mode and Form mode publish successfully with manual edits.
- [ ] Quick mode supports voice dictation with editable transcript before publish.
- [ ] Advice button returns 1-2 recommendations and does not block publish when unavailable.
- [ ] Form mode create/edit works on mobile and desktop.
- [ ] Graph modules render explanations and safe fallbacks.

## Tasks
- [001-build-fundraiser-page-layout-parity](./001-build-fundraiser-page-layout-parity.md)
- [002-implement-quick-and-form-creation-workflows](./002-implement-quick-and-form-creation-workflows.md)
- [003-add-media-limits-and-image-video-fallbacks](./003-add-media-limits-and-image-video-fallbacks.md)
- [004-ship-fundraiser-graph-modules-and-safe-copy](./004-ship-fundraiser-graph-modules-and-safe-copy.md)
