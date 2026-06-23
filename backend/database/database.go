package database

import (
	"fmt"

	"github.com/3wg/vpn-backend/config"
	"github.com/3wg/vpn-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	// Build DSN
	var dsn string
	if cfg.DBPassword == "" {
		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s dbname=%s sslmode=disable",
			cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBName,
		)
	} else {
		dsn = fmt.Sprintf(
			"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	// Проверяем существование таблиц и мигрируем только новые
	if !db.Migrator().HasTable(&models.User{}) {
		if err := db.AutoMigrate(&models.User{}); err != nil {
			return err
		}
	}
	
	// Серверы мигрируем всегда — добавляются новые колонки (panel_type и т.д.)
	if err := db.AutoMigrate(&models.Server{}); err != nil {
		return err
	}
	
	if !db.Migrator().HasTable(&models.VPNKey{}) {
		if err := db.AutoMigrate(&models.VPNKey{}); err != nil {
			return err
		}
	}
	
	if !db.Migrator().HasTable(&models.Payment{}) {
		if err := db.AutoMigrate(&models.Payment{}); err != nil {
			return err
		}
	}
	
	if !db.Migrator().HasTable(&models.Statistics{}) {
		if err := db.AutoMigrate(&models.Statistics{}); err != nil {
			return err
		}
	}
	
	if !db.Migrator().HasTable(&models.SiteSettings{}) {
		if err := db.AutoMigrate(&models.SiteSettings{}); err != nil {
			return err
		}
	}
	
	// Миграция таблиц кэша
	if !db.Migrator().HasTable(&models.WGPeerCache{}) {
		if err := db.AutoMigrate(&models.WGPeerCache{}); err != nil {
			return err
		}
	}
	
	if !db.Migrator().HasTable(&models.WGConfigCache{}) {
		if err := db.AutoMigrate(&models.WGConfigCache{}); err != nil {
			return err
		}
	}
	
	if !db.Migrator().HasTable(&models.SystemStatusCache{}) {
		if err := db.AutoMigrate(&models.SystemStatusCache{}); err != nil {
			return err
		}
	}
	
	// TODO: Uncomment after SpeedTestResult is properly implemented
	// if !db.Migrator().HasTable(&models.SpeedTestResult{}) {
	// 	if err := db.AutoMigrate(&models.SpeedTestResult{}); err != nil {
	// 		return err
	// 	}
	// }
	
	return nil
}
