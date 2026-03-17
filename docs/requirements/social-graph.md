# Spec: Social Graph MVP for a Fundraising Platform

## 1. Overview

This spec defines an MVP social graph system for a fundraising platform similar to GoFundMe. The goal is to create a lightweight graph of relationships between users, fundraisers, donors, and communities so the product can power more engaging, socially aware experiences during a demo.

The MVP is intentionally optimized for:

* **high demo value**
* **clear user-facing magic**
* **low implementation complexity**
* **safe assumptions over perfect identity resolution**

Rather than building a full, production-grade social network graph, this MVP creates a **practical relationship layer** that can answer simple but compelling questions like:

* “Who in my network has supported this cause?”
* “What causes are adjacent to the ones I care about?”
* “Which people or communities are closest to this fundraiser?”
* “What should I show on profile, fundraiser, and community pages to make the platform feel connected?”

---

## 2. Product Goal

Create a minimal social graph that makes the platform feel socially alive by linking:

* people to people
* people to fundraisers
* people to communities
* fundraisers to communities

The graph should support demo-friendly UI experiences across:

* **Profile pages**
* **Fundraiser pages**
* **Community pages**

---

## 3. Non-Goals

This MVP will **not** attempt to solve:

* full contact import and address book sync
* trust/safety risk scoring
* fraud detection
* large-scale graph ranking infrastructure
* multi-hop recommendation systems
* perfect identity resolution across duplicate accounts
* privacy-heavy features like revealing private donor relationships without consent
* real-time graph recomputation at large scale

---

## 4. User Value

### For donors

* See that causes are connected to real people and communities
* Discover relevant fundraisers through social proximity
* Feel more trust and emotional pull when support is socially contextualized

### For organizers

* Better showcase momentum and community backing
* Surface “who is connected” to the cause
* Make fundraiser pages feel less isolated

### For the demo

* Creates obvious “social intelligence” moments
* Connects profile, fundraiser, and community pages into one coherent story
* Enables visually compelling modules with small amounts of seed data

---

## 5. MVP Thesis

A demo-quality social graph does **not** need a complete network. It only needs:

1. a few node types
2. a few relationship types
3. simple weighted edges
4. deterministic ranking rules
5. clean UI modules that make the graph visible

If the product can show meaningful relationship cards like:

* “3 people adjacent to you supported this fundraiser”
* “This cause overlaps with the Wildfire Helpers community”
* “You and this organizer both engaged with animal rescue campaigns”

then the demo succeeds.

---

## 6. Core Concepts

## 6.1 Node Types

The MVP graph will support four node types:

### User

Represents a platform account holder.
Examples:

* donor
* organizer
* community member

### Fundraiser

Represents a fundraising campaign.

### Community

Represents a thematic or cause-based group.

### Cause Tag

Represents a normalized topic like:

* wildfire relief
* medical support
* animal rescue
* education

Cause tags are optional in the UI but useful in the graph to create easy shared edges.

---

## 6.2 Edge Types

Edges represent relationships between nodes.

### User -> User

Possible relationship types:

* `follows`
* `co_donated_to_same_fundraiser`
* `co_member_of_same_community`
* `same_organizer_supporter_cluster`

For MVP, not all need to be explicitly stored. Some can be derived.

### User -> Fundraiser

Possible relationship types:

* `donated_to`
* `shared`
* `viewed`
* `saved`
* `organizes`

### User -> Community

Possible relationship types:

* `member_of`
* `engaged_with`
* `moderates`

### Fundraiser -> Community

Possible relationship types:

* `belongs_to`
* `high_overlap_with`

### Fundraiser -> Cause Tag

Possible relationship type:

* `tagged_as`

### User -> Cause Tag

Possible relationship type:

* `interested_in`

---

## 7. MVP Scope

The MVP will support these minimum capabilities:

### 7.1 Required Graph Capabilities

