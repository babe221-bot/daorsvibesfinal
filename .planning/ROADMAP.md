# Roadmap

## Phases

- [x] **Phase 1: Database Foundation** - Establish PostgreSQL connection pool and initial schemas.
- [ ] **Phase 2: Authentication Security** - Implement login, logout, and route protection using HttpOnly cookies.
- [ ] **Phase 3: Core Data APIs** - Build REST endpoints for validated CRUD operations.
- [ ] **Phase 4: Storage Infrastructure APIs** - Implement S3/MinIO pre-signed URL generation and metadata tracking.
- [ ] **Phase 5: Frontend Data Integration** - Connect frontend to REST APIs with asynchronous state management.
- [ ] **Phase 6: Frontend File Uploads** - Implement direct-to-cloud file uploads from the frontend.
- [ ] **Phase 7: Firebase Decommissioning** - Remove all Firebase SDK dependencies from the codebase.

## Phase Details

### Phase 1: Database Foundation
**Goal**: The application connects to a stable relational database with defined data structures.
**Depends on**: None
**Requirements**: DATA-03, DATA-04
**Success Criteria**:
  1. Backend server starts and successfully connects to PostgreSQL using a connection pool.
  2. Database contains tables with relational constraints matching the domain models.
  3. Server logs confirm successful database queries without connection leaks.
**Plans**:
  - [x] 1-01-PLAN.md — Initialize Go module, config, and DB connection pool
  - [x] 1-02-PLAN.md — Create Goose migrations and domain models

### Phase 2: Authentication Security
**Goal**: Users can securely identify themselves and access restricted areas.
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria**:
  1. User can log in with email/password and receive an HttpOnly cookie.
  2. User can log out, which successfully invalidates the session cookie.
  3. Unauthenticated requests to protected endpoints return 401 Unauthorized errors.
**Plans**: 3 plans
  - [ ] 2-01-PLAN.md — Implement core authentication service and JWT cryptography
  - [ ] 2-02-PLAN.md — Implement Gin auth middleware and HTTP handlers
  - [ ] 2-03-PLAN.md — Register API routes and test E2E authentication flow

### Phase 3: Core Data APIs
**Goal**: Applications can perform business operations through secure, validated endpoints.
**Depends on**: Phase 2
**Requirements**: DATA-01, DATA-02
**Success Criteria**:
  1. REST API endpoints successfully create, read, update, and delete resource data.
  2. API endpoints reject invalid data payloads with descriptive 400 Bad Request errors.
  3. API endpoints return correct relational data based on the established database schema.
**Plans**: TBD

### Phase 4: Storage Infrastructure APIs
**Goal**: Applications can request secure access to upload and download files.
**Depends on**: Phase 2
**Requirements**: STOR-01, STOR-03, STOR-04
**Success Criteria**:
  1. API returns valid, time-limited pre-signed URLs for file uploads.
  2. API returns public URLs for accessing requested files.
  3. File metadata (size, owner, URL) is successfully saved in the PostgreSQL database.
**Plans**: TBD

### Phase 5: Frontend Data Integration
**Goal**: The web client retrieves and manages application data from the new backend without errors.
**Depends on**: Phase 3
**Requirements**: INT-01, INT-02
**Success Criteria**:
  1. Frontend successfully fetches and displays data from the new REST API.
  2. Frontend handles slow network responses gracefully without UI freezing.
  3. Frontend correctly sends HttpOnly cookies with API requests.
**Plans**: TBD

### Phase 6: Frontend File Uploads
**Goal**: The web client successfully uploads user files directly to the storage bucket.
**Depends on**: Phase 4, Phase 5
**Requirements**: STOR-02
**Success Criteria**:
  1. User can select a file and upload it directly to MinIO/S3.
  2. Uploaded file is visible and accessible in the application UI.
**Plans**: TBD

### Phase 7: Firebase Decommissioning
**Goal**: The application operates completely independently of Firebase.
**Depends on**: Phase 6
**Requirements**: INT-03
**Success Criteria**:
  1. No Firebase SDK scripts are loaded in the browser network tab.
  2. Codebase search shows zero references to `firebase` or `@firebase`.
  3. All core application features function normally without Firebase connection.
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Database Foundation | 2/2 | Complete | 2026-03-20 |
| 2. Authentication Security | 0/3 | In Progress | - |
| 3. Core Data APIs | 0/0 | Not started | - |
| 4. Storage Infrastructure APIs | 0/0 | Not started | - |
| 5. Frontend Data Integration | 0/0 | Not started | - |
| 6. Frontend File Uploads | 0/0 | Not started | - |
| 7. Firebase Decommissioning | 0/0 | Not started | - |
