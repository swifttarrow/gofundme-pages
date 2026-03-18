# Milestone 5: Profile, Badges, and Charity Starter Kit

## Overview
Complete trust/profile experiences and creator workflows with idempotent, explainable badge and charity state transitions.

## Dependencies
- [ ] Milestone 4
- [ ] Badge processor and recommendation/notification pipelines stable

## Changes Required
Implement profile UI, badge display semantics, badge evaluation endpoint, and charity starter flow per [Phase 5 in the source plan](../2026-03-17-implementation-plan.md#phase-5-profile-badges-and-charity-starter-kit).

## Success Criteria

### Automated Verification
- [ ] Badge visibility ranking tests pass (max 3-5 badges shown)
- [ ] Charity creation + linkage integration tests pass
- [ ] Authorization tests pass for profile edits and organizer-only actions

### Manual Verification
- [ ] Profile with many badges does not overflow on mobile
- [ ] Charity can be created and linked to at least one fundraiser in one session
- [ ] Badge assignments remain stable under event retries/replay
- [ ] Human confirmation is captured before proceeding

## Tasks
- [001-build-profile-and-badges-experience](./001-build-profile-and-badges-experience.md)
- [002-implement-charity-starter-and-badge-evaluation-api](./002-implement-charity-starter-and-badge-evaluation-api.md)
