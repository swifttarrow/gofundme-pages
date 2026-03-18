# GoFundMe Transparent Tipping System — Product Spec

## 1. Overview

Redesign GoFundMe’s tipping experience to:

* Increase **transparency** around where tips go
* Improve **user trust and perception**
* Make tipping feel **intentional rather than defaulted**
* Set a **new default tip of 10%** (down from current higher defaults)

This system introduces:

* Clear explanations of tip usage
* Visual breakdowns of impact
* Explicit, user-controlled tipping decisions
* Stronger UX signaling (vs. passive acceptance)

---

## 2. Problem Statement

### Current Issues

* Users often **misinterpret tips as platform fees**
* Default tip values feel **preselected / nudged**, leading to distrust
* Lack of clarity on:

  * What the tip funds
  * Why tipping matters
* Prior backlash indicates perception of **deceptive monetization**

### User Pain

> “Am I being charged extra without realizing it?”

### Business Risk

* Reduced trust → lower conversion
* Negative sentiment → brand damage
* Lower repeat donation rates

---

## 3. Goals

### Primary Goals

* Increase **tip transparency comprehension** (target: +30%)
* Increase **user trust score** (survey/NPS)
* Maintain or improve **tip conversion rate**

### Secondary Goals

* Improve **repeat donor rate**
* Reduce **support tickets / complaints about fees**

---

## 4. Key Principles

1. **Clarity over optimization**
2. **User control over defaults**
3. **Explain value, not just cost**
4. **No dark patterns**

---

## 5. UX / UI Changes

## 5.1 Tip Module Redesign

### Before

* Preselected tip %
* Minimal explanation
* Easily overlooked

### After

#### A. Explicit Tip Section

* Dedicated section titled:
  **“Support GoFundMe (optional)”**

* Subtext:

  > “Your tip helps keep GoFundMe free for people raising money.”

---

#### B. Default Tip: 10%

* Preselected: **10%**
* Clearly labeled:

  * “Recommended”
  * NOT visually dominant vs other options

---

#### C. Tip Selector UI

Options:

* 0%
* 5%
* **10% (default)**
* 15%
* 20%
* Custom slider/input

---

#### D. Cost Transparency

Display clearly:

```
Donation: $100
Tip (10%): $10
Total charged: $110
```

---

## 5.2 “Where Your Tip Goes” Breakdown

Add expandable section:

### CTA:

**“See how your tip helps”**

### Expanded View:

* Payments processing
* Platform infrastructure (hosting, uptime)
* Fraud prevention & safety
* Customer support
* Product improvements

---

## 5.3 Impact Visualization

Add lightweight visual:

* “Your $10 tip helps:

  * Process ~3 donations
  * Support fraud detection systems
  * Keep fundraisers free”

(This can be approximate / illustrative)

---

## 5.4 Inline Trust Messaging

Near tip selector:

> “100% of your donation goes to the fundraiser. Tips support GoFundMe.”

---

## 5.5 Removal of Dark Patterns

* No hidden defaults
* No confusing language (“fees” vs “tips”)
* No misleading preselection styling

---

## 6. Behavioral UX Improvements

### A. Active Choice Requirement

* Require user interaction:

  * Must confirm tip (even if keeping default)
  * Prevent passive acceptance

---

### B. Post-Selection Confirmation

Small inline confirmation:

> “You chose to tip 10% to support GoFundMe”

---

### C. Optional Reinforcement

After donation:

> “Thanks for supporting both this fundraiser and the platform 💛”

---

## 7. Experimentation Plan

### A/B Tests

#### Test 1: Default Tip Level

* 10% vs 12% vs no default

#### Test 2: Transparency Module

* With vs without breakdown section

#### Test 3: Impact Messaging

* Numeric vs narrative vs none

---

### Success Metrics

| Metric            | Target                     |
| ----------------- | -------------------------- |
| Tip opt-in rate   | Maintain or +5%            |
| Avg tip %         | Slight decrease acceptable |
| Conversion rate   | +3–5%                      |
| Repeat donor rate | +5–10%                     |
| Trust/NPS         | +10 pts                    |

---

## 8. Why This Matters

### 8.1 Trust → Retention → Revenue

Transparent systems build trust, which drives:

* Higher **repeat donations**
* Stronger **platform loyalty**
* Increased **lifetime value (LTV)**

---

### 8.2 Fixing Historical Perception Issues

GoFundMe has faced criticism that tipping:

* Feels mandatory
* Is not clearly explained

This redesign:

* Reframes tipping as **voluntary support**
* Removes perception of **hidden fees**

---

### 8.3 Long-Term Revenue Optimization

Even if:

* Average tip % decreases slightly

We expect:

* More users willing to tip over time
* Higher retention → more donations → more total tips

---

### 8.4 Competitive Differentiation

Position GoFundMe as:

> “The most transparent fundraising platform”

---

## 9. Risks & Mitigations

| Risk                           | Mitigation                          |
| ------------------------------ | ----------------------------------- |
| Lower short-term tip revenue   | Offset via higher trust + retention |
| Users choose 0% more often     | Improve value messaging             |
| UI friction reduces conversion | Keep UX lightweight                 |

---

## 10. Future Enhancements

* Personalized tip suggestions based on behavior
* “Tip history” in user profile
* Subscription-style supporter model
* Donor badges for platform supporters

---

## 11. Summary

This redesign shifts tipping from:

> **Passive, ambiguous, and mistrusted**

to:

> **Explicit, transparent, and value-driven**

Result:

* Higher trust
* Better user experience
* Stronger long-term revenue

---