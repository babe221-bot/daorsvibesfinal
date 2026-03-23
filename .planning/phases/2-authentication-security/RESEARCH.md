<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- We are replacing Firebase Auth with standard Email and Password authentication.
- For passwords, the system will use `golang.org/x/crypto/bcrypt` for secure hashing before storing them in the PostgreSQL database.
- Instead of returning JWTs in the response body (which exposes them to `localStorage` XSS attacks), the server will issue a JWT and immediately set it as an `HttpOnly`, `Secure`, and `SameSite=Strict` cookie on the response.
- We will implement a custom Gin middleware that checks incoming requests for the `HttpOnly` cookie.
- If the token is valid, it extracts the user claims (like user ID) and adds them to the Gin Context for downstream handlers.
- If missing or invalid, it immediately returns a `401 Unauthorized` response.
- Logout will be handled via a dedicated endpoint that clears the session cookie by setting its expiration date to the past.

### Claude's Discretion
- What specific claims should the JWT contain besides the `user_id` to make subsequent database queries efficient?
- How should the Go application handle JWT signing keys (e.g., standard `HS256` with an environment variable secret)?

### Deferred Ideas (OUT OF SCOPE)
- Distributed session stores (like Redis).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can log in with email/password and receive an HttpOnly cookie. | Implementation details for Login handler and `golang-jwt/jwt/v5`. |
| AUTH-02 | Session Management via HttpOnly, Secure, SameSite=Strict cookies. | Secure cookie settings and extraction in Gin. |
| AUTH-03 | User can log out, invalidating the session cookie. | Implementation details for Logout handler. |
| AUTH-04 | Unauthenticated requests to protected endpoints return 401 Unauthorized errors. | Gin middleware structure for JWT validation. |
</phase_requirements>

# Phase 2: Authentication Security - Research

**Researched:** 2026-03-23
**Domain:** Go Backend Authentication, JWT, Gin Middleware, Cookie Security
**Confidence:** HIGH

## Summary

This phase replaces Firebase Auth with a custom email/password authentication system built on Go, PostgreSQL, and Gin. To maximize security and minimize complexity, we will use JSON Web Tokens (JWT) stored in `HttpOnly` cookies. This approach prevents cross-site scripting (XSS) attacks from accessing the token while keeping the backend completely stateless, avoiding the need for Redis or similar session stores.

**Primary recommendation:** Use `github.com/golang-jwt/jwt/v5` for token generation and validation, `golang.org/x/crypto/bcrypt` (cost=12) for password hashing, and Gin's built-in cookie handling (`c.SetCookie` and `c.Cookie`) for secure session management.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `github.com/golang-jwt/jwt/v5` | v5.x | JWT Generation & Validation | The most popular, actively maintained, and secure JWT library for Go. v5 introduced stricter validation and typing. |
| `golang.org/x/crypto/bcrypt` | v0.x | Password Hashing | The definitive, cryptographically secure password hashing package in the Go standard extended library. |
| `github.com/gin-gonic/gin` | v1.x | HTTP Routing & Middleware | Gin provides excellent helper functions for cookie management and robust context passing via `c.Set()` and `c.MustGet()`. |

**Installation:**
```bash
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
go get github.com/gin-gonic/gin
```

## Architecture Patterns

### Recommended Project Structure
For Phase 2, integrate the authentication logic cleanly into the existing Go layout:

```text
/
├── cmd/
│   └── api/
│       └── main.go           # Setup Gin router and register auth routes
├── internal/
│   ├── auth/                 # JWT logic, password hashing, and token claims
│   │   ├── jwt.go            # Functions for generating/validating tokens
│   │   └── password.go       # Functions for bcrypt hash/compare
│   ├── handlers/             # HTTP Handlers
│   │   └── auth_handler.go   # Signup, Login, Logout handlers
│   ├── middleware/           # Gin Middlewares
│   │   └── auth_middleware.go# JWT validation and claim extraction
│   └── repository/           # Data access layer
│       └── user_repo.go      # Fetch user by email, insert new user
└── .env                      # Add JWT_SECRET
```

