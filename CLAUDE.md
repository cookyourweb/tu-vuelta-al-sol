# Tu Vuelta al Sol - Claude Code Guide

## Project Overview

**Tu Vuelta al Sol** is a Spanish-language astrology web application that provides personalized astrological services: natal charts, solar return charts, progressed charts, and a printable astrological agenda book. The platform integrates Stripe for payments, Firebase for authentication, MongoDB for persistence, and OpenAI for AI-generated interpretations.

**Live URL**: https://www.tuvueltaalsol.es/

## Tech Stack

### Core Technologies
- **Framework**: Next.js (latest) with App Router
- **React**: 18.2.0 (pinned for stability -- do NOT upgrade without extensive testing)
- **TypeScript**: 5.0.4 (strict mode enabled)
- **Styling**: Tailwind CSS 4.1.11 (via `@tailwindcss/postcss`)
- **Database**: MongoDB (via Mongoose 8.16.2)
- **Authentication**: Firebase 11.10.0 + Firebase Admin 13.4.0
- **Payments**: Stripe 20.0.0 + @stripe/stripe-js 8.5.3

### Key Libraries
- **Astrology Calculations**: astronomy-engine 2.1.19
- **External Astrology API**: ProKerala (via custom client in `src/lib/prokerala/`)
- **AI Interpretations**: openai 5.12.2
- **UI**: lucide-react 0.525.0, framer-motion 12.23.12, react-draggable 4.5.0
- **Forms**: react-hook-form 7.60.0, @hookform/resolvers 5.1.1, zod 3.25.76
- **PDF Generation**: puppeteer 24.16.2, pdf-parse 1.1.1
- **Utilities**: date-fns 4.1.0, axios 1.4.0, clsx 2.1.1, tailwind-merge 3.3.1
- **Geocoding**: node-geocoder 4.4.1

### Dev Tools
- **Testing**: Jest 29 + ts-jest (jsdom environment)
- **Linting**: ESLint (next/core-web-vitals + next/typescript)
- **TypeScript**: strict mode, bundler module resolution

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm test          # Run Jest tests
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/home page
│   ├── (auth)/                   # Auth routes (login, register)
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard layout with auth guard
│   │   ├── agenda/               # Astrological agenda page
│   │   ├── birth-data/           # Birth data entry
│   │   ├── dashboard/            # Main dashboard
│   │   ├── natal-chart/          # Natal chart page
│   │   ├── profile/              # User profile
│   │   └── solar-return/         # Solar return chart
│   ├── admin/                    # Admin panel
│   ├── compra/                   # Purchase flow
│   │   ├── agenda/               # Agenda purchase
│   │   ├── pricing/              # Pricing page
│   │   ├── success/              # Payment success
│   │   └── cancel/               # Payment cancel
│   ├── shop/                     # Shop page
│   ├── api/                      # API routes (see API section below)
│   └── tests/                    # Test/debug pages
├── components/                   # React components
│   ├── admin/                    # Admin panel components
│   ├── agenda/                   # Agenda & book generation
│   │   ├── AgendaLibro/          # PDF book components (calendario, indices, etc.)
│   │   └── Libro/                # Alternative book implementation
│   ├── astrology/                # Chart wheels, aspects, planets, interpretations
│   │   └── tooltips/             # Chart tooltips
│   ├── auth/                     # Login/register forms
│   ├── dashboard/                # Dashboard widgets
│   ├── debug/                    # Debug utilities
│   ├── icons/                    # Custom SVG icons (Logo, LogoSimple, LogoSimpleGold)
│   ├── layout/                   # PrimaryHeader, MobileBottomNav, Footer
│   ├── modals/                   # Modal dialogs (WelcomeModal)
│   ├── solar-return/             # Solar return components & drawers
│   ├── stripe/                   # PaymentButton, SubscriptionManager
│   ├── test/                     # Test components (MongoDB, ProKerala, etc.)
│   └── ui/                       # Button, Input, Alert, FloatingActionPanel
├── constants/                    # Constants and configuration
│   ├── astrology.ts              # Core astrology constants
│   └── astrology/                # Chart, progressed, psychological constants
├── context/                      # React Context providers
│   ├── AuthContext.tsx            # Firebase auth state
│   ├── NotificationContext.tsx    # Toast notifications
│   └── StyleContext.tsx           # Theme/style state
├── data/                         # Static data
│   ├── astrology.ts              # Astrology reference data
│   └── interpretations/          # Pre-built interpretation templates
├── hooks/                        # Custom React hooks
│   ├── useChart.ts, useAspects.ts, usePlanets.ts, etc.
│   ├── astrology/                # Chart display hooks
│   └── lib/
│       ├── db.ts, firebase.ts    # Library hooks
│       └── prokerala/             # ProKerala API hooks
├── lib/                          # Library integrations
│   ├── db.ts                     # MongoDB connection
│   ├── stripe.ts                 # Stripe configuration
│   ├── apiClient.ts              # API client
│   ├── firebase-client.ts        # Firebase client-side
│   ├── firebaseAdmin.ts          # Firebase admin SDK
│   ├── firebase/                 # Firebase config, client, admin
│   └── prokerala/                # ProKerala client, endpoints, types
├── models/                       # MongoDB/Mongoose models
│   ├── User.ts                   # User (uid, email, role, subscriptionStatus)
│   ├── BirthData.ts              # Birth data (date, time, location, coordinates)
│   ├── Chart.ts                  # Generic chart data
│   ├── NatalChart.ts             # Natal chart specific
│   ├── Interpretation.ts         # Stored interpretations
│   ├── EventInterpretation.ts    # Event-specific interpretations
│   ├── Subscription.ts           # Stripe subscription records
│   └── AIUsage.ts                # AI API usage tracking
├── services/                     # Business logic (23 services)
│   ├── userDataService.ts        # User CRUD operations
│   ├── chartCalculationsService.ts
│   ├── chartInterpretationsService.ts
│   ├── chartRenderingService.tsx
│   ├── astrologyService.ts
│   ├── astrologicalEventsService.ts
│   ├── agendaGenerator.ts
│   ├── prokeralaService.ts       # ProKerala API integration
│   ├── progressedChartService.tsx
│   ├── solarReturnInterpretationService.ts
│   ├── eventInterpretationService.ts / V2
│   ├── natalBatchInterpretationService.ts
│   ├── cleanNatalInterpretationService.ts
│   ├── completeNatalInterpretationService.ts
│   ├── educationalInterpretationService.ts
│   ├── tripleFusedInterpretationService.ts  # 3-layer interpretation fusion
│   ├── trainedAssistantService.ts  # OpenAI trained assistant
│   ├── cacheService.ts
│   └── kitGenerator.ts
├── types/                        # TypeScript type definitions
│   ├── interpretations.ts
│   └── astrology/                # basic, chart, aspects, events, interpretation, etc.
├── utils/                        # Utility functions
│   ├── dateTimeUtils.ts, planetNameUtils.ts, agendaAccessControl.ts, etc.
│   ├── astrology/                # Calculations, coordinate utils, event generators
│   └── prompts/                  # OpenAI prompt templates for all interpretation types
└── styles/
    └── print-libro.css           # Print styles for agenda book
