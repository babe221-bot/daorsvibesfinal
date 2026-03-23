# Requirements

## v1 Requirements

### Authentication
- [ ] **AUTH-01**: User can log in securely using email and password, establishing a session.
- [ ] **AUTH-02**: System maintains user session securely using HttpOnly cookies (preventing XSS).
- [ ] **AUTH-03**: User can log out, securely terminating the session.
- [ ] **AUTH-04**: Unauthenticated users are prevented from accessing protected API endpoints.

### Data Management (Replacing Firestore)
- [ ] **DATA-01**: Backend exposes REST API endpoints for all necessary CRUD operations previously handled by Firestore.
- [ ] **DATA-02**: Backend validates all incoming data payloads (replacing Firebase Security Rules logic).
- [x] **DATA-03**: Backend securely connects to and queries the PostgreSQL database using a connection pool.
- [x] **DATA-04**: System preserves data relationships and constraints appropriate for a relational database.

### Storage (Replacing Firebase Storage)
- [ ] **STOR-01**: Backend can generate and return secure, time-limited pre-signed URLs for file uploads.
- [ ] **STOR-02**: Frontend can upload files directly to MinIO/S3 using the provided pre-signed URLs.
- [ ] **STOR-03**: Backend can generate and return public URLs for accessing uploaded files.
- [ ] **STOR-04**: Backend tracks file metadata (URLs, owner, size) in the database.

### Frontend Integration
- [ ] **INT-01**: Frontend application communicates exclusively with the new Go backend REST API.
- [ ] **INT-02**: Frontend application handles asynchronous data fetching and state management gracefully (e.g., using React Query or similar) to compensate for the loss of Firebase's optimistic UI.
- [ ] **INT-03**: All Firebase SDK initializations and calls are completely removed from the frontend codebase.

## v2 Requirements (Deferred)
- Advanced SQL querying features (e.g., complex full-text search) not present in the original Firebase implementation.
- Background job processing (e.g., image resizing after upload).
- Real-time WebSocket subscriptions (unless strictly required by existing core features; fallback to polling first).
- Third-party OAuth providers (Google, GitHub) if not strictly necessary for MVP replacement.

## Out of Scope
- Rebuilding the frontend UI/UX (the goal is backend replacement, not a redesign).
- Implementing microservices architecture (a monolith is appropriate and recommended for this scale).
- Mobile application development.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 1 | Complete |
| DATA-04 | Phase 1 | Complete |
| STOR-01 | Phase 4 | Pending |
| STOR-02 | Phase 6 | Pending |
| STOR-03 | Phase 4 | Pending |
| STOR-04 | Phase 4 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 7 | Pending |
