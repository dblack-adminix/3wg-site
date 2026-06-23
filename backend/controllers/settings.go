package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/3wg/vpn-backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SettingsController struct {
	db *gorm.DB
}

func NewSettingsController(db *gorm.DB) *SettingsController {
	return &SettingsController{db: db}
}

// GetHomePageSettings получить настройки главной страницы
func (sc *SettingsController) GetHomePageSettings(c *gin.Context) {
	var setting models.SiteSettings
	
	// Ищем настройки главной страницы
	if err := sc.db.Where("key = ?", "homepage_blocks").First(&setting).Error; err != nil {
		// Если не найдено - возвращаем дефолтные (все включено)
		if err == gorm.ErrRecordNotFound {
			defaultSettings := models.HomePageSettings{
				HeroSection:           true,
				KeeneticSection:       true,
				VPNSection:            true,
				ServicesSection:       true,
				PricingSection:        true,
				HardwareSection:       true,
				InfrastructureSection: true,
				FAQSection:            true,
				ArticlesSection:       true,
				TelegramSection:       true,
				StatusWidget:          true,
				BlockOrder: []string{
					"keenetic_section",
					"vpn_section",
					"pricing_section",
					"services_section",
					"hardware_section",
					"infrastructure_section",
					"faq_section",
					"articles_section",
					"telegram_section",
					"status_widget",
				},
			}
			c.JSON(http.StatusOK, defaultSettings)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settings"})
		return
	}

	// Парсим JSON
	var settings models.HomePageSettings
	if err := json.Unmarshal([]byte(setting.Value), &settings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse settings"})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdateHomePageSettings обновить настройки главной страницы
func (sc *SettingsController) UpdateHomePageSettings(c *gin.Context) {
	var req models.HomePageSettings
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Логируем полученные данные
	println("Received settings:")
	println("BlockOrder length:", len(req.BlockOrder))
	for i, block := range req.BlockOrder {
		println("  ", i, ":", block)
	}

	// Конвертируем в JSON
	jsonData, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal settings"})
		return
	}

	println("JSON data:", string(jsonData))

	// Ищем существующую настройку
	var setting models.SiteSettings
	result := sc.db.Where("key = ?", "homepage_blocks").First(&setting)

	if result.Error == gorm.ErrRecordNotFound {
		// Создаем новую
		setting = models.SiteSettings{
			Key:   "homepage_blocks",
			Value: string(jsonData),
			Type:  "json",
		}
		if err := sc.db.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		// Обновляем существующую
		setting.Value = string(jsonData)
		if err := sc.db.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, req)
}

// GetAllSettings получить все настройки
func (sc *SettingsController) GetAllSettings(c *gin.Context) {
	var settings []models.SiteSettings
	if err := sc.db.Find(&settings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settings"})
		return
	}
	c.JSON(http.StatusOK, settings)
}

// GetBlockContent получить контент блока
func (sc *SettingsController) GetBlockContent(c *gin.Context) {
	blockKey := c.Param("block_key")
	
	var setting models.SiteSettings
	if err := sc.db.Where("key = ?", "block_content_"+blockKey).First(&setting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Возвращаем пустой контент если не найдено
			c.JSON(http.StatusOK, gin.H{})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get block content"})
		return
	}

	var content map[string]interface{}
	if err := json.Unmarshal([]byte(setting.Value), &content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse block content"})
		return
	}

	c.JSON(http.StatusOK, content)
}

// UpdateBlockContent обновить контент блока
func (sc *SettingsController) UpdateBlockContent(c *gin.Context) {
	blockKey := c.Param("block_key")
	
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal content"})
		return
	}

	var setting models.SiteSettings
	result := sc.db.Where("key = ?", "block_content_"+blockKey).First(&setting)

	if result.Error == gorm.ErrRecordNotFound {
		setting = models.SiteSettings{
			Key:   "block_content_" + blockKey,
			Value: string(jsonData),
			Type:  "json",
		}
		if err := sc.db.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create block content"})
			return
		}
	} else {
		setting.Value = string(jsonData)
		if err := sc.db.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update block content"})
			return
		}
	}

	c.JSON(http.StatusOK, req)
}

