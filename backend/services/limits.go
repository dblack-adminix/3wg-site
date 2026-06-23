package services

import (
	"fmt"

	"github.com/3wg/vpn-backend/models"
	"gorm.io/gorm"
)

// LimitsService проверяет лимиты и баланс пользователей
type LimitsService struct {
	db       *gorm.DB
	settings models.PricingSettings
}

// NewLimitsService создает новый сервис лимитов
func NewLimitsService(db *gorm.DB) *LimitsService {
	return &LimitsService{
		db:       db,
		settings: models.DefaultPricingSettings(),
	}
}

// CheckResult содержит результат проверки
type CheckResult struct {
	Allowed      bool    `json:"allowed"`
	Reason       string  `json:"reason,omitempty"`
	CurrentKeys  int     `json:"current_keys"`
	MaxKeys      int     `json:"max_keys"`
	Balance      float64 `json:"balance"`
	Cost         float64 `json:"cost"`
	BalanceAfter float64 `json:"balance_after"`
}

// CanCreateKey проверяет может ли пользователь создать ключ
func (s *LimitsService) CanCreateKey(userID uint, serverID uint) (*CheckResult, error) {
	// Получаем пользователя
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	// Получаем сервер
	var server models.Server
	if err := s.db.First(&server, serverID).Error; err != nil {
		return nil, fmt.Errorf("server not found: %w", err)
	}

	// Подсчитываем текущие ключи пользователя
	var userKeysCount int64
	if err := s.db.Model(&models.VPNKey{}).
		Where("user_id = ? AND status = ?", userID, "active").
		Count(&userKeysCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count user keys: %w", err)
	}

	// Подсчитываем ключи на сервере
	var serverKeysCount int64
	if err := s.db.Model(&models.VPNKey{}).
		Where("server_id = ? AND status = ?", serverID, "active").
		Count(&serverKeysCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count server keys: %w", err)
	}

	// Определяем максимум ключей для пользователя
	maxKeys := s.settings.MaxKeysPerUser
	if user.Tariff == "free" {
		maxKeys = s.settings.FreeUserMaxKeys
	}

	// Проверка 1: Лимит ключей на пользователя
	if int(userKeysCount) >= maxKeys {
		return &CheckResult{
			Allowed:     false,
			Reason:      fmt.Sprintf("Достигнут лимит ключей (%d/%d). Удалите старые ключи или обновите тариф.", userKeysCount, maxKeys),
			CurrentKeys: int(userKeysCount),
			MaxKeys:     maxKeys,
			Balance:     user.Balance,
			Cost:        s.settings.KeyCreationCost,
		}, nil
	}

	// Проверка 2: Лимит ключей на сервере
	maxServerKeys := s.settings.MaxKeysPerServer
	if server.MaxUsers > 0 {
		maxServerKeys = server.MaxUsers
	}
	if int(serverKeysCount) >= maxServerKeys {
		return &CheckResult{
			Allowed:     false,
			Reason:      fmt.Sprintf("Сервер переполнен (%d/%d). Выберите другой сервер.", serverKeysCount, maxServerKeys),
			CurrentKeys: int(userKeysCount),
			MaxKeys:     maxKeys,
			Balance:     user.Balance,
			Cost:        s.settings.KeyCreationCost,
		}, nil
	}

	// Проверка 3: Баланс (только для платных пользователей)
	cost := s.settings.KeyCreationCost
	if user.Tariff != "free" {
		if user.Balance < cost {
			return &CheckResult{
				Allowed:      false,
				Reason:       fmt.Sprintf("Недостаточно средств. Требуется: %.2f₽, Баланс: %.2f₽", cost, user.Balance),
				CurrentKeys:  int(userKeysCount),
				MaxKeys:      maxKeys,
				Balance:      user.Balance,
				Cost:         cost,
				BalanceAfter: user.Balance - cost,
			}, nil
		}
	} else {
		// Для бесплатных пользователей стоимость 0
		cost = 0
	}

	// Все проверки пройдены
	return &CheckResult{
		Allowed:      true,
		CurrentKeys:  int(userKeysCount),
		MaxKeys:      maxKeys,
		Balance:      user.Balance,
		Cost:         cost,
		BalanceAfter: user.Balance - cost,
	}, nil
}

// ChargeForKey списывает средства за создание ключа
func (s *LimitsService) ChargeForKey(userID uint) error {
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	// Для бесплатных пользователей не списываем
	if user.Tariff == "free" {
		return nil
	}

	cost := s.settings.KeyCreationCost

	// Проверяем баланс еще раз
	if user.Balance < cost {
		return fmt.Errorf("insufficient balance: %.2f < %.2f", user.Balance, cost)
	}

	// Списываем средства
	if err := s.db.Model(&user).
		Update("balance", gorm.Expr("balance - ?", cost)).Error; err != nil {
		return fmt.Errorf("failed to charge balance: %w", err)
	}

	return nil
}

// GetUserStats возвращает статистику пользователя
func (s *LimitsService) GetUserStats(userID uint) (map[string]interface{}, error) {
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	var keysCount int64
	if err := s.db.Model(&models.VPNKey{}).
		Where("user_id = ? AND status = ?", userID, "active").
		Count(&keysCount).Error; err != nil {
		return nil, fmt.Errorf("failed to count keys: %w", err)
	}

	maxKeys := s.settings.MaxKeysPerUser
	if user.Tariff == "free" {
		maxKeys = s.settings.FreeUserMaxKeys
	}

	return map[string]interface{}{
		"user_id":      user.ID,
		"email":        user.Email,
		"balance":      user.Balance,
		"tariff":       user.Tariff,
		"keys_count":   keysCount,
		"max_keys":     maxKeys,
		"keys_left":    maxKeys - int(keysCount),
		"cost_per_key": s.settings.KeyCreationCost,
	}, nil
}
