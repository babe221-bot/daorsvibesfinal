# Feature Landscape

**Domain:** Custom Web Application Backend (Replacing Firebase)
**Researched:** 2026-03-19

## Table Stakes

Features users and the frontend application expect. Missing these means the application will break or lose its current Firebase-provided functionality.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| User Authentication & Session Management | Replaces Firebase Auth. Required to identify users and secure their data. | Medium | Email/password login, JWTs or secure session cookies. |
| CRUD REST Endpoints | Replaces direct Firestore client access. The core way the frontend interacts with data. | Low | Essential to map frontend actions to database operations securely. |
| Role-based Route Authorization | Replaces Firebase Security Rules. Protects endpoints from unauthorized access. | Low | Middleware (e.g., in Gin/Echo) to verify user roles/tokens before accessing handlers. |
| Relational or Document Database | Replaces Firestore. Persistent storage for application state and user data. | Medium | Setup migrations, models, and connection pooling (e.g., PostgreSQL or SQLite via GORM). |
| File Upload API & Storage | Replaces Firebase Storage. Needed for user avatars, documents, or media. | Medium | Multipart form parsing, storing files locally or on S3-compatible object storage. |
| CORS Configuration | Essential for separating frontend and backend domains securely. | Low | Must allow frontend origin to make API requests with credentials. |
| Basic Input Validation | Prevents malformed data and injection attacks. | Low | Validate request bodies before processing them in the database. |

## Differentiators

Features that set a custom backend apart from Firebase's limitations, providing competitive advantage and long-term control.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Complex Relational Queries | Allows efficient joins, aggregations, and reporting that are notoriously difficult/expensive in Firestore. | Medium | Leverage SQL capabilities for better data analysis and feature building. |
| Full Data Ownership & Backups | Direct access to raw data. No vendor lock-in, easy to backup via standard database dumps (e.g., pg_dump). | Low | Provides peace of mind and easier compliance. |
| Scheduled Background Jobs | Replaces expensive Cloud Functions. Run cron jobs or background workers directly on the server without extra billing. | Medium | Useful for periodic cleanups, email sending, or data processing. |
| Local Development Environment | Developers can run the entire stack locally via Docker without relying on Firebase Emulators or internet access. | Low | Drastically improves developer experience and testing workflows. |

## Anti-Features

Features to explicitly NOT build, especially for a beginner Go developer targeting a small/medium scale (hundreds of users).

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Ubiquitous Real-time Sync (WebSockets) | Rebuilding Firestore's real-time document sync for everything is highly complex, stateful, and resource-intensive to manage. | Stick to standard REST (HTTP request/response) or short-polling unless a feature absolutely requires real-time. |
| Microservices Architecture | Adds massive operational overhead, complex deployments, and networking challenges for a small application. | Build a modular Monolith. Run everything in a single Go process. |
| Custom Multi-Region Distribution | Unnecessary for hundreds of users. Over-complicates database replication and deployment. | Deploy a single instance to a reliable VPS close to your primary user base. |
| Custom OAuth/OIDC Server | Building a secure, spec-compliant OAuth provider is extremely difficult and error-prone. | Use simple Email/Password auth for MVP, or integrate existing Go libraries to consume external providers. |

## Feature Dependencies

```text
Relational/Document Database → CRUD REST Endpoints (Endpoints require DB)
User Authentication & Sessions → Role-based Route Authorization (Auth required for roles)
Relational/Document Database → File Upload API & Storage (Need to store file metadata/URLs)
```

## MVP Recommendation

Prioritize:
1. **Relational Database Setup** (Foundation for all data)
2. **User Authentication & Sessions** (Security prerequisite)
3. **CRUD REST Endpoints** (Core functionality to unblock frontend)
4. **File Upload API & Storage** (Since the app currently uses Firebase Storage)

Defer: 
- **Complex Relational Queries**: Build only when a specific new feature demands it; stick to 1:1 Firestore replacements first.
- **Scheduled Background Jobs**: Implement later when automated tasks are explicitly required.
- **Real-time WebSockets**: Unless a specific feature breaks without it, rely on REST initially.

## Sources

- Project Context (Beginner Go developer, small/medium scale).
- Standard web architecture patterns for migrating off BaaS (Backend-as-a-Service) platforms.
