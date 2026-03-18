# Fundraiser Starter — Product Spec (MVP)

## Overview

Enable users to start a fundraiser quickly through a guided setup flow at `/fundraiser/new`.

## Core Flow: "Start a Fundraiser"

Entry points:
- CTA on homepage: "Start a Fundraiser"
- Primary navbar CTA: "Start a Fundraiser"
- Sign-in page upsell: "Start a fundraiser"

## MVP Scope

1. Guided starter wizard with clear, step-based setup
2. Transparency setup for planned fund usage
3. Funding milestones with editable amount + label
4. Review and launch step before publish

## UX Requirements

- Starter flow language must consistently use "Fundraiser" (not "Charity")
- Route for new starter flow must be `/fundraiser/new`
- `/charity/new` remains a separate flow for creating a nonprofit legal entity
- CTA copy should remain consistent across homepage, nav, and auth surfaces

## Metrics

- Starter CTA clicks by source (homepage, nav, sign-in)
- Start-to-launch conversion rate
- Median time to complete starter flow
- Drop-off by wizard step
