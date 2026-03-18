# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**[Large UI Components]:**
- Issue: The `src/components/ui/sidebar.tsx` file is 780 lines, making it difficult to maintain and understand.
- Files: `src/components/ui/sidebar.tsx`
- Impact: Increased cognitive load for developers, higher risk of introducing bugs when modifying.
- Fix approach: Break down into smaller, focused components (e.g., separate sections for navigation, user profile, settings).

**[Lack of Testing Infrastructure]:**
- Issue: No test files found (`*.test.{ts,tsx}`) and no testing configuration detected.
- Files: Entire codebase lacks test files.
- Impact: No automated regression protection; changes may break functionality without immediate detection.
- Fix approach: Establish testing strategy (Jest/Vitest), add unit tests for critical utilities and hooks, set up test scripts in package.json.

**[Environment Configuration Risk]:**
- Issue: `.env.local` file exists in the repository (visible in ls output), potentially exposing sensitive configuration.
- Files: `.env.local` (existence noted only - contents not read per security policy)
- Impact: If committed to remote repository, exposes Firebase API keys and other secrets.
- Fix approach: Add `.env.local` to `.gitignore` if not already present, remove from git history if committed, use environment variable injection in deployment.

## Known Bugs

**[AI Flow Error Handling]:**
- Symptoms: AI flow actions (extract-song-data, format-song-content, etc.) return generic error messages to users while logging full errors server-side.
- Files: `src/app/actions.ts` (lines 30-40, 56-66, 83-93, 110-120)
- Trigger: When external AI services fail or return unexpected data formats.
- Workaround: Users see generic "Unexpected error occurred" messages without actionable guidance.
- Note: While error logging is present, user feedback lacks specificity for recovery.

## Security Considerations

**[Firebase Admin SDK Exposure]:**
- Risk: The `firebase-admin` dependency is present, typically requiring service account credentials with elevated privileges.
- Files: `src/lib/firebase.server.ts` (likely contains admin initialization - existence noted)
- Current mitigation: Environment variables should contain service account credentials.
- Recommendations: 
  - Ensure `firebase-admin` is only used in server-side code (Next.js server actions/API routes)
  - Never expose service account credentials in client-side builds
  - Implement least-privilege service account permissions
  - Consider using Firebase App Check to prevent abuse

**[Client-Side Firebase Config]:**
- Risk: Firebase configuration values are exposed to the client via `NEXT_PUBLIC_` environment variables (standard for Firebase client SDK).
- Files: `src/lib/firebase-config.ts` (lines 1-10)
- Current mitigation: This is by design for Firebase client SDK usage.
- Recommendations:
  - Ensure Firebase security rules are properly configured to restrict data access
  - Monitor Firebase usage for anomalous patterns
  - Avoid storing sensitive data in Firestore that shouldn't be client-accessible

## Performance Bottlenecks

**[Large Dependency Bundle]:**
- Problem: The package.json shows 60+ dependencies including heavy libraries like `@firebasegen/default-connector` (file:dataconnect-generated), `tone`, `wavefile`, `embla-carousel-react`, etc.
- Files: `package.json` (dependencies section)
- Cause: Many large libraries included in the frontend bundle.
- Improvement path:
  - Use dynamic imports for non-critical components (lazy loading)
  - Analyze bundle with `next bundle-analyzer` (script available)
  - Consider tree-shaking and code splitting
  - Evaluate if all dependencies are necessary for initial load

**[AI Flow Latency]:**
- Problem: AI-powered features (key change suggestion, chord simplification) depend on external API calls which may introduce latency.
- Files: `src/app/actions.ts` (AI flow handlers)
- Cause: Network requests to Google AI services via Genkit.
- Improvement path:
  - Implement loading states and skeletons
  - Consider caching frequent requests
  - Provide offline fallbacks for critical features
  - Monitor AI service response times

## Fragile Areas

**[AI Integration Points]:**
- Files: `src/app/actions.ts` (all AI flow handlers), `src/ai/flows/` directory
- Why fragile: 
  - Heavy reliance on external AI service availability and format consistency
  - Minimal validation of AI response structure beyond null checks
  - No retry mechanisms for transient failures
- Safe modification:
  - Add comprehensive response validation using Zod schemas
  - Implement exponential backoff retry logic
  - Add circuit breaker pattern for service outages
  - Create mock implementations for development/testing
- Test coverage: Gaps identified below

**[Authentication Flow]:**
- Files: `src/hooks/use-auth.ts`, `src/app/layout.tsx` (likely uses auth)
- Why fragile: 
  - Authentication state management is critical for user experience
  - Token refresh logic may be complex
  - Redirect handling after auth is error-prone
- Safe modification:
  - Follow Firebase Auth best practices
  - Test token expiration and refresh scenarios
  - Ensure redirect loops are handled
  - Use Firebase Auth UI providers where possible

## Scaling Limits

**[Firestore Read/Write Limits]:**
- Current capacity: Depends on Firebase project tier (likely Spark/Blaze plan)
- Limit: Firestore has hard limits on concurrent connections, document size (1MB), and write rates.
- Scaling path:
  - Monitor Firebase usage metrics
  - Implement pagination for large collections (songs, setlists)
  - Consider denormalization for frequent queries
  - Use Firebase Functions for complex transactions
  - Upgrade Firebase plan as needed

**[AI Service Rate Limits]:**
- Current capacity: Google AI services have rate limits per project.
- Limit: Exceeding quotas results in HTTP 429 errors.
- Scaling path:
  - Implement rate limiting client-side
  - Use exponential backoff for retries
  - Monitor quota usage in Google Cloud Console
  - Consider requesting higher quotas or alternative providers

## Dependencies at Risk

**[aubiojs]:**
- Risk: Last updated 2 years ago (version 0.2.1), potential compatibility issues with newer browsers/node versions.
- Impact: Audio processing features may break in future updates.
- Migration plan: 
  - Check for actively maintained alternatives (Web Audio API implementations)
  - Evaluate if built-in Web Audio API can replace this dependency
  - Test audio loader functionality thoroughly

**[dotenv]:**
- Risk: Version 17.2.1 is significantly outdated (current is 16.x).
- Impact: Potential security vulnerabilities in outdated package.
- Migration plan: Update to latest stable version, ensure compatibility with Next.js.

## Missing Critical Features

**[Input Sanitization]:**
- Problem: User-generated content (song lyrics, chords) is processed and displayed without apparent sanitization.
- Blocks: Safe display of user-provided HTML/content to prevent XSS attacks.
- Files: Likely in components displaying song content (e.g., song-player.tsx, chord-progression-generator.tsx)

**[Offline Capability]:**
- Problem: Application appears to require constant internet connection for Firebase and AI services.
- Blocks: Usage in low-connectivity environments (stages, rehearsal spaces).
- Consider: Service workers for caching, local Firestore persistence, offline queue for AI requests.

## Test Coverage Gaps

**[Untested area]:**
- What's not tested: All client-side components, hooks, utility functions, and AI flow integrations.
- Files: `src/components/`, `src/hooks/`, `src/lib/`, `src/ai/flows/`
- Risk: Regressions in UI logic, business rules, and AI integration points could go undetected.
- Priority: High - Core functionality lacks any automated test coverage.
- Recommendation: 
  - Start with unit tests for pure utility functions (`src/lib/utils.ts`, `src/lib/audio.ts`)
  - Add tests for React hooks using `@testing-library/react-hooks`
  - Implement component tests for critical UI elements
  - Mock AI flows for testing action handlers

---
*Concerns audit: 2026-03-18*