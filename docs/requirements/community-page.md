# GoFundMe Community Page — MVP Redesign Spec

## Overview
This spec defines a redesigned GoFundMe Community Page that shifts the experience from a static aggregation of fundraisers into a **mission-driven participation hub**.

The MVP will:
- Preserve core existing functionality (fundraiser list, activity feed, leaderboard)
- Introduce 3 high-leverage improvements:
  1. Mission Dashboard (shared goal + progress)
  2. Structured Activity Feed (prioritized, labeled updates)
  3. Supporter Participation Layer (non-organizer engagement)

---

## Goals

### Primary Goals
- Increase donation conversion from community pages
- Increase fundraiser creation from community pages
- Increase repeat visits and session depth
- Enable lightweight participation beyond donations

### Secondary Goals
- Improve clarity of community purpose
- Surface high-signal content (urgency, momentum, impact)
- Strengthen sense of belonging and identity

---

## Non-Goals
- Full social network features (chat, DMs, etc.)
- Complex recommendation systems
- Deep gamification economy
- Rebuilding fundraiser creation flows

---

## Target Users

### 1. Donors
- Want to quickly understand impact
- Want to know where their money matters most

### 2. Organizers
- Want visibility and traction
- Want to feel part of a larger movement

### 3. Supporters (New Focus)
- Not ready to start a fundraiser
- Want lightweight ways to participate and belong

---

# Core Improvements

---

## 1. Mission Dashboard

### Problem
Users see past performance but lack clarity on:
- What the community is currently trying to achieve
- How close they are to a goal
- Why they should act now

### Solution
Introduce a **Mission Dashboard** at the top of the page.

### Features
- Mission headline
- Short mission description
- Progress bar (toward goal)
- Milestones (optional)
- Deadline or countdown (optional)
- Primary CTAs:
  - Donate
  - Start Fundraiser
  - Follow
  - Share

### Example
> “Help fund wildfire alert coverage for 200,000 more people”

### Data Model
```

community_goal {
id
title
description
target_amount
current_amount
milestones[] {
threshold
label
}
deadline (optional)
}

```

### MVP Scope
- Single active goal per community
- Linear progress bar
- Static milestone definitions (no dynamic unlock logic)

### Success Metrics
- CTR on primary CTAs
- Donation conversion rate
- Fundraiser creation rate
- Follow rate

---

## 2. Structured Activity Feed

### Problem
The current feed is unstructured and low-signal:
- Important updates are buried
- Users cannot quickly identify urgency or impact

### Solution
Transform feed into a **Mission Feed** with categorized and prioritized content.

### Post Categories (Auto-assigned)
- `urgent_need`
- `milestone`
- `gratitude`
- `impact_proof`
- `organizer_update`
- `discussion`

### Feed Modules
- Top Updates
- Near Goal
- Needs Support
- New This Week

### Post Card Enhancements
- Category badge
- Fundraiser progress snippet (if linked)
- Highlighted metrics (e.g., “95% funded”)
- Media preview (if available)

### Ranking Logic (MVP)
Simple heuristic-based scoring:
- Near goal boost
- High recent activity boost
- Urgent tag boost

### Data Model
```

community_post {
id
content
category
linked_fundraiser_id (optional)
created_at
engagement_score
}

```

### MVP Scope
- Rule-based classification (no ML required)
- Basic ranking (no personalization)
- No commenting system (read-only feed)

### Success Metrics
- Feed engagement rate
- Clickthrough to fundraiser pages
- Donation conversion from feed
- Time on page

---

## 3. Supporter Participation Layer

### Problem
Users have limited ways to engage unless they:
- Donate
- Start a fundraiser

This excludes a large group of potential contributors.

### Solution
Enable lightweight participation and visible identity.

---

### A. Supporter Identity

#### Features
- “Support this mission” CTA
- Public supporter count
- Optional supporter list (avatars)
- Optional “Why I support” snippet

#### Data Model
```

community_supporter {
user_id
community_id
created_at
message (optional)
}

```

---

### B. Contribution Actions

#### Features
- Share community
- Invite friends
- Boost fundraiser near goal
- React to updates (like/endorse)

#### MVP Scope
- Share (native + link copy)
- Simple “boost” CTA (redirect to donation)
- Lightweight reactions (like only)

---

### C. Recognition Layer

#### Features
Expand beyond money-only leaderboard:
- Top Fundraisers
- Top Supporters (by actions)
- Weekly Movers

#### MVP Scope
- Keep existing leaderboard
- Add 1 additional module: “Supporters this week”

---

### Success Metrics
- Supporter conversion rate
- Share rate
- Weekly active users
- Repeat visits
- Actions per user (non-donation)

---

# Existing Features (MVP Retained)

### Community Header
- Name
- Description
- Hero image
- Follow button

### Stats Summary
- Total raised
- Number of donations
- Number of fundraisers

### Fundraiser Directory
- List of fundraisers
- Progress bars
- “Show more” pagination

### Leaderboard
- Ranked fundraisers by amount raised

### About + Guidelines
- Static content

---

# Page Architecture

## Layout Order

1. Community Header
2. Mission Dashboard (NEW)
3. Primary Actions (Donate / Start / Follow / Share)
4. Highlights Rail
   - Near Goal
   - Trending
   - Milestone
5. Mission Feed (Enhanced)
6. Fundraiser Directory
7. Leaderboard + Supporters
8. About + Guidelines

---

# User Flows

## Flow: New Visitor → Donor
1. Lands on page
2. Sees Mission Dashboard
3. Scrolls to “Near Goal”
4. Clicks fundraiser
5. Donates

## Flow: Passive User → Supporter
1. Lands on page
2. Clicks “Support this mission”
3. Appears in supporter list
4. Shares community

## Flow: Engaged User → Organizer
1. Sees community momentum
2. Clicks “Start Fundraiser”
3. Creates fundraiser tied to community

---

# Instrumentation

### Key Events
- `community_viewed`
- `goal_cta_clicked`
- `fundraiser_clicked`
- `donation_initiated`
- `supporter_joined`
- `community_shared`

### Key Funnels
- View → Donate
- View → Support
- View → Start Fundraiser

---

# Risks & Mitigations

### Risk: Low-quality or misclassified posts
- Mitigation: allow fallback to “uncategorized”

### Risk: Empty states (new communities)
- Mitigation:
  - Hide modules when empty
  - Default to “Start the first fundraiser”

### Risk: Over-complexity
- Mitigation:
  - Keep logic rule-based
  - Avoid personalization in MVP

---

# MVP Summary

This MVP does not attempt to rebuild the platform.

Instead, it:
- Clarifies **what the community is doing**
- Highlights **where help is needed most**
- Expands **how users can participate**

The result is a Community Page that feels:
- More actionable
- More social
- More alive
