package validator

import (
	"time"

	"github.com/go-playground/validator/v10"
)

// CustomValidator adapts validator.Validate to Echo's interface
type CustomValidator struct {
	Validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.Validator.Struct(i)
}

func RegisterCustomValidators(v *validator.Validate) {
	_ = v.RegisterValidation("datetime", validateDateTime)
}

func validateDateTime(fl validator.FieldLevel) bool {
	dateStr := fl.Field().String()
	if dateStr == "" {
		return false
	}
	layout := fl.Param()
	if layout == "" {
		layout = "2006-01-02"
	}
	_, err := time.Parse(layout, dateStr)
	return err == nil
}
