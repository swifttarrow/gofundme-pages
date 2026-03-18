# Mobile Responsiveness Spec

## Overview

All GoFundMe surfaces being built for this project must work well across both **desktop browser** and **mobile devices**. The goal is not only visual adaptation, but also ensuring that the experience remains fast, readable, tappable, and conversion-friendly on smaller screens.

This spec defines the requirements, layout rules, interaction patterns, and success criteria for delivering a high-quality responsive experience across:
- Fundraiser pages
- Community pages
- Profile pages
- Shared components and flows

---

## Goals

1. Ensure every page is fully usable on mobile and desktop.
2. Preserve core user outcomes across screen sizes:
   - Discover content
   - Read stories/updates
   - Donate or take action
   - Create/edit profile or fundraiser content
   - Navigate between key surfaces
3. Reduce friction on smaller screens by prioritizing clarity, speed, and thumb-friendly interaction.
4. Create a consistent responsive system that can be reused across all current and future GoFundMe pages.

---

## Why This Matters

A significant portion of users will discover, browse, and donate from mobile devices. If pages are difficult to read, slow to load, or require excessive zooming/scrolling, conversion and trust will suffer.

Strong mobile responsiveness is important because it:
- Improves donor conversion
- Increases fundraiser/profile completion rates
- Reduces bounce on community and fundraiser pages
- Makes sharing and visiting links from social/mobile contexts feel seamless
- Builds trust through a polished, modern UI

---

## Scope

This spec applies to:
- New fundraiser page designs
- New community page designs
- New profile page designs
- Shared navigation, cards, forms, modals, drawers, media, and CTA patterns

This spec does not define:
- Exact visual design language
- Brand styling details
- Native mobile app behavior outside responsive web
- Separate tablet-specific product strategy beyond responsive adaptation

---

## Primary User Scenarios

### Donor / Visitor
- Lands on a fundraiser from social or text link on mobile
- Reads the story and views media
- Understands trust signals and donation context
- Completes donation with minimal friction

### Organizer
- Creates or edits a fundraiser on mobile
- Updates profile information
- Posts updates to a community
- Uploads media from phone camera/gallery

### Community Member
- Browses community content on mobile
- Reads updates and discussions
- Taps into fundraisers or profiles
- Interacts with posts without layout breakage

---

## Supported Viewports

### Mobile
- 320px minimum supported width
- 360px target baseline
- 390px common modern phone width
- 428px large phone width

### Tablet / Small laptop
- 768px and up

### Desktop
- 1024px and up
- 1280px+ optimized layout
- 1440px+ max-width constrained for readability

---

## Responsive Design Principles

### 1. Mobile-first
Design and build starting from the smallest supported viewport, then enhance for larger screens.

### 2. Content priority
On mobile, prioritize:
1. Primary CTA
2. Headline and core context
3. Essential trust/progress info
4. Key media
5. Supporting details
6. Secondary actions

### 3. Single-column first
On small screens, default to a single-column layout unless a multi-column layout is truly necessary.

### 4. Touch-friendly interaction
All tappable elements must be sized and spaced for thumbs.

### 5. Readability over density
Do not try to preserve desktop density on mobile. Stack, collapse, or progressively disclose secondary content.

### 6. Consistency
Shared components should adapt using the same spacing, breakpoint, and interaction system.

---

## Breakpoints

Recommended responsive breakpoints:

- `xs`: 320–359px
- `sm`: 360–767px
- `md`: 768–1023px
- `lg`: 1024–1279px
- `xl`: 1280px+

Engineering may implement these as tokens/utilities, but all screens must behave consistently at these ranges.

---

## Global Layout Requirements

### Page Width
- Desktop content should use a max-width container for readability.
- Mobile content should use full width with safe horizontal padding.
- No page should require horizontal scrolling at supported widths.

### Page Padding
- Mobile: 16px horizontal padding minimum
- Tablet: 24px horizontal padding
- Desktop: 32px+ horizontal padding as appropriate

### Vertical Rhythm
- Use consistent spacing scale between sections
- Tighten spacing slightly on mobile, but preserve visual separation

### Sticky Areas
Where useful, mobile may use sticky bottom CTA bars for primary actions such as:
- Donate
- Share
- Save/Edit
- Post update

Sticky elements must not obscure essential content or system controls.

---

## Navigation Requirements

### Header / Top Navigation
Desktop:
- Full navigation may be visible

Mobile:
- Compress navigation into a simplified header
- Use hamburger/menu sheet for secondary nav items
- Preserve immediate access to highest-priority actions