// GetSystemSettings получить системные настройки
func (sc *SettingsController) GetSystemSettings(c *gin.Context) {
	var setting models.SiteSettings
	
	if err := sc.db.Where("key = ?", "system_settings").First(&setting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Возвращаем дефолтные настройки
			defaultSettings := map[string]interface{}{
				"maintenance_mode":      false,
				"registration_enabled":  true,
				"site_name":            "3WG VPN",
				"site_url":             "https://3wg.ru",
				"admin_email":          "admin@3wg.ru",
				"max_keys_per_user":    5,
				"default_key_duration_days": 30,
			}
			c.JSON(http.StatusOK, defaultSettings)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settings"})
		return
	}

	var settings map[string]interface{}
	if err := json.Unmarshal([]byte(setting.Value), &settings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse settings"})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdateSystemSettings обновить системные настройки
func (sc *SettingsController) UpdateSystemSettings(c *gin.Context) {
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal settings"})
		return
	}

	var setting models.SiteSettings
	result := sc.db.Where("key = ?", "system_settings").First(&setting)

	if result.Error == gorm.ErrRecordNotFound {
		setting = models.SiteSettings{
			Key:   "system_settings",
			Value: string(jsonData),
			Type:  "json",
		}
		if err := sc.db.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		setting.Value = string(jsonData)
		if err := sc.db.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, req)
}


// GetHardwarePageSettings получить настройки страницы Hardware
func (sc *SettingsController) GetHardwarePageSettings(c *gin.Context) {
	var setting models.SiteSettings
	
	if err := sc.db.Where("key = ?", "page_hardware").First(&setting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Возвращаем дефолтные настройки
			defaultSettings := map[string]interface{}{
				"hero": map[string]interface{}{
					"badge":       "HARDWARE_SOLUTION",
					"title":       "3WG NODE-1",
					"subtitle":    "Готовый роутер с VPN из коробки",
					"description": "Промышленный маршрутизатор в металлическом корпусе. Никакого пластика. Только надежность, пассивное охлаждение и встроенный Kill Switch.",
				},
				"features": []map[string]interface{}{
					{"id": "1", "title": "Plug & Play", "description": "Включил и работает", "icon": "Package", "color": "primary"},
					{"id": "2", "title": "Hardware Crypto", "description": "Аппаратное шифрование AmneziaWG/WireGuard", "icon": "Shield", "color": "accent"},
					{"id": "3", "title": "Gigabit Ports", "description": "Скорость до 1000 Мбит/с", "icon": "Zap", "color": "red"},
					{"id": "4", "title": "Admin Console", "description": "Управление через Telegram Mini App", "icon": "Settings", "color": "purple"},
				},
				"specs": []map[string]interface{}{
					{"id": "1", "label": "CPU", "value": "ARM Cortex-A53 Quad-Core 1.2GHz"},
					{"id": "2", "label": "RAM", "value": "512MB DDR4"},
					{"id": "3", "label": "Storage", "value": "128MB NAND Flash"},
					{"id": "4", "label": "Crypto", "value": "Hardware AES-256 + ChaCha20"},
					{"id": "5", "label": "Ports", "value": "4x Gigabit Ethernet + 1x WAN"},
					{"id": "6", "label": "Wi-Fi", "value": "802.11ac Dual-Band (optional)"},
				},
				"steps": []map[string]interface{}{
					{"id": "1", "step": "01", "title": "Заказываете комплект", "description": "Оформляете заказ на нашем сайте или через Telegram-бота. Выбираете способ доставки."},
					{"id": "2", "step": "02", "title": "Получаете роутер", "description": "Мы привозим уже настроенный роутер с прошитыми ключами вашего персонального сервера."},
					{"id": "3", "step": "03", "title": "Включаете в розетку", "description": "Подключаете роутер к интернету и электросети. Всё работает автоматически."},
					{"id": "4", "step": "04", "title": "Управляете через Telegram", "description": "Используете наш Mini App для мониторинга, перезагрузки и смены локации сервера."},
				},
				"pricing": map[string]interface{}{
					"price":      "1500₽",
					"period":     "/мес",
					"note":       "В стоимость оборудования уже включен личный сервер",
					"buttonText": "Заказать комплект",
				},
			}
			c.JSON(http.StatusOK, defaultSettings)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settings"})
		return
	}

	var settings map[string]interface{}
	if err := json.Unmarshal([]byte(setting.Value), &settings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse settings"})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdateHardwarePageSettings обновить настройки страницы Hardware
func (sc *SettingsController) UpdateHardwarePageSettings(c *gin.Context) {
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal settings"})
		return
	}

	var setting models.SiteSettings
	result := sc.db.Where("key = ?", "page_hardware").First(&setting)

	if result.Error == gorm.ErrRecordNotFound {
		setting = models.SiteSettings{
			Key:   "page_hardware",
			Value: string(jsonData),
		}
		if err := sc.db.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		setting.Value = string(jsonData)
		if err := sc.db.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, req)
}


// GetPricingPageSettings получить настройки страницы Pricing
func (sc *SettingsController) GetPricingPageSettings(c *gin.Context) {
	var setting models.SiteSettings
	
	if err := sc.db.Where("key = ?", "page_pricing").First(&setting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Возвращаем дефолтные настройки
			defaultSettings := map[string]interface{}{
				"hero": map[string]interface{}{
					"badge":    "ACCESS_CONTROL",
					"title":    "ВЫБЕРИТЕ УРОВЕНЬ СУВЕРЕНИТЕТА",
					"subtitle": "Доступ к узлам 3WG.RU. Никаких логов. Никаких следов.",
				},
				"tiers": []map[string]interface{}{
					{
						"id":          "1",
						"name":        "LITE",
						"description": "Базовый доступ",
						"price":       "9$",
						"period":      "/ mo",
						"icon":        "Shield",
						"color":       "muted",
						"features":    []string{"WireGuard Protocol", "Standard Speed", "1 Device", "Location: Netherlands"},
						"buttonText":  "SELECT_TIER",
						"highlighted": false,
					},
					{
						"id":          "2",
						"name":        "PRO",
						"description": "Оптимальный выбор",
						"price":       "19$",
						"period":      "/ mo",
						"icon":        "Zap",
						"color":       "primary",
						"badge":       "OPTIMAL_CHOICE",
						"features":    []string{"WireGuard + AmneziaWG", "High Speed (1Gbps)", "5 Devices", "All Locations", "Priority Support"},
						"buttonText":  "SELECT_TIER",
						"highlighted": true,
					},
					{
						"id":          "3",
						"name":        "SOVEREIGN",
						"description": "Железо + Сеть",
						"price":       "99$",
						"period":      "+ Shipping",
						"icon":        "Server",
						"color":       "accent",
						"badge":       "HARDWARE_BUNDLE",
						"features":    []string{"NODE-1 Hardware Included", "Lifetime Firmware Updates", "Personal Node Setup", "Private Domain Access"},
						"buttonText":  "CONFIGURE_NODE",
						"buttonLink":  "/hardware",
						"highlighted": false,
					},
				},
				"crypto": map[string]interface{}{
					"title":    "Anonymous Settlement",
					"subtitle": "PAYMENT_METHOD: CRYPTO_ONLY",
					"badge":    "PAYMENT_METHOD: CRYPTO_ONLY",
					"payments": []map[string]interface{}{
						{"id": "1", "name": "Bitcoin", "symbol": "BTC", "color": "#F7931A"},
						{"id": "2", "name": "Ethereum", "symbol": "ETH", "color": "#627EEA"},
						{"id": "3", "name": "USDT", "symbol": "USDT", "color": "#26A17B"},
						{"id": "4", "name": "Monero", "symbol": "XMR", "color": "#FF6600"},
						{"id": "5", "name": "Litecoin", "symbol": "LTC", "color": "#BFBBBB"},
					},
				},
				"footer": map[string]interface{}{
					"note": "*Мы не запрашиваем вашу почту или имя. Только хэш транзакции. Только приватность.",
				},
			}
			c.JSON(http.StatusOK, defaultSettings)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get settings"})
		return
	}

	var settings map[string]interface{}
	if err := json.Unmarshal([]byte(setting.Value), &settings); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse settings"})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// UpdatePricingPageSettings обновить настройки страницы Pricing
func (sc *SettingsController) UpdatePricingPageSettings(c *gin.Context) {
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jsonData, err := json.Marshal(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal settings"})
		return
	}

	var setting models.SiteSettings
	result := sc.db.Where("key = ?", "page_pricing").First(&setting)

	if result.Error == gorm.ErrRecordNotFound {
		setting = models.SiteSettings{
			Key:   "page_pricing",
			Value: string(jsonData),
		}
		if err := sc.db.Create(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create settings"})
			return
		}
	} else {
		setting.Value = string(jsonData)
		if err := sc.db.Save(&setting).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings"})
			return
		}
	}

	c.JSON(http.StatusOK, req)
}
