# Task 002: Build graph ingest and summary routes

## Goal
Implement event ingestion and graph summary endpoints required by page modules.

## Deliverables
- [ ] `POST /api/graph/events/ingest` endpoint implemented.
- [ ] Summary endpoints for user, fundraiser context, and community are implemented.
- [ ] Zod request/response contracts are defined and enforced.
- [ ] Auth checks are applied to write endpoints.

## Notes
Keep response payloads reason-labeled and explainable to align with recommendation transparency requirements.

## Verification
Call each route against seeded data and confirm deterministic responses across repeated requests.