### Pattern 1: JWT Claims
**What:** The payload embedded in the JWT.
**When to use:** Every time a user logs in, a new token is generated with these claims.
**Example:**
```go
type CustomClaims struct {
    UserID string `json:"user_id"`
    Email  string `json:"email"` // Optional: saves a DB query if you only need the email
    jwt.RegisteredClaims
}
```
*Recommendation:* Keep claims minimal. Include `user_id` as the primary identifier. Adding `email` or `role` can prevent unnecessary database queries on protected routes, but ensure the token doesn't exceed standard cookie size limits (4KB) and doesn't contain sensitive data.

### Pattern 2: Gin Middleware Structure
**What:** A function that intercepts requests to validate the `HttpOnly` cookie.
**When to use:** Applied to all protected routes (e.g., creating a song, fetching user profile).
**Example:**
```go
package middleware

import (
    "net/http"
    "github.com/gin-gonic/gin"
    // import your auth package for JWT validation
)

func RequireAuth(secretKey string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenString, err := c.Cookie("auth_token")
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
            return
        }

        claims, err := ValidateToken(tokenString, secretKey)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
            return
        }

        // Add claims to Gin context for downstream handlers
        c.Set("userID", claims.UserID)
        c.Next()
    }
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password Hashing | SHA256 / MD5 with manual salt | `golang.org/x/crypto/bcrypt` | Standard hashes are too fast and vulnerable to brute-force/rainbow table attacks. Bcrypt natively handles salting and work-factor scaling. |
| JWT Validation | String splitting and manual base64/crypto verification | `golang-jwt/jwt/v5` | Validating the signature, expiration (`exp`), and algorithms (`alg` none attacks) is fraught with security pitfalls. |
| Cookie Formatting | Manual `Set-Cookie` header construction | `gin.Context.SetCookie` | Gin handles the formatting, escaping, and proper placement of attributes like `HttpOnly` and `SameSite` perfectly. |

**Key insight:** Authentication security relies heavily on correctly implementing established cryptographic standards. Hand-rolling any aspect of token parsing or password hashing introduces critical vulnerabilities.

## Common Pitfalls

### Pitfall 1: Insufficient Bcrypt Work Factor (Cost)
**What goes wrong:** Hashes can be cracked too quickly, or hashing takes too long and acts as a DOS attack on the server.
**Why it happens:** Using the default or a very low/high cost.
**How to avoid:** Use a cost of `12` (`bcrypt.DefaultCost` is 10, which is slightly outdated for modern hardware). It strikes a good balance (taking ~250-500ms per hash).

### Pitfall 2: JWT `alg` None Vulnerability
**What goes wrong:** Attackers modify the token and set the algorithm to `none`, bypassing signature verification.
**Why it happens:** The JWT library is configured to blindly trust the algorithm specified in the token header.
**How to avoid:** `golang-jwt/jwt/v5` protects against this by default if you use the correct parsing function. Always verify the signing method in the `Keyfunc`:
```go
token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method")
    }
    return []byte(secretKey), nil
})
```

### Pitfall 3: Insecure Cookie Defaults in Development
**What goes wrong:** The `Secure` flag on cookies requires HTTPS. If set to `true` during local development (which is usually HTTP), the browser will silently drop the cookie, and logins will fail.
**Why it happens:** Hardcoding the `Secure` flag.
**How to avoid:** Use an environment variable (e.g., `APP_ENV=development`) to conditionally set the `Secure` flag.
```go
isProduction := os.Getenv("APP_ENV") == "production"
c.SetCookie("auth_token", token, 3600*24, "/", "", isProduction, true) // Secure=isProduction, HttpOnly=true
```

## Code Examples

### 1. Password Hashing (bcrypt)
```go
import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