```

## API Routes

### User & Auth
- `POST/GET /api/birth-data` - Birth data CRUD
- `GET /api/birth-data/all` - All birth data
- `GET/POST /api/users` - User management
- `GET /api/debug-auth` - Auth debugging

### Chart Calculation
- `POST /api/charts/natal` - Natal chart
- `POST /api/charts/progressed` - Progressed chart
- `POST /api/charts/solar-return` - Solar return chart
- `POST /api/astrology/natal-chart` - Alternative natal endpoint
- `POST /api/astrology/progressed-chart-accurate` - Accurate progressed chart
- `POST /api/astrology/planetary-cards` - Planetary cards data

### AI Interpretations
- `POST /api/astrology/interpret-natal` - Natal interpretation
- `POST /api/astrology/interpret-natal-clean` - Clean natal interpretation
- `POST /api/astrology/interpret-natal-complete` - Complete natal interpretation
- `POST /api/astrology/interpret-planet` - Individual planet
- `POST /api/astrology/interpret-aspect` - Aspect interpretation
- `POST /api/astrology/interpret-angle` - Angle interpretation
- `POST /api/astrology/interpret-chunk` - Chunk-based interpretation
- `POST /api/astrology/interpret-events` - Event interpretation
- `POST /api/astrology/interpret-solar` - Solar return interpretation
- `POST /api/astrology/interpret-solar-return` - Full SR interpretation
- `POST /api/astrology/interpret-aspect-sr` - SR aspect interpretation
- `POST /api/astrology/interpret-planet-sr` - SR planet interpretation
- `POST /api/astrology/progressed-interpretation` - Progressed chart interpretation
- `POST /api/astrology/synthesis-annual` - Annual synthesis

### Agenda & Events
- `POST /api/astrology/solar-year-events` - Solar year events
- `POST /api/astrology/monthly-events` - Monthly events
- `POST /api/astrology/complete-events` - Complete event generation
- `GET /api/astrology/simple-agenda` - Simple agenda
- `GET /api/astrology/get-agenda` - Get agenda
- `POST /api/astrology/generate-week-model` - Weekly model
- `POST /api/astrology/generate-agenda-ai` - AI-generated agenda
- `POST /api/agenda/generate-book` - Generate agenda book PDF

### Events
- `GET /api/events/astrological` - Astrological events

### Payments (Stripe)
- `POST /api/checkout` - Create checkout session
- `GET /api/checkout/products` - Available products
- `GET /api/subscription/status` - Subscription status
- `POST /api/subscription/cancel` - Cancel subscription
- `POST /api/webhook` - Stripe webhook handler

### Cache & Interpretations Storage
- `POST /api/cache/save` - Save to cache
- `GET /api/cache/check` - Check cache
- `GET /api/cache/stats` - Cache statistics
- `POST /api/interpretations/save` - Save interpretation
- `GET /api/interpretations` - Get interpretations
- `POST /api/interpretations/clear-cache` - Clear interpretation cache

### ProKerala (External Astrology API)
- `POST /api/prokerala/token` - Get API token
- `POST /api/prokerala/natal-chart` - Natal chart
- `POST /api/prokerala/progressed-chart` - Progressed chart
- `GET /api/prokerala/location-search` - Location search

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/update-role` - Update user role
- `POST /api/admin/delete-user` - Delete user
- `POST /api/admin/clear-cache` - Clear cache
- `POST /api/admin/clear-database` - Clear database
- `POST /api/admin/reset-interpretations` - Reset interpretations

