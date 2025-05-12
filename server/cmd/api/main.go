package main

import (
	"fmt"
	"log"
	"os"

	"taskmanager/internal/config"
	"taskmanager/internal/controllers"
	"taskmanager/internal/db"
	"taskmanager/internal/logging"
	"taskmanager/internal/repository"
	"taskmanager/internal/routes"
	"taskmanager/internal/service"
	customValidator "taskmanager/internal/validator" // Alias for custom validator

	v10 "github.com/go-playground/validator/v10" // Alias for third-party validator
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Initialize logger
	logging.InitLogger()

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	dbConn, err := db.InitDB(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize repository, service, and handler
	repo := repository.NewTaskRepository(dbConn)
	svc := service.NewTaskService(repo)
	handler := controllers.NewTaskHandler(svc)

	// Initialize and register validator
	validate := v10.New()
	customValidator.RegisterCustomValidators(validate)

	// Initialize Echo
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(controllers.ErrorMiddleware())

	// ✅ Register validator with Echo
	e.Validator = &customValidator.CustomValidator{Validator: validate}

	// Register routes
	routes.RegisterRoutes(e, handler)

	// Start server
	port := getEnv("PORT", "8080")
	log.Printf("Starting server on :%s", port)
	if err := e.Start(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// getEnv retrieves an environment variable or returns a default value.
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
