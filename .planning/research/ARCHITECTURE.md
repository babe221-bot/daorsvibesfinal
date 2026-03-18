# Architecture Research

**Domain:** Go Backend Web Application (Replacing Firebase)
**Researched:** March 19, 2026
**Confidence:** HIGH

## Standard Architecture

Moving from Firebase (Backend-as-a-Service) to a custom Go backend shifts the paradigm from "Thick Client" (where frontend directly queries Firestore/Storage) to a standard "Thin Client / Thick Server" model. The frontend now communicates exclusively through a REST API, and security rules are translated into backend business logic.

### System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                           Client App                            │
│           (Existing Web Frontend - Minimal Changes)             │
└───────────────────────┬─────────────────────────┬───────────────┘
                        │ HTTP/REST (JSON)        │ Pre-signed URL
┌───────────────────────┴─────────────────────────┴───────────────┐
│                API Routing & Middleware (Gin/Echo)              │
│  ┌────────────────────────┐  ┌───────────────────────────────┐  │
│  │ Auth/JWT Middleware    │  │      CORS & Rate Limiter      │  │
│  └────────────────────────┘  └───────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     Handlers (Controllers)                      │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────────┐  │
│  │ User Handler  │   │ Data Handler  │   │ Storage Handler   │  │
│  └───────┬───────┘   └───────┬───────┘   └─────────┬─────────┘  │
├──────────┼───────────────────┼─────────────────────┼────────────┤
│          │        Service Layer (Business Logic)   │            │
│  ┌───────┴───────┐   ┌───────┴───────┐   ┌─────────┴─────────┐  │
│  │ User Service  │   │ Data Service  │   │ Storage Service   │  │
│  └───────┬───────┘   └───────┬───────┘   └─────────┬─────────┘  │
├──────────┼───────────────────┼─────────────────────┼────────────┤
│          │     Data Access & Infrastructure Layer  │            │
│  ┌───────┴───────┐   ┌───────┴───────┐   ┌─────────┴─────────┐  │
│  │ Session/Cache │   │  Repository   │   │  Storage Adapter  │  │
│  │ (Redis/Memory)│   │ (SQL/Postgres)│   │    (S3/MinIO)     │  │
│  └───────┬───────┘   └───────┬───────┘   └─────────┬─────────┘  │
└──────────┼───────────────────┼─────────────────────┼────────────┘
           │                   │                     │
      ┌────┴────┐         ┌────┴────┐           ┌────┴────┐
      │ Cache   │         │ SQL DB  │           │   S3    │
      │(Tokens) │         │(Data)   │           │(Files)  │
      └─────────┘         └─────────┘           └─────────┘
```

### Component Responsibilities & Component Boundaries

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Router/Middleware** | HTTP entry point. Validates requests, blocks unauthorized access (replacing Firebase Security Rules), handles CORS. | Gin or Echo router setup, custom middleware functions. |
| **Handlers** | Parses HTTP requests (JSON/Query params), calls Services, formats HTTP JSON responses. Knows about HTTP, nothing about DB. | Go structs with methods matching route endpoints. |
| **Services** | Core business logic. Validates domain rules, coordinates between repositories and external services. | Go structs holding domain interfaces. |
| **Repositories** | Data Access Layer. Handles SQL queries and database mapping. Hides DB implementation from Services. | Interfaces implemented with `database/sql`, `sqlx`, or GORM. |
| **Storage Adapter** | Replaces Firebase Storage client. Handles file uploads/downloads, or generates pre-signed URLs for direct client uploads. | Wrapper around AWS SDK (`aws-sdk-go-v2`) for S3/MinIO. |

## Recommended Project Structure

For a beginner-friendly Go web application (following simplified standard Go layout):

```text
.
├── cmd/
│   └── server/             # Application entrypoint
│       └── main.go         # Wires up dependencies and starts HTTP server
├── internal/               # Private application code
│   ├── api/                # HTTP layer (Gin/Echo)
│   │   ├── handlers/       # Request/Response logic
│   │   ├── middleware/     # Auth, CORS, logging
│   │   └── router.go       # Route definitions
│   ├── core/               # Domain models & interfaces
│   │   └── models.go       # Structs representing business entities
│   ├── service/            # Business logic (Replaces Firebase Rules/Logic)
│   │   └── [domain].go     # e.g., users.go, articles.go, storage.go
│   ├── repository/         # Database persistence
│   │   └── postgres/       # SQL queries
│   └── storage/            # Cloud storage (Replaces Firebase Storage)
│       └── s3.go           # S3 implementation
├── pkg/                    # Shared public utilities (if any)
└── migrations/             # SQL database migration files
```

### Structure Rationale

- **`internal/` boundary:** Prevents other Go applications from importing your internal business logic. Best practice in Go.
- **Separation of Concerns:** Keeps HTTP handlers (`internal/api`) completely unaware of SQL queries (`internal/repository`). This makes testing easier and the codebase manageable for beginners.
- **Centralized Models:** `internal/core` holds domain structs used across all layers, preventing import cycles.

## Architectural Patterns

### Pattern 1: Dependency Injection (Constructor Injection)

**What:** Instead of using global variables for database connections, pass them via constructors.
**When to use:** Always, as it is the standard way to build testable Go applications.
**Trade-offs:** Slightly more boilerplate in `main.go`.

**Example:**
```go
// internal/api/handlers/user_handler.go
type UserHandler struct {
    service service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
    return &UserHandler{service: svc}
}
```

### Pattern 2: Repository Pattern

**What:** An interface defining data access methods. The service layer depends on the interface, not the SQL implementation.
**When to use:** Crucial when migrating away from a NoSQL DB (Firestore) to a relational DB.
**Trade-offs:** Adds an extra layer of abstraction.

**Example:**
```go
// internal/core/models.go
type UserRepository interface {
    GetByID(ctx context.Context, id string) (*User, error)
    Create(ctx context.Context, u *User) error
}
```

### Pattern 3: Pre-signed S3 URLs (Storage Replacement)

**What:** Instead of piping file uploads through the Go server (which wastes memory/bandwidth), the Go server generates a temporary, secure URL that the frontend uses to upload directly to an S3-compatible bucket.
**When to use:** Replacing Firebase Storage for handling images, videos, or large files.
**Trade-offs:** More complex frontend upload flow, but significantly better backend performance.

## Data Flow

### 1. Standard API Request Flow (Replacing Firestore Reads/Writes)

```text
[Frontend Request]
    ↓ (JSON payload)
