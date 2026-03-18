# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
daorsvibesfinal/
├── src/                    # Main application source code
│   ├── app/                # Next.js App Router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and Firebase configuration
│   ├── ai/                 # AI processing flows (Genkit)
│   └── utils/              # Audio processing utilities
├── public/                 # Static assets (images, icons, favicon)
├── dataconnect/            # Firebase Data Connect schema
├── dataconnect-generated/  # Generated Data Connect client code
├── functions/              # Cloud Functions for Firebase
├── scripts/                # Utility scripts
├── docs/                   # Documentation
├── planning/               # GSD planning documents
├── patches/                # Dependency patches
├── .vscode/                # VS Code workspace settings
├── .vs/                    # Visual Studio settings
├── .idx/                   # Indexing files
├── .planning/              # GSD codebase maps
└── .git/                   # Git version control
```

## Directory Purposes

**src/app/:**
- Purpose: Next.js App Router pages, layouts, and route groups
- Contains: Page components (`page.tsx`), layout components (`layout.tsx`), route groups (dashboard/, login/)
- Key files: `layout.tsx` (root layout), `page.tsx` (home page), `dashboard/page.tsx` (dashboard hub)

**src/components/:**
- Purpose: Reusable UI components organized by type
- Contains: UI primitives (buttons, inputs, modals), feature components (song player, metronome), layout components
- Structure: Flat directory with shadcn-ui components, feature-specific subdirectories (layout/)
- Key files: `song-player.tsx` (audio player), `metronome.tsx` (visual metronome), `layout/app-layout.tsx`

**src/hooks/:**
- Purpose: Custom React hooks encapsulating reusable logic
- Contains: Data fetching hooks, authentication hooks, utility hooks
- Key files: `use-auth.ts` (authentication state), `use-user-songs.ts` (song data fetching), `use-song.ts` (individual song operations)

**src/lib/:**
- Purpose: Utility functions, Firebase configuration, and shared services
- Contains: Firebase initialization, TypeScript types, utility functions, audio processing
- Key files: `firebase-client.ts` (Firebase SDK wrapper), `firebase-config.ts` (configuration), `types.ts` (shared TypeScript interfaces), `utils.ts` (helper functions)

**src/ai/:**
- Purpose: AI processing flows using Genkit
- Contains: Flow definitions, schemas, and development utilities
- Structure: `flows/` subdirectory containing individual AI processing flows
- Key files: `extract-song-data-flow.ts` (audio analysis), `suggest-key-change.flow.ts` (key suggestion workflow)

**src/utils/:**
- Purpose: Low-level audio processing utilities
- Contains: Audio loading and processing functions
- Key files: `audio-loader.ts` (audio file loading utility)

**public/:**
- Purpose: Static assets served directly by Next.js
- Contains: Images, icons, favicon
- Structure: `images/` (content images), `icons/` (UI icons)
- Key files: `favicon.ico` (browser tab icon)

**dataconnect/:**
- Purpose: Firebase Data Connect schema definition
- Contains: GraphQL schema files for database models
- Key files: Schema definition files in `schema/` directory

**dataconnect-generated/:**
- Purpose: Auto-generated Data Connect client code
- Contains: TypeScript client for database operations
- Note: Generated code, should not be modified manually

**functions/:**
- Purpose: Cloud Functions for Firebase backend
- Contains: Server-side logic that runs in Firebase environment
- Structure: Standard Firebase functions layout with `src/` and `lib/` directories

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout wrapping all pages
- `src/app/page.tsx`: Home/Landing page
- `src/app/login/page.tsx`: Authentication page
- `src/app/dashboard/page.tsx`: Dashboard hub

**Configuration:**
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `firebase.json`: Firebase project configuration
- `firestore.rules`: Firestore security rules
- `firestore.indexes.json`: Firestore composite indexes

**Core Logic:**
- `src/app/actions.ts`: Server actions for data mutations
- `src/lib/firebase-client.ts`: Firebase client initialization
- `src/hooks/use-auth.ts`: Authentication state management
- `src/lib/types.ts`: Shared TypeScript interfaces

**Testing:**
- No dedicated test directory detected - tests may be colocated or not implemented
- Jest configuration inferred from devDependencies (`@types/jest`)

## Naming Conventions

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `SongPlayer.tsx`)
- Hooks: camelCase prefixed with "use" (e.g., `useUserSongs.ts`)
- Utilities: camelCase with `.ts` extension (e.g., `audioLoader.ts`)
- Pages: `page.tsx` within route directories
- Layouts: `layout.tsx` within route directories

**Directories:**
- Feature-based grouping under `src/app/dashboard/` for dashboard features
- Feature-specific components placed in `src/components/` (flat structure)
- AI flows in `src/ai/flows/` with descriptive names
- Utility files in `src/lib/` and `src/utils/`

**Constants:**
- UPPER_SNAKE_CASE for global constants (observed in configuration)

## Where to Add New Code

**New Feature (Dashboard):**
- Primary code: `src/app/dashboard/[feature-name]/page.tsx`
- Components: `src/components/[feature-name].tsx` or `src/components/dashboard/`
- Hooks: `src/hooks/use-[feature-name].ts`
- Tests: Colocated with `.test.ts` suffix (if implementing testing)

**New Component/Module:**
- Implementation: `src/components/[ComponentName].tsx`
- If reusable across features: Place directly in `src/components/`
- If feature-specific: Consider creating subdirectory under `src/components/`
- Associated styles: Same file with Tailwind or separate `.css` file

**Utilities:**
- Shared helpers: `src/lib/utils.ts` or new file in `src/lib/`
- Audio-specific: `src/utils/` directory
- Firebase-related: `src/lib/` with Firebase suffix

**AI Flows:**
- Implementation: `src/ai/flows/[flow-name].flow.ts`
- Schemas: `src/ai/flows/[flow-name].schemas.ts`
- Flows follow Genkit patterns with input/output validation

## Special Directories

**src/app/dashboard/:**
- Purpose: Protected dashboard feature area
- Generated: No (manually created)
- Committed: Yes
- Contains: Route groups for each dashboard feature (tuner, songs, playlists, etc.)
- Protected by: Authentication checks in hooks or redirect behavior

**public/images/ and public/icons/:**
- Purpose: Static asset storage
- Generated: No (manually added)
- Committed: Yes
- Guidelines: Optimize images for web use, use SVG for icons when possible

**.vscode/:**
- Purpose: VS Code workspace settings and extensions
- Generated: Partially (some auto-generated)
- Committed: Yes (to share IDE configuration)
- Contains: Launch configurations, recommended settings, extensions

**dataconnect-generated/:**
- Purpose: Auto-generated Firebase Data Connect client
- Generated: Yes (by Firebase CLI)
- Committed: Yes (to ensure consistency across environments)
- Guidelines: Do not modify manually; regenerate when schema changes

**planning/codebase/:**
- Purpose: GSD-generated codebase maps
- Generated: Yes (by this analysis)
- Committed: Yes (to share architectural understanding)
- Guidelines: Updated when significant architectural changes occur

---
*Structure analysis: 2026-03-18*