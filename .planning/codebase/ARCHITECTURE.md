# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Next.js App Router with React Server Components and Client Components hybrid architecture

**Key Characteristics:**
- Server-first data fetching with selective client interactivity
- Firebase-backed data storage and authentication
- AI-powered features using Genkit for music processing
- Modular UI components following shadcn-ui patterns
- Feature-based organization within the dashboard

## Layers

**Presentation Layer:**
- Purpose: Handle UI rendering and user interactions
- Location: `src/app/` (pages), `src/components/` (reusable UI)
- Contains: Page components, layout components, UI primitives, feature-specific components
- Depends on: Application logic layer, infrastructure layer
- Used by: End users via web browser

**Application Logic Layer:**
- Purpose: Manage business logic, state, and side effects
- Location: `src/hooks/` (custom hooks), `src/lib/` (utility functions), `src/ai/flows/` (AI processing)
- Contains: Data fetching hooks, authentication logic, audio processing, AI flow definitions
- Depends on: Infrastructure layer (Firebase, external services)
- Used by: Presentation layer

**Data Access Layer:**
- Purpose: Handle communication with external services and databases
- Location: `src/lib/firebase-client.ts`, `src/lib/firebase.server.ts`, `src/lib/firebase-config.ts`
- Contains: Firebase initialization, Firestore queries, authentication methods
- Depends on: Firebase SDKs, configuration
- Used by: Application logic layer

**Infrastructure Layer:**
- Purpose: Provide cross-cutting concerns and configuration
- Location: `src/lib/utils.ts`, `src/lib/types.ts`, configuration files
- Contains: Utility functions, TypeScript types, environment configuration, logging helpers
- Depends on: External libraries (firebase, tone, etc.)
- Used by: All layers

## Data Flow

**User Authentication Flow:**

1. User visits login page (`src/app/login/page.tsx`)
2. Credentials submitted to server action (`src/app/actions.ts`)
3. Server action validates credentials using Firebase Auth (`src/lib/firebase-client.ts`)
4. Upon success, session cookie set and user redirected to dashboard
5. Protected dashboard routes check session via middleware (implied by route protection)

**Data Fetching Flow (e.g., Songs):**

1. Dashboard component mounts (`src/app/dashboard/page.tsx`)
2. Custom hook `use-user-songs.ts` called (client-side)
3. Hook makes request to Firestore via Firebase client SDK
4. Real-time updates via Firestore listeners
5. Data passed to song library component for rendering

**AI Processing Flow:**

1. User uploads or selects a song in dashboard
2. File processed client-side (audio analysis) or sent to server
3. Server action triggers Genkit flow (`src/ai/flows/`)
4. Flow processes audio data using Tone.js and returns analysis
5. Results stored in Firestore and returned to UI

**State Management:**
- Client state: React hooks (useState, useEffect) and custom hooks
- Server state: None (stateless requests with Firebase backend)
- Global state: Firebase Auth state via context (implied)
- Real-time updates: Firestore listeners in custom hooks

## Key Abstractions

**FirebaseClient:**
- Purpose: Singleton Firebase app instance with services
- Examples: `src/lib/firebase-client.ts`
- Pattern: Module exporting initialized Firebase services (app, auth, firestore, analytics)

**Custom Hooks:**
- Purpose: Encapsulate reusable logic with state and effects
- Examples: `src/hooks/use-auth.ts`, `src/hooks/use-user-songs.ts`, `src/hooks/use-song.ts`
- Pattern: Return tuple of [data, loading, error] or specific return values

**UI Components:**
- Purpose: Reusable, accessible UI primitives
- Examples: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`
- Pattern: Compose Radix UI primitives with Tailwind styling via `cn` utility

**AI Flows:**
- Purpose: Process music data using AI models
- Examples: `src/ai/flows/extract-song-data-flow.ts`, `src/ai/flows/suggest-key-change.flow.ts`
- Pattern: Genkit flow definitions with input/output schemas

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Set up HTML structure, load fonts, provide global styles, contain children

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: Navigation to root URL
- Responsibilities: Display landing page with featured tools and call-to-action

**Login Page:**
- Location: `src/app/login/page.tsx`
- Triggers: Navigation to /login
- Responsibilities: Render authentication form, handle login submissions

**Dashboard Layout:**
- Location: `src/app/dashboard/layout.tsx` (implied by route grouping)
- Triggers: Access to any dashboard route
- Responsibilities: Provide dashboard navigation, check authentication, layout structure

**API Routes:**
- Location: `src/app/actions.ts` (server actions)
- Triggers: Form submissions, explicit calls from components
- Responsibilities: Handle mutations (data writes, AI processing) with Firebase Admin

## Error Handling

**Strategy:** 
- Error boundaries for graceful UI degradation
- Next.js built-in error handling for routes
- Firebase error catching with user-friendly messages
- Server action error handling with form field validation

**Patterns:**
- `src/components/error-boundary.tsx` - catches errors in subtree
- Try/catch in server actions with `zod` validation (implied by usage)
- Error toast notifications via `use-toast` hook
- Console.error logging in development

## Cross-Cutting Concerns

**Logging:** 
- Client-side: `console.log` in development (observed in hooks)
- Server-side: Winston transport configured via `@opentelemetry/winston-transport` and Jaeger exporter
- Firebase debugging: `firestore-debug.log` indicates verbose logging

**Validation:** 
- Form validation: `react-hook-form` with Zod schemas (inferred from dependencies and usage)
- Data validation: Firestore security rules (`firestore.rules`)
- Input validation: Client-side validation in components before submission

**Authentication:** 
- Firebase Auth SDK (`src/lib/firebase-client.ts`)
- Protected routes: Dashboard routes check auth status (via hook or redirect)
- Session management: Cookies or Firebase session handling (implied)
- Auth redirects: `src/hooks/use-auth-redirect.ts` handles post-login redirect

**Styling:** 
- Tailwind CSS with custom configuration (`tailwind.config.ts`)
- CSS variables for themes (dark/light) via `class-variance-authority`
- Global styles in `src/app/globals.css`
- Component-level styling with `cn` utility for conditional classes

---
*Architecture analysis: 2026-03-18*