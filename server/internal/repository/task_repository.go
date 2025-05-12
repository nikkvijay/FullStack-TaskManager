package repository

import (
	"taskmanager/internal/models"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type TaskRepository interface {
	FindAll() ([]models.Task, error)
	FindByID(id string) (models.Task, error)
	Create(task models.Task) (models.Task, error)
	Update(task models.Task) (models.Task, error)
	Delete(id string) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) FindAll() ([]models.Task, error) {
	var tasks []models.Task
	if err := r.db.Find(&tasks).Error; err != nil {
		log.Error().Err(err).Msg("Failed to find all tasks")
		return nil, err
	}
	return tasks, nil
}

func (r *taskRepository) FindByID(id string) (models.Task, error) {
	var task models.Task
	if err := r.db.First(&task, "id = ?", id).Error; err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to find task")
		return task, err
	}
	return task, nil
}

func (r *taskRepository) Create(task models.Task) (models.Task, error) {
	if err := r.db.Create(&task).Error; err != nil {
		log.Error().Err(err).Msg("Failed to create task")
		return models.Task{}, err
	}
	return task, nil
}

func (r *taskRepository) Update(task models.Task) (models.Task, error) {
	if err := r.db.Save(&task).Error; err != nil {
		log.Error().Err(err).Str("id", task.ID).Msg("Failed to update task")
		return models.Task{}, err
	}
	return task, nil
}

func (r *taskRepository) Delete(id string) error {
	if err := r.db.Delete(&models.Task{}, "id = ?", id).Error; err != nil {
		log.Error().Err(err).Str("id", id).Msg("Failed to delete task")
		return err
	}
	return nil
}
