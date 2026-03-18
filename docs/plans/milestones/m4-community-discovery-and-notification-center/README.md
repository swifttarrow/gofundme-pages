# Milestone 4: Community Discovery and Notification Center

## Overview
Deliver discovery and engagement loops with recommendation explainability and notification deep-linking.

## Dependencies
- [ ] Milestone 3
- [ ] Recommendation signal updates and notification processor outputs available

## Changes Required
Build community feed/discovery, recommendation API + reason rendering, and notification center + preview endpoint per [Phase 4 in the source plan](../2026-03-17-implementation-plan.md#phase-4-community-discovery-and-notification-center).

## Success Criteria

### Automated Verification
- [ ] Ranking tests pass for weight composition and exploration ratio behavior
- [ ] Notification reason-generation tests pass
- [ ] E2E tests validate feed -> fundraiser navigation and notification deep links

### Manual Verification
- [ ] User can edit interests and see recommendation output/reasons change
- [ ] Notification center renders seeded + generated notifications with explanations
- [ ] No duplicate notifications for same dedupe key
- [ ] Human confirmation is captured before proceeding

## Tasks
- [001-build-community-feed-and-recommendation-api](./001-build-community-feed-and-recommendation-api.md)
- [002-build-notification-center-and-preview-endpoint](./002-build-notification-center-and-preview-endpoint.md)
