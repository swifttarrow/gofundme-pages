# 🎤 Voice-First Fundraiser Creation (Mobile) — MVP Spec

## 🧭 Objective

Enable users (especially Gen Z) to create a complete fundraiser in **< 60 seconds** using voice as the primary input, eliminating traditional form friction.

---

## 🧠 Core Principles

1. **Voice is the default, not a feature**
2. **No blank canvas** → always guided
3. **AI does the heavy lifting** (structure, polish, optimize)
4. **Edit, don’t create** → user tweaks output, not build from scratch
5. **Fast → expressive → low pressure**

---

## 👤 Target User

* Mobile-first
* Comfortable with voice/video (TikTok, voice notes)
* Low patience for forms
* May not know how to “write a compelling fundraiser”

---

## 📱 Entry Points

* Primary CTA: **“Start a fundraiser”**
* Secondary:

  * Profile page CTA
  * Community page CTA
  * Post-donation upsell (“Start one yourself”)

---

## 🔄 User Flow (Happy Path)

### 1. Entry Screen — “Tell Your Story”

**UI:**

* Full-screen, minimal UI

* Large mic button (center)

* Prompt text:

  > “Tell your story. What happened, and what do you need help with?”

* Subtext:

  > “Just talk — we’ll handle the rest.”

* Secondary option: “Type instead”

**Actions:**

* Tap mic → recording starts
* Visual waveform + timer

---

### 2. Recording State

**UI:**

* Live waveform animation
* Timer (0:00 → 1:00 soft cap)
* Subtle prompts rotate:

  * “What happened?”
  * “Who is this for?”
  * “How will funds be used?”

**Controls:**

* Stop
* Pause
* Retry

**Constraints:**

* Ideal duration: 20–60 seconds
* Hard cap: 90 seconds

---

### 3. Processing State (AI Generation)

**UI:**

* Lightweight loading animation
* Copy:

  > “Turning your story into a fundraiser…”

**Backend (AI pipeline):**

* Speech-to-text transcription
* Content structuring
* Generation of:

  * Title (hook, ≤ 80 chars)
  * Summary (≤ 120 words)
  * Full story (expandable)
  * Suggested goal amount
  * Suggested fund allocation (optional bullets)
  * Category classification
  * Safety/moderation check

---

### 4. Review & Edit Screen (Core Screen)

**UI Structure:**

#### 🏷 Title (Editable)

* AI-generated hook
* Inline edit

#### ✨ Summary (Collapsed by default)

* Short, compelling preview

#### 📖 Full Story (Expandable)

* Cleaned + structured version of voice input

#### 💰 Goal Amount

* AI-suggested
* Editable

#### 🧾 Fund Breakdown (Optional)

* Bullet list (editable)

#### 🖼 Media

* Prompt: “Add a photo or video”
* Optional AI suggestion: extract frame if video recorded (future)

---

**Key UX:**

* Inline editing everywhere
* “Regenerate” button per section
* Tone control toggle:

  * More emotional
  * More direct
  * More detailed

---

### 5. Publish Screen

**UI:**

* Preview card (how others will see it)
* CTA: **“Publish fundraiser”**

**Optional toggles:**

* Share to community
* Notify friends

---

### 6. Success State

**UI:**

* Confirmation + subtle celebration
* Quick share options:

  * Copy link
  * Share to socials
  * Message contacts

---

## 🧩 Fallback / Alternative Flows

### ✍️ Typing Mode

* Accessible from entry screen
* Uses same AI pipeline (user types instead of speaks)

### 🔁 Re-record Flow

* Easy reset from review screen
* “Start over with voice”

---

## 🧠 AI System Requirements

### Input

* Voice audio (20–90 sec)

### Processing

1. Speech-to-text (high accuracy, filler removal optional)
2. Entity extraction:

   * Person, cause, urgency, amount
3. Generation:

   * Title (high emotional clarity)
   * Summary (conversion-optimized)
   * Body (structured narrative)
4. Post-processing:

   * Grammar + clarity cleanup
   * Safety/moderation filtering
   * Confidence scoring

---

## ⚠️ Risks & Mitigations

| Risk                               | Mitigation                                             |
| ---------------------------------- | ------------------------------------------------------ |
| Rambling / unfocused input         | Prompt guidance + AI structuring                       |
| Overly polished / inauthentic tone | Tone control + “closer to my words” toggle             |
| Privacy concerns                   | Clear “You can edit everything before publishing”      |
| AI hallucination                   | Strict grounding in transcript + confidence thresholds |
| User discomfort with voice         | Always-visible “Type instead”                          |

---

## 📊 Success Metrics (MVP)

### Primary

* % of users completing fundraiser creation
* Time to publish (target: < 2 min)

### Secondary

* Conversion rate (views → donations)
* Edit rate (how much users tweak AI output)
* Drop-off during recording vs. review

---

## 🚀 MVP Scope (What to build now vs later)

### ✅ MVP

* Voice recording
* Basic AI structuring (title, summary, story)
* Simple edit UI
* Publish flow

### 🔜 V2 Ideas

* Video-based creation (TikTok-style)
* AI-generated visuals
* Progress storytelling (“before/after” visuals)
* Social graph integration for instant sharing
* Real-time AI prompts أثناء recording

---

## 💡 Product Insight (important)

This feature is not:

> “voice dictation for a form”

It is:

> “a completely new creation primitive”

If executed well, this becomes:

* Faster than typing
* Less intimidating
* More emotionally compelling

