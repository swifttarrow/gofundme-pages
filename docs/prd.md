# GoSupportMe
*Building Trust-Centered Fundraising Surfaces with Event-Driven Product Engineering*

## Before You Start: Pre-Search ([time: 1-2 hours])

You must complete the Pre-Search appendix before writing code. This project is intentionally broad (three core pages plus platform systems), and you will fail fast if you skip architecture and tradeoff decisions.

Your completed Pre-Search artifact is a required part of final submission. Save it at `docs/pre-search.md`.

Methodology emphasis this week: instrument-first product engineering. You are not only shipping UI; you are shipping measurable behavior across discovery, trust, conversion, and retention. Pre-Search defines the constraints and decision trail that make those measurements meaningful.

## Background

Modern fundraising products blend high-conversion pages with engagement loops. GoFundMe, Kickstarter, Patreon, and LinkedIn all converge on similar patterns: relevance feeds, event notifications, credibility signals, and low-friction contribution flows. Platforms that treat these as one system (not disconnected widgets) outperform on repeat engagement and trust-sensitive conversion.

You must build a GoFundMe-inspired web application with three integrated surfaces (fundraiser, community, profile) plus platform capabilities (achievement badges, charity starter kit, content discovery, notifications, transparent tipping, mobile responsiveness). The core technical challenge is building an event-driven, observable, horizontally scalable product where core user actions propagate cleanly across ranking, notifications, and trust signals.

## Gate Statement

Gate: Project completion required for Austin admission.

## Project Overview

One-week sprint with three checkpoints:

| Checkpoint | Deadline | Focus |
| --- | --- | --- |
| Pre-Search | Day 0 (before coding) | Constraints, architecture, metrics, and implementation plan |
| Build Checkpoint | Tuesday / 24 hours | Core pages online with integrated data flow and instrumentation |
| Early Submission | Friday / 4 days | Feature-complete MVP with end-to-end core flows |
| Final Submission | Sunday / 7 days | Production-ready polish, tests, docs, runbooks, and demo |

## Build Checkpoint Requirements (24 Hours)

Progress gate. All items required for this checkpoint:

- ☐ Fundraiser page renders hero, progress, story, donation module, organizer section, and donation feed.
- ☐ Community page renders header, featured campaigns, and feed with filter/sort controls.
- ☐ Profile page renders identity, trust stats, fundraiser list, and activity section.
- ☐ Shared responsive layout works at `320px`, `360px`, `768px`, and `1024px` with no horizontal page overflow.
- ☐ Basic event schema exists for donation, follow, update-posted, and share actions.
- ☐ At least one read path and one write path are fully instrumented (metrics + structured logs + trace IDs).
- ☐ Notification center tab is visible with seeded notifications and deep links.
- ☐ Transparent tip selector supports `0/5/10/15/20/custom` with explicit total charged calculation.
- ☐ Application is deployed and publicly accessible.

A simple fundraising platform with accurate state beats a complex platform with broken trust signals.

## Core Technical Requirements

### Surface and Interaction Requirements

| Feature | Requirements |
| --- | --- |
| Fundraiser Page | Include hero media, title, organizer attribution, progress state, donation CTA, and trust/safety context in a conversion-first layout. |
| Fundraiser Story | Support expandable long-form content with progressive disclosure and mobile-safe rendering. |
| Donation Module | Support suggested amounts, custom amount, optional tip, and clear total charged breakdown before confirm. |
| Community Feed | Support infinite scrolling feed with filterable category chips and click-through into fundraiser detail. |
| Profile Experience | Include profile identity, social proof stats, fundraiser grid/list, trust badges, and editable profile controls. |
| Mobile Responsiveness | Ensure all primary actions remain accessible and touch-friendly with 44x44 minimum target sizing. |
| Navigation | Provide clear back navigation and high-priority mobile actions without hover dependency. |
| Accessibility | Meet WCAG AA-level contrast and keyboard/screen-reader viability across key flows. |

### Engagement and Trust Systems Requirements

| Feature | Requirements |
| --- | --- |
| Achievement Badges | Compute and display trust, momentum, engagement, and social-proof badges with deterministic criteria. |
| Badge Visibility Logic | Display maximum 3-5 top-priority badges and explain badge meaning through tooltip or modal. |
| Notification Following | Support explicit and auto-follow fundraiser relationships with per-fundraiser controls. |
| Notification Delivery | Deliver in-app and email notifications with dedupe and bundling guardrails. |
| Notification Explainability | Every notification must include reason text (for example: because you donated). |
| Discovery Feed | Rank recommendations using interest, historical donation similarity, and trending boost. |
| Similar Campaigns | Show related campaigns on fundraiser pages using category, keyword, and overlap heuristics. |
| Transparent Tipping | Make tip intent explicit and remove dark-pattern UI in selection and confirmation steps. |
| Charity Starter Kit | Provide guided flow to create persistent charity entity and link child fundraisers. |

