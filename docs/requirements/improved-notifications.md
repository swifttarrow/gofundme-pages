# GoFundMe Notification System Improvement Spec

## Title
Fundraiser Follow & Notification Center

## Summary
Build a unified, user-centered notification system that helps people stay meaningfully updated on the fundraisers they are part of, without relying primarily on email.

Today, GoFundMe already supports some notification behaviors:
- fundraiser updates are emailed to subscribed supporters when organizers post updates, :contentReference[oaicite:0]{index=0}
- profile/follow activity appears in a notification feed with a bell icon, and users can receive a weekly digest email, :contentReference[oaicite:1]{index=1}
- beneficiaries can also post updates and thank donors. :contentReference[oaicite:2]{index=2}

However, the current system appears fragmented across organizer updates, profile activity, and email digests, rather than giving users a clear “follow this fundraiser and stay informed” product experience. :contentReference[oaicite:3]{index=3}

This spec proposes a dedicated notification system for fundraiser participation that is:
- in-app first
- preference-based
- milestone-aware
- low-noise
- mobile-friendly
- transparent about why a user is receiving each notification

---

## Problem Statement
Users who donate to, organize, co-organize, benefit from, or otherwise follow a fundraiser should be able to easily stay informed about its progress.

### Current pain points
1. **Notifications are fragmented**
   - Fundraiser updates are tied to organizer-posted updates and email delivery. :contentReference[oaicite:4]{index=4}
   - Social/profile activity has a separate feed and bell system. :contentReference[oaicite:5]{index=5}

2. **The system is too email-dependent**
   - GoFundMe currently relies heavily on emailed updates and weekly digests for awareness. :contentReference[oaicite:6]{index=6}

3. **Users do not have a strong fundraiser-level subscription model**
   - There is no prominent, centralized notification control for “campaigns I’m part of.”

4. **Important fundraiser moments can be missed**
   - Examples: new update posted, goal reached, urgent need added, fundraiser nearing end, payout/progress milestone, recurring donation renewal context.

5. **There is limited personalization**
   - A donor, organizer, beneficiary, and follower may need different notifications.

---

## Goals
- Make it easy for users to follow the fundraisers they are part of.
- Increase return visits and campaign re-engagement.
- Improve donor trust by making updates feel timely and purposeful.
- Help organizers maintain momentum through better supporter awareness.
- Create a modern notification foundation for future social/community features.

## Non-Goals
- Replacing all fundraising email workflows.
- Building a full social feed product in this phase.
- Sending SMS by default.
- Building AI-generated updates in this phase.

---

## Users
### Primary users
- Donors
- Recurring donors
- Organizers
- Co-organizers
- Beneficiaries
- Supporters who follow a fundraiser but have not donated

### Secondary users
- People who follow organizer profiles and may discover fundraiser activity through those relationships. GoFundMe already supports profile-follow notifications today. :contentReference[oaicite:7]{index=7}

---

## Core Product Concept
Introduce a first-class concept: **Fundraiser Following**

A user can explicitly follow a fundraiser and manage notifications for it.

A user is automatically opted into a default notification tier when they are materially involved in a fundraiser:
- donated
- started the fundraiser
- were added as beneficiary
- were added as co-organizer
- opted into follow

This creates a dedicated “My Fundraisers” notification model, separate from profile-follow activity.

---

## Key Improvements

## 1. Fundraiser-Level Follow Model
### New behavior
Each fundraiser gets a visible **Follow / Following** control.

### Entry points
- fundraiser page
- post-donation confirmation
- donor receipt page
- organizer dashboard
- beneficiary dashboard
- “My Activity” page

### Auto-enrollment rules
- Donor: auto-follow with smart-default notifications
- Organizer/co-organizer: auto-follow with creator-level notifications
- Beneficiary: auto-follow with beneficiary-level notifications
- Non-donor visitor: may manually follow

### Why this matters
Today, fundraiser updates are largely sent through organizer-posted updates to subscribed supporters, but the product should make fundraiser following a clear user action and mental model. :contentReference[oaicite:8]{index=8}

---

## 2. Unified Notification Center
### New surface
Create a dedicated **Notifications Center** with tabs:
- All
- My Fundraisers
- Donations
- Community/Profile
- Archived

### Notification objects include
- fundraiser title
- fundraiser image/avatar
- event type
- short message
- timestamp
- why user received it
- CTA
- read/unread state

### Example notifications
- “Maya’s fundraiser posted a new update”
- “This fundraiser reached 75% of its goal”
- “A new photo was added to a campaign you support”
- “Your recurring donation will process tomorrow”
- “The organizer thanked supporters”
- “This fundraiser is ending in 48 hours”

### Why this matters
GoFundMe already has a bell/feed model for profile activity, but fundraiser-related engagement should be centralized rather than scattered across updates and digests. :contentReference[oaicite:9]{index=9}

---

## 3. Event-Based Fundraiser Notifications
Support structured notification events beyond only manually written organizer updates.

### Event categories
#### Content events
- new organizer update posted
- new beneficiary update posted
- new image/video added
- fundraiser story significantly edited
- FAQ added/updated

