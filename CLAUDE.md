# Tu Vuelta al Sol - Claude Code Guide

## Project Overview

**Tu Vuelta al Sol** is an astrology web application that provides personalized astrological services including natal charts, solar return charts, and an astrological agenda. The platform integrates with Stripe for payments and uses Firebase for authentication.

**Live URL**: https://www.tuvueltaalsol.es/

## Tech Stack

### Core Technologies
- **Framework**: Next.js (latest) with App Router
- **React**: 18.2.0 (pinned for stability)
- **TypeScript**: 5.0.4
- **Styling**: Tailwind CSS 4.1.11
- **Database**: MongoDB (via Mongoose 8.16.2)
- **Authentication**: Firebase 11.10.0 + Firebase Admin 13.4.0
- **Payments**: Stripe 20.0.0

### Key Libraries
- **Astrology**: astronomy-engine 2.1.19
- **UI**: lucide-react 0.525.0, framer-motion 12.23.12
- **Forms**: react-hook-form 7.60.0, @hookform/resolvers 5.1.1, zod 3.25.76
- **AI**: openai 5.12.2
- **PDF Generation**: puppeteer 24.16.2, pdf-parse 1.1.1
- **Utilities**: date-fns 4.1.0, axios 1.4.0, clsx 2.1.1

### Dev Tools
- Jest for testing
- ESLint for linting
- TypeScript strict mode enabled

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── agenda/
│   │   ├── birth-data/
│   │   ├── dashboard/
│   │   ├── natal-chart/
│   │   ├── profile/
│   │   └── solar-return/
│   ├── admin/               # Admin panel
│   ├── api/                 # API routes
│   │   └── astrology/      # Astrology calculations
│   └── compra/             # Purchase flow pages
│       ├── agenda/
│       ├── pricing/
│       ├── success/
│       └── cancel/
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── astrology/          # Astrology-specific components
│   │   └── tooltips/
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── debug/              # Debug utilities
│   ├── icons/              # Custom SVG icons (LogoSimple, LogoSimpleGold)
│   ├── layout/             # Layout components (PrimaryHeader, MobileBottomNav)
│   ├── modals/             # Modal dialogs
│   ├── solar-return/       # Solar return specific components
│   ├── stripe/             # Stripe integration components
│   ├── test/               # Test components
│   └── ui/                 # Generic UI components
├── constants/              # Constants and configuration
│   └── astrology/
├── context/                # React Context providers (AuthContext)
├── data/                   # Static data
│   └── interpretations/   # Astrological interpretations
├── hooks/                  # Custom React hooks
│   ├── astrology/
│   └── lib/
│       └── prokerala/
├── lib/                    # Library integrations
│   ├── firebase/          # Firebase configuration
│   └── prokerala/         # ProKerala API integration
├── models/                 # MongoDB/Mongoose models
├── services/               # Business logic services
├── types/                  # TypeScript type definitions
│   └── astrology/
├── utils/                  # Utility functions
│   ├── astrology/
│   └── prompts/
└── constants/              # App-wide constants
```

## Key Configuration Files

### package.json
- Scripts: `dev`, `build`, `start`, `lint`, `test`
- React pinned to 18.2.0 for production stability
- Next.js using latest version

### tsconfig.json
- Path alias: `@/*` → `./src/*`
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler

### next.config.ts
- Minimal configuration (default Next.js setup)

## Important Conventions

### Import Paths
Always use `@/` alias for imports:
```typescript
import { AuthContext } from '@/context/AuthContext';
import PrimaryHeader from '@/components/layout/PrimaryHeader';
```

### Component Structure
- Server Components by default
- Client Components marked with `'use client'` directive
- Props interfaces defined inline or exported

### Styling
- Tailwind utility classes
- Custom color palette: purple, yellow, orange gradients
- Responsive design with mobile-first approach
- Dark theme with purple/cosmic aesthetic

### Icons
- Primary icon library: **Lucide React**
- Custom SVG components in `src/components/icons/`
- Logo variants:
  - `LogoSimple`: Standard yellow/orange gradient sun (for mobile)
  - `LogoSimpleGold`: Gold gradient sun variant (#FFD700 → #FFA500)
  - `Logo`: Full logo (for desktop)

## Authentication & User Flow

### Firebase Auth
- Email/password authentication
- User context via `AuthContext` (`src/context/AuthContext.tsx`)
- Protected routes in `(dashboard)` group

### User Data Service
- Service: `src/services/userDataService.ts`
- Functions:
  - `getUserBirthData(userId)`: Fetch birth data
  - `getUserProfile(userId)`: Complete user profile
  - `saveUserBirthData(userId, birthData)`: Save/update birth data
  - `checkUserDataCompleteness(userId)`: Validate required data

## Git Workflow

### Branch Naming Convention
**CRITICAL**: All branches MUST follow this pattern:
```
claude/[description]-[sessionID]
```

Example: `claude/visual-improvements-018yVirvPCdaUMFpETP4HATz`

### Main Branch
- `main` is the primary branch
- Production deploys from `main` via Vercel

### Push Protocol
Always use:
```bash
git push -u origin <branch-name>
```

If push fails with network errors, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

**NEVER** push directly to `main` without explicit user permission.

### Current Branch
As of last session: `claude/visual-improvements-018yVirvPCdaUMFpETP4HATz`

## Deployment

### Platform
- **Vercel** for hosting and deployment
- Auto-deploys from `main` branch
- Preview deployments for feature branches

### Build
```bash
npm run build
```

### Production Issues History
- React 18.2.0 pinned due to Next.js compatibility issues
- Previous middleware authentication problems resolved by reverting to commit `0135c0c`
- Vercel deployment sometimes requires manual trigger

## Environment Variables

The project uses environment variables for:
- Firebase configuration
- MongoDB connection
- Stripe API keys
- OpenAI API key
- NextAuth URL

**Note**: No `.env.example` file exists. Check with project owner for required variables.

## Common Tasks

### Start Development Server
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Recent Changes & Known Issues

### Visual Improvements (Latest)
- Desktop header logo reduced: 52px → 44px
- Mobile header logo increased: 40px → 48px
- Badge text shortened: "Agenda Astrológica Personalizada" → "Agenda Astrológica"
- Badge spacing improved with `mt-1`
- Mobile nav sun icon: Changed from `Sunrise` to `Sun`, size increased to 28px
- Created `LogoSimpleGold.tsx` as alternative gold gradient logo

### Stable Commit Reference
- Commit `0135c0c`: Last known stable version before middleware auth issues
- This is a safe revert point if authentication problems arise

### Git Issues
- Direct pushes to `main` often fail with HTTP 403
- Solution: Use feature branches with proper naming convention

## API Endpoints Structure

```
/api/
├── birth-data          # User birth data CRUD
├── charts/
│   ├── natal          # Natal chart generation
│   └── progressed     # Progressed chart generation
├── astrology/         # Astrological calculations
├── users              # User profile management
└── stripe/            # Payment processing
```

## Astrological Features

### Natal Chart
- Birth data collection (date, time, location, coordinates)
- Chart calculation using astronomy-engine
- Interpretations using OpenAI

### Solar Return
- Annual solar return calculations
- Custom location support
- PDF report generation

### Agenda
- Personalized astrological events
- Transit tracking
- Daily/weekly/monthly views

## Database Models (Mongoose)

Located in `src/models/`:
- User profiles
- Birth data
- Chart data
- Subscription/payment records

## UI Components

### Layout Components
- `PrimaryHeader`: Main navigation header (desktop + mobile logo)
- `MobileBottomNav`: Mobile bottom navigation bar (5 items for admin, 4 for regular users)

### Mobile Navigation Items
- Nacimiento (Birth Data) - Sparkles icon
- Natal (Natal Chart) - Star icon
- R.Solar (Solar Return) - Sun icon
- Agenda - Calendar icon
- Admin (admin only) - Settings icon

## Documentation Files

Additional documentation in repo:
- `PLAN_ACCION_INTERPRETACION.md`: Interpretation system plan
- `STRIPE_SETUP.md`, `STRIPE_PRODUCTOS.md`, `STRIPE_ENV_SETUP.md`: Stripe integration
- `TODO.md`: Project tasks
- `Guialogos.md`: Logo guidelines
- `estructura e archios.md`: File structure documentation
- `documentacion/`: Extended documentation directory

## Tips for Working with This Project

1. **Always read files before modifying them** - The codebase has evolved significantly
2. **Use the `@/` path alias** - Never use relative imports like `../../../`
3. **Test locally before pushing** - Run `npm run dev` to verify changes
4. **Check mobile responsiveness** - This app has significant mobile optimization
5. **Respect the color scheme** - Purple/yellow/orange cosmic theme is intentional
6. **Firebase Auth is critical** - Don't modify auth flow without understanding impact
7. **Stripe integration is active** - Be careful with payment-related changes
8. **MongoDB queries may be slow** - Consider performance implications
9. **React 18.2.0 is pinned** - Don't upgrade React without extensive testing
10. **Git branch naming is enforced** - Always use `claude/[description]-[sessionID]` format

## Contact & Support

For questions about:
- Authentication issues → Check Firebase console
- Payment issues → Check Stripe dashboard
- Deployment issues → Check Vercel dashboard
- Database issues → Check MongoDB Atlas

## Version History

- **1.0.0**: Initial production release
- Latest stable commit: `7a0ce8e` (header badge spacing and mobile logo improvements)

---

**Last Updated**: 2025-12-08
**Maintained By**: Claude Code Sessions
**Project Owner**: cookyourweb
