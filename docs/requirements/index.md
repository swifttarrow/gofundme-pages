# Build 3 pages, inspired by GoFundMe:
* Fundraiser page: https://www.gofundme.com/f/realtime-alerts-for-wildfire-safety-r5jkk
* Community page: https://www.gofundme.com/communities/watch-duty
* Profile page: https://www.gofundme.com/u/janahan

## Non-functional Requirements
Pages successfully load with fast response times.
The three pages (profile, fundraiser, community) are seamlessly integrated and intuitive.
Well instrumented; explain what metrics you'll capture and why.
Submissions will be graded on:
* Observability
* Simplicity
* Test coverage
* Documentation
* Run books
* Error handling
* Stateless
* Horizontally scalable

## Functional Requirements
For all UI views/pages, they should be supported on all screen sizes in a responsive manner. This is true for both editing and viewing functionality.

### Achievement Badges
Badges users achieve through engagement with the platform. Please refer to `docs/requirements/achievement-badges.md`.

### Charity Starter Kit
The charity starter kit is a means for a user to start their own micro-charity. Please refer to `docs/requirements/charity-starter-kit.md`.

### Social Graph
A social graph connects users with other entities on the platform. Please refer to `docs/requirements/social-graph.md`.

### Fundraiser Page
A fundraiser page is created by an author/owner to secure donations from donors. Please refer to `docs/requirements/fundraiser-page.md`.

### Cross-Page Advice
Each core page (`fundraiser`, `community`, `profile`) includes an advice button that, when clicked, returns 1-2 actionable recommendations for improving page content. Advice is optional, user-triggered, and must degrade gracefully when unavailable.

### Profile Page
The profile page captures a user's profile, their achievements, and their connected entities. Please refer to `docs/requirements/profile-page.md`.

### Community Page
The community page groups similar fundraisers to achieve an overarching objective. Please refer to `docs/quirements/community-page.md`.