# Task 001: Build Profile and Badges Experience

## Goal
Implement profile identity/activity views with a mobile-safe badge presentation that communicates trust clearly.

## Deliverables
- [ ] `apps/web/src/app/profile/[id]/page.tsx` renders identity, trust stats, fundraiser list, activity stream, and editable controls
- [ ] `apps/web/src/components/badges.tsx` shows prioritized top 3-5 badges with meaning tooltips/modal and responsive wrapping

## Notes
Badge ordering logic must align with trust priorities and avoid overflow on narrow screens.

## Verification
Pass badge visibility tests and manually validate profile rendering with dense badge sets on mobile widths.