#### Progress events
- campaign reached 25%, 50%, 75%, 100% of goal
- fundraiser surpassed goal
- fundraiser has a large donation spike
- fundraiser receives first donation after inactivity
- fundraiser has no update for X days

#### Participation events
- user donation receipt
- thank-you received
- recurring donation renewal upcoming
- recurring donation processed
- organizer invites co-organizer
- beneficiary added/confirmed

#### Urgency events
- fundraiser ending soon
- urgent need flagged by organizer
- payout issue / verification action needed for organizer-beneficiary roles

### Guardrails
- Goal milestone notifications should be bundled if multiple happen quickly.
- Story edit notifications should only fire for meaningful changes.
- Users should never receive every tiny campaign action by default.

---

## 4. Notification Preference Controls
### Granularity
Users can control notifications:
- globally
- per fundraiser
- by channel
- by event type

### Channels
- In-app
- Email
- Push (mobile)
- SMS later, not MVP

### Preference presets
#### Light
Only major updates:
- new update posts
- goal milestones
- ending soon
- thank-you / receipt

#### Standard (default for donors)
- Light, plus major content and progress events

#### All Activity
- Nearly everything except suppressed spammy actions

#### Mute
- Keep fundraiser in history but send no notifications

### Per-fundraiser settings UI
For each fundraiser:
- Follow on/off
- Channel toggles
- Frequency:
  - Real-time
  - Daily digest
  - Weekly digest
- Event category toggles

### Why this matters
GoFundMe already lets users edit some follow-related notifications for profiles. The same concept should be extended cleanly to fundraiser-level subscriptions. :contentReference[oaicite:10]{index=10}

---

## 5. Smarter Digests
### New digest types
- Daily fundraiser digest
- Weekly fundraiser digest
- “Catch up” digest after inactivity

### Digest contents
Grouped by fundraiser:
- most important update
- milestone reached
- latest donation momentum
- CTA: View fundraiser / Share / Donate again / Leave support

### Rules
- If user has already viewed all relevant events in-app, suppress digest.
- If user chose real-time for a fundraiser, digest becomes summary-only.
- Avoid sending multiple digests with duplicate content.

### Why this matters
GoFundMe already sends weekly digests for some profile activity use cases. A fundraiser-specific digest would be more useful and intentional. :contentReference[oaicite:11]{index=11}

---

## 6. Mobile-First Notification UX
### Requirements
- Bell icon visible on mobile nav
- Dedicated notification inbox optimized for thumb reach
- Swipe actions:
  - mark read
  - mute fundraiser
  - save for later
- tappable cards with large hit targets
- deep links into exact update or fundraiser section

### Mobile push principles
- Push only for high-value events by default
- Quiet hours respected
- collapse similar alerts
- prioritize fundraiser updates over lower-signal social activity

---

## Functional Requirements

## FR1. Follow a fundraiser
Users can follow or unfollow any eligible fundraiser from its page.

## FR2. Auto-follow on participation
The system auto-follows a fundraiser when a user donates, organizes, co-organizes, or becomes beneficiary, with clear disclosure and opt-out.

## FR3. Notification center
Users can view a list of fundraiser-related notifications in-app, including read/unread status.

## FR4. Event generation
The backend generates notification events for supported campaign actions and milestones.

## FR5. Preferences
Users can manage notification settings globally and per fundraiser.

## FR6. Multi-channel delivery
The system supports in-app, email, and mobile push delivery.

## FR7. Bundling and rate limiting
The system suppresses repetitive notifications and bundles events where appropriate.

## FR8. Deep linking
Every notification links to the relevant fundraiser, update, or activity section.

## FR9. Explanation / transparency
Every notification includes a reason such as:
- “Because you donated”
- “Because you follow this fundraiser”
- “Because you are the beneficiary”

## FR10. Digest generation
The system can compile daily/weekly digests based on unread, high-priority events.

## FR11. Organizer controls
Organizers can preview which supporter-facing notification will fire when posting an update.

## FR12. Notification history
Users can view past notifications for a fundraiser and archive or mute them.

---

## Non-Functional Requirements

## NFR1. Relevance
At least 80% of delivered notifications should be classified by users as useful or neutral, not noisy.

## NFR2. Timeliness
- in-app notification creation: p95 < 3 seconds after triggering event
- push/email enqueue: p95 < 30 seconds for real-time events

## NFR3. Reliability
No duplicate notification delivery for the same user-event pair.

## NFR4. Scalability
System must support large spikes during viral fundraisers and disaster-response campaigns.

## NFR5. Privacy
Only users with a valid relationship to a fundraiser receive restricted notifications.

## NFR6. Accessibility
Notification center and settings must support screen readers, keyboard navigation, and sufficient contrast.

## NFR7. Explainability
Users must be able to understand why they got a notification and how to change it.

---

## MVP Scope
### Include
- fundraiser follow/unfollow
- auto-follow after donation
- unified in-app “My Fundraisers” notifications tab
- event types:
  - new update posted
  - goal milestones
  - ending soon
  - thank-you received
  - recurring donation upcoming/processed
