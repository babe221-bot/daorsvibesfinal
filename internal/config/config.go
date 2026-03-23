package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	JWTSecret  string
}

func Load() (*Config, error) {
	// Ignore error as .env file might not exist in production
	_ = godotenv.Load()

	cfg := &Config{
		DBHost:     getEnvOrDefault("DB_HOST", "localhost"),
		DBPort:     getEnvOrDefault("DB_PORT", "5432"),
		DBUser:     getEnvOrDefault("DB_USER", "postgres"),
		DBPassword: getEnvOrDefault("DB_PASSWORD", ""),
		DBName:     getEnvOrDefault("DB_NAME", "daorsvibes"),
		DBSSLMode:  getEnvOrDefault("DB_SSLMODE", "disable"),
		JWTSecret:  getEnvOrDefault("JWT_SECRET", "fallback-secret-for-dev-only"),
	}

	return cfg, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