### Platform Reliability and Operations Requirements

| Feature | Requirements |
| --- | --- |
| Stateless Services | Runtime instances must be replaceable without local session coupling and safe for horizontal scaling. |
| Event Idempotency | Event-driven writes must use `eventId` and `timestamp` and reject duplicate side effects. |
| Observability | Emit structured logs, RED/USE metrics, and traces for critical paths (donate, follow, notify, discover). |
| Error Handling | Return stable user-facing error states with retriable backend semantics and clear fallback behavior. |
| Test Coverage | Include unit tests for ranking/eligibility logic and integration tests for end-to-end user flows. |
| Runbooks | Document incident triage for notification delays, recommendation failure, and donation path degradation. |
| Performance Hygiene | Prevent layout shift, lazy-load non-critical media, and cap mobile JS cost for fast interaction. |

### Testing Scenarios

We will test:

1. A new user on `320px` completes a donation flow, makes an explicit tip choice, and sees a correct total charge.
2. A donor action emits one event and creates exactly one user notification without duplicates.
3. A fundraiser update triggers bundled notifications when multiple noisy events occur in a burst.
4. A profile with many badges displays top-priority badges only and does not overflow mobile layout.
5. A user edits interests and sees discovery ranking changes with visible recommendation reasons.
6. A user creates a charity via starter wizard and links at least one fundraiser in the same session.
7. App behavior under synthetic concurrency spike preserves correctness and measurable latency targets.
8. Error states (notification service unavailable, recommendation timeout) degrade gracefully and remain traceable.

### Performance Targets

| Metric | Target |
| --- | --- |
| Fundraiser page load (initial meaningful paint) | p95 < 2.0s |
| Community feed initial render | p95 < 1.5s |
| Profile page load | p95 < 1.5s |
| In-app notification creation latency | p95 < 3s from triggering event |
| Push/email enqueue latency for real-time events | p95 < 30s |
| Duplicate notification rate for same user-event pair | 0 duplicates per dedupe key |

## Domain-Specific Deep Section

### Event-Driven Engagement Orchestrator

This project’s signature challenge is building one orchestrated engagement pipeline that powers badges, notifications, and discovery using shared event contracts.

Required capabilities:

- Ingest user actions (`donation.created`, `fundraiser.update_posted`, `fundraiser.followed`, `profile.updated`).
- Persist canonical events with deterministic IDs and timestamps.
- Trigger downstream processors for notifications, badge evaluation, and recommendation signal updates.
- Expose reason metadata so UI can explain why users got alerts or recommendations.

Example event payload:

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "occurredAt": "2026-03-17T20:10:12Z",
  "type": "donation.created",
  "payload": {
    "amountCents": 5000,
    "tipCents": 500,
    "totalCents": 5500,
    "donationId": "5b7b1b60-7d70-4c7d-a6b7-b9e5d0a2e8c8",
    "fundraiserId": "8eaf4c52-4c5b-4a10-8f65-5a72d63c4d20",
    "donorUserId": "d2c7e38e-5e6a-4527-a6e5-9a3be6d9f3c2",
    "isAnonymous": false,
    "message": null
  }
}
```

Required API/interface definitions:

```ts
type PlatformEvent = {
  eventId: string
  occurredAt: string
  type: "donation.created" | "fundraiser.update_posted" | "fundraiser.followed" | "profile.updated"
  payload: Record<string, unknown>
}