### PDF & Geocoding
- `POST /api/pdf/generate` - Generate PDF report
- `GET /api/geocode` - Forward geocoding
- `GET /api/reverse-geocode` - Reverse geocoding

## Database Models (Mongoose)

| Model | Collection | Key Fields |
|-------|-----------|------------|
| `User` | users | uid, email, fullName, role (`user`/`admin`), subscriptionStatus (`free`/`premium`/`none`) |
| `BirthData` | birthdatas | userId, fullName, birthDate, birthTime, birthPlace, latitude, longitude, timezone, currentPlace fields for SR |
| `Chart` | charts | Generic chart storage |
| `NatalChart` | natalcharts | Natal chart calculations |
| `Interpretation` | interpretations | Stored AI interpretations |
| `EventInterpretation` | eventinterpretations | Event-specific interpretations |
| `Subscription` | subscriptions | userId, stripeCustomerId, stripeSubscriptionId, status, currentPeriodStart/End |
| `AIUsage` | aiusages | userId, annualAICalls (year-based limits), callHistory, optimization metrics |

## Important Conventions

### Import Paths
Always use the `@/` alias for imports:
```typescript
import { AuthContext } from '@/context/AuthContext';
import PrimaryHeader from '@/components/layout/PrimaryHeader';
```

### Component Patterns
- Server Components by default
- Client Components marked with `'use client'` directive
- Props interfaces defined inline or exported from the component file

### Styling
- Tailwind utility classes throughout
- Custom color palette: purple, yellow, orange gradients (cosmic aesthetic)
- Dark theme with purple/cosmic tones
- Mobile-first responsive design
- Print styles in `src/styles/print-libro.css` for agenda book PDF output

