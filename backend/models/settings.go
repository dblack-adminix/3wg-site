package models

import (
	"time"

	"gorm.io/gorm"
)

type SiteSettings struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Key       string         `gorm:"uniqueIndex;not null" json:"key"`
	Value     string         `gorm:"type:text" json:"value"`
	Type      string         `gorm:"default:string" json:"type"` // string, boolean, json
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Настройки блоков главной страницы
type HomePageSettings struct {
	HeroSection          bool     `json:"hero_section"`
	KeeneticSection      bool     `json:"keenetic_section"`
	VPNSection           bool     `json:"vpn_section"`
	ServicesSection      bool     `json:"services_section"`
	PricingSection       bool     `json:"pricing_section"`
	HardwareSection      bool     `json:"hardware_section"`
	InfrastructureSection bool     `json:"infrastructure_section"`
	FAQSection           bool     `json:"faq_section"`
	ArticlesSection      bool     `json:"articles_section"`
	TelegramSection      bool     `json:"telegram_section"`
	StatusWidget         bool     `json:"status_widget"`
	BlockOrder           []string `json:"block_order"` // Порядок блоков (кроме hero_section)
}
