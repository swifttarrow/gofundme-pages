# Task 003: Create core schema and local infra

## Goal
Create baseline relational entities and local development infrastructure for deterministic development.

## Deliverables
- [ ] Core DB schema entities exist for users, fundraisers, communities, charities, badges, and baseline graph tables.
- [ ] `infra/docker-compose.yml` defines Postgres and Redis services.
- [ ] Local migration path is documented and runnable.

## Notes
Prioritize minimal schema needed for early vertical slices; avoid premature optional fields.

## Verification
Start local infra with Docker Compose and run migrations successfully against local Postgres.
