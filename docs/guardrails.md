# Guardrails Used For AI-Generated Work

This document captures the guardrails used while AI assisted with planning, implementation, and documentation for GoSupportMe.

It is intentionally focused on constraints and decision boundaries, not just feature goals. The main idea was to use AI as a constrained implementation assistant inside a requirements-driven workflow, rather than allowing unconstrained code generation.

## Scope

These guardrails apply to:

- AI-assisted planning and architecture work
- AI-assisted code and documentation generation
- Optional future AI product ideas discussed in planning docs

They do not mean the shipped application currently includes production AI features. The current runtime is deterministic and does not call a model provider.

## Core Principles

- Specs are the source of truth.
- Research and planning happen before implementation.
- Human confirmation is required at major phase boundaries.
- Reliability and trust constraints take priority over UI polish.
- Deterministic behavior is preferred over AI behavior in critical paths.
- Every important write path must be observable, testable, and safe under retries.

## Process Guardrails

### 1. Pre-Search Before Coding

The project required a completed pre-search artifact before implementation began. This was used to force explicit decisions on architecture, constraints, risks, testing, and operational posture before AI generated code.

Required pre-search topics included:

- Scale and load assumptions
- Budget and cost envelope
- Delivery scope and planned cuts
- Data sensitivity and risk
- Domain modeling
- Notification architecture
- Ranking and recommendation design
- Badge evaluation strategy
- Donation and tip UX validation
- Security, testing, deployment, and observability

### 2. Phase-Gated Workflow

AI work followed a staged workflow:

1. Research
2. Plan
3. Implement
4. Validate

This reduced one-shot generation risk and made it easier to review correctness at each stage.

### 3. Human Confirmation Checkpoints

Major milestones were expected to pause for human confirmation before proceeding. This guardrail prevented autonomous drift after architecture and milestone decisions were made.

### 4. Written Decision Trail

Important decisions were documented in:

- `docs/pre-search.md`
- `docs/architecture.md`
- `docs/developer-log.md`
- `docs/plans/`

This created an audit trail for why implementation choices were made and what tradeoffs were accepted.

## Product And Architecture Guardrails

### 1. Deterministic Event Model

The project centered on a canonical `PlatformEvent` contract. Events were required to include:

- `eventId`
- `occurredAt` or equivalent timestamp
- stable event type
- typed payload

This guarded downstream AI or non-AI generation from inventing ad hoc event formats.

### 2. Idempotency By Default

All event-driven side effects were expected to be safe under retries and replay.

Examples:

- event storage guarded by unique `eventId`
- notification writes deduped by user and dedupe key
- badge grants deduped by user and badge type
- replay expected to avoid duplicate side effects

This was one of the strongest guardrails in the repo because it constrained how generated code could write state.

### 3. Server-Side Business Logic

The system guidance explicitly favored domain logic on the server. The UI was expected to render state and invoke explicit actions, not contain hidden business rules.

This reduced the risk of AI scattering important logic across client components.

### 4. Shared Runtime Validation

The codebase standardized on Zod contracts for runtime validation. This guarded generated API and event handling code from accepting malformed or underspecified inputs.

### 5. Integer-Cents Money Model

All monetary logic was constrained to integer cents with server-side recomputation of totals. This reduced ambiguity and prevented AI from introducing float-based rounding issues in donation flows.

## Reliability Guardrails

### 1. Observability First

The requirements explicitly prioritized observability. Critical paths were expected to include:

- structured logs
- metrics
- trace or request correlation
- queue and latency visibility

This made the system measurable and limited invisible failures from generated code.

### 2. Stable Error Handling

The app was expected to return clear user-facing failures with retriable backend semantics and explicit fallback behavior.

### 3. Stateless And Horizontally Scalable Services

Runtime services were expected to avoid local-only state and be safe to scale horizontally. This constrained auth, worker, and API design choices away from sticky, manual, or stateful patterns.

### 4. Runbooks And Operational Docs

The submission required incident runbooks for high-risk flows such as donation degradation, recommendation failure, and notification delays. This forced AI-assisted implementation to consider recovery, not just happy paths.

## Testing Guardrails

### 1. Required Automated Verification

Plans and milestone docs required explicit automated verification such as:

- linting
- typechecking
- unit tests
- integration tests
- end-to-end tests

### 2. Required Manual Verification

Plans also required manual checks for:

- mobile responsiveness
- donation correctness
- notification dedupe behavior
- recommendation reason visibility
- graceful degradation and failure handling

### 3. Realistic Scenario Testing

The PRD pushed testing beyond happy paths by requiring checks for:

- duplicate event retries
- burst notification scenarios
- 320px mobile flows
- badge overflow
- recommendation changes after profile edits
- degraded dependency behavior

## AI-Specific Guardrails

### 1. AI Was Optional, Not Foundational

The planning docs allowed future AI-assisted features, but they were not allowed to become critical-path dependencies for the shipped MVP.

The preferred order was:

- deterministic heuristics first
- optional AI enhancements later
- feature flags and fallbacks if AI is added

### 2. Explicit Cost Controls

The planning docs introduced AI budget expectations and kill-switch concepts, including:

- capping AI spend relative to infra budget
- ability to disable AI-generated summaries
- deterministic fallback behavior when AI is disabled or over budget

### 3. No Production AI Runtime In Current App

The current shipped application does not include model-provider calls in runtime code.

Current documented state:

- no AI route handlers
- no checked-in AI SDK dependency
- no active production AI feature flag
- current production AI cost documented as `$0/month`

This is itself a strong guardrail: any optional AI idea remained outside the production critical path unless fully implemented with routing, dependencies, flags, instrumentation, and cost modeling.

### 4. Future AI Features Must Meet Extra Conditions

The repository guidance implies that AI features should not be treated as real until all of the following exist:

1. A concrete route or service that calls a model provider
2. A checked-in provider client or SDK
3. Feature flags
4. Token, latency, and error instrumentation
5. Revised cost modeling based on actual usage

## Practical Summary

The project used guardrails in five layers:

1. Requirements guardrails: PRD, checkpoint gates, and explicit deliverables
2. Process guardrails: research, plan, implement, validate
3. Technical guardrails: Zod validation, server-side logic, integer money, idempotent events
4. Reliability guardrails: observability, error handling, statelessness, runbooks
5. AI guardrails: optional only, budgeted, flaggable, and currently absent from production runtime

## What This Meant In Practice

In practice, AI was allowed to help with:

- synthesizing architecture choices
- drafting plans and documentation
- generating implementation scaffolding
- filling in code that matched the chosen contracts and constraints

AI was not supposed to:

- skip architecture and planning
- invent its own success criteria
- bypass validation and test expectations
- introduce non-idempotent side effects
- put opaque AI behavior in trust-critical product paths

## Bottom Line

GoSupportMe was generated with process and architecture guardrails that emphasized trust, determinism, and reviewability. The most important guardrail was not a model setting, but the combination of pre-search, phase gates, human confirmation, and reliability constraints that limited what AI-generated code was allowed to do.