### Back Navigation
- Mobile flows should always provide an obvious way to return
- Back action should be consistent and reachable

### Bottom Reachability
High-priority actions on mobile should be reachable without requiring fine cursor movement or top-of-screen interactions only.

---

## Typography Requirements

### Readability
- Body text must remain legible without zoom
- Avoid overly small metadata text on mobile

### Line Length
- Desktop text blocks should be constrained for readability
- Mobile text should not feel cramped; use sufficient line-height

### Wrapping
- Titles, names, tags, and metadata must wrap gracefully
- No clipped text unless intentionally truncated with ellipsis

---

## Component-Level Responsive Requirements

## Buttons and CTAs
- Minimum tap target: 44x44px
- Primary CTA must remain prominent on all breakpoints
- On mobile, adjacent buttons should stack when horizontal space is limited
- Avoid more than 2 side-by-side actions on small screens

## Cards
- Cards must scale to full width on mobile
- Internal padding should reduce slightly on smaller screens
- Card content order may be rearranged for mobile priority

## Forms
- Inputs must span available width on mobile
- Labels should remain visible and associated with fields
- Multi-column desktop forms should collapse to single-column on mobile
- Validation messages must not break layout
- File upload controls must work cleanly on touch devices

## Modals
- Desktop may use centered modal
- Mobile should prefer full-screen modal or bottom sheet for complex tasks
- Avoid tiny centered popups on small screens

## Drawers / Sheets
- Mobile drawers should be easy to dismiss and not trap users
- Long content should scroll within the sheet without breaking the page

## Media
- Images and videos must scale responsively
- Preserve aspect ratio
- Avoid cropping critical visual content by default
- Media galleries should support swipe or horizontal scrolling patterns on mobile when appropriate

## Tabs
- On narrow widths, tabs may become scrollable horizontally or convert to segmented controls/dropdowns
- Active state must remain obvious

## Tables / Dense Data
- Avoid raw desktop tables on mobile where possible
- Convert to cards, stacked rows, or expandable sections
- If a table is unavoidable, allow controlled horizontal scroll within the component only

---

## Page-Specific Responsive Behavior

## 1. Fundraiser Page

### Mobile Priorities
1. Title
2. Donation CTA
3. Amount raised / goal / progress
4. Hero media
5. Short story summary
6. Trust/context signals
7. Updates and secondary content

### Layout Rules
- Collapse desktop side rail into stacked mobile sections
- Donation card should become either:
  - inline near top, and/or
  - sticky bottom CTA entry point
- Long story text should support progressive disclosure ("Read more")
- Secondary modules such as related campaigns, comments, or organizer details should stack below core conversion content

### CTA Behavior
- Donate CTA must stay easy to access without repeated upward scrolling
- Share CTA should remain visible but secondary to Donate

---

## 2. Community Page

### Mobile Priorities
1. Community identity/header
2. Primary action (join/follow/share/post)
3. Featured or urgent posts
4. Feed items
5. Linked fundraisers and resources

### Layout Rules
- Desktop multi-column feed/sidebar layouts should collapse into a single feed
- Filters/chips may become horizontally scrollable
- Community metadata should condense into lighter summary blocks
- Post composer and post actions must remain usable with thumb interaction

### Feed Behavior
- Cards should avoid excessive vertical chrome
- Media-heavy posts should size responsively without pushing key actions too far down
- Replies/comments may be collapsed by default on mobile

---

## 3. Profile Page

### Mobile Priorities
1. Profile identity (photo, name, short bio)
2. Key stats / badges / trust markers
3. Primary actions
4. Fundraisers
5. Activity / updates / communities

### Layout Rules
- Desktop side-by-side hero/profile info should stack vertically
- Achievement badges should wrap cleanly and never overflow container width
- Sections such as "About", "Fundraisers", "Updates", and "Communities" may become accordions or stacked tabs on mobile
- Editing actions should remain accessible without cluttering top area

### Editing UX
- Profile setup/edit flows should be optimized for mobile input
- Prefer guided steps and large touch targets over dense settings screens

---

## Responsive Content Strategy

### Progressive Disclosure
On mobile, lengthy or secondary content should use:
- "Read more"
- Accordions
- Expandable sections
- Bottom sheets
- Progressive reveal of details

### Priority Reduction
Do not hide critical information, but reduce visual competition by:
- De-emphasizing low-priority metadata
- Moving secondary actions into overflow menus
- Simplifying badges, chips, or stats presentation

