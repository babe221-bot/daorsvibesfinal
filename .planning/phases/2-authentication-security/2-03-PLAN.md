---
phase: 2-authentication-security
plan: 03
type: execute
wave: 3
depends_on: ["2-02"]
files_modified: ["cmd/api/main.go"]
autonomous: false
requirements: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]
user_setup: []
must_haves:
  truths:
    - "API routes for signup, login, and logout are reachable via HTTP"
    - "Protected routes successfully enforce authentication and reject anonymous requests"
  artifacts:
    - path: "cmd/api/main.go"
      provides: "API router configuration"
      contains: "api.POST(\"/auth/login\""
  key_links:
    - from: "cmd/api/main.go"
      to: "internal/handlers/auth.go"
      via: "route registration"
      pattern: "authHandler.Login"
---

<objective>
Wire up the authentication handlers and middleware to the Gin router to expose the endpoints.

Purpose: Complete the authentication flow by making the routes accessible and establishing a test protected route.
Output: A running server with functional authentication endpoints.
</objective>

<context>
@.planning/phases/2-authentication-security/CONTEXT.md
@.planning/phases/2-authentication-security/RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Register Auth Routes</name>
  <files>cmd/api/main.go</files>
  <action>Instantiate `services.AuthService` (using `os.Getenv("JWT_SECRET")`) and `handlers.AuthHandler`. Map standard auth endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, and `POST /api/auth/logout`. Create a protected route group using the `middleware.RequireAuth` function, and add a test route `GET /api/auth/me` that returns the `userID` and `email` retrieved from the Gin context using `c.MustGet`.</action>
  <verify>
    <automated>go build ./cmd/api</automated>
  </verify>
  <done>Routes are properly mapped to their respective handlers.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Full end-to-end authentication flow</what-built>
  <how-to-verify>
1. Start the server: `JWT_SECRET=supersecret go run cmd/api/main.go`
2. Test Signup: `curl -X POST http://localhost:8080/api/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"password123"}'`
3. Test Login: `curl -v -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"password123"}'`
   - Ensure the output shows `Set-Cookie: auth_token=...; HttpOnly`
4. Test Protected Route: Send a request to `GET http://localhost:8080/api/auth/me` with the cookie attached, or use curl with the received cookie (`--cookie "auth_token=..."`). Confirm it returns user info with 200 OK.
5. Test Missing Cookie: Send request to `GET http://localhost:8080/api/auth/me` without cookie. Confirm 401 Unauthorized response.
6. Test Logout: Send request to `POST http://localhost:8080/api/auth/logout`. Confirm `Set-Cookie` header invalidates the cookie (Max-Age=0 or past expiry).
  </how-to-verify>
  <resume-signal>Type "approved" if the auth flow works successfully and all criteria match.</resume-signal>
</task>

</tasks>

<verification>
Server starts cleanly and the authentication routes respond according to the defined rules.
</verification>

<success_criteria>
Phase 2 is fully implemented and human-verified.
</success_criteria>

<output>
After completion, create `.planning/phases/2-authentication-security/2-03-SUMMARY.md`
</output>