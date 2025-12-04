# CLAUDE.md - AI Assistant Guide for Tu Vuelta al Sol

> **Last Updated**: 2025-12-04
> **Project Version**: 1.0.0
> **Target Audience**: AI Assistants (Claude, GPT, etc.)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Data Flow](#architecture--data-flow)
4. [Directory Structure](#directory-structure)
5. [Development Workflow](#development-workflow)
6. [Key Conventions & Patterns](#key-conventions--patterns)
7. [Database Models](#database-models)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Common Development Tasks](#common-development-tasks)
10. [Testing Strategy](#testing-strategy)
11. [Deployment & Environment](#deployment--environment)
12. [Important Considerations](#important-considerations)
13. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🌟 Project Overview

**Tu Vuelta al Sol** is a sophisticated astrological web application that generates personalized astrological agendas based on users' natal charts and solar returns. The application combines precise astronomical calculations with AI-powered interpretations to provide tailored guidance and actionable advice aligned with planetary transits.

### Core Features

- **Natal Chart Generation**: Complete natal chart calculations with planetary positions, houses, and aspects
- **Solar Return Charts**: Annual solar return analysis with location-based calculations
- **Progressed Charts**: Secondary progressions tracking personal evolution
- **Astrological Agenda**: AI-generated personalized calendars covering lunar phases, transits, retrogrades, and eclipses
- **AI Interpretations**: OpenAI-powered interpretations for charts, planets, aspects, and events
- **Subscription Management**: Stripe-based payment processing with tiered access
- **User Authentication**: Firebase Authentication with role-based access control
- **Admin Panel**: User management, data administration, and system monitoring

### Product Philosophy

The application balances **maximum astrological precision** with **user-friendly accessibility**, making complex astrological concepts actionable through AI-generated guidance and beautiful visualizations.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15+ (App Router with React Server Components)
- **UI Library**: React 19
- **Styling**:
  - Tailwind CSS 4.1+ (utility-first styling)
  - Framer Motion (animations and transitions)
  - Custom CSS for astrological wheel visualizations
- **Forms**: React Hook Form + Zod (schema validation)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Inter, Playfair Display)

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **Database**: MongoDB 8.16+ with Mongoose ODM
- **Authentication**: Firebase Authentication (client + admin SDK)
- **File Storage**: Firebase Storage (future implementation)

### External APIs & Services
- **Prokerala API**: Professional astrological calculations and chart data
- **OpenAI API**: GPT-4 for AI-powered interpretations
- **Stripe**: Payment processing and subscription management
- **Geocoding**: Node-geocoder for location coordinates and timezone resolution

### Development Tools
- **Language**: TypeScript 5.0+
- **Package Manager**: npm (with `--legacy-peer-deps` flag for installation)
- **Testing**: Jest + ts-jest (DOM environment with jsdom)
- **Linting**: ESLint with Next.js and TypeScript configs
- **Build**: Next.js build system
- **Deployment**: Vercel (serverless functions with 60s timeout for astrology routes)

---

## 🏗 Architecture & Data Flow

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ React Pages  │  │   Context    │  │ Custom Hooks │          │
│  │  (App Router)│  │  Providers   │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
└─────────┼─────────────────┼──────────────────┼───────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/astrology/*  (maxDuration: 60s)                    │  │
│  │  /api/birth-data/*                                       │  │
│  │  /api/charts/*                                           │  │
│  │  /api/checkout/*  /api/subscription/*  /api/webhook     │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICES LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Astrology   │  │  Prokerala   │  │ Interpretation│          │
│  │   Service    │  │   Service    │  │   Services    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
└─────────┼─────────────────┼──────────────────┼───────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA & EXTERNAL APIs                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MongoDB    │  │  Firebase    │  │   OpenAI     │          │
│  │  (Mongoose)  │  │     Auth     │  │     API      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Prokerala   │  │    Stripe    │  │  Geocoding   │          │
│  │     API      │  │     API      │  │    Service   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. User Authentication Flow
```
User Input → Firebase Auth (client) → AuthContext → Auto-sync to MongoDB User model
→ Role-based route protection → Subscription status check
```

#### 2. Chart Generation Flow
```
Birth Data Input → Geocoding (coordinates + timezone) → Store in BirthData model
→ Prokerala API (astronomical calculations) → Chart calculation service
→ Store in Chart model with caching → Display to user
```

#### 3. AI Interpretation Flow
```
Chart/Event data → Interpretation service (with prompts) → OpenAI API
→ Cache in Interpretation model → Return to client → Display in drawer/modal
```

#### 4. Payment Flow
```
User selects product → Stripe checkout session → Redirect to Stripe
→ Payment completion → Webhook to /api/webhook → Update subscription status
→ Grant access to premium features
```

### State Management Strategy

- **Authentication**: React Context (`AuthContext`) with Firebase session persistence
- **Notifications**: React Context (`NotificationContext`) for toast messages
- **Server State**: MongoDB as single source of truth
- **Client State**: React state + custom hooks for derived data
- **Caching**: MongoDB-based cache service with TTL for expensive calculations
- **Cross-component Events**: Custom DOM events (e.g., `birthDataSaved`)

---

## 📁 Directory Structure

```
tu-vuelta-al-sol/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group (login, register)
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── agenda/               # Astrological agenda page
│   │   │   ├── birth-data/           # Birth data entry page
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── natal-chart/          # Natal chart display
│   │   │   ├── profile/              # User profile
│   │   │   ├── solar-return/         # Solar return page
│   │   │   └── layout.tsx            # Protected layout with nav
│   │   ├── admin/                    # Admin panel (role-restricted)
│   │   ├── api/                      # API routes (see API section below)
│   │   ├── compra/                   # Purchase flow pages
│   │   ├── shop/                     # Shop page
│   │   ├── tests/                    # Manual testing pages
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home/landing page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # React components
│   │   ├── admin/                    # Admin-specific components
│   │   ├── astrology/                # Astrological visualization components
│   │   │   ├── AstrologicalAgendaGenerator.tsx
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── InterpretationDrawer.tsx
│   │   │   ├── ChartProgressModal.tsx
│   │   │   └── ...
│   │   ├── auth/                     # Auth forms (Login, Register)
│   │   ├── dashboard/                # Dashboard components
│   │   ├── layout/                   # Layout components (Header, Footer, Nav)
│   │   ├── modals/                   # Modal components
│   │   ├── stripe/                   # Payment components
│   │   ├── ui/                       # Reusable UI components (shadcn/ui based)
│   │   └── test/                     # Test components
│   │
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication state
│   │   └── NotificationContext.tsx   # Toast notifications
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── astrology/                # Astrology-specific hooks
│   │   ├── useAuth.ts                # Auth hook (from context)
│   │   ├── useChart.ts               # Chart data management
│   │   ├── useChartDisplay.ts        # Chart visualization state
│   │   ├── usePlanets.ts             # Planet data extraction
│   │   ├── useAspects.ts             # Aspect calculations
│   │   ├── useInterpretationDrawer.ts # Interpretation UI state
│   │   └── useProkeralaApi.ts        # Prokerala API integration
│   │
│   ├── lib/                          # Library configurations
│   │   ├── db.ts                     # MongoDB connection
│   │   ├── firebase.ts               # Firebase client config
│   │   ├── firebaseAdmin.ts          # Firebase admin SDK
│   │   ├── stripe.ts                 # Stripe client
│   │   ├── utils.ts                  # Utility functions
│   │   ├── firebase/                 # Firebase modules
│   │   │   ├── config.ts
│   │   │   ├── client.ts
│   │   │   └── admin.ts
│   │   └── prokerala/                # Prokerala API client
│   │       ├── client.ts
│   │       ├── endpoints.ts
│   │       └── types.ts
│   │
│   ├── models/                       # MongoDB Mongoose schemas
│   │   ├── User.ts                   # User model (synced with Firebase)
│   │   ├── BirthData.ts              # Birth data with geocoding
│   │   ├── Chart.ts                  # Natal/progressed/solar return charts
│   │   ├── Subscription.ts           # Stripe subscription tracking
│   │   ├── Interpretation.ts         # AI interpretation cache
│   │   └── AIUsage.ts                # OpenAI usage tracking
│   │
│   ├── services/                     # Business logic layer
│   │   ├── astrologyService.ts       # Core astrological calculations
│   │   ├── astrologicalEventsService.ts # Event generation
│   │   ├── chartCalculationsService.ts  # Chart math
│   │   ├── chartRenderingService.tsx    # Chart visualization logic
│   │   ├── completeNatalInterpretationService.ts # Full natal AI
│   │   ├── solarReturnInterpretationService.ts   # Solar return AI
│   │   ├── educationalInterpretationService.ts   # Educational content
│   │   ├── tripleFusedInterpretationService.ts   # Multi-source AI
│   │   ├── trainedAssistantService.ts  # Trained AI assistant
│   │   ├── progressedChartService.tsx  # Progressed charts
│   │   ├── prokeralaService.ts         # Prokerala API wrapper
│   │   ├── cacheService.ts             # Caching layer
│   │   └── userDataService.ts          # User data operations
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── astrology/                # Astrological types
│   │   │   ├── unified-types.ts      # Main astrological interfaces
│   │   │   ├── aspects.ts
│   │   │   ├── basic.ts
│   │   │   ├── chart.ts
│   │   │   ├── chartDisplay.ts
│   │   │   ├── chartConstants.ts
│   │   │   ├── interpretation.ts
│   │   │   ├── utils.ts
│   │   │   └── index.ts
│   │   └── interpretations.ts
│   │
│   ├── utils/                        # Utility functions
│   │   ├── astrology/                # Astrological utilities
│   │   │   ├── generateCharts.ts
│   │   │   ├── degreeConverter.ts
│   │   │   ├── planetPositions.ts
│   │   │   ├── aspectCalculations.ts
│   │   │   ├── events.ts
│   │   │   ├── solarYearEvents.ts
│   │   │   ├── solarReturnComparison.ts
│   │   │   ├── completeEventGenerator.ts
│   │   │   └── agendaDateCalculator.ts
│   │   ├── prompts/                  # AI prompt templates
│   │   ├── agendaCalculator.ts
│   │   ├── dateTimeUtils.ts
│   │   └── planetNameUtils.ts
│   │
│   ├── constants/                    # Application constants
│   │   └── astrology/
│   │       ├── chartConstants.ts
│   │       ├── progressedChartConstants.ts
│   │       └── psychologicalTooltips.ts
│   │
│   └── data/                         # Static reference data
│       ├── astrology.ts
│       └── interpretations/
│
├── public/                           # Static assets
├── scripts/                          # Utility scripts
│   ├── parse_and_chunk_pdfs.js       # Book processing script
│   └── test-*.js                     # Testing scripts
├── astrology_books/                  # Reference materials
│   ├── chunks.json                   # Processed book content
│   └── *.pdf                         # Original astrology books
├── documentacion/                    # Project documentation
│
├── Configuration Files:
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript config (path alias: @/*)
├── next.config.js                    # Next.js config (ESLint ignored in builds)
├── vercel.json                       # Vercel deployment (60s timeout for astrology APIs)
├── eslint.config.mjs                 # ESLint rules
├── postcss.config.mjs                # PostCSS with Tailwind
├── jest.config.js                    # Jest testing config
└── .env.local                        # Environment variables (NOT in git)
```

---

## 🔄 Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd tu-vuelta-al-sol

# Install dependencies (IMPORTANT: use --legacy-peer-deps flag)
npm install --legacy-peer-deps

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables section)

# Run development server
npm run dev
# Server runs on http://localhost:3000 (or next available port)

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables Required

Create a `.env.local` file with:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Firebase Admin (Server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=

# Prokerala API
PROKERALA_CLIENT_ID=
PROKERALA_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=

# Stripe (use test keys in development)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product Price IDs
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_QUARTERLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_SEMIANNUAL_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID=price_...
```

### Git Workflow

```bash
# Current development branch
git checkout claude/claude-md-miqxp09739f04d59-018yVirvPCdaUMFpETP4HATz

# Create commits with descriptive messages
git add .
git commit -m "feat: add new feature description"

# Push to remote (use -u for first push on new branch)
git push -u origin claude/claude-md-miqxp09739f04d59-018yVirvPCdaUMFpETP4HATz
```

### Common Scripts

```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint",         // Run ESLint
  "test": "jest"               // Run tests
}
```

---

## 🎯 Key Conventions & Patterns

### 1. Code Organization Principles

- **Single Responsibility**: Each service, component, and function has one clear purpose
- **Separation of Concerns**: UI (components) ↔ Business Logic (services) ↔ Data Access (models)
- **DRY (Don't Repeat Yourself)**: Shared logic in hooks, services, and utilities
- **Type Safety**: Comprehensive TypeScript types for all data structures
- **Backwards Compatibility**: Dual field support in models for legacy data (e.g., `importance` + `priority`)

### 2. File Naming Conventions

- **Components**: PascalCase (e.g., `BirthDataForm.tsx`)
- **Utilities/Services**: camelCase (e.g., `astrologyService.ts`)
- **Types**: PascalCase interfaces (e.g., `interface AstrologicalEvent`)
- **API Routes**: kebab-case directories with `route.ts` files
- **Constants**: UPPER_SNAKE_CASE for values, PascalCase for objects

### 3. TypeScript Patterns

#### Dual Field Support (Backwards Compatibility)
```typescript
interface AstrologicalEvent {
  id: string;
  type: EventType;
  date: string;
  title: string;

  // Support both old and new field names
  importance: 'high' | 'medium' | 'low';  // New standard
  priority: 'high' | 'medium' | 'low';    // Legacy alias (deprecated)

  personalInterpretation?: PersonalizedInterpretation;  // New
  aiInterpretation?: PersonalizedInterpretation;        // Legacy (deprecated)
}
```

#### Unified Type System
All astrological types are centralized in `/src/types/astrology/unified-types.ts` to ensure consistency.

### 4. API Route Pattern

All API routes follow this structure:

```typescript
// /src/app/api/[domain]/[feature]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate input
    const body = await request.json();
    // Use Zod schema for validation if complex

    // 2. Connect to database
    await connectDB();

    // 3. Execute business logic (preferably via service layer)
    const result = await someService.doSomething(body);

    // 4. Return success response
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('❌ Error in API route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 5. Service Layer Pattern

Services encapsulate business logic and external API calls:

```typescript
// /src/services/exampleService.ts
import { ProkeralaClient } from '@/lib/prokerala/client';
import Chart from '@/models/Chart';

export class ExampleService {
  private prokeralaClient: ProkeralaClient;

  constructor() {
    this.prokeralaClient = new ProkeralaClient();
  }

  async generateChart(userId: string, birthData: BirthData) {
    // 1. Check cache
    const cached = await this.checkCache(userId);
    if (cached) return cached;

    // 2. Call external API
    const apiResult = await this.prokeralaClient.getNatalChart(birthData);

    // 3. Process and store
    const chart = await Chart.create({ userId, data: apiResult });

    // 4. Return result
    return chart;
  }
}
```

### 6. Component Patterns

#### Server Components (Default)
```typescript
// app/page.tsx - Fetches data on server
export default async function Page() {
  const data = await fetchData(); // Server-side fetch
  return <Display data={data} />;
}
```

#### Client Components (Interactive)
```typescript
'use client'; // Required for useState, useEffect, event handlers

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(!state)}>Toggle</button>;
}
```

### 7. Error Handling Conventions

```typescript
// Graceful degradation with user-friendly messages
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('❌ Operation failed:', error);

  // Return fallback or informative error
  return {
    success: false,
    error: 'Unable to complete operation. Please try again.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
}
```

### 8. Logging Conventions

Use emoji prefixes for visual scanning:
- ✅ Success/completion
- ❌ Errors
- ⚠️ Warnings
- 📡 API calls
- 🔍 Debug info
- 💾 Database operations
- 🎯 Important milestones

```typescript
console.log('✅ Chart generated successfully');
console.error('❌ Failed to connect to Prokerala API');
console.warn('⚠️ Using cached data - may be stale');
```

### 9. Database Connection Pattern

Always connect before database operations:

```typescript
import connectDB from '@/lib/db';

export async function handler() {
  await connectDB(); // Idempotent - safe to call multiple times

  const user = await User.findOne({ uid });
  // ... operations
}
```

### 10. Timezone Handling

- **Storage**: IANA timezone strings (e.g., `"Europe/Madrid"`)
- **API Calls**: Convert to offset format (e.g., `"+01:00"`)
- **Display**: User's local time or birth location time (context-dependent)

```typescript
// Stored in database
birthData.timezone = "America/New_York";

// Converted for Prokerala API
const offset = convertToOffset(birthData.timezone); // "-05:00"
```

---

## 💾 Database Models

### User Model (`/src/models/User.ts`)

```typescript
interface IUser extends Document {
  uid: string;              // Firebase UID (unique index)
  email: string;            // User email (required, unique)
  fullName: string;         // Display name
  role: 'user' | 'admin';   // Role-based access
  subscriptionStatus: 'free' | 'premium' | 'none';
  stripeCustomerId?: string;
  createdAt: Date;
  lastLogin: Date;
}
```

**Key Operations**:
- Synced automatically with Firebase Auth on registration/login
- Updated via `/api/users` endpoint
- Admin operations via `/api/admin/users`

### BirthData Model (`/src/models/BirthData.ts`)

```typescript
interface IBirthData extends Document {
  userId: string;           // Primary user identifier (indexed)
  uid?: string;             // Legacy compatibility field
  fullName: string;
  birthDate: Date;
  birthTime: string;        // Format: "HH:MM"
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;         // IANA timezone (e.g., "America/New_York")

  // Solar return specific fields
  livesInSamePlace?: boolean;
  currentPlace?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  currentTimezone?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

**Key Operations**:
- Created/updated via `/api/birth-data`
- Geocoding automatically fetches coordinates and timezone
- Used as input for all chart generation

### Chart Model (`/src/models/Chart.ts`)

```typescript
interface IChart extends Document {
  userId: string;
  birthDataId: ObjectId;
  chartType: 'natal' | 'progressed' | 'transit' | 'solar-return';

  natalChart: any;          // Main natal chart data from Prokerala

  // Progressed charts - supports both legacy and new formats
  progressedChart?: any;    // Legacy single progressed chart
  progressedCharts?: {      // New array format for multiple periods
    period: string;         // e.g., "2024-2025"
    year: number;
    startDate: Date;
    endDate: Date;
    chart: any;
    isActive: boolean;
  }[];

  solarReturnChart?: any;   // Solar return data

  createdAt: Date;
  updatedAt: Date;
}
```

**Key Operations**:
- Generated via `/api/charts/natal`, `/api/charts/progressed`, `/api/charts/solar-return`
- Cached after first generation
- Updated when birth data changes (with cache invalidation)

### Interpretation Model (`/src/models/Interpretation.ts`)

```typescript
interface IInterpretation extends Document {
  userId: string;
  chartId?: ObjectId;
  type: 'natal' | 'planet' | 'aspect' | 'event' | 'solar-return';
  content: string;          // AI-generated interpretation
  metadata?: {
    planetName?: string;
    aspectType?: string;
    eventId?: string;
  };
  createdAt: Date;
  expiresAt?: Date;         // TTL for cache
}
```

**Key Operations**:
- Cached AI interpretations to reduce OpenAI API costs
- Retrieved before making new API calls
- Cleaned up periodically via `/api/astrology/cleanup-interpretations`

### Subscription Model (`/src/models/Subscription.ts`)

```typescript
interface ISubscription extends Document {
  userId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Key Operations**:
- Created via Stripe webhook on successful payment
- Updated via `/api/webhook` on subscription changes
- Queried via `/api/subscription/status`

### AIUsage Model (`/src/models/AIUsage.ts`)

```typescript
interface IAIUsage extends Document {
  userId: string;
  endpoint: string;         // Which API endpoint was called
  tokensUsed: number;
  cost: number;             // Estimated cost in USD
  timestamp: Date;
}
```

**Key Operations**:
- Tracks OpenAI API usage per user
- Used for analytics and cost monitoring
- Aggregated for reporting

---

## 🔌 API Endpoints Reference

### Authentication & Users

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/users` | POST | Create/update user (synced with Firebase) | Yes |
| `/api/users?uid={uid}` | GET | Get user by UID | Yes |

### Birth Data

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/birth-data` | POST | Create/update birth data with geocoding | Yes |
| `/api/birth-data?userId={id}` | GET | Get user's birth data | Yes |
| `/api/birth-data/all` | GET | Get all birth data (admin only) | Admin |

### Charts

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/charts/natal?userId={id}` | GET | Get cached natal chart | Yes |
| `/api/charts/progressed?userId={id}` | GET | Get progressed chart(s) | Yes |
| `/api/charts/solar-return?userId={id}` | GET | Get solar return chart | Yes |

### Astrology & Interpretations

| Endpoint | Method | Description | Timeout |
|----------|--------|-------------|---------|
| `/api/astrology/natal-chart` | POST | Generate natal chart | 60s |
| `/api/astrology/interpret-natal` | POST | Full natal chart interpretation | 60s |
| `/api/astrology/interpret-planet` | POST | Single planet interpretation | 60s |
| `/api/astrology/interpret-events` | POST | Event interpretation | 60s |
| `/api/astrology/interpret-solar-return` | POST | Solar return interpretation | 60s |
| `/api/astrology/generate-agenda-ai` | POST | Generate AI-powered agenda | 60s |
| `/api/astrology/simple-agenda` | POST | Basic agenda without AI | 30s |
| `/api/astrology/complete-events` | POST | Complete event list for year | 60s |

### Prokerala Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prokerala/natal-chart` | POST | Fetch natal chart from Prokerala |
| `/api/prokerala/progressed-chart` | POST | Fetch progressed chart |
| `/api/prokerala/location-search` | POST | Search locations for coordinates |
| `/api/prokerala/token` | GET | Get/refresh OAuth token |

### Payments & Subscriptions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/checkout/products` | GET | Get available products/prices |
| `/api/subscription/status?userId={id}` | GET | Check subscription status |
| `/api/subscription/cancel` | POST | Cancel subscription |
| `/api/webhook` | POST | Stripe webhook handler |

### Geocoding

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/geocode` | POST | Get coordinates from address |
| `/api/reverse-geocode` | POST | Get address from coordinates |

### Cache Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cache/save` | POST | Save to cache |
| `/api/cache/check?key={key}` | GET | Check cache for key |
| `/api/cache/stats` | GET | Cache statistics |
| `/api/cache/invalidate` | POST | Invalidate cache entry |

### Admin

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/admin/users` | GET | List all users | Admin |
| `/api/admin/delete-user` | POST | Delete user + all data | Admin |
| `/api/admin/update-role` | POST | Update user role | Admin |

### Debug (Development Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/debug-auth` | GET | Debug authentication |
| `/api/debug-firebase` | GET | Debug Firebase config |
| `/api/debug/mongodb` | GET | Test MongoDB connection |

---

## 🛠 Common Development Tasks

### 1. Adding a New API Endpoint

```bash
# Create the route file
touch src/app/api/my-feature/route.ts
```

```typescript
// src/app/api/my-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();

    // Your logic here

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// If this is an astrology endpoint with long processing time,
// add to vercel.json:
// "src/app/api/my-feature/*.ts": { "maxDuration": 60 }
```

### 2. Creating a New Component

```bash
# Create component file
touch src/components/myfeature/MyComponent.tsx
```

```typescript
// src/components/myfeature/MyComponent.tsx
'use client'; // Only if using hooks or event handlers

import React from 'react';

interface MyComponentProps {
  data: string;
}

export default function MyComponent({ data }: MyComponentProps) {
  return (
    <div className="p-4">
      {data}
    </div>
  );
}
```

### 3. Adding a New Database Model

```bash
# Create model file
touch src/models/MyModel.ts
```

```typescript
// src/models/MyModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMyModel extends Document {
  userId: string;
  data: string;
  createdAt: Date;
}

const MyModelSchema = new Schema({
  userId: { type: String, required: true, index: true },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MyModel ||
  mongoose.model<IMyModel>('MyModel', MyModelSchema);
```

### 4. Adding a New Service

```bash
# Create service file
touch src/services/myService.ts
```

```typescript
// src/services/myService.ts
export class MyService {
  async doSomething(input: string): Promise<string> {
    // Business logic here
    return result;
  }
}

export const myService = new MyService();
```

### 5. Adding Environment Variables

```bash
# 1. Add to .env.local
echo "NEW_API_KEY=your_key_here" >> .env.local

# 2. Document in this file under Environment Variables section

# 3. Access in code:
# - Server-side: process.env.NEW_API_KEY
# - Client-side: process.env.NEXT_PUBLIC_NEW_API_KEY (must have NEXT_PUBLIC_ prefix)
```

### 6. Running Database Migrations

```typescript
// For schema changes, update the model and restart the server
// Mongoose will automatically update the schema

// For data migrations, create a script in /scripts/
// Example: scripts/migrate-add-field.ts
import connectDB from '../src/lib/db';
import User from '../src/models/User';

async function migrate() {
  await connectDB();

  await User.updateMany(
    { newField: { $exists: false } },
    { $set: { newField: 'default' } }
  );

  console.log('✅ Migration complete');
  process.exit(0);
}

migrate();
```

### 7. Testing API Endpoints Locally

```bash
# Use curl or the built-in test pages

# Example: Test MongoDB connection
curl http://localhost:3000/api/debug/mongodb

# Or visit test pages:
# http://localhost:3000/tests/test-mongodb
# http://localhost:3000/tests/test-natal-chart
# http://localhost:3000/tests/test-payments
```

### 8. Clearing Caches

```bash
# Clear Next.js build cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Clear MongoDB cache via API
curl -X POST http://localhost:3000/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{"key": "cache_key_here"}'
```

---

## 🧪 Testing Strategy

### Manual Testing Pages

The project includes manual testing pages in `/src/app/tests/`:

- `/tests/test-mongodb` - MongoDB connection test
- `/tests/test-natal-chart` - Natal chart generation test
- `/tests/test-progressed` - Progressed chart test
- `/tests/test-timezone` - Timezone handling test
- `/tests/test-agenda-ai` - AI agenda generation test
- `/tests/test-payments` - Stripe payment flow test

### Test Components

Located in `/src/components/test/`:
- `MongoDBTest.tsx` - Database connectivity
- `ProkeralaNatalTest.tsx` - Prokerala API integration
- `NatalChartTest.tsx` - Chart generation
- `TimezoneTestComponent.tsx` - Timezone calculations

### Jest Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.spec.ts
```

Configuration in `jest.config.js`:
- Preset: `ts-jest`
- Environment: `jsdom` (browser-like)
- Setup file: `jest.setup.ts`

### Testing Best Practices

1. **API Endpoints**: Use test pages or curl for manual testing
2. **Components**: Use Jest with React Testing Library (future implementation)
3. **Services**: Unit test business logic with mocked dependencies
4. **Integration**: Test full flows using test pages
5. **Stripe**: Use Stripe test cards (4242 4242 4242 4242)

---

## 🚀 Deployment & Environment

### Vercel Deployment

The project is configured for Vercel deployment:

```json
// vercel.json
{
  "installCommand": "npm install --legacy-peer-deps",
  "buildCommand": "npm run build",
  "functions": {
    "src/app/api/astrology/**/*.ts": {
      "maxDuration": 60  // 60 second timeout for AI operations
    }
  }
}
```

### Deployment Checklist

- [ ] Environment variables configured in Vercel dashboard
- [ ] MongoDB Atlas connection string added
- [ ] Firebase credentials configured (both client and admin)
- [ ] Stripe keys updated to production mode
- [ ] Prokerala API credentials verified
- [ ] OpenAI API key added
- [ ] Domain configured and SSL active
- [ ] Webhook URLs updated in Stripe dashboard
- [ ] CORS settings verified for production domain

### Production vs Development

```typescript
// Check environment
const isProd = process.env.NODE_ENV === 'production';

// Use appropriate API keys
const stripeKey = isProd
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY;
```

### Monitoring & Logs

- **Vercel Dashboard**: View function logs and analytics
- **MongoDB Atlas**: Monitor database performance
- **Stripe Dashboard**: Track payments and webhooks
- **Console Logs**: Use emoji prefixes for easy scanning (✅❌⚠️📡)

---

## ⚠️ Important Considerations

### 1. Authentication Sync

Users must be synced between Firebase Auth and MongoDB:
- Registration creates records in both systems
- Login updates `lastLogin` in MongoDB
- `uid` is the primary identifier across systems

### 2. Backwards Compatibility

The codebase maintains dual field support:
- `importance` / `priority` (use `importance`)
- `personalInterpretation` / `aiInterpretation` (use `personalInterpretation`)
- Single `progressedChart` / array `progressedCharts` (prefer array format)

### 3. API Rate Limits

External APIs have rate limits:
- **Prokerala**: Unknown limit, implement caching
- **OpenAI**: Monitor token usage via AIUsage model
- **Stripe**: No strict limits, but monitor for abuse

### 4. Timeout Considerations

Astrology API routes have 60-second timeout:
- Chart generation: ~10-30 seconds
- AI interpretations: ~20-40 seconds
- Full agenda generation: ~45-60 seconds

If operations exceed timeout, break into smaller chunks.

### 5. Cost Management

- **OpenAI API**: Cache interpretations aggressively
- **Prokerala API**: Cache chart data, reuse when possible
- **Stripe**: Monitor failed payments and retries

### 6. Security

- Never expose admin routes to non-admin users
- Validate all user input (use Zod for complex validation)
- Sanitize data before MongoDB queries to prevent injection
- Use Firebase Admin SDK server-side only (never expose credentials)
- Stripe webhook signatures must be verified

### 7. Data Privacy

- Birth data is sensitive personal information
- Ensure HTTPS in production
- Follow GDPR guidelines (user data deletion, export)
- Don't log sensitive data in production

### 8. Timezone Complexity

- Always store IANA timezone strings
- Convert to offsets only for external APIs
- Test with multiple timezones (US, Europe, Asia, Southern Hemisphere)
- Handle DST transitions correctly

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### 1. MongoDB Connection Fails

**Symptoms**: `MongoServerError: connection refused`

**Solutions**:
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas whitelist (allow your IP or 0.0.0.0/0 for dev)
- Ensure database user has proper permissions
- Test connection: `npm run test-mongodb` or visit `/tests/test-mongodb`

#### 2. Firebase Auth Not Working

**Symptoms**: Login fails, user is null

**Solutions**:
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check Firebase Console for project configuration
- Ensure Firebase Auth is enabled for Email/Password
- Clear browser cache and cookies
- Check browser console for CORS errors

#### 3. Prokerala API Errors

**Symptoms**: `401 Unauthorized`, `Invalid token`

**Solutions**:
- Verify `PROKERALA_CLIENT_ID` and `PROKERALA_CLIENT_SECRET`
- Check token expiration (tokens expire after 24 hours)
- Manually refresh token via `/api/prokerala/token`
- Verify API endpoint URLs in `/src/lib/prokerala/endpoints.ts`

#### 4. Stripe Webhook Fails

**Symptoms**: Subscription status not updating

**Solutions**:
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhook`
- Check Stripe dashboard → Developers → Webhooks for errors
- Ensure webhook endpoint is publicly accessible in production

#### 5. Chart Generation Timeout

**Symptoms**: 504 Gateway Timeout, operation exceeds 60s

**Solutions**:
- Check Prokerala API response time
- Verify vercel.json has `maxDuration: 60` for astrology routes
- Consider breaking operation into smaller chunks
- Implement progress tracking for long operations

#### 6. Build Fails

**Symptoms**: `npm run build` errors

**Solutions**:
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install --legacy-peer-deps`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct (check path aliases `@/*`)

#### 7. Slow Page Loads

**Symptoms**: Pages take >5 seconds to load

**Solutions**:
- Check for unnecessary API calls in components
- Implement caching for expensive operations
- Use Next.js Image component for images
- Lazy load non-critical components
- Monitor Vercel function logs for bottlenecks

#### 8. AI Interpretations Return Errors

**Symptoms**: OpenAI API errors, incomplete interpretations

**Solutions**:
- Verify `OPENAI_API_KEY` is valid and has credits
- Check token limits (max 8000 tokens for most models)
- Implement retry logic for transient failures
- Fall back to cached interpretations on error

---

## 📚 Additional Resources

### Documentation Files

- `README.md` - User-facing documentation and feature overview
- `TODO.md` - Project roadmap and action plan
- `STRIPE_SETUP.md` - Stripe integration guide
- `STRIPE_PRODUCTOS.md` - Product configuration
- `STRIPE_ENV_SETUP.md` - Environment setup for Stripe
- `documentacion/` - Technical documentation and analysis

### External Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [MongoDB Mongoose](https://mongoosejs.com/docs/)
- [Stripe API](https://stripe.com/docs/api)
- [Prokerala API](https://www.prokerala.com/api/docs/)
- [OpenAI API](https://platform.openai.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 🤝 AI Assistant Guidelines

### When Working on This Project

1. **Read First**: Always check existing code before proposing changes
2. **Follow Patterns**: Match the existing code style and patterns
3. **Type Everything**: Use TypeScript types for all new code
4. **Test Changes**: Use the test pages to verify your work
5. **Document**: Update this file if you add new conventions or patterns
6. **Ask Questions**: If uncertain about architecture decisions, ask the user
7. **Backwards Compatible**: Maintain support for existing data structures
8. **Security First**: Never expose sensitive data or create security vulnerabilities
9. **Cost Conscious**: Be mindful of external API usage (cache aggressively)
10. **User-Centric**: Prioritize user experience and error handling

### Before Making Changes

- [ ] Read the relevant code files
- [ ] Understand the data flow
- [ ] Check for existing patterns
- [ ] Consider backwards compatibility
- [ ] Think about edge cases
- [ ] Plan error handling

### After Making Changes

- [ ] Test locally using test pages
- [ ] Verify types compile (`npx tsc --noEmit`)
- [ ] Check console for errors
- [ ] Update this documentation if needed
- [ ] Commit with descriptive message

---

**Last Updated**: 2025-12-04
**Maintained By**: AI Assistants working on Tu Vuelta al Sol
**Version**: 1.0.0

For questions or clarifications, refer to the existing code or ask the project owner.
