package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"database/sql"
	"task-manager/internal/config"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Create PostgreSQL DSN
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
	)

	// Connect to database
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Find and execute migration files
	migrationFiles, err := filepath.Glob("migrations/*.sql")
	if err != nil {
		log.Fatalf("Failed to find migration files: %v", err)
	}

	for _, file := range migrationFiles {
		content, err := os.ReadFile(file)
		if err != nil {
			log.Fatalf("Failed to read migration file %s: %v", file, err)
		}

		fmt.Printf("Executing migration: %s\n", file)
		_, err = db.Exec(string(content))
		if err != nil {
			log.Fatalf("Failed to execute migration %s: %v", file, err)
		}
		fmt.Printf("Successfully applied migration: %s\n", file)
	}

	fmt.Println("All migrations completed successfully!")
}
