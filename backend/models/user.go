package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `gorm:"not null" json:"-"`
	TelegramID   string         `gorm:"uniqueIndex" json:"telegram_id,omitempty"`
	Balance      float64        `gorm:"default:0" json:"balance"`
	Tariff       string         `gorm:"default:free" json:"tariff"`
	IsAdmin      bool           `gorm:"default:false" json:"is_admin"`
	IsActive     bool           `gorm:"default:true" json:"is_active"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type UserResponse struct {
	ID         uint      `json:"id"`
	Email      string    `json:"email"`
	TelegramID string    `json:"telegram_id,omitempty"`
	Balance    float64   `json:"balance"`
	Tariff     string    `json:"tariff"`
	IsAdmin    bool      `json:"is_admin"`
	IsActive   bool      `json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:         u.ID,
		Email:      u.Email,
		TelegramID: u.TelegramID,
		Balance:    u.Balance,
		Tariff:     u.Tariff,
		IsAdmin:    u.IsAdmin,
		IsActive:   u.IsActive,
		CreatedAt:  u.CreatedAt,
	}
}
