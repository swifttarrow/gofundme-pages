# 🧾 GoFundMe — Create a Charity (MVP Spec)

## 🎯 Goal

Enable users to request the creation of a charity on GoFundMe through a **simple, guided flow**, with **manual review by GoFundMe staff** to ensure trust and legitimacy.

---

# 🧠 Core Principles

* **Simple > Complete** (reduce intimidation)
* **Trust-first** (everything is reviewed before going live)
* **One at a time** (prevents spam + low-quality submissions)

---

# 🚪 Entry Points

* Profile page → “Start a Charity”
* Fundraiser page → “Turn this into a Charity”
* Community page → “Create a Charity”

---

# 🧩 Flow Overview

### Step 0: Eligibility Gate

* If user has an **active or under-review charity request**:

  * Block entry
  * Show message:

    > “You can only create one charity at a time. Your current request is still in progress.”

---

## ✍️ Step 1: “What We Help With” (Education Screen)

### Purpose

Set expectations and reduce confusion about what GoFundMe handles vs. what the user is responsible for.

### Content (simple, skimmable)

**Header:**

> “We help you get your charity started”

**Sections:**

* ✅ Collect donations securely
* ✅ Host your charity page
* ✅ Provide basic transparency tools
* ⚠️ You are responsible for how funds are used
* ⚠️ This is reviewed before going live

**CTA:**

* “Continue”

---

## 🧾 Step 2: Charity Submission Form

### Fields (keep this tight)

**1. Charity Name** *(required)*

* Free text

**2. Mission / Purpose** *(required)*

* Multi-line text
* Helper text:

  > “What problem are you trying to solve?”

**3. Who / What Will Be Helped** *(required)*

* Short text
* Example: “Families affected by wildfires in LA”

**4. How Funds Will Be Used** *(required)*

* Multi-line text
* Example prompt:

  > “Be as specific as possible (e.g., food, shelter, medical supplies)”

**5. Location** *(required)*

* City / Region

**6. Cover Image** *(optional but recommended)*

* Upload 1 image

### CTA

* “Submit for Review”

---

# 🔄 Post-Submission State

## Confirmation Screen

> “Your charity request is under review”

### Details:

* Estimated review time (e.g., 1–3 days)
* What happens next:

  * “We may reach out for more info”
  * “You’ll be notified once it’s approved or rejected”

---

# 📬 Status Tracking

### Entry Point:

* Profile → “Your Charity Request”

### States:

* **Under Review**
* **Approved**
* **Rejected**

## If Approved

* Charity page is created automatically
* User becomes **owner**
* Prompt:

  > “Your charity is live. Start sharing it.”

## If Rejected

* Show reason (short, human-readable)
* CTA:

  * “Edit and Resubmit”

---

# 🚫 Constraints

## One Active Charity Rule

* User can only have:

  * 1 under-review OR
  * 1 active charity

### System Behavior:

* Disable “Start a Charity” if:

  * Existing charity is under review
  * OR user already owns an active charity

---

# 🛡️ Trust & Safety (MVP)

* All submissions go through **manual review**
* Internal tools (out of scope UI-wise):

  * Flag suspicious content
  * Basic identity checks (if needed)
* Users can report charities post-launch

---

# 📊 Success Metrics

* Submission completion rate
* Approval rate
* Time to approval
* % of approved charities that receive donations

---

# 🔥 MVP Cut (What We’re NOT Building Yet)

* No legal incorporation flow
* No multi-admin roles
* No advanced financial reporting
* No AI autofill (can layer in later)

---