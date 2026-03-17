# Task 002: Build charity starter and linkage APIs

## Goal
Add APIs for creating charities, linking them to fundraisers, and reading charity context.

## Deliverables
- [ ] `POST /api/charities` endpoint implemented with Zod validation.
- [ ] `POST /api/charities/:id/fundraisers` linkage endpoint implemented.
- [ ] `GET /api/charities/:id` read endpoint returns aggregate charity context.
- [ ] Auth and input validation are enforced server-side.

## Notes
Keep API contracts explicit and consistent with composition services used by page reads.

## Verification
Create a charity, link a fundraiser, then query charity details and confirm linkage persistence.
