package models

import (
	"time"
	"gorm.io/gorm"
)

type SpeedTestResult struct {
	ID       uint `gorm:"primarykey" json:"id"`
	UserID   uint `gorm:"not null" json:"user_id"`
	ServerID uint `gorm:"not null" json:"server_id"`
	DownloadSpeed float64 `json:"download_speed"`
	UploadSpeed   float64 `json:"upload_speed"`
	LatencyAvg    float64 `json:"latency_avg"`
	LatencyMin    float64 `json:"latency_min"`
	LatencyMax    float64 `json:"latency_max"`
	Jitter        float64 `json:"jitter"`
	TestDuration  int     `json:"test_duration"`
	DataTransferred int64 `json:"data_transferred"`
	CreatedAt     time.Time `json:"created_at"`
	User   User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Server Server `gorm:"foreignKey:ServerID" json:"server,omitempty"`
}

func (SpeedTestResult) TableName() string {
	return "speed_test_results"
}

func (s *SpeedTestResult) BeforeCreate(tx *gorm.DB) error {
	if s.CreatedAt.IsZero() {
		s.CreatedAt = time.Now()
	}
	return nil
}

func (s *SpeedTestResult) Validate() error {
	if s.UserID == 0 {
		return gorm.ErrRecordNotFound
	}
	if s.ServerID == 0 {
		return gorm.ErrRecordNotFound
	}
	if s.DownloadSpeed < 0 {
		return gorm.ErrInvalidData
	}
	if s.UploadSpeed < 0 {
		return gorm.ErrInvalidData
	}
	if s.LatencyAvg < 0 || s.LatencyMin < 0 || s.LatencyMax < 0 {
		return gorm.ErrInvalidData
	}
	if s.TestDuration <= 0 {
		return gorm.ErrInvalidData
	}
	if s.DataTransferred <= 0 {
		return gorm.ErrInvalidData
	}
	return nil
}