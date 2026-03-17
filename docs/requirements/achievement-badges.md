# Achievement Badges Spec (GoFundMe-style Platform)

## 1. Overview

Achievement badges are **earned signals of credibility, momentum, and community engagement** displayed on user profiles, fundraisers, and community posts.

They serve three core purposes:

* **Trust** → Increase donor confidence
* **Engagement** → Encourage positive organizer behaviors
* **Social proof** → Highlight meaningful progress and activity

---

## 2. Goals & Success Metrics

### Primary Goals

* Increase **donation conversion rate**
* Increase **repeat donor rate**
* Encourage **high-quality organizer behaviors** (updates, transparency, sharing)

### Success Metrics

* % lift in donation conversion (A/B vs control)
* Avg. donations per fundraiser
* Organizer activity rate (updates/week)
* Badge interaction CTR (hover, click, filter usage)
* Retention of fundraisers > 7 days

---

## 3. Badge System Design

### 3.1 Badge Categories

Badges are grouped into 4 categories:

#### A. Trust & Credibility

* Verified Identity
* Verified Beneficiary
* Transparent Organizer
* External Validation (news, nonprofit tie-in)

#### B. Momentum & Performance

* Trending
* Fully Funded
* 50% Milestone
* Rapid Growth (e.g. $X in 24h)

#### C. Engagement & Effort

* Frequent Updates
* Community Builder (comments, replies)
* Story Completeness
* Media Rich (images/video)

#### D. Social Proof

* First 10 Donors
* 100+ Donors
* Repeat Donors
* Influencer Amplified

---

### 3.2 Badge Properties

Each badge includes:

```ts
type Badge = {
  id: string
  name: string
  category: "trust" | "momentum" | "engagement" | "social"
  description: string
  icon: string
  tier?: "bronze" | "silver" | "gold"
  earnCriteria: BadgeCriteria
  visibility: "public" | "internal"
  expires?: boolean
}
```

---

### 3.3 Badge Criteria (Examples)

```ts
type BadgeCriteria =
  | { type: "donation_count"; threshold: number }
  | { type: "amount_raised"; threshold: number }
  | { type: "update_frequency"; per_days: number }
  | { type: "profile_completion"; percentage: number }
  | { type: "verification"; method: "id" | "bank" | "ngo" }
  | { type: "velocity"; amount: number; timeframe_hours: number }
```

---

## 4. Example Badge Definitions

### 4.1 Trust Badge

**Verified Organizer**

* Criteria: ID verification completed
* Impact: High trust boost
* UI: Shield icon

---

### 4.2 Momentum Badge

**Trending Now**

* Criteria: Top X% donation velocity in category
* Expires: Yes (24–48 hrs)
* UI: Flame icon

---

### 4.3 Engagement Badge

**Consistent Storyteller**

* Criteria: ≥3 updates in last 7 days
* UI: Pen / story icon

---

### 4.4 Social Proof Badge

**Community Supported**

* Criteria: ≥50 unique donors
* UI: Group icon

---

## 5. Badge Tiers (Optional)

Some badges can tier:

Example:

* Community Supported

  * Bronze: 10 donors
  * Silver: 50 donors
  * Gold: 200 donors

---

## 6. Placement & UX

### 6.1 Fundraiser Page

* Badge strip under title
* Hover → explanation tooltip
* Click → “Why this matters” modal

### 6.2 Profile Page

* Badge grid (earned + locked)
* Progress indicators (gamification)

### 6.3 Community Feed

* Badge chips on posts
* Filters (e.g. “Show verified only”)

---

## 7. Ranking & Display Logic

Not all badges shown at once.

### Rules:

* Max 3–5 badges displayed prominently
* Prioritize:

  1. Trust
  2. Momentum
  3. Social Proof
  4. Engagement

```ts
function selectTopBadges(badges: Badge[]): Badge[] {
  return sortByPriority(badges).slice(0, 5)
}
```

---

## 8. Backend Design

### 8.1 Badge Service

Endpoints:

```
POST /badges/evaluate
GET /users/{id}/badges
GET /fundraisers/{id}/badges
```

---

### 8.2 Evaluation Strategy

Two models:

#### A. Event-driven (preferred)

* Trigger on:

  * Donation created
  * Update posted
  * Profile edited
* Emit event → badge evaluation worker

#### B. Scheduled jobs

* For time-based badges (e.g. trending)

---

### 8.3 Idempotency

Badge assignment must be idempotent:

```ts
if (!user.hasBadge(badgeId)) {
  assignBadge(user, badgeId)
}
```

---

## 9. Analytics & Instrumentation

Track:

```ts
badge_impression
badge_hover
badge_click
donation_after_badge_view
badge_earned
```

Key question:

> Do badges actually increase trust → donation?

---

## 10. Risks & Mitigations

### Risk: Gamification abuse

* Users spam updates to earn badges
  → Mitigation: quality thresholds (length, engagement)

### Risk: Misleading trust signals

→ Require strong verification for trust badges

### Risk: Badge overload

→ Limit visible badges + prioritize

### Risk: Inequality (new fundraisers disadvantaged)

→ Include **“New but Active”** style badges

---

## 11. Future Extensions

* Advice-informed "confidence badges" (content quality, clarity)
* Personalized badges (“Your network is supporting this”)
* Dynamic badges tied to donor preferences
* Badge-based search filters

---

## 12. MVP Scope (Recommended)

Start with ~6 badges:

1. Verified Organizer
2. 50% Funded
3. Trending
4. 10 Donors
5. Frequent Updates
6. Story Complete

This gives:

* Trust
* Momentum
* Social proof
* Engagement

…without overwhelming the UI or backend.

---