[API Router] → (Routes to specific endpoint)
    ↓
[Auth Middleware] → (Validates JWT, rejects if invalid)
    ↓
[Handler] → (Parses JSON into Go struct)
    ↓
[Service] → (Applies business logic/validations)
    ↓
[Repository] → (Executes parameterized SQL query)
    ↓
[Database] (Returns rows)
    ↓
(Flow reverses: Repo → Service → Handler JSON Response → Frontend)
```

### 2. File Upload Flow (Replacing Firebase Storage)

```text
1. [Frontend] POST /api/upload-url { "filename": "image.jpg" }
2. [Go Handler] → [Storage Service] → Generates S3 Pre-signed URL
3. [Go Handler] Returns URL to [Frontend]
4. [Frontend] PUTs file directly to [S3 Bucket] using the URL
5. [Frontend] POST /api/data { "image_url": "s3-url" } to save reference in DB
```

## Suggested Build Order (Dependencies)

To ensure smooth development without running into circular dependencies, build the system from the "inside out":

1. **Phase 1: Domain & Infrastructure Base**
   - Define `internal/core/models.go` (Your data structs).
   - Set up Database connection and initial Migrations (PostgreSQL/SQLite).
2. **Phase 2: Repositories & Storage Adapters**
   - Build `internal/repository` (SQL queries).
   - Build `internal/storage` (S3 integration for files).
   - *Dependency:* Depends on Models.
3. **Phase 3: Service Layer**
   - Build `internal/service` to handle business logic.
   - *Dependency:* Depends on Models and Repositories/Storage interfaces.
4. **Phase 4: API & Handlers**
   - Build `internal/api/handlers` and translate HTTP requests to Service calls.
   - Build `internal/api/middleware` (Auth, CORS).
   - *Dependency:* Depends on Models and Services.
5. **Phase 5: Routing & Entrypoint**
   - Wire everything together in `cmd/server/main.go`.
   - *Dependency:* Depends on all of the above.

## Scaling Considerations

Given the target scale of hundreds of users, simplicity is key.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1,000 users | **Monolith App + SQLite or Managed Postgres.** Keep it simple. Go is extremely fast and can handle thousands of concurrent requests on a basic $5 server. |
| 1k-10k users | Scale up database (connection pooling). Ensure S3 is used for all media (do not serve media directly from the Go binary). |
| 10k+ users | Horizontal scaling. Run multiple instances of the Go binary behind a Load Balancer (e.g., NGINX). Move session state to Redis. |

## Anti-Patterns to Avoid

### Anti-Pattern 1: Leaking HTTP into Services or DB

**What people do:** Passing `*gin.Context` or `echo.Context` into the Service or Repository layers.
**Why it's wrong:** Tightly couples your business logic to your web framework. If you change frameworks or want to run a cron job, you can't reuse the service.
**Do this instead:** Extract the necessary data (strings, structs, `context.Context`) in the Handler, and pass only those standard Go types to the Service.

### Anti-Pattern 2: Replicating Firestore's NoSQL in a Relational DB

**What people do:** Dumping large JSON blobs into a single SQL column because "that's how Firestore did it."
**Why it's wrong:** Defeats the purpose of using a SQL database, makes querying extremely slow and updates difficult.
**Do this instead:** Normalize the data. Break Firebase collections into proper relational SQL tables with Foreign Keys.

### Anti-Pattern 3: Piping file uploads through Go

**What people do:** Client uploads a 10MB image to the Go server, which holds it in memory, then uploads it to S3.
**Why it's wrong:** Eats up server RAM, slows down the API, and doubles the bandwidth cost.
**Do this instead:** Use the Pre-signed URL pattern described above.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **S3/MinIO** | AWS SDK (v2) | Use for all blobs. Configure CORS on the S3 bucket to allow direct frontend uploads. |
| **Database** | SQL Driver + `database/sql` or `sqlx` | Use connection pooling. Handle DB migrations automatically on startup using a library like `golang-migrate`. |

## Sources

- Go Standard Project Layout Patterns
- General HTTP/REST API best practices for Go (Hexagonal Architecture / Clean Architecture principles adapted for beginners)
- Cloud storage integration patterns (Pre-signed URL uploads)

---
*Architecture research for: Go Backend Replacing Firebase*
*Researched: March 19, 2026*