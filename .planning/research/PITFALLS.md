# Pitfalls Research

**Domain:** Firebase to Custom Go Backend Migration
**Researched:** Thu Mar 19 2026
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Bottlenecking the Server with File Uploads (Storage Migration)

**What goes wrong:**
The new Go server crashes due to Out-Of-Memory (OOM) errors, or upload speeds drop significantly compared to Firebase Storage. 

**Why it happens:**
Firebase Storage SDK uploads directly from the client to Google's cloud buckets. When migrating to a custom backend, beginners often change this to route the file upload *through* the Go server (using `multipart/form-data`), which buffers the entire file into the server's RAM or disk before sending it to the final storage destination (like S3/MinIO).

**How to avoid:**
Do not route large files through the Go server. Instead, use the Go backend to generate a **Pre-signed URL** (if using S3-compatible storage) and have the frontend upload directly to the storage bucket using that URL, preserving the direct-to-cloud architecture of Firebase.

**Warning signs:**
- `c.FormFile("file")` is used in Gin/Echo for anything larger than a few megabytes.
- High memory usage spikes on the server during user activity.

**Phase to address:**
Phase 2 (Storage Migration)

---

### Pitfall 2: Token Storage & Security Downgrade (Auth Migration)

**What goes wrong:**
The application becomes vulnerable to Cross-Site Scripting (XSS) attacks stealing user sessions, or users are forced to log in constantly.

**Why it happens:**
Firebase Auth manages session tokens automatically and securely. When rolling custom JWT authentication in Go, developers often send the JWT in the JSON response body and store it in the frontend's `localStorage` because it's easiest. Any malicious script on the page can read `localStorage` and steal the token.

**How to avoid:**
Implement an `HttpOnly`, `Secure`, `SameSite=Strict` cookie mechanism in the Go backend to store the JWT or session ID. This ensures JavaScript cannot access the token, neutralizing XSS session theft.

**Warning signs:**
- Returning `{ "token": "ey..." }` in the login API response.
- Frontend code containing `localStorage.setItem('token', ...)`

**Phase to address:**
Phase 1 (Authentication Foundation)

---

### Pitfall 3: Loss of Optimistic UI and Caching (Frontend Degradation)

**What goes wrong:**
The application suddenly feels sluggish, "clicky," and full of loading spinners after the migration, despite the Go backend being fast.

**Why it happens:**
The Firebase SDK does heavy lifting on the client side: it caches data locally, provides real-time updates, and updates the UI instantly (optimistic updates) before the server confirms the write. Standard REST API calls using basic `fetch()` wait for network round-trips for every action.

**How to avoid:**
Introduce a robust asynchronous state management library on the frontend (like TanStack Query / React Query, or SWR) to replace the Firebase SDK's caching and optimistic update capabilities. 

**Warning signs:**
- `await fetch(...)` calls sprinkled directly inside UI components without a caching layer.
- Flash of loading spinners on every tab switch or data mutation.

**Phase to address:**
Phase 4 (Frontend Integration)

---

### Pitfall 4: Database Connection Leaks (Go Beginner Mistake)

**What goes wrong:**
The Go application runs fine for a while, then suddenly stops responding or throws "too many connections" errors from the database.

**Why it happens:**
A beginner to Go might call `sql.Open()` or open a new GORM connection inside the HTTP handler function for every incoming request, rather than initializing a single connection pool at startup and reusing it.

**How to avoid:**
Initialize the database connection *once* in `main.go`, configure the connection pool settings (`SetMaxOpenConns`, `SetMaxIdleConns`), and pass the connection instance to your Gin/Echo handlers (e.g., via dependency injection or a handler struct).

**Warning signs:**
- `db, err := gorm.Open(...)` or `sql.Open()` appearing inside route handlers.
- Rapidly increasing database connections in monitoring dashboards.

**Phase to address:**
Phase 1 (Backend Foundation)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using SQLite instead of PostgreSQL | Zero setup, single file DB. | Doesn't scale horizontally; concurrency limits. | MVP / Small-scale apps (< 100 concurrent users). |
| Storing JWT in `localStorage` | Easy to send with Axios headers. | XSS vulnerabilities; compromised user accounts. | **Never acceptable.** Use HttpOnly cookies. |
| Returning raw database errors | Fast debugging during dev. | Exposes table names and internal schema to attackers. | Only in local development environments. |
| Hardcoding config in Go files | No need to parse `.env` files. | Passwords in Git; requires recompilation to change settings. | **Never acceptable.** |