### 2. Login, Signup, and Logout Handlers
```go
// Signup Handler (Simplified)
func SignupHandler(c *gin.Context) {
    // 1. Bind JSON (email, password)
    // 2. Hash Password
    // 3. Insert into DB
    // 4. Return success (require them to log in, or auto-log them in)
}

// Login Handler
func LoginHandler(c *gin.Context) {
    // 1. Bind JSON (email, password)
    // 2. Fetch user from DB by email
    // 3. Check password hash
    // 4. Generate JWT
    tokenString, err := GenerateJWT(user.ID.String(), secretKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
        return
    }

    // 5. Set HttpOnly Cookie
    isProd := os.Getenv("APP_ENV") == "production"
    // MaxAge in seconds (e.g., 24 hours). Path="/". Domain="" (current domain). Secure=isProd. HttpOnly=true
    c.SetCookie("auth_token", tokenString, 86400, "/", "", isProd, true)

    c.JSON(http.StatusOK, gin.H{"message": "logged in successfully"})
}

// Logout Handler
func LogoutHandler(c *gin.Context) {
    isProd := os.Getenv("APP_ENV") == "production"
    // MaxAge = -1 immediately expires the cookie
    c.SetCookie("auth_token", "", -1, "/", "", isProd, true)
    c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}
```

### 3. Managing the JWT Signing Secret
The JWT secret MUST be managed securely.
1. Generate a strong random key: `openssl rand -base64 32`
2. Add it to your `.env` file: `JWT_SECRET=your_base64_random_string`
3. Load it on application startup using `os.Getenv("JWT_SECRET")`. Fail the startup if it is missing or empty. Pass the secret down to your handlers and middlewares (do not use a global variable).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `testing` (Go standard library) |
| Config file | `go.mod` |
| Quick run command | `go test ./internal/auth ./internal/middleware -v -short` |
| Full suite command | `go test ./... -cover -v` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | Valid credentials issue an HttpOnly cookie | integration | `go test ./internal/handlers -run TestLogin -v` | ❌ Wave 0 |
| AUTH-02 | Token uses HttpOnly and Secure (in prod) | unit | `go test ./internal/handlers -run TestCookieAttributes -v` | ❌ Wave 0 |
| AUTH-03 | Logout sets cookie expiration to past | integration | `go test ./internal/handlers -run TestLogout -v` | ❌ Wave 0 |
| AUTH-04 | Middleware blocks requests without cookie | unit | `go test ./internal/middleware -run TestRequireAuth -v` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `go test ./internal/auth ./internal/middleware ./internal/handlers -short`
- **Per wave merge:** `go test ./... -v`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `internal/auth/jwt_test.go` — covers JWT generation/validation
- [ ] `internal/auth/password_test.go` — covers bcrypt hashing
- [ ] `internal/handlers/auth_handler_test.go` — covers HTTP handler logic (AUTH-01, AUTH-03)
- [ ] `internal/middleware/auth_middleware_test.go` — covers route protection (AUTH-04)

## Sources

### Primary (HIGH confidence)
- Go JWT v5 Documentation: [github.com/golang-jwt/jwt](https://pkg.go.dev/github.com/golang-jwt/jwt/v5)
- Go Crypto Bcrypt: [golang.org/x/crypto/bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt)
- Gin Web Framework Cookie Docs: [gin-gonic.com](https://gin-gonic.com/docs/examples/cookie/)

### Secondary (MEDIUM confidence)
- OWASP Session Management Cheat Sheet: Standard recommendations for `HttpOnly`, `Secure`, and `SameSite` cookie flags.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - `jwt/v5`, `bcrypt`, and Gin are the undisputed standards for this approach.
- Architecture: HIGH - The described middleware and handler pattern cleanly integrates into the existing Phase 1 layout.
- Pitfalls: HIGH - Missing the `Secure` flag conditional in dev and `alg` none are incredibly common beginner pitfalls.

**Research date:** 2026-03-23
**Valid until:** 2026-09-23