* show users socially adjacent fundraisers
* show overlapping supporters or communities on fundraiser pages
* show profile affinity summary
* show related communities
* support a basic “why am I seeing this?” explanation

### 7.2 Required Demo Surfaces

* **Profile page:** network summary, causes you support, people/communities adjacent to you
* **Fundraiser page:** supporters from your graph, related communities, nearby causes
* **Community page:** top connected fundraisers, key members, graph activity highlights

### 7.3 Out of Scope for MVP

* graph search UI
* friend requests
* messaging
* notifications
* deep personalization models
* dynamic privacy management beyond simple rules
* graph visualization UI beyond a small optional module

---

## 8. Product Requirements

## 8.1 Profile Page Requirements

The profile page should display:

* causes the user has supported
* communities the user is connected to
* fundraisers connected to their activity
* lightweight “people like you supported” recommendations

### Example modules

* **Your Cause Footprint**
* **Communities Around You**
* **People With Similar Support Patterns**
* **Fundraisers Near Your Network**

### Acceptance criteria

* Page loads a graph summary for the user in under 500 ms from cached data
* At least 3 connected entities are shown if available
* Each recommendation has a simple explanation label

---

## 8.2 Fundraiser Page Requirements

The fundraiser page should display:

* people in your extended network who supported this or related causes
* related communities
* similar fundraisers based on shared supporters or cause tags
* optional “social proof” strip

### Example modules

* **Supported by people adjacent to you**
* **Popular in the Wildfire Helpers community**
* **Related causes your network cares about**

### Acceptance criteria

* Show at least one social context module when graph data exists
* Never expose private donor identity unless donor visibility allows it
* Fallback gracefully to aggregate counts when identities cannot be shown

---

## 8.3 Community Page Requirements

The community page should display:

* connected fundraisers
* active members
* causes represented in the community
* recent relationship activity

### Example modules

* **Fundraisers gaining traction in this community**
* **Members who support similar causes**
* **Cause clusters in this community**

### Acceptance criteria

* Community page ranks fundraisers using graph overlap + recency
* At least one activity or relationship summary is shown
* Explanations are readable and donor-safe

---

## 9. Functional Requirements

### FR1: Create graph nodes

System must create nodes for:

* users
* fundraisers
* communities
* cause tags

### FR2: Create graph edges from core user actions

System must create or update edges when a user:

* donates
* joins a community
* views a fundraiser
* saves a fundraiser
* shares a fundraiser
* creates a fundraiser

### FR3: Assign simple edge weights

Each edge should store a numeric weight indicating strength of relationship.

Example:

* donate = 5
* organize fundraiser = 7
* join community = 4
* save = 2
* share = 3
* view = 1

### FR4: Support simple graph queries

System must answer:

* related fundraisers for a user
* related communities for a fundraiser
* similar users by shared activity
* cause overlap across user/community/fundraiser

### FR5: Provide explainability metadata

Every recommended entity must include a short explanation reason, such as:

* “Because you donated to similar causes”
* “Because this community overlaps with your activity”
* “Because supporters of this fundraiser also joined this community”

### FR6: Support seeded or synthetic data

System must support manually seeded graph data for a polished demo, even if organic traffic is low.

This is important. For a demo, hand-authored or precomputed graph relationships are acceptable.

---

## 10. Nonfunctional Requirements

### Performance

* Graph-backed modules should render from precomputed or cached data
* Page-level graph response target: p95 under 500 ms for demo dataset

### Reliability

* If graph service fails, page still loads without graph modules
* Graph UI modules degrade gracefully to generic recommendations

### Privacy

* Respect donor visibility flags
* Prefer aggregate social proof when user-level disclosure is not allowed

### Explainability

* Every graph-based suggestion should have a human-readable reason
* Avoid black-box ranking in MVP

### Simplicity

* Favor precomputation over real-time graph traversal
* Favor deterministic ranking over ML

---

## 11. Data Model

## 11.1 Nodes

### users

