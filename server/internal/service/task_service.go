package service

import (
	"time"

	"taskmanager/internal/models"
	"taskmanager/internal/repository"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

type TaskService interface {
	GetAllTasks() ([]models.Task, error)
	GetTaskByID(id string) (models.Task, error)
	CreateTask(input models.CreateTaskInput) (models.Task, error)
	UpdateTask(id string, input models.UpdateTaskInput) (models.Task, error)
	DeleteTask(id string) error
}

type taskService struct {
	repo      repository.TaskRepository
	validator *validator.Validate
}

func NewTaskService(repo repository.TaskRepository) TaskService {
	return &taskService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *taskService) GetAllTasks() ([]models.Task, error) {
	tasks, err := s.repo.FindAll()
	if err != nil {
		log.Error().Err(err).Msg("Failed to fetch all tasks from repository")
		return nil, err
	}
	return tasks, nil
}

func (s *taskService) GetTaskByID(id string) (models.Task, error) {
	task, err := s.repo.FindByID(id)
	if err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to fetch task from repository")
		return models.Task{}, err
	}
	return task, nil
}

func (s *taskService) CreateTask(input models.CreateTaskInput) (models.Task, error) {
	if err := s.validator.Struct(input); err != nil {
		log.Error().Err(err).Msg("Validation failed for CreateTaskInput")
		return models.Task{}, err
	}

	dueDate, err := input.ValidateDueDate()
	if err != nil {
		log.Error().Err(err).Msg("Failed to parse due date during task creation")
		return models.Task{}, err
	}

	task := models.Task{
		ID:          uuid.New().String(),
		Title:       input.Title,
		Description: input.Description,
		DueDate:     dueDate,
		Completed:   input.Completed,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	createdTask, err := s.repo.Create(task)
	if err != nil {
		log.Error().Err(err).Msg("Failed to create task in repository")
		return models.Task{}, err
	}

	return createdTask, nil
}

func (s *taskService) UpdateTask(id string, input models.UpdateTaskInput) (models.Task, error) {
	if err := s.validator.Struct(input); err != nil {
		log.Error().Err(err).Msg("Validation failed for UpdateTaskInput")
		return models.Task{}, err
	}

	task, err := s.repo.FindByID(id)
	if err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to find task for update")
		return models.Task{}, err
	}

	// Parse due date if provided
	if input.DueDate != "" {
		dueDate, err := input.ValidateDueDate()
		if err != nil {
			log.Error().Err(err).Msg("Failed to parse due date in update")
			return models.Task{}, err
		}
		task.DueDate = dueDate
	}

	// Update fields
	task.Title = input.Title
	task.Description = input.Description
	task.Completed = input.Completed
	task.UpdatedAt = time.Now()

	updatedTask, err := s.repo.Update(task)
	if err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to update task in repository")
		return models.Task{}, err
	}

	return updatedTask, nil
}

func (s *taskService) DeleteTask(id string) error {
	if err := s.repo.Delete(id); err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to delete task from repository")
		return err
	}
	return nil
}
