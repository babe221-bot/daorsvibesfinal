# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- TypeScript files use `.ts` extension
- React components use `.tsx` extension
- Component files use PascalCase (e.g., `SongPlayer.tsx`, `AuthRedirect.ts`)
- Utility files use camelCase (e.g., `audio-loader.ts`, `firebase-client.ts`)
- Hook files use camelCase with `use-` prefix (e.g., `use-auth.ts`, `use-toast.ts`)

**Functions:**
- Functions use camelCase (e.g., `useAuth()`, `signInAnonymously()`)
- Arrow functions used for concise callbacks
- Event handlers use `handle` prefix (e.g., `handleClick()`)

**Variables:**
- Constants use UPPER_SNAKE_CASE (limited usage observed)
- Regular variables use camelCase (e.g., `user`, `loading`, `error`)
- Boolean variables often use `is` or `has` prefix (e.g., `isLoading`, `hasError`)

**Types/Interfaces:**
- Types and interfaces use PascalCase (e.g., `Metadata`, `User`)
- Generic types use single uppercase letters (T, U) when appropriate

## Code Style

**Formatting:**
- ESLint configured with `next/core-web-vitals` preset
- No explicit Prettier configuration detected
- Consistent 2-space indentation
- Semicolons used consistently
- Quotes: Single quotes for strings, double quotes for JSX attributes

**Linting:**
- Tool: ESLint with Next.js core web vitals preset
- Configuration file: `.eslintrc.json`
- Key rules inferred from Next.js preset:
  - React best practices enforced
  - Next.js specific rules (like no synchronous scripts in head)
  - Accessibility recommendations

## Import Organization

**Order:**
1. React imports (`import { useState, useEffect } from 'react';`)
2. Next.js imports (`import Link from "next/link";`)
3. Firebase/library imports (`import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';`)
4. Absolute imports with `@/` prefix (`import { auth } from '@/lib/firebase-client';`)
5. Relative imports (`import HomePage from './home-page';`)
6. CSS imports (`import "./flashing-button.css";`)

**Path Aliases:**
- `@/` alias configured for `src/` directory (seen in `import { auth } from '@/lib/firebase-client';`)
- Standard Next.js path alias configuration

## Error Handling

**Patterns:**
- Try/catch blocks for asynchronous operations (seen in `use-auth.ts`)
- Console.error for logging unexpected errors
- User-facing error messages stored in state and displayed in UI
- Error boundaries used (`<ErrorBoundary>` component observed in components/)
- Graceful degradation when services fail (anonymous sign-in as fallback)

## Logging

**Framework:** Console API (`console.error()` observed)

**Patterns:**
- Error logging with contextual information: `console.error('Anonymous sign-in failed:', e);`
- No debug/info/warning logging patterns observed
- Logging primarily focused on error conditions

## Comments

**When to Comment:**
- Minimal inline comments observed
- Comments used for complex logic explanations
- JSDoc-style comments not prevalent in examined files
- Component props documented through TypeScript interfaces rather than comments

**JSDoc/TSDoc:**
- Limited usage observed
- Type definitions preferred over JSDoc for API documentation

## Function Design

**Size:** Functions observed are small and focused (typically <20 lines)

**Parameters:** 
- Functions typically take 0-3 parameters
- Object destructuring used for options objects
- Callback functions passed as parameters for async operations

**Return Values:**
- Consistent return types defined with TypeScript
- Custom hooks return objects with relevant state and functions
- Early returns used for conditional logic

## Module Design

**Exports:**
- Named exports for utilities and hooks (`export function useAuth() {}`)
- Default exports for React components (`export default function HomePage() {}`)
- Barrel files not observed in current structure

## Firebase Conventions

**Authentication:**
- Firebase auth instance imported from centralized client file
- Anonymous sign-in used as fallback authentication method
- Auth state managed through React hooks with loading/error states

**Database/Firestore:**
- Not observed in examined files, but Firebase configuration files present