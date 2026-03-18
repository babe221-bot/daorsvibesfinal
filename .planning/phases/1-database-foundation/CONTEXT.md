# Phase 1: Database Foundation

## Decisions Captured

### 1. Go Project Structure
- We will use a standard Go project layout (e.g., `cmd`, `internal`, `pkg`) to organize the new backend code.
- This provides a scalable foundation as the project grows.

### 2. PostgreSQL Setup
- We will use a local installation of PostgreSQL for development, rather than Docker.
- Connection parameters will be managed via environment variables (`.env`).

### 3. Database Schema Design
- The AI planner/researcher will analyze the existing Firebase/Firestore usage and propose the initial relational database schema (tables, columns, relationships).
- The focus will be on the core domain models required to replace the existing functionality.

### 4. Database Connection & ORM
- We will use the standard `database/sql` package with a lightweight driver like `pgx` or an ORM like `gorm`, depending on the planner's recommendation for a beginner-friendly approach.
- A connection pool will be established to handle concurrent requests efficiently.

## Developer Context
- The developer is a beginner in Go backend development.
- The project is migrating away from Firebase.
- Scale target is small/medium (hundreds of users).

## Open Questions for Research/Planning
- What specific Go package should be used for database migrations (e.g., `golang-migrate`, `goose`)?
- What are the exact tables and columns needed based on the existing codebase?