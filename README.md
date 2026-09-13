# Digital Flower Gift

A mobile-first web application where one person creates a digital flower gift for another person. The recipient opens a private link and cares for the flower daily. After 30 days, it blooms with a personalized message.

## Features

- **Gift Creation**: Choose flower type, name it, write messages, set start date
- **Private Links**: Cryptographically secure random tokens (128+ bits entropy)
- **Flower Growth**: Calendar-based growth over 30 days through 8 stages
- **Daily Care**: Water (💧 +10 XP), Sunshine (☀️ +5 XP), Love (❤️ +5 XP)
- **Health System**: Healthy, Thirsty, Wilting, Reviving states
- **XP & Streak**: Daily XP cap of 20, consecutive day streaks
- **Rewards**: Milestone unlocks at Days 3, 7, 14, 21, 30
- **Bloom Experience**: Emotional Day 30 reveal with personalized message
- **No Accounts Required**: Giver creates, recipient opens link directly

## Architecture

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL
- **Validation**: Zod
- **Testing**: Node.js built-in test runner

## Project Structure

```
src/
  app/
    page.tsx                  # Landing page
    create/page.tsx           # Gift creation form
    preview/page.tsx          # Gift preview & result
    g/[token]/page.tsx        # Recipient gift page
    api/gifts/route.ts        # POST create gift
    api/gifts/[token]/route.ts # GET gift state
    api/gifts/[token]/care/route.ts # POST care action
  components/
    flower/FlowerVisual.tsx   # SVG flower rendering
    care/CareActions.tsx      # Care button UI
    ui/HealthBadge.tsx        # Health state display
    ui/ProgressBar.tsx        # Growth progress bar
    ui/RewardsList.tsx        # Milestone rewards
  lib/
    flower/day.ts             # Growth calculation
    flower/health.ts          # Health state logic
    flower/config.ts          # Flower type configs
    care/xp.ts                # XP calculation & cap
    care/streak.ts            # Streak calculation
    rewards/rewards.ts        # Reward definitions
    security/token.ts         # Secure token generation
    validation/schemas.ts     # Zod schemas
    db/client.ts              # Supabase client
    db/gifts.ts               # Gift CRUD
    db/care.ts                # Care event operations
    db/rewards.ts             # Reward operations
  types/
    index.ts                  # Core type definitions
    database.ts               # Supabase database types
supabase/
  migrations/001_initial_schema.sql
tests/
  flower-day.test.ts
  care-xp.test.ts
  rewards.test.ts
  health.test.ts
  token.test.ts
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-only)

### 3. Database setup

Run the migration in your Supabase SQL editor:

```bash
# Open supabase/migrations/001_initial_schema.sql
# Copy and run in Supabase SQL Editor
```

### 4. Start development server

```bash
npm run dev
```

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
npm run test         # Run tests
```

## Testing

```bash
npm run test
```

Tests cover:
- Flower day calculation and growth stages
- XP calculation and daily cap (20 XP max)
- Duplicate care prevention
- Streak calculation
- Health state transitions
- Reward unlocking at milestones
- Secure token generation (URL-safe, unique, random)

## Growth Stages

| Day | Stage | Visual |
|-----|-------|--------|
| 0 | Seed | Seed planted in soil |
| 1-3 | Sprout | Small green shoot |
| 4-7 | Young Plant | Small leaves, stronger stem |
| 8-14 | Growing Plant | Larger plant, more leaves |
| 15-21 | Bud | Visible flower bud |
| 22-29 | Pre-Bloom | Larger bud, showing color |
| 30 | Bloom | Flower opens |
| 30+ | Mature | Full flower remains |

## Health States

- **Healthy**: Cared within 1-2 days
- **Thirsty**: 2 days since last care
- **Wilting**: 3+ days since last care
- **Reviving**: Recovering from wilting

## XP System

- Water: +10 XP
- Sunshine: +5 XP
- Love: +5 XP
- Daily cap: 20 XP
- Duplicate care on same day: No additional XP

## Security

- Tokens generated using `crypto.randomBytes()` (128+ bits entropy)
- URL-safe tokens (base64url filtered)
- Server-side validation for all inputs
- Database uniqueness constraints prevent duplicate care
- Private gift pages marked noindex
- No secrets exposed to client
- Service role key stays server-only

## Vercel Deployment

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. Deploy

Environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## License

Private project.
