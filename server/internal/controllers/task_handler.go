package controllers

import (
	"net/http"
	"taskmanager/internal/models"
	"taskmanager/internal/service"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

type TaskHandler struct {
	service service.TaskService
}

func NewTaskHandler(service service.TaskService) *TaskHandler {
	return &TaskHandler{service: service}
}

func (h *TaskHandler) GetAllTasks(c echo.Context) error {
	tasks, err := h.service.GetAllTasks()
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch all tasks")
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "Failed to fetch tasks",
			"message": err.Error(),
		})
	}
	return c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandler) GetTaskByID(c echo.Context) error {
	id := c.Param("id")
	task, err := h.service.GetTaskByID(id)
	if err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to fetch task")
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"error":   "Task not found",
			"message": err.Error(),
		})
	}
	return c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) CreateTask(c echo.Context) error {
	var input models.CreateTaskInput
	if err := c.Bind(&input); err != nil {
		log.Error().Err(err).Msg("Failed to bind CreateTaskInput")
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Invalid input",
			"message": err.Error(),
		})
	}

	if err := c.Validate(&input); err != nil {
		log.Error().Err(err).Msg("Validation failed for CreateTaskInput")
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Validation error",
			"message": err.Error(),
		})
	}

	task, err := h.service.CreateTask(input)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create task")
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "Failed to create task",
			"message": err.Error(),
		})
	}
	return c.JSON(http.StatusCreated, task)
}

func (h *TaskHandler) UpdateTask(c echo.Context) error {
	id := c.Param("id")
	var input models.UpdateTaskInput
	if err := c.Bind(&input); err != nil {
		log.Error().Err(err).Msg("Failed to bind UpdateTaskInput")
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Invalid input",
			"message": err.Error(),
		})
	}

	if err := c.Validate(&input); err != nil {
		log.Error().Err(err).Msg("Validation failed for UpdateTaskInput")
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   "Validation error",
			"message": err.Error(),
		})
	}

	task, err := h.service.UpdateTask(id, input)
	if err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to update task")
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "Failed to update task",
			"message": err.Error(),
		})
	}
	return c.JSON(http.StatusOK, task)
}

func (h *TaskHandler) DeleteTask(c echo.Context) error {
	id := c.Param("id")
	if err := h.service.DeleteTask(id); err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to delete task")
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "Failed to delete task",
			"message": err.Error(),
		})
	}
	return c.NoContent(http.StatusNoContent)
}
