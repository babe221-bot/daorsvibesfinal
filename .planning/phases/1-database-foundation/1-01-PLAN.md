---
phase: 1-database-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: ["go.mod", "go.sum", "internal/config/config.go", "internal/database/db.go", "cmd/api/main.go", ".env", ".gitignore"]
autonomous: true
requirements: [DATA-03]
user_setup:
  - service: "PostgreSQL"
    why: "Local database required for development"
    env_vars:
      - name: DB_USER
        source: "Your local PostgreSQL user"
      - name: DB_PASSWORD
        source: "Your local PostgreSQL password"
      - name: DB_NAME
        source: "daorsvibes (needs to be created manually via createdb)"
      - name: DB_HOST
        source: "localhost"
      - name: DB_PORT
        source: "5432"
must_haves:
  truths:
    - "Backend server can compile and run"
    - "Application establishes a connection pool to PostgreSQL"
  artifacts:
    - path: "internal/database/db.go"
      provides: "Database connection pool logic"
      exports: ["NewConnectionPool"]
    - path: "cmd/api/main.go"
      provides: "Application entry point"
      contains: "func main()"
  key_links:
    - from: "cmd/api/main.go"
      to: "internal/database"
      via: "database connection initialization"
      pattern: "database\\.NewConnectionPool"
---

<objective>
Initialize the Go backend project structure, set up dependencies, and establish a robust PostgreSQL connection pool using `sqlx` and `pgx`.

Purpose: Establish the bedrock of the backend application before defining data models.
Output: A compiling Go application that can connect to a database and ping it.
</objective>

<context>
@.planning/phases/1-database-foundation/CONTEXT.md
@.planning/phases/1-database-foundation/RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Initialize Go Module and Dependencies</name>
  <files>go.mod, go.sum</files>
  <action>Run `go mod init daorsvibes` (if go.mod doesn't exist). Install the standard stack dependencies researched for this phase:
- `go get github.com/jackc/pgx/v5/stdlib`
- `go get github.com/jmoiron/sqlx`
- `go get github.com/joho/godotenv`
- `go install github.com/pressly/goose/v3/cmd/goose@latest`
Run `go mod tidy` to clean up.</action>
  <verify>
    <automated>go list -m all</automated>
  </verify>
  <done>go.mod exists and contains the required pgx, sqlx, and godotenv libraries.</done>
</task>

<task type="auto">
  <name>Task 2: Configure Environment and Database Pool</name>
  <files>internal/config/config.go, internal/database/db.go, .env, .gitignore</files>
  <action>1. Create `internal/config/config.go` with a `Load()` function that uses `godotenv.Load()` to parse `.env` and returns a config struct with DB variables (Host, Port, User, Password, Name, SSLMode).
2. Create `internal/database/db.go` featuring a `NewConnectionPool(dsn string) (*sqlx.DB, error)` function. Ensure you include the blank import `_ "github.com/jackc/pgx/v5/stdlib"` to register the pgx driver. Set max open/idle connections to 25.
3. Create a dummy `.env` placeholder locally and verify `.env` is appended to `.gitignore`.</action>
  <verify>
    <automated>go build ./internal/database ./internal/config</automated>
  </verify>
  <done>Configuration and database packages compile with correct driver imports.</done>
</task>

<task type="auto">
  <name>Task 3: Create API Entry Point</name>
  <files>cmd/api/main.go</files>
  <action>Create the application entry point `cmd/api/main.go`. In `main()`:
1. Call `config.Load()`.
2. Construct the PostgreSQL DSN string from config variables.
3. Call `database.NewConnectionPool(dsn)`.
4. Use `db.Ping()` to verify the connection is alive.
5. Log "Successfully connected to the database" and cleanly exit. 
(Note: If the DB isn't running, it should log the error and exit 1).</action>
  <verify>
    <automated>go build -o bin/api ./cmd/api</automated>
  </verify>
  <done>Main application compiles and is ready to test DB connection.</done>
</task>

</tasks>

<verification>
- Ensure code compiles without errors
- Ensure `go.mod` is properly configured
</verification>

<success_criteria>
- The `cmd/api` package compiles to an executable.
- Database driver `pgx` is correctly blank-imported.
</success_criteria>

<output>
After completion, create `.planning/phases/1-database-foundation/1-01-SUMMARY.md`
</output>