# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**AI Services:**
- Google Gemini AI (via Genkit) - Used for AI-powered music analysis and suggestions
  - SDK/Client: @genkit-ai/googleai and genkit packages
  - Auth: GEMINI_API_KEY environment variable

- Firebase Services - Core backend infrastructure
  - SDK/Client: firebase and firebase-admin packages
  - Auth: Service account credentials (GOOGLE_APPLICATION_CREDENTIALS) or client-side config

**Audio Processing Libraries:**
- Tone.js - Web Audio framework for music synthesis and analysis
  - SDK/Client: tone package
  - Auth: None required (client-side library)

- Wavefile - WAV file manipulation for audio processing
  - SDK/Client: wavefile package
  - Auth: None required

- Aubiojs - Audio analysis for beat detection and feature extraction
  - SDK/Client: aubiojs package
  - Auth: None required

## Data Storage

**Databases:**
- Firebase Firestore
  - Connection: Firebase config via environment variables
  - Client: Firebase JS SDK (@/src/lib/firebase-client.ts) and Firebase Admin SDK

- Firebase Realtime Database (inferred from databaseURL in config)
  - Connection: Firebase config via environment variables
  - Client: Firebase JS SDK

**File Storage:**
- Firebase Storage - Used for storing user-uploaded audio files and generated content
  - Connection: Firebase config via environment variables
  - Client: Firebase JS SDK

**Caching:**
- Not explicitly detected - May use Firebase caching or browser caching

## Authentication & Identity

**Auth Provider:**
- Firebase Authentication
  - Implementation: Email/password, OAuth providers (Google, etc.) configured via Firebase console
  - Client SDK: @/src/lib/firebase-client.ts
  - Admin SDK: @/src/lib/firebase.server.ts
  - Auth tokens: Stored in browser localStorage/sessionStorage or cookies

## Monitoring & Observability

**Error Tracking:**
- OpenTelemetry with Jaeger exporter - Configured via @opentelemetry/exporter-jaeger and @opentelemetry/winston-transport packages
- Console.error logging in action handlers

**Logs:**
- Winston transport for OpenTelemetry
- Console logging in development
- Server-side logging via Firebase functions (inferred)

## CI/CD & Deployment

**Hosting:**
- Vercel (inferred from Next.js usage)
- Firebase Hosting (possible alternative)

**CI Pipeline:**
- GitHub Actions (not explicitly detected but common for Vercel/Firebase projects)
- Vercel automatic deployments on push to main branch

## Environment Configuration

**Required env vars:**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_DATABASE_URL
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- GEMINI_API_KEY (for AI features)
- GOOGLE_APPLICATION_CREDENTIALS (optional, for Firebase Admin SDK local development)

**Secrets location:**
- .env.local file (gitignored)
- Environment variables in production (Vercel/Firebase)
- Service account key file for admin SDK (referenced by GOOGLE_APPLICATION_CREDENTIALS)

## Webhooks & Callbacks

**Incoming:**
- Firebase Authentication webhooks (handled automatically by Firebase SDK)
- API routes in Next.js app directory (inferred from /src/app/actions.ts as server actions)

**Outgoing:**
- None explicitly detected - Application primarily makes outbound calls to Firebase and Google AI APIs

---

*Integration audit: 2026-03-18*