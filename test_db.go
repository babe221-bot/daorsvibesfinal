package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
	db, err := sql.Open("pgx", "host=localhost user=postgres password=postgres dbname=postgres sslmode=disable")
	if err != nil {
		log.Fatalf("failed to open: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping: %v", err)
	}

	fmt.Println("Ping successful!")
}
