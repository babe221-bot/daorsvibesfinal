package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

func main() {
	// Connect to default local postgres
	dsn := "host=localhost user=postgres password=postgres dbname=postgres sslmode=disable"
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Database ping failed: %v", err)
	}

	// Set dialect
	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatalf("Failed to set dialect: %v", err)
	}

	// Run migrations
	if err := goose.Up(db, "migrations"); err != nil {
		log.Fatalf("Goose up failed: %v", err)
	}

	fmt.Println("Migrations applied successfully!")
}
