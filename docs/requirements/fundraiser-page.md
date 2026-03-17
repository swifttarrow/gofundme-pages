
# GoFundMe Fundraiser Page — Enhanced MVP Spec

## 1. Overview

This spec defines an improved Fundraiser Page experience optimized for:
- **High engagement within 30 seconds**
- **Mobile-first storytelling**
- **Guided manual creation with optional advice**
- **Audio/visual-first consumption**

The experience introduces:
1. Dual creation flows (**Form vs Quick**)
2. User-triggered advice (1-2 recommendations) to improve content quality
3. Lightweight media animation (photo -> short video)
4. Condensed, expandable UI for fast donor scanning

---

## 2. Goals

### Primary Goals
- Increase **conversion rate (viewer → donor)**
- Reduce **time to publish fundraiser**
- Improve **story clarity + emotional impact**

### Success Metrics
- % of fundraisers created via Quick/Form flows
- Conversion rate within first 30 seconds
- Avg. time to first donation
- Expand-click rate on story content
- Media interaction rate (plays, animations)

---

## 3. User Flows

## 3.1 Author / Creator Flow

### Entry Points
- “Start a Fundraiser” CTA
- Profile page CTA

### Two Creation Modes

#### A. Quick Mode (mobile optimized)
- User inputs:
  - Freeform text prompt (voice or text)
    - Example: “I need help covering my dog’s surgery after an accident”
- System provides:
  - A lightweight starter template
  - Suggested field ordering for faster completion
  - Optional advice button for 1-2 improvement recommendations

- User can:
  - Continue with starter template
  - Edit inline
  - Switch to Form Mode

---

#### B. Form Mode (Manual)

##### Fields
- Title (editable)
- Hook (1 sentence)
- Body (expandable)
- Donation target amount
- Optional fund allocation breakdown:
  - Categories (e.g. medical, rent, supplies)
  - Amount or percentage per category

##### Media Upload
- Up to 3 items (image or video)

##### Media Animation (NEW)
- Each uploaded image has:
  - “Animate” button
- On click:
  - Converts image → ~7 second video clip
  - Adds subtle motion (zoom, parallax, lighting)
- Output replaces or sits alongside original media

---

### Advice Features

#### 1. Advice Button (Body Editor)
- User-triggered recommendation pass:
  - Returns 1-2 concise suggestions to improve clarity/trust
  - Never auto-rewrites content
  - Keeps all final edits fully user-controlled
- Includes:
  - Optional refresh action
  - Clear fallback copy when advice is unavailable

---

### Preview Capability (Desktop Only)
- Toggle: “Preview as Mobile”
- Shows:
  - Fold behavior
  - Media-first layout
  - Expand interactions

---

## 3.2 Viewer / Donor Flow

### Core Assumption
Users spend **≤ 30 seconds**

---

### Page Structure (Top → Bottom)

#### 1. Hero Section (Above the Fold)
- Primary media (auto-play if video / animation)
- Title
- Hook (1 sentence)
- Progress bar
- Donation CTA

---

#### 2. Quick Trust Layer
- Organizer name
- Small trust signals:
  - Verified indicator (if applicable)
  - # of donors
  - Last update timestamp

---

#### 3. Story Section (Collapsed by Default)
- Shows:
  - Hook only
- “Read more” expands:
  - Full body

---

#### 4. Fund Allocation (Optional)
- Simple visual breakdown:
  - Categories + percentages
- Example:
  - Surgery: 60%
  - Medication: 25%
  - Recovery: 15%

---

#### 5. Media Carousel
- Includes:
  - Uploaded media
  - Animated clips
- Tap/click to expand full-screen

---

#### 6. Social Proof
- Recent donations (MVP: 3–5 items)
  - Name (or anonymous)
  - Amount
  - Optional short message

---

#### 7. Updates (MVP)
- Latest update only (collapsed)
- Expand to view more

---

## 4. Key Features (Deep Dive)

### 4.1 Advice for Fundraiser Content

#### Endpoint
`POST /api/advice/fundraiser`

#### Input
```

{
"title": string,
"hook": string,
"body": string,
"goal_amount": number,
"allocation": [{category, percentage}]
}

```

#### Output
```

{
"recommendations": [
  { "text": string }
],
"count": number
}

```

---

### 4.2 Media Animation

#### Endpoint
`POST /api/media/animate-image`

#### Input
- Image file

#### Output
- 7-second MP4 video

#### Constraints
- Max processing time: ~3–5s
- Fallback to static image if failed

---

## 5. UX Principles

### 5.1 Compression First
- Default = minimal text
- Expand on intent

### 5.2 Media > Text
- Visual storytelling prioritized

### 5.3 Fast Decision Making
- Donation CTA always visible above fold

### 5.4 Progressive Disclosure
- Details revealed only when requested

---

## 6. MVP Scope (Included vs Excluded)

### Included
- Dual creation flow (Quick + Form)
- Advice button with 1-2 recommendations
- Media animation (image → video)
- Mobile preview (desktop)
- Collapsible story UI
- Basic social proof
- Simple fund allocation

### Excluded (Future)
- Deep community integrations
- Comments / discussions
- Advanced personalization
- Multi-update feed
- Gamification / badges

---

## 7. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Advice quality is too generic | Keep 1-2 concrete, actionable recommendations only |
| Over-automation | Advice never auto-rewrites; user remains final editor |
| Slow media processing | Async + placeholder UI |
| Low trust in advice output | Label as optional "Advice", not generated copy |

---

## 8. Open Questions

- Should animated media autoplay by default?
- How strict should advice wording be for tone and specificity?
- Should fund allocation affect donor trust scoring?
- What is the ideal default donation suggestion?

---

## 9. Future Extensions

- Personalized donor messaging (“why this matters to you”)
- Advice summaries for fundraiser updates
- Before/after progress visualization tied to funding %
- Voice-based storytelling playback

---
