package errors

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/rs/zerolog/log"
)

type ValidationError struct {
	Message string
	Details map[string]string
}

func NewValidationError(message string, details map[string]string) *ValidationError {
	return &ValidationError{Message: message, Details: details}
}

func (e *ValidationError) Error() string {
	return e.Message
}

func HandleError(c echo.Context, err error) error {
	log.Error().Err(err).Msg("Handling error")
	switch e := err.(type) {
	case *ValidationError:
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"error":   e.Message,
			"details": e.Details,
		})
	default:
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"error":   "Internal server error",
			"message": err.Error(),
		})
	}
}