- per-fundraiser notification controls
- email + in-app delivery
- daily and weekly digest

### Exclude from MVP
- SMS
- AI-prioritized notifications
- notification reactions/comments
- cross-fundraiser recommendation engine
- advanced social graph ranking

---

## UX Flows

## Flow 1: Donor donates to fundraiser
1. User completes donation
2. Confirmation screen shows:
   - “You’re now following this fundraiser”
   - toggle for notification level
3. Default preset = Standard
4. User begins receiving key in-app and email updates

## Flow 2: Organizer posts update
1. Organizer writes update
2. Composer shows expected audience + channels
3. Update is posted
4. Supporters receive:
   - in-app notification immediately
   - email depending on settings
5. Notification deep-links directly to update content

Note: GoFundMe already emails subscribed supporters when organizers post updates; this flow formalizes and expands that experience. :contentReference[oaicite:12]{index=12}

## Flow 3: User manages fundraiser notifications
1. User opens Notifications Center
2. Clicks overflow menu on a fundraiser-related notification
3. Can:
   - mute this fundraiser
   - switch to digest only
   - turn off milestone notifications
   - unfollow fundraiser

---

## Data Model

## Entities
### FundraiserFollow
- follow_id
- user_id
- fundraiser_id
- relationship_type
  - donor
  - recurring_donor
  - organizer
  - co_organizer
  - beneficiary
  - follower
- follow_status
- notification_preset
- channel_preferences
- event_preferences
- created_at
- updated_at

### NotificationEvent
- event_id
- fundraiser_id
- actor_user_id
- event_type
- event_payload
- event_priority
- created_at
- dedupe_key

### UserNotification
- user_notification_id
- user_id
- event_id
- delivery_channel
- delivery_status
- read_status
- archived_status
- sent_at
- opened_at

---

## Notification Taxonomy
### Priority 1
- fundraiser update posted
- ending soon
- urgent issue/action needed
- recurring payment failed / action needed

### Priority 2
- goal milestone reached
- major new media/content added
- thank-you from organizer/beneficiary

### Priority 3
- routine momentum updates
- digest summaries
- lower-importance participation events

---

## Ranking / Delivery Logic
### Delivery rules
1. Check user eligibility
2. Check follow state
3. Check event/channel preferences
4. Check dedupe key
5. Apply bundling rules
6. Apply quiet hours for push
7. Deliver or defer to digest

### Bundling examples
- 5 donations in 1 hour → one “momentum” notification for followers
- 3 media uploads in 10 minutes → one bundled content update
- 25/50/75% milestones crossed in a short burst → send only highest reached milestone

---

## Success Metrics

## Primary metrics
- notification open rate
- fundraiser revisit rate within 7 days of notification
- % of donors who return to view update after donation
- % of followed fundraisers with notification settings retained
- unsubscribe / mute rate
- conversion lift from notified users vs control

## Secondary metrics
- organizer update posting frequency
- donor repeat donation rate
- fundraiser share rate after notification
- push enablement rate
- digest CTR

## Guardrail metrics
- complaint rate
- mute-all rate
- notification dismissal rate
- duplicate send rate
- unsubscribe from all fundraiser emails

---

## Experiment Ideas
### Experiment A
Auto-follow after donation vs manual opt-in only

### Experiment B
Default preset = Light vs Standard

### Experiment C
Milestone notifications on by default vs digest only

### Experiment D
Push for organizer updates vs in-app only

---

## Risks
### Risk 1: Too many notifications
Mitigation:
- presets
- bundling
- quiet hours
- per-fundraiser controls

### Risk 2: Low-value updates
Mitigation:
- rank event types
- only push high-value items
- digest low-priority activity

### Risk 3: User confusion about why they are getting alerts
Mitigation:
- explicit follow model
- “Why am I seeing this?” copy
- clear settings

### Risk 4: Fragmentation with existing profile notifications
Mitigation:
- keep fundraiser notifications in a dedicated tab
- preserve profile/social feed separately
- allow future convergence later

---

## Open Questions
1. Should every donor be auto-followed, or should this depend on donation type?
2. Should anonymous donors be auto-followed by default?
3. Should recipients/beneficiaries be able to send supporter-facing updates without organizer approval? Today, beneficiaries can post updates and send thank-yous. :contentReference[oaicite:13]{index=13}
4. Should milestone notifications mention donation amounts or only progress percentages?
5. Should recurring donors have a distinct premium notification tier, given recurring donations are now supported? :contentReference[oaicite:14]{index=14}

---

## Recommendation
Ship this in three phases:

### Phase 1
- Follow model
- My Fundraisers tab
- key in-app + email notifications
- per-fundraiser settings

### Phase 2
- push notifications
- smarter bundling/digesting
- notification reasoning labels

### Phase 3
- predictive ranking
- personalized milestones
- community/social feed convergence

---

## Expected Impact
This improvement should increase:
- donor retention
- fundraiser revisit frequency
- supporter trust
- organizer momentum
- overall engagement with active campaigns

Most importantly, it turns notifications from a fragmented support feature into a core engagement system for the fundraising journey.