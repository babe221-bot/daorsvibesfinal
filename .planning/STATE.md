# Project State

## Project Reference
**Core Value**: Replace Firebase services with a custom Go backend (Gin/Echo, PostgreSQL, MinIO/S3) for greater control and data ownership while maintaining existing frontend functionality.
**Current Focus**: Initialization of project roadmap and mapping of Firebase replacement requirements.

## Current Position
- **Phase**: 1. Database Foundation
- **Plan**: 02
- **Status**: Completed Plan 1-02

## Progress
**Milestone**: Backend Replacement
- [ ] Phase 1: Database Foundation
- [ ] Phase 2: Authentication Security
- [ ] Phase 3: Core Data APIs
- [ ] Phase 4: Storage Infrastructure APIs
- [ ] Phase 5: Frontend Data Integration
- [ ] Phase 6: Frontend File Uploads
- [ ] Phase 7: Firebase Decommissioning

## Performance Metrics
- **Velocity**: N/A
- **Defect Rate**: N/A

## Accumulated Context
### Architectural Decisions
- Backend language: Go
- HTTP Framework: Gin or Echo
- Database: PostgreSQL (replacing Firestore)
- Storage: MinIO/S3 (replacing Firebase Storage)
- Auth: JWT with HttpOnly cookies (replacing Firebase Auth)
- Architecture: Thin Client / Thick Server (Monolith)
- Database Driver: Used pgx driver with sqlx to provide a robust yet beginner-friendly SQL mapping experience.
- Configuration: Configured database pool with 25 max open and idle connections. Opted for godotenv to load local configuration, falling back to environment variables or defaults.
- Schema Migrations: Using pressly/goose for PostgreSQL migrations.
- Go Domain Models: Using sql.NullString and sql.NullInt32 for robust DB nulls mapping, and pq.StringArray and pq.Int64Array for PostgreSQL native array columns.

### Current Blockers
- None. Ready for next plan.

### Next Steps
- Execute Phase 1 Plan 03 (or next Phase).

## Session Continuity
- Roadmap initialized with 7 phases corresponding to the transition from Firebase to a custom Go backend.
