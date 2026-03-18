# GoFundMe Content Discovery System Spec (MVP)

## Overview

Introduce a personalized content discovery system that surfaces fundraisers, campaigns, and charities based on:

1. User donation history (behavioral signals)
2. Explicit interests selected during onboarding
3. Lightweight engagement signals (views, shares, likes)

Goal: Increase repeat donations, session duration, and discovery of relevant causes.

---

## Goals

### Primary Goals
- Increase repeat donor rate
- Increase average donations per user
- Improve fundraiser visibility (long-tail campaigns)

### Secondary Goals
- Improve user retention (DAU/WAU)
- Reduce reliance on external traffic (social sharing)

---

## Key Features (MVP)

### 1. Personalized Discovery Feed

#### Description
A dynamic feed on the homepage displaying recommended content:
- Fundraisers
- Charities
- Community campaigns

#### Inputs
- Donation history (category, amount, recency)
- Onboarding interests (e.g. healthcare, disaster relief, animals)
- Engagement signals (clicks, dwell time)

#### Ranking Logic (MVP Heuristic)
```

Score =
(0.5 * Interest Match) +
(0.3 * Similar Donation History) +
(0.2 * Trending Boost)

```

#### UI Components
- "Recommended for You" feed (scrollable)
- Cards with:
  - Title
  - Image/video
  - Short AI-generated summary (<=120 words)
  - Progress bar (goal vs raised)
  - Cause tag (badge)

---

### 2. Similar Campaigns Module

#### Description
On each fundraiser page, show similar campaigns.

#### Placement
- Below main campaign content
- Also appears after donation confirmation

#### Matching Criteria
- Category similarity
- Keyword similarity (title/body embeddings)
- Donor overlap (users who donated to X also donated to Y)

#### UI
- Horizontal scroll carousel
- Label: "Similar causes you may care about"

---

### 3. Interest-Based Exploration

#### Description
Users can explicitly explore categories tied to their interests.

#### Features
- Interest tags selectable during onboarding
- Editable in profile settings

#### Categories (MVP)
- Medical
- Education
- Emergency
- Animals
- Nonprofits
- Community

#### UI
- Chips/tags at top of discovery feed
- Tap to filter feed

---

### 4. Lightweight Onboarding for Preferences

#### Trigger
- New users
- Existing users (soft prompt)

#### Flow
- Select 3–5 causes of interest
- Optional: “What motivates you?” (personal story, local impact, etc.)

#### Output
- Stored as `user_interest_profile`

---

### 5. Trending + Local Hybrid Layer

#### Description
Blend personalization with global signals.

#### Trending Signals
- Donation velocity
- Page views
- Social shares

#### Local Signals (if location available)
- Campaigns near user
- Regional emergencies

#### UI Sections
- "Trending Now"
- "Near You"

---

## Backend Requirements

### 1. User Profile Service

#### Schema
```

user_profile {
user_id
interests: [tags]
donation_history: [
{campaign_id, category, amount, timestamp}
]
engagement_events: [
{type, campaign_id, timestamp}
]
}

```

---

### 2. Recommendation Service (MVP)

#### Endpoint
```

GET /api/recommendations?user_id=<id>

```

#### Response
```

{
recommendations: [
{
campaign_id,
score,
reason: "Based on your interest in medical causes"
}
]
}

```

#### Implementation (MVP)
- Rule-based scoring (no ML required initially)
- Precomputed similarity (batch jobs)

---

### 3. Campaign Embeddings (Optional but High Value)

#### Purpose
Enable semantic similarity

#### Method
- Use text embeddings on:
  - Title
  - Description
  - Tags

#### Storage
- Vector DB (e.g. Pinecone, FAISS)

---

### 4. Event Tracking

Track:
- Feed impressions
- Click-through rate (CTR)
- Donation conversions
- Scroll depth

---

## Frontend Requirements

### Pages Impacted
- Homepage (primary discovery surface)
- Fundraiser page (similar campaigns)
- Profile (interest management)

---

### Mobile Optimization

- Feed is swipe-first, vertical scroll
- Cards optimized for thumb interaction
- Lazy loading for performance

---

## AI Enhancements (Optional for MVP+)

- AI-generated summaries for campaigns
- Cause classification (auto-tagging)
- “Why this was recommended” explanations

---

## Metrics & Success Criteria

### Core Metrics
- Repeat donation rate ↑
- CTR on recommendations ↑
- Conversion rate from feed ↑

### Supporting Metrics
- Time spent on platform
- Number of campaigns viewed per session

---

## Risks & Mitigations

### Risk: Irrelevant Recommendations
- Mitigation: Include “Not interested” feedback loop

### Risk: Filter Bubble
- Mitigation: Inject 10–20% exploration content

### Risk: Cold Start (New Users)
- Mitigation:
  - Use onboarding interests
  - Fall back to trending

---

## Future Iterations

- ML-based ranking (collaborative filtering)
- Social graph integration (friends’ donations)
- Push/email notifications for new relevant campaigns
- “Follow a cause” feature

---

## Summary

This system shifts GoFundMe from:
- Static, search-driven discovery

To:
- Personalized, behavior-driven discovery

Expected impact:
- Higher engagement
- Increased donations
- Better visibility for long-tail campaigns