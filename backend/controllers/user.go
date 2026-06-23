package controllers

import (
	"net/http"
	"strings"

	"github.com/3wg/vpn-backend/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserController struct {
	db *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{db: db}
}

func (uc *UserController) GetMe(c *gin.Context) {
	userID := c.GetUint("user_id")

	var user models.User
	if err := uc.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

type UpdateUserRequest struct {
	TelegramID      *string `json:"telegram_id"`
	Email           *string `json:"email"`
	CurrentPassword string  `json:"current_password"`
	NewPassword     string  `json:"new_password"`
}

func (uc *UserController) UpdateMe(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := uc.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Смена email и пароля требует подтверждения текущим паролем
	needPassword := (req.Email != nil && *req.Email != user.Email) || req.NewPassword != ""
	if needPassword {
		if req.CurrentPassword == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Укажите текущий пароль"})
			return
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "Неверный текущий пароль"})
			return
		}
	}

	// Email
	if req.Email != nil && *req.Email != "" && *req.Email != user.Email {
		newEmail := strings.TrimSpace(strings.ToLower(*req.Email))
		if !strings.Contains(newEmail, "@") || len(newEmail) < 5 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный email"})
			return
		}
		var existing models.User
		if err := uc.db.Where("email = ? AND id != ?", newEmail, userID).First(&existing).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email уже используется"})
			return
		}
		user.Email = newEmail
	}

	// Telegram ID
	if req.TelegramID != nil {
		user.TelegramID = strings.TrimSpace(strings.TrimPrefix(*req.TelegramID, "@"))
	}

	// Пароль
	if req.NewPassword != "" {
		if len(req.NewPassword) < 8 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Пароль должен быть не короче 8 символов"})
			return
		}
		hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}
		user.PasswordHash = string(hashed)
	}

	if err := uc.db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, user.ToResponse())
}

// GetMyTraffic возвращает реальную статистику трафика по ключам пользователя
// (из кэша пиров и истории трафика).
func (uc *UserController) GetMyTraffic(c *gin.Context) {
	userID := c.GetUint("user_id")

	// Ключи пользователя
	var keys []models.VPNKey
	if err := uc.db.Where("user_id = ?", userID).Find(&keys).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get keys"})
		return
	}

	publicKeys := make([]string, 0, len(keys))
	activeKeys := 0
	for _, k := range keys {
		if k.PublicKey != "" {
			publicKeys = append(publicKeys, k.PublicKey)
		}
		if k.Status == "active" {
			activeKeys++
		}
	}

	var rxGB, txGB float64
	type dailyRow struct {
		Date string  `json:"date"`
		RxGB float64 `json:"rx_gb"`
		TxGB float64 `json:"tx_gb"`
	}
	daily := []dailyRow{}

	if len(publicKeys) > 0 {
		// Текущие счётчики из кэша пиров (в GB)
		row := uc.db.Raw(`
			SELECT COALESCE(SUM(total_receive),0), COALESCE(SUM(total_sent),0)
			FROM wg_peers_cache WHERE public_key IN ?`, publicKeys).Row()
		row.Scan(&rxGB, &txGB)

		// История по дням за 14 дней (в байтах → GB)
		rows, err := uc.db.Raw(`
			SELECT to_char(recorded_at::date, 'YYYY-MM-DD') AS d,
			       COALESCE(SUM(delta_received),0), COALESCE(SUM(delta_sent),0)
			FROM peer_traffic_history
			WHERE public_key IN ? AND recorded_at >= NOW() - INTERVAL '14 days'
			GROUP BY d ORDER BY d`, publicKeys).Rows()
		if err == nil {
			defer rows.Close()
			const gb = 1024 * 1024 * 1024
			for rows.Next() {
				var d string
				var rx, tx int64
				if rows.Scan(&d, &rx, &tx) == nil {
					daily = append(daily, dailyRow{Date: d, RxGB: float64(rx) / gb, TxGB: float64(tx) / gb})
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"keys_total":  len(keys),
		"keys_active": activeKeys,
		"traffic": gin.H{
			"rx_gb":    rxGB,
			"tx_gb":    txGB,
			"total_gb": rxGB + txGB,
		},
		"daily": daily,
	})
}

func (uc *UserController) GetMyStats(c *gin.Context) {
	userID := c.GetUint("user_id")

	var stats []models.Statistics
	if err := uc.db.Where("user_id = ?", userID).
		Order("date DESC").
		Limit(30).
		Find(&stats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get statistics"})
		return
	}

	// Calculate totals
	var totalUpload, totalDownload int64
	var totalUptime int
	for _, stat := range stats {
		totalUpload += stat.TrafficUpload
		totalDownload += stat.TrafficDownload
		totalUptime += stat.Uptime
	}

	c.JSON(http.StatusOK, gin.H{
		"stats": stats,
		"totals": gin.H{
			"traffic_upload":   totalUpload,
			"traffic_download": totalDownload,
			"traffic_total":    totalUpload + totalDownload,
			"uptime":           totalUptime,
		},
	})
}
