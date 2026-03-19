# GoSupportMe

A GoFundMe-inspired fundraising platform built as a full-stack monorepo.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 App Router + Tailwind CSS |
| API | Fastify 4 + TypeScript |
| Worker | BullMQ background processor |
| Database | PostgreSQL |
| Cache/Queue | Redis + BullMQ |
| Contracts | Zod (shared package) |
| Testing | Vitest + Playwright |

## Project Structure

```
gosupportme/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # Fastify API + BullMQ worker
├── packages/
│   └── contracts/    # Shared Zod schemas
└── infra/
    ├── migrations/   # SQL migrations
    └── scripts/      # DB utilities
```

## Quick Start

### Prerequisites

- Node.js 20.9+
- PostgreSQL 15+
- Redis 7+

### 1. Install dependencies

```bash
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
# Edit .env with your database and Redis URLs
# Keep API_ORIGIN pointed at the Fastify service for the Next.js proxy
```

### 3. Database setup

```bash
# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Run in development

```bash
# Run both web and API concurrently
npm run dev

# Or individually:
npm run dev --workspace=apps/web    # http://localhost:3000
npm run dev --workspace=apps/api    # http://localhost:3001
```

### Local Login

- Visit `http://localhost:3000/sign-in`
- Or create an account at `http://localhost:3000/sign-up`
- Use any seeded user email from `infra/scripts/seed.js` (for example `michael@example.com`)
- Seeded user password is controlled by `DEV_AUTH_PASSWORD` (default: `gosupportme-dev-password`)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with featured fundraisers |
| `/fundraiser/[id]` | Fundraiser detail with donation module |
| `/community` | Community feed with filters |
| `/profile/[id]` | User profile with badges |
| `/notifications` | Notification center |
| `/fundraiser/new` | Multi-step fundraiser starter wizard |
| `/tipping` | Transparent tipping module demo |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |
| POST | `/api/events` | Ingest platform event |
| POST | `/api/replay` | Replay events by ID |
| POST | `/api/donations` | Create donation |
| GET | `/api/donations` | List donations for fundraiser |
| GET | `/api/fundraisers` | List fundraisers (paginated) |
| GET | `/api/fundraisers/:id` | Fundraiser detail |
| GET | `/api/notifications` | User notifications |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notifications/preview` | Preview notification |
| GET | `/api/recommendations` | Personalized recommendations |
| POST | `/api/badges/evaluate` | Evaluate + award badges |
| GET | `/api/badges/:userId` | Get user badges |
| POST | `/api/charities` | Create charity |
| GET | `/api/charities/:id` | Charity detail |
| PATCH | `/api/charities/:id/fundraisers/:fid` | Link fundraiser to charity |
| GET | `/api/feed` | Community feed |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current authenticated user |
| PATCH | `/api/auth/profile` | Update authenticated profile |
| POST | `/api/auth/logout` | Logout |

## Event System

The platform uses an event-driven architecture with idempotent fan-out:

```
POST /api/events
  → platform_events table (ON CONFLICT DO NOTHING)
  → notification-queue (BullMQ)
  → badge-queue (BullMQ)
  → recommendation-queue (BullMQ)
```

**Event Types:**
- `donation.created`
- `fundraiser.update_posted`
- `fundraiser.followed`
- `profile.updated`

## Recommendation Scoring

```
score = interest_match × 0.4
      + donation_similarity × 0.3
      + trending_boost × 0.2
      + recency × 0.1
```

15% of results are exploration slots (random eligible campaigns).

## Badge Types

| Badge | Trigger |
|-------|---------|
| Trust Pioneer | Has any active fundraiser |
| Momentum Builder | Raised 50%+ in first 48h |
| Community Champion | 500+ donors |
| Top Donor | Donated to 10+ fundraisers |
| Milestone Reacher | Fundraiser reached goal |

## Build

```bash
npm run build
npm run typecheck
npm run test
```

## Design System

- Primary green: `#00B964`
- Dark green: `#008748`
- Font: Inter
- Corner radii: sm=6px, md=10px, lg=16px, xl=24px
