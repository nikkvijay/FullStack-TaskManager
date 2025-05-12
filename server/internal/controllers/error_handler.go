package controllers

import (
	"taskmanager/internal/errors"

	"github.com/labstack/echo/v4"
)

// ErrorMiddleware handles errors in HTTP requests.
func ErrorMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			err := next(c)
			if err != nil {
				return errors.HandleError(c, err)
			}
			return nil
		}
	}
}
