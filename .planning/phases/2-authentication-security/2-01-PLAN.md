---
phase: 2-authentication-security
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: ["go.mod", "go.sum", "internal/services/auth.go", "internal/services/auth_test.go"]
autonomous: true
requirements: [AUTH-01, AUTH-02]
must_haves:
  truths:
    - "Passwords are cryptographically hashed using bcrypt"
    - "JWTs are securely generated and validated with correct algorithms"
  artifacts:
    - path: "internal/services/auth.go"
      provides: "JWT and hashing business logic"
      exports: ["AuthService", "NewAuthService"]
  key_links:
    - from: "internal/services/auth.go"
      to: "golang.org/x/crypto/bcrypt"
      via: "password hashing"
      pattern: "bcrypt.GenerateFromPassword"
---

<objective>
Implement the core authentication service to handle password hashing, JWT generation and validation, and database operations for users.

Purpose: Create a secure, standalone service for all identity operations before exposing them via HTTP.
Output: An AuthService struct and utility functions for cryptography.
</objective>

<context>
@.planning/phases/2-authentication-security/CONTEXT.md
@.planning/phases/2-authentication-security/RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Dependencies</name>
  <files>go.mod, go.sum</files>
  <action>Run `go get github.com/golang-jwt/jwt/v5 golang.org/x/crypto/bcrypt` to install the required standard security libraries.</action>
  <verify>
    <automated>go list -m github.com/golang-jwt/jwt/v5 golang.org/x/crypto/bcrypt</automated>
  </verify>
  <done>Both dependencies are correctly added to go.mod.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Implement Auth Service Logic</name>
  <files>internal/services/auth.go, internal/services/auth_test.go</files>
  <behavior>
    - HashPassword: returns string hashed with bcrypt cost 12
    - CheckPasswordHash: returns true for valid match, false otherwise
    - GenerateJWT: returns string token signed with HS256 containing userID and email
    - ValidateJWT: securely parses token, prevents `alg` none attacks, returns claims
  </behavior>
  <action>Create `AuthService` struct that holds a DB connection and a `jwtSecret` byte slice. Implement the cryptography and token methods defined in the behavior. Add `CreateUser(ctx, email, password)` and `AuthenticateUser(ctx, email, password)` which interact with the `users` table, hashing passwords on creation and checking them on auth. Define a `CustomClaims` struct embedding `jwt.RegisteredClaims` with `UserID` and `Email`.</action>
  <verify>
    <automated>go test ./internal/services -v -run TestAuth</automated>
  </verify>
  <done>Service compiles and tests pass for hashing and JWT operations.</done>
</task>

</tasks>

<verification>
`go test ./internal/services/...` passes successfully.
</verification>

<success_criteria>
The codebase now contains the required cryptographic functions and JWT utilities to support the authentication handlers.
</success_criteria>

<output>
After completion, create `.planning/phases/2-authentication-security/2-01-SUMMARY.md`
</output>