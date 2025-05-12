package models

import (
	"time"
)

// Task represents a task in the system
type Task struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Completed   bool      `json:"completed"`
	DueDate     time.Time `json:"due_date"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateTaskInput represents the input for creating a task
type CreateTaskInput struct {
	Title       string `json:"title" validate:"required,min=3,max=100"`
	Description string `json:"description"`
	DueDate     string `json:"due_date"`  // Removed validation
	Completed   bool   `json:"completed"`
}

// UpdateTaskInput represents the input for updating a task
type UpdateTaskInput struct {
	Title       string `json:"title" validate:"required,min=3,max=100"`
	Description string `json:"description"`
	DueDate     string `json:"due_date"`  // Removed validation
	Completed   bool   `json:"completed"`
}

// ValidateDueDate parses the DueDate string into a time.Time (Create)
func (t *CreateTaskInput) ValidateDueDate() (time.Time, error) {
	if t.DueDate == "" {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02", t.DueDate)
}

// ValidateDueDate parses the DueDate string into a time.Time (Update)
func (t *UpdateTaskInput) ValidateDueDate() (time.Time, error) {
	if t.DueDate == "" {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02", t.DueDate)
}


