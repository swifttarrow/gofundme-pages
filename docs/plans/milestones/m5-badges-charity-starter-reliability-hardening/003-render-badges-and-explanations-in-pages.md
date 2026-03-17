# Task 003: Render badges and explanations in pages

## Goal
Expose prioritized badge surfaces and explanation copy in profile and fundraiser contexts.

## Deliverables
- [ ] `apps/web/src/features/badges` includes rendering for top 3-5 badges.
- [ ] Badge explanation text and metadata are visible in supported contexts.
- [ ] Empty and unavailable badge states render safely.

## Notes
Keep badge ordering deterministic and compatible with composition payloads.

## Verification
Load profile and fundraiser pages for users with and without badges and verify ranking, copy, and fallback behavior.
