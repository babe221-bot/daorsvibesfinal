# Project Research Summary

**Project:** Custom Web Application Backend (Replacing Firebase)
**Domain:** Go Backend Web Application
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

The project involves replacing a Firebase Backend-as-a-Service with a custom Go backend. This represents a fundamental paradigm shift from a "Thick Client" architecture—where the frontend directly queries Firestore and Storage—to a standard "Thin Client / Thick Server" model that communicates exclusively via a REST API. Experts recommend building a modular monolith in Go utilizing Gin for routing, PostgreSQL for persistent data (replacing Firestore), and MinIO/S3 for object storage (replacing Firebase Storage).

The recommended approach focuses on simplicity and robust architectural boundaries, using standard Go patterns like dependency injection and the repository pattern to cleanly separate HTTP handling, business logic, and database operations. The MVP should prioritize a relational database setup, JWT-based user authentication using secure HTTP-only cookies, CRUD REST endpoints, and file upload APIs leveraging pre-signed URLs.

Key risks during this migration include server out-of-memory (OOM) crashes from buffering large file uploads, session theft via XSS if JWTs are stored in `localStorage`, database connection leaks, and UX degradation from losing Firebase's optimistic UI. These can be effectively mitigated by utilizing pre-signed URLs for direct-to-cloud file uploads, storing tokens in `HttpOnly` cookies, properly managing database connection pools in `main.go`, and integrating a robust asynchronous state management library (like React Query or SWR) on the frontend.

## Key Findings

### Recommended Stack

A modern, high-performance Go stack is recommended for replacing Firebase, favoring explicit control over magic.

**Core technologies:**
- **Gin (v1.12.0):** HTTP web framework — High performance, zero-allocation router, excellent middleware, and beginner-friendly API.
- **PostgreSQL (v18.3):** Primary database — Replaces Firestore with ACID transactions, relational integrity, and JSONB support.
- **MinIO (RELEASE.2025-10-15):** Object storage — S3-compatible, avoids vendor lock-in, and provides a straightforward Firebase Storage replacement.
- **Go (1.25.3):** Language/runtime — Latest stable version required for modern dependency compatibility.

### Expected Features

Features are categorized based on their necessity for a successful Firebase migration.

**Must have (table stakes):**
- User Authentication & Session Management — Security prerequisite replacing Firebase Auth.
- CRUD REST Endpoints — Core way the frontend interacts with data, replacing direct Firestore access.
- Role-based Route Authorization — Replaces Firebase Security Rules.
- Relational or Document Database — Persistent storage replacing Firestore.
- File Upload API & Storage — Needed to replace Firebase Storage functionality.

**Should have (competitive):**
- Complex Relational Queries — Differentiator allowing efficient joins/reporting difficult in Firestore.
- Full Data Ownership & Backups — Eliminates vendor lock-in.
- Local Development Environment — Improves developer experience without needing internet access.

**Defer (v2+):**
- Ubiquitous Real-time Sync (WebSockets) — Rebuilding Firestore's real-time sync is highly complex.
- Microservices Architecture — Adds massive operational overhead.

### Architecture Approach

The system uses a standard "Thin Client / Thick Server" model with clear component boundaries.

**Major components:**
1. **Router/Middleware:** HTTP entry point that validates requests, handles Auth/CORS, and replaces Firebase Security Rules.
2. **Handlers & Services:** Handlers parse HTTP requests and format JSON; Services contain core business logic, decoupled from HTTP and SQL.
3. **Repositories & Storage Adapter:** Handles SQL queries and S3/MinIO pre-signed URLs, hiding infrastructure implementation from Services.

### Critical Pitfalls

1. **Bottlenecking the Server with File Uploads:** Avoid routing large files through the Go server's RAM; generate Pre-signed URLs for direct-to-cloud frontend uploads.
2. **Token Storage & Security Downgrade:** Avoid storing custom JWTs in frontend `localStorage`; implement `HttpOnly`, `Secure`, `SameSite=Strict` cookies to prevent XSS.
3. **Loss of Optimistic UI and Caching:** Avoid sluggish UX by introducing a robust asynchronous state management library (e.g., React Query) on the frontend.
4. **Database Connection Leaks:** Avoid opening DB connections inside HTTP handlers; initialize a single connection pool in `main.go`.

## Implications for Roadmap

Based on research, suggested phase structure follows a dependency-driven "inside out" build order:

### Phase 1: Domain & Infrastructure Base (Backend Foundation)
**Rationale:** Establishes the core data models and database connection pool before building dependent features.
**Delivers:** Initial `internal/core/models.go`, database connection pooling setup, and initial SQL migrations.
**Addresses:** Relational/Document Database.
**Avoids:** Database Connection Leaks (Pitfall 4).

### Phase 2: Authentication & Security Foundation
**Rationale:** Security is a prerequisite for most REST endpoints; establishes user identities and sessions.
**Delivers:** JWT generation, `HttpOnly` cookie handling, Auth middleware, User Service, and User Repository.
**Addresses:** User Authentication & Session Management, Role-based Route Authorization.
**Avoids:** Token Storage & Security Downgrade (Pitfall 2).

### Phase 3: Core API & Data Migration (CRUD)
**Rationale:** Provides the core functionality to unblock the frontend and replace direct Firestore operations.
**Delivers:** Repositories, Services, and Handlers for primary domain data; REST endpoints.
**Addresses:** CRUD REST Endpoints, Basic Input Validation, CORS Configuration.
**Avoids:** Replicating NoSQL in a Relational DB, N+1 Queries.

### Phase 4: Storage Migration
**Rationale:** Replaces Firebase Storage functionality for avatars and media uploads.
**Delivers:** Storage Adapter (S3/MinIO integration) and pre-signed URL generation endpoints.
**Addresses:** File Upload API & Storage.
**Avoids:** Bottlenecking the Server with File Uploads (Pitfall 1).

### Phase 5: Frontend Integration & Optimization
**Rationale:** Connects the existing frontend to the new Go backend, resolving expected UX regressions.
**Delivers:** Client-side integration using React Query/SWR, robust error handling, and optimistic updates.
**Addresses:** Seamless transition from Firebase SDK.
**Avoids:** Loss of Optimistic UI and Caching (Pitfall 3).

### Phase Ordering Rationale

- **Dependencies:** The database and core domain models must exist before authentication can be built. Authentication must exist before core CRUD endpoints can be secured. Storage can be built in parallel or after core data is established.
- **Architecture:** Moving from the "inside out" (Models -> Repositories -> Services -> Handlers -> Router) ensures a clean architecture and prevents circular dependencies.
- **Pitfall Prevention:** Each phase specifically targets the most critical pitfalls identified in the research for that particular domain area.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (Frontend Integration):** Needs research into the specific existing frontend framework (React, Vue, Svelte, etc.) to select the exact caching and data-fetching strategy (e.g., React Query vs. SWR).
- **Data Migration (Pre-launch):** While the application architecture is researched, the exact script/strategy to export existing production data from Firestore and safely import it into normalized PostgreSQL tables needs specific planning.

Phases with standard patterns (skip research-phase):
- **Phase 1, 2, 3, 4:** Standard Go `database/sql` usage, JWT/cookie implementation, standard REST patterns, and standard AWS SDK pre-signed URL patterns are well-documented and established.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified specific version compatibility for Go 1.25.3, Gin, Postgres, MinIO. |
| Features | HIGH | Clear differentiation between table stakes and anti-features for Firebase migrations. |
| Architecture | HIGH | Standard clean/hexagonal architecture principles adapted well for Go. |
| Pitfalls | HIGH | Identified specific, actionable solutions for common Firebase migration errors. |

**Overall confidence:** HIGH

### Gaps to Address

- **Frontend Specifics:** The research assumes a modern frontend that can adapt to React Query/SWR, but the exact frontend framework isn't specified in the backend research and will dictate the exact integration library.
- **Firestore Export Strategy:** The exact strategy to perform the one-time data migration from Firestore to PostgreSQL is not covered and needs attention during planning/execution.

## Sources

### Primary (HIGH confidence)
- github.com/gin-gonic/gin — Verified v1.12.0 release date and features
- https://www.postgresql.org/about/news/postgresql-183-179-1613-1517-and-1422-released-3246/ — PostgreSQL 18.3 release announcement
- github.com/minio/minio — Verified MinIO RELEASE.2025-10-15
- github.com/jackc/pgx — Official pgx v5 documentation
- github.com/minio/minio-go — Verified v7.0.21 release
- Go Standard Project Layout Patterns
- OWASP Top 10 (JWT storage vulnerabilities, XSS)

### Secondary (MEDIUM confidence)
- "PostgreSQL Is Replacing MongoDB for Modern Apps" Medium article, Jan 2026
- "How to Set Up MinIO for S3-Compatible Storage" guide, Jan 2026
- "Choosing a Go Web Framework in 2026: A Minimalist's Guide" Medium article, Jan 2026

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*