### Icons
- Primary icon library: **Lucide React**
- Custom SVG components in `src/components/icons/`:
  - `Logo`: Full logo (desktop)
  - `LogoSimple`: Standard yellow/orange gradient sun (mobile)
  - `LogoSimpleGold`: Gold gradient sun (#FFD700 -> #FFA500)

### ESLint Configuration
- `@typescript-eslint/no-unused-vars`: warn (not error)
- `@typescript-eslint/no-explicit-any`: warn
- `react/no-unescaped-entities`: error only for `< > { }` (quotes allowed for Spanish text)
- `react-hooks/exhaustive-deps`: warn
- `no-console`: warn in production, off in development

### Middleware
The root `middleware.ts` is currently **disabled** -- it passes all requests through. Individual API routes handle their own authentication.

## Authentication

- **Firebase Auth** with email/password
- Auth state managed via `AuthContext` (`src/context/AuthContext.tsx`)
- `useAuth()` hook provides: `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `register`, `resetPassword`, `refreshUser`
- Protected routes live under the `(dashboard)` route group
- API routes authenticate via Firebase Admin SDK (server-side token verification)

## Key Services

### User Data (`src/services/userDataService.ts`)
- `getUserBirthData(userId)` - Fetch birth data
- `getUserProfile(userId)` - Complete user profile
- `saveUserBirthData(userId, birthData)` - Save/update birth data
- `checkUserDataCompleteness(userId)` - Validate required data

### Interpretation Pipeline
The project uses a multi-layer interpretation system:
1. **Layer 1**: Raw astronomical data from astronomy-engine or ProKerala
2. **Layer 2**: Pre-built interpretation templates from `src/data/interpretations/`
3. **Layer 3**: AI-generated interpretations via OpenAI (gpt-4o-mini)

Interpretation services include: clean natal, complete natal, educational, triple-fused, event-based, solar return, and progressed chart interpretations. Prompts are stored in `src/utils/prompts/`.

### AI Usage Tracking
The `AIUsage` model tracks per-user annual AI call limits to control costs. Users get a limited number of AI interpretation calls per year.

## Deployment

### Platform
- **Vercel** for hosting
- Auto-deploys from `main` branch
- Preview deployments for feature branches
- `vercel.json` uses `--legacy-peer-deps` for install

### Build
```bash
npm run build
```

### Known Production Considerations
- React 18.2.0 is pinned due to Next.js compatibility -- do not upgrade
- `vercel.json` specifies `npm install --legacy-peer-deps` to resolve dependency conflicts
- Vercel deployment may sometimes require manual trigger

## Environment Variables

Required environment variables (no `.env.example` exists -- check with project owner):
- **Firebase**: `NEXT_PUBLIC_FIREBASE_*` config keys, `FIREBASE_ADMIN_*` credentials
- **MongoDB**: `MONGODB_URI` connection string
- **Stripe**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **OpenAI**: `OPENAI_API_KEY`
- **ProKerala**: `PROKERALA_CLIENT_ID`, `PROKERALA_CLIENT_SECRET`
- **Geocoding**: geocoder API keys
- **Next.js**: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

## Git Workflow

### Branch Naming Convention
**CRITICAL**: All Claude Code branches MUST follow this pattern:
```
claude/[description]-[sessionID]
```

### Main Branch
- `main` is the primary branch
- Production deploys from `main` via Vercel

### Push Protocol
```bash
git push -u origin <branch-name>
```
If push fails with network errors, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

**NEVER** push directly to `main` without explicit user permission.

## Mobile Navigation

The `MobileBottomNav` component renders bottom navigation with:
- Nacimiento (Birth Data) -- Sparkles icon
- Natal (Natal Chart) -- Star icon
- R.Solar (Solar Return) -- Sun icon
- Agenda -- Calendar icon
- Admin (admin users only) -- Settings icon

## Astrological Features

### Natal Chart
- Birth data collection (date, time, location with geocoding)
- Chart calculation via astronomy-engine and ProKerala
- Interactive chart wheel with aspects, houses, tooltips
- AI-generated interpretations (planets, aspects, angles)

### Solar Return
- Annual solar return calculations
- Custom current-location support for relocated charts
- Planet-by-planet interpretation drawers
- PDF report generation

### Progressed Chart
- Secondary progression calculations
- Visual comparison with natal chart

### Astrological Agenda
- Personalized event generation (transits, aspects, lunar phases)
- Monthly and annual calendar views
- AI-interpreted events
- Printable agenda book (A5 format) with:
  - Cover/back cover pages
  - Table of contents
  - Monthly calendars with event annotations
  - Soul chart, creative therapy, annual cycles sections
  - Special pages for birthdays and cycle transitions

## Documentation

The `documentacion/` directory contains 34+ markdown files covering:
- Architecture decisions (`ARQUITECTURA_3_CAPAS.md`)
- Stripe integration guides (`STRIPE_SETUP.md`, `STRIPE_PRODUCTOS.md`, `STRIPE_ENV_SETUP.md`)
- Interpretation system design (`SISTEMA_INTERPRETACIONES.md`, `SISTEMA_INTERPRETACIONES_LLM.md`)
- Session summaries and progress notes
- Bug analysis (`documentacion/BUGDEAPIS/`)

Root-level docs include `TODO.md`, `GUIA_RAPIDA_DESARROLLO.md`, and various feature-specific markdown files.

## Tips for Working with This Project

1. **Always read files before modifying them** -- the codebase has evolved through many sessions
2. **Use the `@/` path alias** -- never use relative imports like `../../../`
3. **Test locally before pushing** -- run `npm run dev` to verify changes
4. **Check mobile responsiveness** -- significant mobile optimization throughout
5. **Respect the color scheme** -- purple/yellow/orange cosmic theme is intentional
6. **Firebase Auth is critical** -- don't modify auth flow without understanding the full impact
7. **Stripe integration is active** -- be careful with payment-related changes
8. **React 18.2.0 is pinned** -- don't upgrade React without extensive testing
9. **Middleware is disabled** -- API routes handle their own auth; don't re-enable middleware without understanding the history (caused production issues before)
10. **AI usage is metered** -- the `AIUsage` model enforces annual call limits per user
11. **ProKerala API** -- external astrology API with its own token management; check `src/lib/prokerala/` and `src/hooks/lib/prokerala/`
12. **Print/PDF output** -- agenda book components use specific A5 formatting and print CSS; test print layout carefully
13. **Spanish-language UI** -- all user-facing text is in Spanish; maintain language consistency

## Stable References

- Commit `0135c0c`: Safe revert point if authentication/middleware issues arise
- The middleware was intentionally disabled after production auth failures

---

**Last Updated**: 2026-02-09
**Maintained By**: Claude Code Sessions
**Project Owner**: cookyourweb
