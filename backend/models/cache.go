package models

import (
	"time"

	"github.com/lib/pq"
)

// WGPeerCache - кэш для пиров WireGuard
type WGPeerCache struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	ServerID         uint           `gorm:"not null;uniqueIndex:idx_peers_unique" json:"server_id"`
	ConfigName       string         `gorm:"size:50;not null;uniqueIndex:idx_peers_unique" json:"config_name"`
	PublicKey        string         `gorm:"size:255;not null;uniqueIndex:idx_peers_unique" json:"public_key"`
	Name             string         `gorm:"size:255" json:"name"`
	Status           string         `gorm:"size:20" json:"status"`
	AllowedIPs       pq.StringArray `gorm:"type:text[]" json:"allowed_ips"`
	Endpoint         string         `gorm:"size:255" json:"endpoint"`
	LastKnownEndpoint string        `gorm:"size:255" json:"last_known_endpoint"` // Последний известный endpoint (для геолокации)
	DNS              string         `gorm:"size:255" json:"dns"`
	MTU              int            `json:"mtu"`
	KeepAlive        int            `gorm:"column:keepalive" json:"keepalive"`
	TotalReceive     float64        `gorm:"type:decimal(15,4)" json:"total_receive"`
	TotalSent        float64        `gorm:"type:decimal(15,4)" json:"total_sent"`
	TotalData        float64        `gorm:"type:decimal(15,4)" json:"total_data"`
	LatestHandshake  string         `gorm:"size:100" json:"latest_handshake"`
	Category         string         `gorm:"size:255" json:"category"` // Категория пира (3wg-panel)
	LastSyncedAt     time.Time      `gorm:"default:now()" json:"last_synced_at"`
	CreatedAt        time.Time      `gorm:"default:now()" json:"created_at"`
	UpdatedAt        time.Time      `gorm:"default:now()" json:"updated_at"`
}

// WGConfigCache - кэш для конфигураций WireGuard
type WGConfigCache struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	ServerID       uint      `gorm:"not null;uniqueIndex:idx_configs_unique" json:"server_id"`
	Name           string    `gorm:"size:50;not null;uniqueIndex:idx_configs_unique" json:"name"`
	Status         bool      `json:"status"`
	PublicKey      string    `gorm:"size:255" json:"public_key"`
	ListenPort     string    `gorm:"size:10" json:"listen_port"`
	Address        string    `gorm:"size:100" json:"address"`
	TotalPeers     int       `json:"total_peers"`
	ConnectedPeers int       `json:"connected_peers"`
	DataReceive    float64   `gorm:"type:decimal(15,4)" json:"data_receive"`
	DataSent       float64   `gorm:"type:decimal(15,4)" json:"data_sent"`
	DataTotal      float64   `gorm:"type:decimal(15,4)" json:"data_total"`
	LastSyncedAt   time.Time `gorm:"default:now()" json:"last_synced_at"`
	CreatedAt      time.Time `gorm:"default:now()" json:"created_at"`
	UpdatedAt      time.Time `gorm:"default:now()" json:"updated_at"`
}

// SystemStatusCache - кэш для системного статуса
type SystemStatusCache struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ServerID      uint      `gorm:"not null;unique" json:"server_id"`
	CPUPercent    float64   `gorm:"type:decimal(5,2)" json:"cpu_percent"`
	MemoryPercent float64   `gorm:"type:decimal(5,2)" json:"memory_percent"`
	MemoryTotal   int64     `json:"memory_total"`
	MemoryUsed    int64     `json:"memory_used"`
	DiskPercent   float64   `gorm:"type:decimal(5,2)" json:"disk_percent"`
	DiskTotal     int64     `json:"disk_total"`
	DiskUsed      int64     `json:"disk_used"`
	LastSyncedAt  time.Time `gorm:"default:now()" json:"last_synced_at"`
	UpdatedAt     time.Time `gorm:"default:now()" json:"updated_at"`
}

// TableName для GORM
func (WGPeerCache) TableName() string {
	return "wg_peers_cache"
}

func (WGConfigCache) TableName() string {
	return "wg_configs_cache"
}

func (SystemStatusCache) TableName() string {
	return "system_status_cache"
}


// PeerTrafficHistory история трафика пира (снимки по дням)
type PeerTrafficHistory struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ServerID     uint      `gorm:"not null;index:idx_peer_traffic_history_peer" json:"server_id"`
	ConfigName   string    `gorm:"size:50;not null;index:idx_peer_traffic_history_peer" json:"config_name"`
	PublicKey    string    `gorm:"type:text;not null;index:idx_peer_traffic_history_peer" json:"public_key"`
	PeerName     string    `gorm:"size:255" json:"peer_name"`
	
	// Снимок трафика (кумулятивный)
	BytesReceived uint64 `gorm:"not null;default:0" json:"bytes_received"`
	BytesSent     uint64 `gorm:"not null;default:0" json:"bytes_sent"`
	BytesTotal    uint64 `gorm:"not null;default:0" json:"bytes_total"`
	
	// Дельта за день
	DeltaReceived uint64 `gorm:"not null;default:0" json:"delta_received"`
	DeltaSent     uint64 `gorm:"not null;default:0" json:"delta_sent"`
	DeltaTotal    uint64 `gorm:"not null;default:0" json:"delta_total"`
	
	RecordedAt time.Time `gorm:"not null;index:idx_peer_traffic_history_peer,priority:4;index:idx_peer_traffic_history_date" json:"recorded_at"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (PeerTrafficHistory) TableName() string {
	return "peer_traffic_history"
}

// PeerTrafficHourly почасовая история трафика пира
type PeerTrafficHourly struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ServerID     uint      `gorm:"not null;index:idx_peer_traffic_hourly_peer" json:"server_id"`
	ConfigName   string    `gorm:"size:50;not null;index:idx_peer_traffic_hourly_peer" json:"config_name"`
	PublicKey    string    `gorm:"type:text;not null;index:idx_peer_traffic_hourly_peer" json:"public_key"`
	PeerName     string    `gorm:"size:255" json:"peer_name"`
	
	// Снимок трафика (кумулятивный)
	BytesReceived uint64 `gorm:"not null;default:0" json:"bytes_received"`
	BytesSent     uint64 `gorm:"not null;default:0" json:"bytes_sent"`
	BytesTotal    uint64 `gorm:"not null;default:0" json:"bytes_total"`
	
	// Дельта за час
	DeltaReceived uint64 `gorm:"not null;default:0" json:"delta_received"`
	DeltaSent     uint64 `gorm:"not null;default:0" json:"delta_sent"`
	DeltaTotal    uint64 `gorm:"not null;default:0" json:"delta_total"`
	
	RecordedAt time.Time `gorm:"not null;index:idx_peer_traffic_hourly_peer,priority:4;index:idx_peer_traffic_hourly_date" json:"recorded_at"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (PeerTrafficHourly) TableName() string {
	return "peer_traffic_hourly"
}
