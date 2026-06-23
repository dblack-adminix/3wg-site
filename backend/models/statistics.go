package models

import (
	"time"

	"gorm.io/gorm"
)

type Statistics struct {
	ID              uint           `gorm:"primarykey" json:"id"`
	UserID          uint           `gorm:"not null" json:"user_id"`
	User            User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ServerID        uint           `gorm:"not null" json:"server_id"`
	Server          Server         `gorm:"foreignKey:ServerID" json:"server,omitempty"`
	TrafficUpload   int64          `gorm:"default:0" json:"traffic_upload"`   // bytes
	TrafficDownload int64          `gorm:"default:0" json:"traffic_download"` // bytes
	Uptime          int            `gorm:"default:0" json:"uptime"`           // seconds
	Ping            int            `gorm:"default:0" json:"ping"`             // milliseconds
	Date            time.Time      `gorm:"index" json:"date"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}
