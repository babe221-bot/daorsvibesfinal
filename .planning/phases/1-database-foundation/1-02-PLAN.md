---
phase: 1-database-foundation
plan: 02
type: execute
wave: 2
depends_on: ["1-01"]
files_modified: ["migrations/00001_create_users_table.sql", "migrations/00002_create_songs_table.sql", "migrations/00003_create_files_table.sql", "internal/models/user.go", "internal/models/song.go", "internal/models/file.go"]
autonomous: false
requirements: [DATA-04]
must_haves:
  truths:
    - "PostgreSQL contains correctly structured users, songs, and files tables"
    - "Go domain models match the database schema exactly"
  artifacts:
    - path: "migrations/00001_create_users_table.sql"
      provides: "Users table schema"
      contains: "CREATE TABLE users"
    - path: "internal/models/song.go"
      provides: "Go struct for songs"
      exports: ["Song"]
  key_links:
    - from: "internal/models/song.go"
      to: "migrations/00002_create_songs_table.sql"
      via: "db struct tags"
      pattern: "db:\"title\""
---

<objective>
Define the PostgreSQL schema via Goose migrations and create the corresponding Go domain models mirroring the legacy Firebase data structure.

Purpose: Establish the strict relational data models to replace the NoSQL collections.
Output: Executable migration scripts and Go structs ready for repository queries.
</objective>

<context>
@.planning/phases/1-database-foundation/CONTEXT.md
@.planning/phases/1-database-foundation/RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create Goose Migrations</name>
  <files>migrations/00001_create_users_table.sql, migrations/00002_create_songs_table.sql, migrations/00003_create_files_table.sql</files>
  <action>Write the `.sql` migration files matching the design in `RESEARCH.md`.
- `00001`: Create `users` table with UUID PK, email, and password hash. Ensure `uuid-ossp` or `pgcrypto` is enabled in `+goose Up`.
- `00002`: Create `songs` table with `user_id` FK (cascade delete) and text arrays for tags/comments. Include `avg_rating` and chords columns.
- `00003`: Create `files` table for storing storage metadata (size, content_type, url).</action>
  <verify>
    <automated>ls migrations/*.sql</automated>
  </verify>
  <done>All three migration files exist with +goose Up and +goose Down annotations.</done>
</task>

<task type="auto">
  <name>Task 2: Define Go Domain Models</name>
  <files>internal/models/user.go, internal/models/song.go, internal/models/file.go</files>
  <action>Create Go structs for `User`, `Song`, and `File` in `internal/models/`. 
Add strict `db:"column_name"` tags to ensure `sqlx` maps fields correctly. Add `json:"columnName"` tags for future JSON serialization. 
Use native `[]string` or `github.com/lib/pq`'s `StringArray` type for the Postgres array columns (`tags`, `comments`) depending on what `sqlx`/`pgx` natively supports best. Use `time.Time` for timestamp fields.</action>
  <verify>
    <automated>go build ./internal/models</automated>
  </verify>
  <done>Model files compile and contain appropriate tags matching the SQL schema.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>PostgreSQL migrations and connection logic</what-built>
  <how-to-verify>
1. Ensure your local PostgreSQL server is running.
2. Create the database: `createdb daorsvibes` (or your chosen DB name).
3. Run Goose migrations: `goose -dir migrations postgres "host=localhost user=YOUR_USER password=YOUR_PW dbname=YOUR_DB sslmode=disable" up`
4. Confirm migrations applied successfully.
5. Run the Go backend to confirm connection: `go run cmd/api/main.go`
  </how-to-verify>
  <resume-signal>Type "approved" if migrations run cleanly and the server pings the DB successfully.</resume-signal>
</task>

</tasks>

<verification>
- Goose migrations should be idempotent or safely reversible.
- Models should reflect exact types of DB schema (e.g., UUID -> string).
</verification>

<success_criteria>
- Migrations run against a clean database without errors.
- Go application connects successfully and does not panic.
</success_criteria>

<output>
After completion, create `.planning/phases/1-database-foundation/1-02-SUMMARY.md`
</output>