### Image and Media Behavior
- Use responsive image sizes
- Crop carefully
- Avoid text embedded in images that becomes unreadable on small screens

---

## Interaction Requirements

### Touch Targets
- Minimum 44x44px for interactive controls
- Adequate spacing between nearby controls

### Gestures
Where relevant, mobile may support:
- Swipe through media
- Horizontal scroll on chips/carousels
- Pull interactions only if standard and discoverable

Do not rely on hidden gestures for core functionality.

### Hover Dependence
- No essential action or information may require hover
- All hover-based desktop affordances must have tap equivalents

---

## Accessibility Requirements

- Text must remain readable at supported sizes
- Interactive controls must be keyboard accessible on web
- Focus states must remain visible on desktop and mobile browser contexts
- Color contrast must meet accessibility standards
- Screen readers should preserve logical reading order after responsive stacking
- Zoom to 200% must not break core functionality
- Orientation changes should not break layout

---

## Performance Requirements

Mobile responsiveness is not only layout adaptation; it also includes performance.

### Requirements
- Avoid large unoptimized images
- Lazy-load below-the-fold media where appropriate
- Prevent layout shift during image/media load
- Keep mobile interactions responsive and low-jank
- Minimize oversized JS for mobile-critical experiences

### Target Outcomes
- Fast initial render on mobile networks
- Stable layout during load
- Quick access to primary action

---

## Engineering Requirements

### Layout System
- Use a shared responsive grid and spacing system
- Use reusable breakpoint tokens rather than one-off CSS values
- Shared components must expose responsive variants or rules

### Content Safety
- No clipped buttons, overlapping text, off-screen modals, or horizontal overflow
- All responsive states must be tested with realistic content lengths:
  - Long fundraiser titles
  - Long names
  - Large currency amounts
  - Multiple badges/chips
  - Long translated/localized text

### Browser Support
Support modern mobile and desktop browsers used by mainstream users.

---

## QA / Acceptance Criteria

A screen is considered responsive only if all of the following are true:

1. No horizontal page scroll at supported widths.
2. All primary actions are visible and usable on mobile.
3. Text is readable without zoom.
4. Tap targets are large enough and not crowded.
5. Forms are usable on touch devices.
6. Images and videos resize correctly without distortion.
7. Multi-column desktop layouts collapse cleanly.
8. No content overlap, clipping, or broken wrapping.
9. Modals/drawers are usable on mobile.
10. Core flows can be completed end-to-end on both desktop and mobile.

---

## Required QA Test Matrix

At minimum, test each major page on:
- 320px width
- 360px width
- 390px width
- 768px width
- 1024px width
- 1280px+ width

Test in both:
- Portrait mobile
- Landscape mobile where relevant

Test scenarios:
- Long content
- Empty states
- Error states
- Loading states
- Media-heavy states
- Forms with validation
- Logged-in and logged-out variants if applicable

---

## Analytics / Success Metrics

To validate impact, instrument:

### Engagement
- Mobile bounce rate
- Scroll depth by device type
- Time to first interaction
- CTA click-through rate by device type

### Conversion
- Donation conversion rate on mobile vs desktop
- Profile completion rate on mobile
- Fundraiser creation completion rate on mobile
- Community post creation rate on mobile

### UX Quality
- Rage clicks / repeated taps
- Form abandonment by step/device
- Error rate by viewport class
- Page load and interaction latency by device type

---

## Non-Goals

This spec does not require:
- A separate mobile-only site
- Fully distinct layouts for every page if shared responsive rules suffice
- Parity of every decorative desktop element on small screens
- Complex gesture systems that reduce clarity

---

## MVP Requirements

For MVP, the responsive implementation must ensure:
- All pages work cleanly at 320px+
- Primary CTA remains easy to access on mobile
- Desktop multi-column layouts collapse to single-column on mobile
- All forms are touch-friendly
- Media scales correctly
- No layout breakage on core pages and flows

Nice-to-have enhancements can follow later, but MVP must prioritize usability, readability, and conversion.

---

## Future Enhancements

Potential follow-up improvements:
- Device-specific optimization for high-performing screen sizes
- Smarter sticky CTA patterns based on scroll depth
- Reduced-motion responsive variants
- Adaptive image crops per breakpoint
- More advanced mobile composer/editor experiences
- One-handed mode optimizations for key flows

---

## Summary

This responsive spec ensures that all GoFundMe screens being built will function effectively across browser and mobile. The core principle is not simply shrinking desktop layouts, but redesigning content hierarchy, actions, and components so that users can successfully browse, trust, and act from any device.