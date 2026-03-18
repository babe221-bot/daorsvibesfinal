<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Go Project Structure:** We will use a standard Go project layout (e.g., `cmd`, `internal`, `pkg`) to organize the new backend code. This provides a scalable foundation as the project grows.
- **PostgreSQL Setup:** We will use a local installation of PostgreSQL for development, rather than Docker. Connection parameters will be managed via environment variables (`.env`).
- **Database Schema Design:** The AI planner/researcher will analyze the existing Firebase/Firestore usage and propose the initial relational database schema (tables, columns, relationships). The focus will be on the core domain models required to replace the existing functionality.
- **Database Connection & ORM:** We will use the standard `database/sql` package with a lightweight driver like `pgx` or an ORM like `gorm`, depending on the planner's recommendation for a beginner-friendly approach. A connection pool will be established to handle concurrent requests efficiently.

### Claude's Discretion
- What specific Go package should be used for database migrations (e.g., `golang-migrate`, `goose`)?
- What are the exact tables and columns needed based on the existing codebase?

### Deferred Ideas (OUT OF SCOPE)
- Advanced SQL querying features (e.g., complex full-text search) not present in the original Firebase implementation.
- Background job processing (e.g., image resizing after upload).
- Real-time WebSocket subscriptions (unless strictly required by existing core features; fallback to polling first).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-03 | Backend securely connects to and queries the PostgreSQL database using a connection pool. | Recommendation for `jmoiron/sqlx` and `jackc/pgx/v5` setup for safe, robust connection pools. |
| DATA-04 | System preserves data relationships and constraints appropriate for a relational database. | Derived normalized SQL schema replacing Firestore's `users/{userId}/songs` collection. |
</phase_requirements>

# Phase 1: Database Foundation - Research

**Researched:** 2026-03-19
**Domain:** Go Backend, PostgreSQL Database, Migrations
**Confidence:** HIGH

## Summary

The current application relies entirely on Firebase for authentication, data storage (Firestore), and file storage. The data model is relatively flat, mostly focused on an authenticated `User` and their `Songs`, where a song contains text-based fields (lyrics, chords, etc.) and simple arrays for tags and comments. 

To replace this with a Go backend and PostgreSQL while keeping it beginner-friendly, the recommended path is to use `jmoiron/sqlx` paired with the `jackc/pgx/v5/stdlib` driver. This approach removes the "magic" of full ORMs (like GORM), forcing the developer to learn SQL directly—but eliminates the verbose row-scanning boilerplate of standard `database/sql`. For migrations, `pressly/goose` is the most reliable, avoiding the "dirty state" errors that frustrate beginners using `golang-migrate`.

**Primary recommendation:** Use `sqlx` + `pgx` for database interactions and `goose` for migrations, with a schema that leverages PostgreSQL's native arrays to easily mirror the existing NoSQL structures.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `jackc/pgx/v5` | v5.x | Database Driver | The definitive modern PostgreSQL driver for Go, far outperforming `lib/pq`. |
| `jmoiron/sqlx` | v1.x | SQL Struct Mapping | Standard extension to `database/sql`. Removes massive boilerplate of manual `Rows.Scan`, mapping query results directly to Go structs. Extremely beginner-friendly for learning standard SQL. |
| `pressly/goose/v3` | v3.x | Schema Migrations | Simple file-based `.sql` migrations. Unlike `golang-migrate`, it recovers gracefully from failed migrations and avoids locking beginners in "dirty state" hell. |
| `joho/godotenv` | v1.x | Environment Config | Safely loads `.env` files into Go environment variables for local PostgreSQL setups. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `sqlx` + `pgx` | `gorm` | GORM is highly popular and feels like TypeORM/Prisma (auto-migrations, relationship preloading). However, ORM "magic" in Go can confuse beginners with zero-value updates and implicit pointer states. Explicit SQL with `sqlx` is easier to debug and more "Go-idiomatic." |
| `goose` | `golang-migrate` | `golang-migrate` is strictly idempotent but requires manual database intervention if a migration fails halfway (the `dirty` boolean flag in the migration table). `goose` is much more forgiving for beginners. |

**Installation:**
```bash
go get github.com/jackc/pgx/v5/stdlib
go get github.com/jmoiron/sqlx
go get github.com/joho/godotenv
go install github.com/pressly/goose/v3/cmd/goose@latest
```

## Architecture Patterns

### Recommended Project Structure
For Phase 1, align with the standard Go layout:

```text
/
├── cmd/
│   └── api/
│       └── main.go           # Application entry point
├── internal/
│   ├── config/               # Environment loading (.env)
│   ├── database/             # PostgreSQL connection pool and setup
│   ├── models/               # Go structs mapping to database tables
│   └── repository/           # Data access layer (SQL queries via sqlx)
├── migrations/               # .sql files for Goose
└── .env                      # Local PostgreSQL credentials
```

### Pattern 1: Connection Pool Initialization
**What:** Centralize the database connection logic using `sqlx.Connect`.
**When to use:** On application startup inside `cmd/api/main.go`.
**Example:**
```go
package database

import (
    "fmt"
    "github.com/jmoiron/sqlx"
    _ "github.com/jackc/pgx/v5/stdlib" // Load pgx driver
)

func NewConnectionPool(dsn string) (*sqlx.DB, error) {
    db, err := sqlx.Connect("pgx", dsn)
    if err != nil {
        return nil, fmt.Errorf("error connecting to db: %w", err)
    }
    
    // Connection pool settings
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(25)
    
    return db, nil
}
```

