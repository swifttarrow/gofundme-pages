# Fundraiser Page Spec

## Overview
A fundraising detail page that communicates urgency, trust, and ease of donation. Optimized for conversion.

---

## Core Layout

### 1. Hero Section
- Cover media (image/video carousel)
- Fundraiser title
- Organizer + beneficiary attribution
- Primary CTA:
  - "Donate now"
  - "Share"

### 2. Progress & Social Proof
- Amount raised vs goal
- % progress bar
- # of donations
- Avatars of recent donors
- Optional:
  - “Top donations”
  - “Recent donations”

> Example: "$2,102 raised of $3K · 21 donations" :contentReference[oaicite:0]{index=0}

---

### 3. Story Section
- Expandable description ("Read more")
- Includes:
  - Problem statement
  - Why it matters
  - Use of funds
  - Emotional narrative

> Typical content: explains cause, urgency, and impact of donations :contentReference[oaicite:1]{index=1}

---

### 4. Donation Module (Sticky on desktop)
- Suggested donation amounts
- Custom input
- Tip to platform
- Payment CTA
- Trust signals:
  - Secure payments
  - Guarantee messaging

---

### 5. Organizer & Beneficiary Section
- Organizer profile:
  - Name
  - Location
- Beneficiary:
  - Individual or nonprofit
- Metadata:
  - Date created
  - Category
  - Tax deductible flag

---

### 6. Donations Feed
- List of donors
- Amount donated
- Optional message
- Sorting:
  - Top
  - Recent

---

### 7. Trust & Safety Section
- Messaging:
  - “Easy, Powerful, Trusted”
- Links:
  - Guarantee
  - Fraud reporting

> GoFundMe emphasizes trust & safety prominently :contentReference[oaicite:2]{index=2}

---

## Functional Requirements

### Donation Flow
- One-click donate (saved payment)
- Multi-step fallback flow
- Support for:
  - Anonymous donation
  - Recurring donation (optional)

### Sharing
- Copy link
- Social share (FB, X, etc.)
- Native mobile share

### Content
- Expand/collapse story
- Media gallery navigation

---

## Non-Functional Requirements

- Page load < 2s
- Mobile-first design
- High trust UX (clear attribution + guarantee)
- Accessibility (WCAG AA)

---

## Key Metrics

- Conversion rate (view → donate)
- Avg donation amount
- Share rate
- Scroll depth