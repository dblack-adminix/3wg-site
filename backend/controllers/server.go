package controllers

import (
	"net/http"

	"github.com/3wg/vpn-backend/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ServerController struct {
	db *gorm.DB
}

func NewServerController(db *gorm.DB) *ServerController {
	return &ServerController{db: db}
}

func (sc *ServerController) GetAll(c *gin.Context) {
	var servers []models.Server
	
	query := sc.db.Where("status = ?", "active")
	
	// Filter by location if provided
	if location := c.Query("location"); location != "" {
		query = query.Where("location = ?", location)
	}

	if err := query.Find(&servers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get servers"})
		return
	}

	// Добавляем подсчет текущих пиров для каждого сервера
	type ServerWithPeers struct {
		models.Server
		CurrentPeers int `json:"current_peers"`
	}

	serversWithPeers := make([]ServerWithPeers, len(servers))
	for i, server := range servers {
		// Подсчитываем количество пиров из кэша
		var peerCount int64
		sc.db.Model(&models.WGPeerCache{}).
			Where("server_id = ?", server.ID).
			Count(&peerCount)

		serversWithPeers[i] = ServerWithPeers{
			Server:       server,
			CurrentPeers: int(peerCount),
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"servers": serversWithPeers,
		"total":   len(serversWithPeers),
	})
}

func (sc *ServerController) GetByID(c *gin.Context) {
	id := c.Param("id")

	var server models.Server
	if err := sc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Подсчитываем количество пиров из кэша
	var peerCount int64
	sc.db.Model(&models.WGPeerCache{}).
		Where("server_id = ?", server.ID).
		Count(&peerCount)

	// Возвращаем сервер с количеством пиров
	type ServerWithPeers struct {
		models.Server
		CurrentPeers int `json:"current_peers"`
	}

	c.JSON(http.StatusOK, ServerWithPeers{
		Server:       server,
		CurrentPeers: int(peerCount),
	})
}
