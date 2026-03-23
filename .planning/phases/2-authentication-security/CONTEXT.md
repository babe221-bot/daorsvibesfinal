# Phase 2: Authentication Security

## Decisions Captured (Auto Mode)

### 1. Authentication Mechanism
- We are replacing Firebase Auth with standard Email and Password authentication.
- For passwords, the system will use `golang.org/x/crypto/bcrypt` for secure hashing before storing them in the PostgreSQL database.

### 2. Session Management
- Instead of returning JWTs in the response body (which exposes them to `localStorage` XSS attacks), the server will issue a JWT and immediately set it as an `HttpOnly`, `Secure`, and `SameSite=Strict` cookie on the response.
- This satisfies the critical security requirement (`AUTH-02`) identified in the research phase and mitigates common vulnerabilities.

### 3. Middleware & Route Protection
- We will implement a custom Gin middleware that checks incoming requests for the `HttpOnly` cookie.
- If the token is valid, it extracts the user claims (like user ID) and adds them to the Gin Context for downstream handlers.
- If missing or invalid, it immediately returns a `401 Unauthorized` response, satisfying `AUTH-04`.

### 4. Logout Mechanism
- Logout will be handled via a dedicated endpoint that clears the session cookie by setting its expiration date to the past.

## Developer Context
- **Experience Level:** Beginner in Go backend development.
- **Goal:** Provide a straightforward and secure implementation of standard web authentication without overcomplicating the setup with distributed session stores (like Redis) right now. The JWT approach keeps the backend mostly stateless while remaining secure due to the `HttpOnly` cookie wrapper.

## Open Questions for Research/Planning
- What specific claims should the JWT contain besides the `user_id` to make subsequent database queries efficient?
- How should the Go application handle JWT signing keys (e.g., standard `HS256` with an environment variable secret)?