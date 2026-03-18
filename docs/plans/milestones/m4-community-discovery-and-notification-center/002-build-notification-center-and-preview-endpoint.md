# Task 002: Build Notification Center and Preview Endpoint

## Goal
Expose generated notifications with clear reasons, deep links, and debug preview support.

## Deliverables
- [ ] `apps/web/src/app/notifications/page.tsx` renders reason text, timestamps, and deep links
- [ ] `apps/api/src/routes/notifications-preview.ts` implements `POST /api/notifications/preview` for explainability/debugging

## Notes
Notification rendering should tolerate both seeded and generated data and preserve dedupe expectations.

## Verification
Pass reason-generation tests and run E2E checks for notification deep links into fundraiser pages.
