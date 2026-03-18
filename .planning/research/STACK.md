# Stack Research

**Domain:** Web application with Go backend replacing Firebase
**Researched:** 2026-03-18
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Gin | v1.12.0 | HTTP web framework | Gin provides high performance (up to 40x faster than Martini-like APIs) with zero-allocation router, excellent middleware support, and beginner-friendly API. Its popularity (88k stars) and active maintenance (last push 2026-03-16) make it a safe choice for replacing Firebase backend logic. |
| PostgreSQL | v18.3 | Primary database | PostgreSQL replaces Firestore with ACID transactions, relational integrity, and JSONB support for document-like data. Latest version 18.3 (Feb 2026) includes performance improvements and security fixes. It's gaining traction as a MongoDB replacement for modern apps and offers superior data integrity for applications moving from Firebase's eventual consistency model. |
| MinIO | RELEASE.2025-10-15 | S3-compatible object storage | MinIO replaces Firebase Storage with full S3 API compatibility, open-source licensing, and high performance. It avoids vendor lock-in while providing the same interface Firebase Storage used, making migration straightforward. |
| Go | 1.25.3 | Language/runtime | Latest stable Go version with improved performance, security patches, and standard library enhancements. Required for Gin v1.12.0 (which requires Go 1.24+). |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pgx | v5.7.0 | PostgreSQL driver for Go | Official recommended driver for PostgreSQL in Go, offering high performance, full feature support, and active maintenance. Use for all database interactions. |
| minio-go | v7.0.21 | MinIO/S3 client SDK | Official Go SDK for MinIO and S3-compatible storage. Use for all file upload/download operations replacing Firebase Storage. |
| golang-jwt/jwt | v5.2.1 | JSON Web Token implementation | For stateless authentication replacing Firebase Auth. Use when you need lightweight token-based auth without external dependencies. |
| godotenv | v1.5.1 | Environment variable loader | For managing configuration in development and production. Essential for keeping secrets out of codebase. |
| zap | v1.27.0 | Structured logging | High-performance, structured logging library. Use instead of standard log for better observability in production. |
| validator | v10.15.0 | Struct validation | For validating request payloads and data models. Use to ensure data integrity at API boundaries. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| GoReleaser | Build automation | Simplifies cross-platform builds and releases. Use for consistent artifact generation. |
| Delve | Debugging | Official Go debugger. Essential for development and troubleshooting. |
| golangci-lint | Linting | Fast, configurable linter for Go. Use to maintain code quality and catch issues early. |
| Air | Live reload | Provides live reloading during development. Use to improve developer experience. |

## Installation

```bash
# Core dependencies
go get github.com/gin-gonic/gin@v1.12.0
go get github.com/jackc/pgx/v5@v5.7.0
go get github.com/minio/minio-go/v7@v7.0.21
go get github.com/golang-jwt/jwt/v5@v5.2.1

# Supporting libraries
go get github.com/joho/godotenv@v1.5.1
go get go.uber.org/zap@v1.27.0
go get github.com/go-playground/validator/v10@v10.15.0

# Development tools
go install github.com/uber-go/gobra@v0.1.1
go install github.com/go-delve/delve/cmd/dlv@latest
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
go install github.com/air-verse/air@latest
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Gin | Echo v5.0.4 | Choose Echo if you need built-in HTTP/2 support, automatic TLS via Let's Encrypt, or template rendering out-of-the-box. Echo is slightly more minimalist but has steeper learning curve for beginners. |
| PostgreSQL | MongoDB v7.0 | Choose MongoDB if your data model is primarily document-based with minimal relational requirements, and you prioritize development speed over data integrity. However, be aware of consistency tradeoffs compared to Firestore. |
| MinIO | Amazon S3 | Choose AWS S3 if you're already on AWS infrastructure and want managed service with zero operational overhead. Only recommended if vendor lock-in is acceptable. |
| PostgreSQL + MinIO | Supabase | Choose Supabase if you want an integrated Firebase-like experience with PostgreSQL storage and built-in auth. However, this adds another layer of abstraction and may not provide the full control sought in this migration. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Firebase Go SDK | Maintains dependency on Firebase services, defeating the purpose of migration. | Direct PostgreSQL and MinIO clients as recommended above. |
| gorm/v2 | Heavy ORM with performance overhead and abstraction leaks. Useful for complex applications but adds unnecessary complexity for Firebase replacement. | pgx/v5 with manual SQL or lightweight SQL builder like squirrel. |
| Gorilla Mux | Excellent router but lacks built-in middleware system, validation, and JSON binding that Gin provides out-of-the-box. | Gin for its integrated middleware, validation, and rendering capabilities. |
| MinIO client-go v6 | Older version with different API patterns and less active maintenance. | minio-go/v7 for current API and features. |
| Go 1.19 or older | Missing performance improvements, security updates, and language features used in modern dependencies. | Go 1.25.3 for compatibility with all recommended libraries. |

## Stack Patterns by Variant

**If needing real-time features:**
- Add github.com/gorilla/websocket@v1.5.0 for WebSocket support
- Use PostgreSQL's LISTEN/NOTIFY or Redis for pub/sub
- Because Gin works well with Gorilla WebSocket and PostgreSQL provides native pub/sub capabilities

**If requiring multi-tenancy:**
- Use PostgreSQL schemas or row-level security (RLS)
- Add github.com/jmoiron/sqlx@v1.4.0 for easier schema-aware queries
- Because PostgreSQL's RLS provides robust multi-tenancy at the database level

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| github.com/gin-gonic/gin@v1.12.0 | Go>=1.24 | Gin v1.12.0 requires Go 1.24+ due to module changes |
| github.com/jackc/pgx/v5@v5.7.0 | Go>=1.19 | Tested with Go 1.25.3; compatible with all supported Go versions |
| github.com/minio/minio-go/v7@v7.0.21 | Go>=1.19 | Works with Go 1.25.3; no known issues |
| github.com/golang-jwt/jwt/v5@v5.2.1 | Go>=1.20 | Requires Go 1.20+ for generics support |

## Sources

- github.com/gin-gonic/gin — Verified v1.12.0 release date and features (HIGH confidence)
- https://www.postgresql.org/about/news/postgresql-183-179-1613-1517-and-1422-released-3246/ — PostgreSQL 18.3 release announcement (HIGH confidence)
- github.com/minio/minio — Verified MinIO RELEASE.2025-10-15 (HIGH confidence)
- github.com/jackc/pgx — Official pgx v5 documentation (HIGH confidence)
- github.com/minio/minio-go — Verified v7.0.21 release (HIGH confidence)
- "PostgreSQL Is Replacing MongoDB for Modern Apps" Medium article, Jan 2026 (MEDIUM confidence)
- "How to Set Up MinIO for S3-Compatible Storage" guide, Jan 2026 (MEDIUM confidence)
- "Choosing a Go Web Framework in 2026: A Minimalist's Guide" Medium article, Jan 2026 (MEDIUM confidence)