* `id`
* `name`
* `avatar_url`
* `visibility_level`
* `created_at`

### fundraisers

* `id`
* `title`
* `organizer_user_id`
* `community_id` nullable
* `primary_cause_tag`
* `created_at`

### communities

* `id`
* `name`
* `description`
* `primary_cause_tag`

### cause_tags

* `id`
* `name`

---

## 11.2 Edges

A generic edge table is enough for MVP.

### graph_edges

* `id`
* `from_node_type`
* `from_node_id`
* `to_node_type`
* `to_node_id`
* `edge_type`
* `weight`
* `created_at`
* `updated_at`
* `metadata_json`

Example:

* user 123 -> fundraiser 456 -> donated_to -> weight 5
* user 123 -> community 999 -> member_of -> weight 4
* fundraiser 456 -> cause wildfire_relief -> tagged_as -> weight 3

---

## 12. Ranking Logic

For MVP, use deterministic scoring.

## 12.1 Related Fundraisers for a User

Score based on:

* shared cause tags
* shared communities
* overlap with users who have similar donation/support patterns
* recency boost

Example formula:
`score = cause_overlap*5 + shared_community*4 + supporter_overlap*3 + recency_boost`

## 12.2 Related Communities for a Fundraiser

Score based on:

* matching cause tag
* overlap of supporters and members
* organizer affinity

## 12.3 Similar Users

Score based on:

* shared donated fundraisers
* shared communities
* shared cause tags

For demo purposes, top 3–5 results is enough.

---

## 13. Read APIs

The MVP can expose a few simple endpoints.

### GET /api/graph/user/:userId/summary

Returns:

* top causes
* related communities
* recommended fundraisers
* similar users

### GET /api/graph/fundraiser/:fundraiserId/context?viewerId=:viewerId

Returns:

* supporter overlap
* related communities
* similar fundraisers
* explanation strings

### GET /api/graph/community/:communityId/summary

Returns:

* top connected fundraisers
* top cause tags
* active members
* graph activity summary

### GET /api/graph/explanations

Optional utility endpoint if explanation generation is shared.

---

## 14. Write/Event Inputs

The graph should ingest events from existing product actions.

### Supported events

* donation_created
* fundraiser_created
* fundraiser_viewed
* fundraiser_saved
* fundraiser_shared
* community_joined
* profile_followed (optional if product has follows)

These can be written:

* synchronously to a simple relational table for MVP
* asynchronously copied into a denormalized summary table

---

## 15. Suggested Architecture for MVP

Use a **hybrid relational approach**, not a true graph database.

### Why

For a demo MVP:

* faster to build
* easier to inspect
* easier to seed
* easier to explain
* avoids infra overhead

### Recommended setup

* PostgreSQL tables for nodes and edges
* background job to compute summary tables
* cache layer for page modules
* optional JSON blobs for precomputed recommendations

### Summary tables

#### user_graph_summary

* user_id
* top_causes_json
* related_communities_json
* recommended_fundraisers_json
* similar_users_json
* refreshed_at

#### fundraiser_graph_summary

* fundraiser_id
* related_communities_json
* similar_fundraisers_json
* supporter_overlap_json
* refreshed_at

#### community_graph_summary

* community_id
* top_fundraisers_json
* top_members_json
* cause_distribution_json
* refreshed_at

This makes the frontend fast and demo-stable.

---

## 16. Demo Optimization Strategy

Because this is optimized for demoing, the implementation should bias toward **predictable delight**.

### Recommendations

* pre-seed 20–50 users, 10–20 fundraisers, 5–10 communities
* ensure overlap is intentionally designed
* create visible “clusters” like:

  * wildfire relief cluster
  * medical support cluster
  * animal rescue cluster
* hand-tune a few recommendation outputs
* cache results aggressively
* design social explanations that sound intuitive

### Important note

For demo purposes, it is acceptable for some recommendations to be:

* partially precomputed
* seeded from fixture data
* lightly editorialized

