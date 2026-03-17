# GoFundMe Profile Page — MVP Requirements

## Overview
The profile page should present a user's identity, social context, and credibility signals while remaining privacy-safe and easy to scan.

## Core Requirements
- Show profile header, cause footprint, connected communities, and achievement badges.
- Render graph-based context modules with deterministic ranking and explainable reason labels.
- Support responsive behavior across mobile, tablet, and desktop layouts.

## Advice Button Requirement
- Include a "Get advice" button on the profile page.
- On click, return 1-2 concise recommendations for improving profile/campaign-related content.
- Advice is optional and user-triggered only; never auto-edit content.
- If advice is unavailable, show a non-blocking fallback message.

## Reliability and Privacy
- Never expose private donor identity in advice or graph sections.
- If graph or advice dependencies fail, keep the profile page readable with safe fallback content.
