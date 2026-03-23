package handlers

import (
	"net/http"
	"os"

	"github.com/daorsvibesfinal/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

type Credentials struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.authService.CreateUser(c.Request.Context(), creds.Email, creds.Password)
	if err != nil {
		// Basic error handling for duplicate email/etc could be improved
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user created successfully",
		"user_id": user.ID,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var creds Credentials
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, tokenString, err := h.authService.AuthenticateUser(c.Request.Context(), creds.Email, creds.Password)
	if err != nil {
		if err == services.ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authentication failed"})
		return
	}

	isProd := os.Getenv("APP_ENV") == "production"
	c.SetCookie("auth_token", tokenString, 86400, "/", "", isProd, true)

	c.JSON(http.StatusOK, gin.H{"message": "logged in successfully"})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	isProd := os.Getenv("APP_ENV") == "production"
	c.SetCookie("auth_token", "", -1, "/", "", isProd, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
}