As long as the system architecture still resembles a believable MVP.

---

## 17. Privacy and Trust Rules

This is especially important on a donation platform.

### MVP rules

* never reveal hidden donors by name
* if donor visibility is private, only show:

  * count
  * anonymized phrasing
  * cause overlap
* avoid showing exact social relationship claims that may feel creepy

  * bad: “Your coworker donated here”
  * safer: “Someone in your extended network supported this cause”
* explanations should emphasize shared cause interest, not surveillance

---

## 18. Instrumentation

Because the graph exists to improve engagement, measure whether users interact with graph-powered modules.

### Events to capture

* graph_module_impression
* graph_module_click
* explanation_tooltip_opened
* recommended_fundraiser_clicked
* recommended_community_clicked
* similar_user_clicked
* donation_after_graph_exposure
* save_after_graph_exposure
* join_community_after_graph_exposure

### Dimensions

* page_type
* module_type
* viewer_logged_in
* recommendation_reason
* graph_score_bucket
* entity_type
* cause_tag

### Why these metrics matter

They show:

* whether graph modules are noticed
* whether social context increases downstream engagement
* which explanation types are effective
* whether graph-powered modules influence donations, saves, or joins

---

## 19. Success Metrics

For MVP/demo, success is primarily qualitative plus directional quantitative signals.

### Primary

* users can clearly understand why entities are connected
* demo feels socially intelligent
* graph modules make profile, fundraiser, and community pages feel unified

### Secondary

* CTR on graph modules
* donation conversion after graph exposure
* join/save actions after graph exposure
* time spent on interconnected pages

---

## 20. Risks

### Risk 1: Sparse graph

If there is not enough real user activity, recommendations may feel empty.

**Mitigation:** use seeded data and precomputed summaries.

### Risk 2: Privacy creepiness

Overly specific social wording may feel invasive.

**Mitigation:** use broad, cause-based phrasing.

### Risk 3: Weak relevance

Naive graph ranking may surface low-quality connections.

**Mitigation:** constrain to cause tags + community overlap + recency.

### Risk 4: Overbuilding infra

A true graph platform may be overkill for demo scope.

**Mitigation:** use relational tables and summary blobs.

---

## 21. Phased Delivery

## Phase 1: Seeded Demo Graph

* create node and edge schema
* ingest fixture data
* build precomputed summaries
* render graph modules on 3 pages

## Phase 2: Real Activity Ingestion

* map real events into graph edges
* refresh summaries daily or near-real-time
* reduce reliance on hand-curated data

## Phase 3: Smarter Ranking

* better weighting
* multi-hop recommendations
* optional ML ranking

---

## 22. Example Demo UX

### On a fundraiser page

> **Why this matters to you**
> Popular among supporters of wildfire relief and adjacent to 2 communities you’ve engaged with.

### On a profile page

> **Your support network**
> You’ve engaged with 3 cause areas, 2 communities, and 6 fundraisers connected to emergency response.

### On a community page

> **Momentum in this community**
> Fundraisers tied to this community have seen strong support from members interested in emergency preparedness and recovery.

---

## 23. MVP Recommendation

If the goal is to impress in a prototype or interview/demo setting, the best version of this is:

* **Postgres-backed node/edge tables**
* **precomputed summary JSON per page entity**
* **3–5 graph modules across profile/fundraiser/community**
* **seeded overlapping data**
* **simple explanation strings**
* **strict privacy-safe wording**

That gives you the appearance of a sophisticated social graph without needing full graph infrastructure.

---

## 24. Concise PRD-Style Summary

**Build an MVP social graph that links users, fundraisers, communities, and cause tags in order to make profile, fundraiser, and community pages feel socially connected.**
The system should ingest a small set of core actions, assign simple weighted relationships, and expose precomputed summaries to the frontend. It should prioritize fast rendering, intuitive explanations, privacy-safe language, and polished seeded data for demo purposes.

---