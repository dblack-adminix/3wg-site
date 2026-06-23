package models

// PricingSettings содержит настройки цен и лимитов
type PricingSettings struct {
	// Цены за создание ключей
	KeyCreationCost float64 `json:"key_creation_cost"` // Стоимость создания одного ключа

	// Лимиты для пользователей
	MaxKeysPerUser       int `json:"max_keys_per_user"`        // Максимум ключей на пользователя
	MaxKeysPerServer     int `json:"max_keys_per_server"`      // Максимум ключей на сервер
	MinBalanceForCreation float64 `json:"min_balance_for_creation"` // Минимальный баланс для создания

	// Лимиты для бесплатных пользователей
	FreeUserMaxKeys int `json:"free_user_max_keys"` // Максимум ключей для free тарифа
}

// DefaultPricingSettings возвращает настройки по умолчанию
func DefaultPricingSettings() PricingSettings {
	return PricingSettings{
		KeyCreationCost:       10.0,  // 10 рублей за ключ
		MaxKeysPerUser:        10,    // Максимум 10 ключей на пользователя
		MaxKeysPerServer:      100,   // Максимум 100 ключей на сервер
		MinBalanceForCreation: 10.0,  // Минимум 10 рублей на балансе
		FreeUserMaxKeys:       2,     // Бесплатно только 2 ключа
	}
}