## Database Schema Design

Based on an analysis of `src/lib/types.ts` and `src/hooks/use-user-songs.ts`, the application relies on an array-heavy document model. PostgreSQL natively supports arrays (`TEXT[]`, `INT[]`), making the transition from Firestore incredibly smooth while still providing relational constraints for the parent data.

### Proposed Migrations

Create these sequentially using Goose (`goose create init sql`):

**`00001_create_users_table.sql`**
```sql
-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE users;
DROP EXTENSION IF EXISTS "uuid-ossp";
```

**`00002_create_songs_table.sql`**
```sql
-- +goose Up
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    lyrics_and_chords TEXT NOT NULL,
    lyrics TEXT,
    simplified_chords TEXT,
    original_chords TEXT,
    transposed_chords TEXT,
    transposed_key VARCHAR(10),
    capo INTEGER,
    tags TEXT[] DEFAULT '{}',
    comments TEXT[] DEFAULT '{}',
    ratings INTEGER[] DEFAULT '{}',
    avg_rating NUMERIC(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_songs_user_id ON songs(user_id);

-- +goose Down
DROP TABLE songs;
```

**`00003_create_files_table.sql`** *(Preemptively supporting Phase 4)*
```sql
-- +goose Up
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    content_type VARCHAR(100),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- +goose Down
DROP TABLE files;
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Struct Mapping | Manual `Rows.Scan` loops | `jmoiron/sqlx` | Scanning >5 columns into a struct manually is prone to off-by-one errors and type mismatches. |
| Migrations | A custom script executing `.sql` | `pressly/goose` | State tracking, transaction wrapping, and rollback capabilities are notoriously complex to build from scratch safely. |
| Null fields | Custom pointer logic | `database/sql.NullString` | Go's standard library provides specific null-safe types for SQL to prevent nil pointer panics on empty rows. |

**Key insight:** Migrating from a NoSQL DB means developers are used to "always present" or explicitly undefined data. Relational databases enforce strict typing. Relying on battle-tested libraries for the transition bridge avoids major early-stage bugs.

## Common Pitfalls

### Pitfall 1: Failing to Load the Driver
**What goes wrong:** The app panics on startup with `sql: unknown driver "pgx"`.
**Why it happens:** In Go, database drivers register themselves via an `init()` function, which requires a blank import.
**How to avoid:** Always include `import _ "github.com/jackc/pgx/v5/stdlib"` in the file where `sqlx.Connect` is called.

### Pitfall 2: Postgres Array Mapping
**What goes wrong:** `sqlx` fails to map the `tags TEXT[]` array to a Go `[]string`.
**Why it happens:** Standard SQL driver cannot infer Go slice structures from PostgreSQL array bytes without a wrapper.
**How to avoid:** Use `github.com/lib/pq`'s `pq.Array` wrapper when scanning or inserting slices, e.g., `db.Query("...", pq.Array(song.Tags))`. Alternatively, use `pgx` native types (`pgtype.FlatArray`). Since we are using standard `database/sql` mapping, importing `github.com/lib/pq` purely for `pq.Array()` is a common, stable approach.

### Pitfall 3: Connection Leaks
**What goes wrong:** After ~50 queries, the app hangs indefinitely or the database throws "too many clients" errors.
**Why it happens:** Not calling `rows.Close()` after manual queries or deferring it improperly.
**How to avoid:** Use `sqlx` helper methods like `db.Get(&dest)` and `db.Select(&dest)` which automatically close the rows after mapping. If using `db.Query()`, immediately follow it with `defer rows.Close()`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `testing` (Go standard library) + `testcontainers-go` (optional for robust DB tests) |
| Config file | `go.mod` |
| Quick run command | `go test ./... -v` |
| Full suite command | `go test ./... -cover -v` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-03 | Connects to DB successfully | unit/integration | `go test ./internal/database -v` | ❌ Wave 0 |
| DATA-04 | Validates migrations run and schema limits work | integration | `go test ./internal/repository -v` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `go test ./... -short`
- **Per wave merge:** `go test ./... -v`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `internal/database/database_test.go` — covers DATA-03
- [ ] Framework install: `go mod init` and package setup missing.

## Sources

### Primary (HIGH confidence)
- Go Project Layout Standard: [golang-standards/project-layout](https://github.com/golang-standards/project-layout)
- pgx v5 documentation: [jackc/pgx](https://github.com/jackc/pgx)
- sqlx documentation: [jmoiron/sqlx](https://github.com/jmoiron/sqlx)
- Goose migration tool: [pressly/goose](https://github.com/pressly/goose)

### Secondary (MEDIUM confidence)
- Codebase Context (`src/lib/types.ts` & `src/hooks/use-user-songs.ts`): Verified NoSQL schemas natively mapping cleanly to Postgres arrays.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - `sqlx` and `pgx` are universally accepted as the golden standard for intermediate Go/SQL projects.
- Architecture: HIGH - Verified against Firebase usage in current Next.js structure.
- Pitfalls: HIGH - Array mapping and `init()` missing are the two most common beginner bugs in Go DB connectivity.

**Research date:** 2026-03-19
**Valid until:** 2026-09-19
