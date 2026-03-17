# Task 001: Build community page layout and content

## Goal
Implement community page structure and interactions matching Pencil browser/mobile frames.

## Deliverables
- [ ] `apps/web/src/app/communities/[slug]/page.tsx` renders mission dashboard, progress, CTAs, activity feed, and participation layer.
- [ ] Community page includes an advice button that returns 1-2 recommendations for improving campaign content.
- [ ] Layout aligns to `mmCkm` and `PMwPm` hierarchy.
- [ ] Responsive behavior is validated for core breakpoints.

## Notes
Keep module boundaries clean so graph, advice, and composition data can be wired without UI-level business logic.

## Verification
View the community route on mobile and desktop, confirm hierarchy and section ordering parity with designs, and verify advice responses/fallback behavior.
