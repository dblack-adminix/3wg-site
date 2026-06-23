package controllers

import (
	"net/http"

	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LimitsController struct {
	limitsService *services.LimitsService
}

func NewLimitsController(db *gorm.DB) *LimitsController {
	return &LimitsController{
		limitsService: services.NewLimitsService(db),
	}
}

// CheckLimits проверяет может ли пользователь создать ключ
func (lc *LimitsController) CheckLimits(c *gin.Context) {
	userID := c.GetUint("user_id")
	
	var req struct {
		ServerID uint `json:"server_id" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := lc.limitsService.CanCreateKey(userID, req.ServerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check limits"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetUserStats возвращает статистику пользователя
func (lc *LimitsController) GetUserStats(c *gin.Context) {
	userID := c.GetUint("user_id")

	stats, err := lc.limitsService.GetUserStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}
