package models

import (
	"time"

	"gorm.io/gorm"
)

type VPNKey struct {
	ID         uint           `gorm:"primarykey" json:"id"`
	UserID     uint           `gorm:"not null" json:"user_id"`
	User       User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ServerID   uint           `gorm:"not null" json:"server_id"`
	Server     Server         `gorm:"foreignKey:ServerID" json:"server,omitempty"`
	Name       string         `gorm:"not null" json:"name"`
	Protocol   string         `gorm:"not null" json:"protocol"` // wireguard, amneziawg
	PublicKey  string         `gorm:"not null" json:"public_key"`
	PrivateKey string         `gorm:"not null" json:"private_key"`
	IPAddress  string         `gorm:"not null" json:"ip_address"` // Client IP address (e.g., 10.0.0.2)
	Config     string         `gorm:"type:text" json:"config"`
	Status     string         `gorm:"default:active" json:"status"` // active, inactive, expired
	ExpiresAt  *time.Time     `json:"expires_at,omitempty"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
