package main

import (
	"fmt"
	"log"

	"github.com/daorsvibesfinal/internal/config"
	"github.com/daorsvibesfinal/internal/database"
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
}