POST /api/events
GET /api/recommendations?user_id=<id>
POST /api/notifications/preview
POST /api/badges/evaluate
```

Evaluation criteria (input -> expected output):

- `donation.created` -> notification created, recommendation engagement signal updated, badge evaluation triggered.
- Burst of 5 donation events in 1 hour -> one bundled momentum notification for each eligible follower.
- Duplicate event with same `eventId` -> no second write side effect.
- `fundraiser.update_posted` by organizer -> eligible followers receive reasoned notifications and deep links.
- `profile.updated` crossing completeness threshold -> relevant engagement badge assignment evaluated.

Implement at least **4** of the following:

1. Notification dedupe and bundling engine.
2. Badge evaluator worker with idempotent assignment.
3. Recommendation signal updater from engagement events.
4. Notification reason generator service.
5. Event replay endpoint for recovery/testing.
6. Backfill job for missing engagement events.

Deep-section performance targets:

| Metric | Target |
| --- | --- |
| Event ingestion success rate | >= 99.9% |
| Event-to-notification enqueue delay | p95 < 5s |
| Badge evaluation worker processing latency | p95 < 10s per batch |
| Event replay correctness | 100% idempotent reprocessing |

## Technical Stack

Current implementation choices are listed here rather than the earlier decision matrix options.

| Layer | Technology |
| --- | --- |
| Backend | Node.js + Fastify |
| Frontend | Next.js (App Router) |
| AI/LLM | Not implemented in current runtime; deterministic heuristics only |
| Database/Storage | Postgres, Redis |
| Framework | REST + Zod runtime contracts, BullMQ for queueing |
| Deployment | Railway (backend and state services), frontend hosted separately |

Use whatever stack helps you ship. Complete the Pre-Search process to make informed decisions.

## Build Strategy

### Priority Order

1. Implement event contract, persistence model, and idempotency guardrails.
2. Build fundraiser page donation flow with transparent tipping and trust context.
3. Build notification center and follow model using event outputs.
4. Build community feed plus recommendation heuristic and similar-campaign module.
5. Build profile page with badges and trust metrics.
6. Implement charity starter wizard and charity-fundraiser linkage.
7. Instrument telemetry, dashboards, alerts, and runbooks for critical paths.
8. Harden mobile responsiveness, accessibility, and test coverage before final polish.

### Critical Guidance

- Start with the hardest subsystem (event pipeline), not page chrome.
- Keep domain logic server-side; UI should render state and invoke explicit actions.
- Prefer deterministic heuristics first, then add optional AI enhancements behind flags.
- Make every external side effect idempotent and traceable by event ID.
- Validate with realistic long titles, large amounts, empty states, and failure states.

## Required Documentation

Because this project includes AI-assisted content and architecture tradeoffs, include a 1-2 page architecture document.

| Section | Content |
| --- | --- |
| System Diagram | Request flow for fundraiser/community/profile plus event fan-out to notifications, badges, and discovery. |
| Data Contracts | Core schemas (`PlatformEvent`, `UserNotification`, badge criteria, recommendation reason). |
| Decision Log | Key architecture choices, rejected alternatives, and tradeoffs. |
| Reliability Plan | Idempotency strategy, retry policy, dedupe model, and failure handling. |
| Observability Plan | Metrics, traces, logs, SLOs, and alert thresholds with ownership. |
| AI Usage and Cost | AI endpoints, controls, budget limits, and fallback behavior. |

## Submission Requirements

Deadline: Sunday 10:59 PM CT

| Deliverable | Requirements |
| --- | --- |
| GitHub Repository | Clean README, setup instructions, architecture notes, and passing test commands. |
| Demo Video (3-5 min) | Show end-to-end flows: discovery -> fundraiser -> donation -> notification -> profile trust signals. |
| Pre-Search Document | Completed artifact at `docs/pre-search.md` with explicit architecture decisions. |
| Domain-Specific Docs | Event orchestration notes, API contracts, and notification/badge/recommendation behavior docs. |
| Deployed Application | Public URL with working fundraiser, community, and profile experiences. |
| Social Post | Public post summarizing build and learnings, tagging @GauntletAI. |

## Interview Preparation (if gate includes interviews)

This gate is project-completion only. Interview prep is optional but recommended.

### Technical Topics

- Why you chose your event contract and idempotency mechanism.
- Tradeoffs between heuristic ranking and learned ranking for recommendations.
- Notification relevance controls vs engagement maximization tension.
- Horizontal scaling strategy for read-heavy feeds and bursty event writes.
- Observability design for identifying conversion regressions quickly.
- Mobile responsiveness implementation choices and accessibility tradeoffs.

### Mindset & Growth

- What you intentionally cut to preserve reliability.
- Where you changed design after instrumentation data.
- How you handled ambiguity in requirements and preserved velocity.
- What you would ship next with one additional week.

## Final Note

A simple platform with reliable event-driven trust loops beats a complex platform with noisy, untraceable engagement logic.

Gate requirement remains: project completion is required for Austin admission.

## Appendix: Pre-Search Checklist

Complete this before writing code. Save your AI conversation as a reference document at `docs/pre-search.md`.

### Phase 1: Define Your Constraints

#### 1) Scale and Load Model

- How many daily active users do you design for on day 1, month 1, and month 6?
- What are expected peak writes per minute for donation and notification events during a viral campaign?
- Which endpoints are read-heavy versus write-heavy, and where do you expect burst traffic?
- What latency budgets matter most for user trust (donation confirmation, notification display, feed load)?

#### 2) Budget and Cost Envelope

- What monthly hosting budget are you targeting for MVP and where can you exceed briefly?
- What is your maximum acceptable AI spend as a percentage of total infra spend?
- Which expensive operations will be cached, batched, or deferred?
- What are your cost-kill switches when traffic spikes unexpectedly?

#### 3) Timeline and Delivery Scope

- Which requirements are strict MVP versus stretch by Sunday deadline?
- Which 24-hour checkpoint deliverables prove architecture viability fastest?
- What scope cuts preserve trust and correctness while reducing build risk?
- What polish work can wait until after end-to-end reliability is proven?

#### 4) Compliance, Data Sensitivity, and Risk

- What PII is stored for donors/organizers and where is it redacted in logs?
- Which actions require explicit audit trails (donation, notification preference changes, payouts)?
- How will you avoid exposing restricted fundraiser information to unrelated users?
- What retention strategy applies to events, notification history, and debugging traces?

#### 5) Team and Skills Reality

- Which parts of the stack are you strongest in and should anchor your architecture?
- Which feature areas are highest uncertainty (AI summaries, event bus, responsive UI)?
- Where do you need templates/boilerplate to avoid custom framework work?
- Which integrations can you stub early to unblock UI and tests?

### Phase 2: Architecture Discovery

#### 1) Data and Event Modeling

- What canonical entities exist (`User`, `Fundraiser`, `Community`, `Profile`, `Charity`, `Notification`, `Badge`)?
- What is your event naming convention and versioning strategy?
- How do you ensure every event contains `eventId`, `timestamp`, actor, and target context?
- Which events are command-like versus fact-like, and why does that matter downstream?

#### 2) Notification Architecture

- How is follow eligibility evaluated across donor, organizer, beneficiary, and manual follower roles?
- Where are dedupe keys generated and how long are they retained?
- How are bundling windows configured for donation bursts and milestone cascades?
- What is the fallback when push/email enqueue fails but in-app state succeeds?

#### 3) Discovery and Ranking Design

- How will you compute the heuristic score weights (interest, donation similarity, trending boost)?
- Which features are precomputed batch jobs versus request-time calculations?
- How will recommendation reasons be generated and exposed safely to users?
- What exploration percentage (10-20%) will you inject to reduce filter bubbles?

#### 4) Badge Evaluation Strategy

- Which badges are event-triggered versus scheduled re-evaluations?
- How do you avoid badge spam and enforce quality thresholds?
- What ranking rules decide top 3-5 visible badges per surface?
- How will badge assignment remain idempotent under retries and replay?

#### 5) Donation and Tip UX Architecture

- How is tip selection captured as an explicit user action (not passive default)?
- What server-side validation prevents malformed donation/tip totals?
- How do you represent money values to avoid rounding bugs?
- Where do you display transparent tip-use explanations without harming conversion?

#### 6) Charity Starter Kit Flow

- What minimum fields are required to launch a charity in under 2 minutes?
- How are charity entities linked to multiple fundraisers in data and UI?
- What legal disclaimer copy is mandatory in MVP?
- Which advice endpoints are optional behind feature flags versus required?

### Phase 3: Post-Stack Refinement

#### 1) Security and Failure Modes

- What happens if the event store write succeeds but downstream processors fail?
- How will you retry safely without duplicate notifications or badge grants?
- Which endpoints require stricter rate limits to prevent abuse?
- How are authorization checks enforced for profile edits and organizer actions?

#### 2) Testing Strategy

- Which business rules get unit tests first (dedupe, ranking score, badge eligibility)?
- Which end-to-end flows are mandatory in CI before deployment?
- How will you test mobile layouts across required viewport matrix quickly?
- What synthetic tests validate notification timeliness SLOs?

#### 3) Tooling and Developer Workflow

- Which local/dev data seed strategy makes realistic scenarios easy to reproduce?
- How will you run parallel processors (API + worker) in development?
- What migration strategy keeps schema and code consistent across environments?
- How are environment secrets managed across preview and production?

#### 4) Deployment and Scalability

- What is your deployment topology for frontend, API, workers, DB, and cache?
- Which components scale horizontally first under load?
- What caching layers improve feed/profile reads without stale critical state?
- What rollback strategy is defined for bad releases affecting donation flow?

#### 5) Observability and Operations

- Which dashboards must exist before final submission (conversion, latency, errors, queue lag)?
- What alert thresholds trigger incident response for notification and donation paths?
- Which runbooks cover top failure modes and who owns each response step?
- How will you correlate user-reported issues to traces and event IDs quickly?
