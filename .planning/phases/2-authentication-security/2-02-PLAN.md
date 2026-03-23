---
phase: 2-authentication-security
plan: 02
type: execute
wave: 2
depends_on: ["2-01"]
files_modified: ["internal/middleware/auth.go", "internal/handlers/auth.go"]
autonomous: true
requirements: [AUTH-03, AUTH-04]
must_haves:
  truths:
    - "Unauthenticated requests are rejected with 401 Unauthorized"
    - "Login and Logout handlers correctly manage HttpOnly cookies"
  artifacts:
    - path: "internal/middleware/auth.go"
      provides: "Gin middleware for checking auth cookies"
      exports: ["RequireAuth"]
    - path: "internal/handlers/auth.go"
      provides: "HTTP handlers for authentication"
      exports: ["AuthHandler", "NewAuthHandler"]
  key_links:
    - from: "internal/middleware/auth.go"
      to: "internal/services/auth.go"
      via: "token validation"
      pattern: "ValidateJWT"
---

<objective>
Implement the HTTP layer for authentication, including the Gin middleware for route protection and the handlers for signup, login, and logout.

Purpose: Bridge the core AuthService to the web framework, ensuring secure cookie handling and standard HTTP responses.
Output: `RequireAuth` middleware and `AuthHandler` with HTTP methods.
</objective>

<context>
@.planning/phases/2-authentication-security/CONTEXT.md
@.planning/phases/2-authentication-security/RESEARCH.md
</context>

<interfaces>
From internal/services/auth.go:
```go
type AuthService struct { /* ... */ }
func NewAuthService(db *sqlx.DB, secret string) *AuthService
func (s *AuthService) CreateUser(ctx context.Context, email, password string) (*User, error)
func (s *AuthService) AuthenticateUser(ctx context.Context, email, password string) (*User, string, error) // Returns User and JWT token
func (s *AuthService) ValidateJWT(tokenString string) (*CustomClaims, error)
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Implement Auth Middleware</name>
  <files>internal/middleware/auth.go</files>
  <action>Create `RequireAuth(authService *services.AuthService) gin.HandlerFunc`. It must read the `auth_token` cookie using `c.Cookie("auth_token")`. If missing, abort with 401 and JSON error message. If present, validate it using `authService.ValidateJWT`. If valid, extract `UserID` and `Email` and add them to the context via `c.Set("userID", claims.UserID)` and `c.Set("email", claims.Email)`. If invalid, abort with 401.</action>
  <verify>
    <automated>go build ./internal/middleware</automated>
  </verify>
  <done>Middleware correctly intercepts requests and manages the Gin context.</done>
</task>

<task type="auto">
  <name>Task 2: Implement Auth Handlers</name>
  <files>internal/handlers/auth.go</files>
  <action>Create `AuthHandler` struct injected with `*services.AuthService`. Implement:
- `Signup`: Binds JSON `{email, password}`, calls `CreateUser`, returns 201 JSON.
- `Login`: Binds JSON, calls `AuthenticateUser`. On success, sets `auth_token` cookie (MaxAge: 86400, Path: "/", HttpOnly: true, SameSite: Strict). Determine `Secure` dynamically based on `os.Getenv("APP_ENV") == "production"`. Returns 200 JSON indicating success.
- `Logout`: Clears cookie by setting `auth_token` MaxAge to -1. Returns 200 JSON.</action>
  <verify>
    <automated>go build ./internal/handlers</automated>
  </verify>
  <done>Handlers securely interface with cookies and the AuthService.</done>
</task>

</tasks>

<verification>
Handlers and middlewares compile successfully and utilize secure cookie configuration.
</verification>

<success_criteria>
The web layer is ready to be hooked into the main application router.
</success_criteria>

<output>
After completion, create `.planning/phases/2-authentication-security/2-02-SUMMARY.md`
</output>