package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Server struct {
	ID               uint           `gorm:"primarykey" json:"id"`
	Name             string         `gorm:"not null" json:"name"`
	Location         string         `gorm:"not null" json:"location"`
	Country          string         `gorm:"not null" json:"country"`
	IPAddress        string         `gorm:"not null" json:"ip_address"`
	Status           string         `gorm:"default:active" json:"status"` // active, maintenance, offline
	Load             int            `gorm:"default:0" json:"load"`        // 0-100%
	Protocols        pq.StringArray `gorm:"type:text[]" json:"protocols"` // wireguard, amneziawg
	MaxUsers         int            `gorm:"default:100" json:"max_users"`
	UsageType        string         `gorm:"default:shared" json:"usage_type"` // shared (общие пиры) | dedicated (целиком клиенту)
	DedicatedUserID  *uint          `json:"dedicated_user_id"`                // Кому выдан сервер (для dedicated)
	PanelType        string         `gorm:"default:wgdashboard" json:"panel_type"` // wgdashboard | 3wg-panel
	PanelUser        string         `json:"panel_user"`         // Логин панели (для 3wg-panel)
	PanelPassword    string         `json:"panel_password"`     // Пароль панели (для 3wg-panel)
	WGDashboardURL   string         `json:"wg_dashboard_url"`   // URL панели WGDashboard
	WGDashboardKey   string         `json:"wg_dashboard_key"`   // API ключ для WGDashboard
	WGConfigName     string         `json:"wg_config_name"`     // Имя конфигурации (wg0, wg1, etc.)
	WGDashboardPort  int            `json:"wg_dashboard_port"`  // Порт WGDashboard
	WGListenPort     int            `json:"wg_listen_port"`     // Порт WireGuard (51820)
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}