## Integration Gotchas

Common mistakes when connecting to external services to replace Firebase.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| S3 / MinIO (Storage) | Making buckets completely public or completely private. | Keep bucket private, use Pre-signed URLs for both uploading and temporary downloading. |
| SMTP (Email/Auth) | Sending emails synchronously in the HTTP handler (blocks response). | Push email tasks to a background goroutine or queue to respond to the user immediately. |
| PostgreSQL | Trying to mimic Firestore's schemaless nature with giant `JSONB` columns everywhere. | Design proper normalized relational tables; only use `JSONB` for truly dynamic/unstructured data. |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| In-memory file processing | High memory usage, OOM crashes. | Use `io.Copy` to stream data directly, or use pre-signed URLs. | Concurrent uploads of >50MB files. |
| N+1 Queries (ORMs) | API gets slower as database grows. | Use eager loading (`Preload` in GORM) or explicit JOINs. | When a list has >50 items with relations. |
| Missing DB Indexes | Slow response times on specific queries. | Profile queries; add indexes to columns used in `WHERE` and `JOIN`. | Database tables exceed 10,000 rows. |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Missing Rate Limiting on Login | Brute-force attacks on user accounts (Firebase handles this automatically). | Implement a rate limiter middleware in Gin/Echo (e.g., max 5 attempts per minute per IP). |
| Missing Route Authorization | Users accessing data they don't own (Insecure Direct Object Reference). | Firebase Rules must be rewritten as Go middleware checking ownership before returning data. |
| Broad CORS Configuration | `Allow-Origins: *` allows malicious sites to make authenticated requests. | Set exact origins (e.g., `https://myapp.com`) in the Gin/Echo CORS middleware. |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Synchronous Password Reset | User waits 3-5 seconds clicking "Reset" while Go talks to the SMTP server. | Return "Email sent" instantly, process SMTP delivery in a goroutine. |
| Silently failing uploads | User clicks upload, file is too big for the Go server, Nginx returns 413, UI shows nothing. | Implement explicit max file size checks on the frontend *before* uploading. |
| Missing offline support | App shows "Network Error" immediately if connection drops for a second. | Implement frontend retry logic or offline caching (if critical). |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces when replacing managed services.

- [ ] **Authentication:** Token rotation/expiration is handled (not just a single non-expiring JWT).
- [ ] **Authentication:** Password reset flow actually sends an email with a secure, single-use, expiring token.
- [ ] **Storage:** Uploaded files have correct Content-Type headers set (or they will download instead of display in browser).
- [ ] **Infrastructure:** The Go app restarts automatically if it crashes (using systemd or Docker restart policies).
- [ ] **Security:** CORS is strictly configured for the production frontend domain, not `*` or `localhost`.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Compromised JWTs (LocalStorage) | HIGH | Rotate secret key, forcing all users to re-login. Migrate to HttpOnly cookies. |
| Go Server OOM Crash | MEDIUM | Setup a process manager (systemd/Docker) to auto-restart. Implement file size limits immediately. |
| Data corruption from bad DB schema | HIGH | Write a complex data migration script to normalize the incorrectly mapped NoSQL data. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Token Security / DB Connection Leaks | Phase 1 (Core Backend) | Verify tokens are sent via `Set-Cookie` header with `HttpOnly` flag. Review `main.go` for single DB pool. |
| Server Bottleneck on Uploads | Phase 2 (Storage Migration) | Verify frontend uses Pre-signed URLs to upload directly to S3/MinIO bucket. |
| Data Model Mismatches / N+1 | Phase 3 (Database & API) | Code review DB schemas; ensure relational design is used instead of pure JSON columns. |
| Loss of Optimistic UI | Phase 4 (Frontend Integration) | Verify use of React Query / SWR. Test application with network throttling. |
| Broad CORS / Missing Rate Limits | Phase 5 (Security & Deploy) | Penetration test / inspect network headers on the deployed staging server. |

## Sources

- Go Web Development standard practices (effective error handling, connection pooling).
- OWASP Top 10 (JWT storage vulnerabilities, XSS).
- Firebase documentation (understanding what features need to be manually replicated).
- Common GORM / Gin framework GitHub issues and community discussions.

---
*Pitfalls research for: Firebase to Custom Go Backend Migration*
*Researched: Thu Mar 19 2026*