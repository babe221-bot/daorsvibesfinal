package main

import (
	"fmt"
	"log"
	"os"

	"github.com/daorsvibesfinal/internal/config"
	"github.com/daorsvibesfinal/internal/database"
	"github.com/daorsvibesfinal/internal/handlers"
	"github.com/daorsvibesfinal/internal/services"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)

	db, err := database.NewConnectionPool(dsn)
	if err != nil {
		log.Fatalf("Failed to initialize database connection pool: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	log.Println("Successfully connected to the database")

	// Initialize Services
	authService := services.NewAuthService(db, cfg.JWTSecret)

	// Initialize Handlers
	authHandler := handlers.NewAuthHandler(authService)

	// Set up Gin Router
	r := gin.Default()

	// API Routes
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/signup", authHandler.Signup)
			auth.POST("/login", authHandler.Login)
			auth.POST("/logout", authHandler.Logout)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
