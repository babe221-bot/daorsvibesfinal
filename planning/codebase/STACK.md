# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- TypeScript 5.x - Used throughout the application for type safety
- JavaScript - Used in some generated files and legacy code

## Runtime

**Environment:**
- Node.js 20.x - Based on devDependencies specifying @types/node: "^20"

**Package Manager:**
- npm - Standard for Next.js projects
- Lockfile: package-lock.json present (inferred from standard Next.js setup)

## Frameworks

**Core:**
- Next.js 15.4.6 - React framework for server-side rendering and static site generation
- React 19.1.1 - UI library for building user interfaces

**Testing:**
- Jest - Configured via @types/jest: "^30.0.0" in devDependencies
- React Testing Library - @types/testing-library__jest-dom: "^5.14.9"

**Build/Dev:**
- Esbuild 0.25.9 - Fast bundler used for development
- TailwindCSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.x - CSS processing pipeline
- ESLint 8.x - Linting utility
- TypeScript Compiler - Type checking and transpilation

## Key Dependencies

**Critical:**
- Firebase 12.1.0 - Core Firebase services (auth, database, storage, etc.)
- Firebase Admin 13.4.0 - Server-side Firebase SDK
- Genkit 1.16.0 - AI integration framework for building AI-powered features
- @genkit-ai/firebase 1.16.1 - Genkit plugin for Firebase integration
- @genkit-ai/googleai 1.16.0 - Genkit plugin for Google AI models
- Tone.js 15.1.22 - Web Audio framework for music creation and audio synthesis
- Wavefile 11.0.0 - WAV file manipulation for audio processing
- Aubiojs 0.2.1 - Audio analysis library for beat detection and audio features

**Infrastructure:**
- Radix UI Components - Comprehensive set of accessible UI primitives
- Embla Carousel - Touch-friendly carousel library for React
- Class Variance Authority - Utility for constructing cn() function for className composition
- Lucide React - Icon library
- React Hook Form - Form validation and management
- Recharts - Charting library built on React and D3
- OpenTelemetry - Observability framework with Jaeger exporter and Winston transport

## Configuration

**Environment:**
- Configured via .env.local and .env.example files
- Uses dotenv package for loading environment variables
- Firebase configuration (API keys, project ID, etc.)
- Google AI API keys for Genkit integration

**Build:**
- next.config.js - Next.js configuration (inferred from standard setup)
- tailwind.config.js - TailwindCSS configuration (inferred)
- postcss.config.js - PostCSS configuration (inferred)
- eslint.config.js - ESLint configuration (inferred)

## Platform Requirements

**Development:**
- Node.js 20.x or higher
- npm 9.x or higher
- Git for version control

**Production:**
- Vercel or Node.js hosting platform
- Firebase project for backend services
- Modern browser support (Chrome, Firefox, Safari, Edge)

---

*Stack analysis: 2026-03-18*