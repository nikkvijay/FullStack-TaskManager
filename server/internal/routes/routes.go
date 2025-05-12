package routes

import (
	"net/http"
	"taskmanager/internal/controllers"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/rs/zerolog/log"
)

func RegisterRoutes(e *echo.Echo, taskHandler *controllers.TaskHandler) {
	// Configuring CORS middleware
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPut,
			http.MethodPost,
			http.MethodDelete,
		},
		AllowCredentials: true,
		Skipper: func(c echo.Context) bool {
			log.Debug().
				Str("path", c.Path()).
				Str("origin", c.Request().Header.Get("Origin")).
				Msg("CORS middleware triggered")
			return false
		},
	}))

	// Setting up API routes
	api := e.Group("/api/v1")
	tasks := api.Group("/tasks")

	// Task routes
	tasks.GET("", taskHandler.GetAllTasks)
	tasks.GET("/:id", taskHandler.GetTaskByID)
	tasks.POST("", taskHandler.CreateTask)
	tasks.PUT("/:id", taskHandler.UpdateTask)
	tasks.DELETE("/:id", taskHandler.DeleteTask)
}
