package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type AdminController struct {
	db *gorm.DB
}

func NewAdminController(db *gorm.DB) *AdminController {
	return &AdminController{db: db}
}

func (ac *AdminController) GetDashboard(c *gin.Context) {
	// Get total users
	var totalUsers int64
	ac.db.Model(&models.User{}).Count(&totalUsers)

	// Get active users (last 30 days)
	var activeUsers int64
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)
	ac.db.Model(&models.User{}).Where("updated_at > ?", thirtyDaysAgo).Count(&activeUsers)

	// Get total servers
	var totalServers int64
	ac.db.Model(&models.Server{}).Count(&totalServers)

	// Get active servers
	var activeServers int64
	ac.db.Model(&models.Server{}).Where("status = ?", "active").Count(&activeServers)

	// Get total revenue
	var totalRevenue float64
	ac.db.Model(&models.Payment{}).
		Where("status = ?", "completed").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalRevenue)

	// Get revenue this month
	var monthRevenue float64
	firstDayOfMonth := time.Now().AddDate(0, 0, -time.Now().Day()+1)
	ac.db.Model(&models.Payment{}).
		Where("status = ? AND created_at >= ?", "completed", firstDayOfMonth).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&monthRevenue)

	// Get total VPN keys
	var totalKeys int64
	ac.db.Model(&models.VPNKey{}).Count(&totalKeys)

	// Recent activity
	var recentUsers []models.User
	ac.db.Order("created_at DESC").Limit(5).Find(&recentUsers)

	var recentPayments []models.Payment
	ac.db.Preload("User").Order("created_at DESC").Limit(5).Find(&recentPayments)

	c.JSON(http.StatusOK, gin.H{
		"stats": gin.H{
			"total_users":    totalUsers,
			"active_users":   activeUsers,
			"total_servers":  totalServers,
			"active_servers": activeServers,
			"total_revenue":  totalRevenue,
			"month_revenue":  monthRevenue,
			"total_keys":     totalKeys,
		},
		"recent_users":    recentUsers,
		"recent_payments": recentPayments,
	})
}

func (ac *AdminController) GetUsers(c *gin.Context) {
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "20")

	var users []models.User
	var total int64

	query := ac.db.Model(&models.User{})

	// Search by email
	if search := c.Query("search"); search != "" {
		query = query.Where("email LIKE ?", "%"+search+"%")
	}

	// Count total
	query.Count(&total)

	// Paginate
	var offset int
	fmt.Sscanf(page, "%d", &offset)
	var limitInt int
	fmt.Sscanf(limit, "%d", &limitInt)
	offset = (offset - 1) * limitInt

	if err := query.Offset(offset).Limit(limitInt).Order("created_at DESC").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (ac *AdminController) GetAnalytics(c *gin.Context) {
	days := c.DefaultQuery("days", "7")
	var daysInt int
	fmt.Sscanf(days, "%d", &daysInt)

	startDate := time.Now().AddDate(0, 0, -daysInt)

	// Get daily statistics
	type DailyStats struct {
		Date     string  `json:"date"`
		Users    int64   `json:"users"`
		Revenue  float64 `json:"revenue"`
		Keys     int64   `json:"keys"`
		Traffic  int64   `json:"traffic"`
	}

	var analytics []DailyStats

	for i := 0; i < daysInt; i++ {
		date := startDate.AddDate(0, 0, i)
		nextDate := date.AddDate(0, 0, 1)

		var users int64
		ac.db.Model(&models.User{}).
			Where("created_at >= ? AND created_at < ?", date, nextDate).
			Count(&users)

		var revenue float64
		ac.db.Model(&models.Payment{}).
			Where("status = ? AND created_at >= ? AND created_at < ?", "completed", date, nextDate).
			Select("COALESCE(SUM(amount), 0)").
			Scan(&revenue)

		var keys int64
		ac.db.Model(&models.VPNKey{}).
			Where("created_at >= ? AND created_at < ?", date, nextDate).
			Count(&keys)

		var traffic int64
		ac.db.Model(&models.Statistics{}).
			Where("date >= ? AND date < ?", date, nextDate).
			Select("COALESCE(SUM(traffic_upload + traffic_download), 0)").
			Scan(&traffic)

		analytics = append(analytics, DailyStats{
			Date:    date.Format("02 Jan"),
			Users:   users,
			Revenue: revenue,
			Keys:    keys,
			Traffic: traffic,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"analytics": analytics,
		"period":    fmt.Sprintf("Last %d days", daysInt),
	})
}

type CreateServerRequest struct {
	Name            string   `json:"name" binding:"required"`
	Location        string   `json:"location"`
	Country         string   `json:"country"`
	IPAddress       string   `json:"ip_address"`
	Protocols       []string `json:"protocols"`
	MaxUsers        int      `json:"max_users"`
	WGDashboardURL  string   `json:"wg_dashboard_url" binding:"required"`
	WGDashboardKey  string   `json:"wg_dashboard_key" binding:"required"`
	WGConfigName    string   `json:"wg_config_name"`
	WGDashboardPort int      `json:"wg_dashboard_port"`
	WGListenPort    int      `json:"wg_listen_port"`
	UsageType       string   `json:"usage_type"`        // shared | dedicated
	DedicatedUserID *uint    `json:"dedicated_user_id"` // Кому выдан (для dedicated)
	PanelType       string   `json:"panel_type"`        // wgdashboard | 3wg-panel
	PanelUser       string   `json:"panel_user"`
	PanelPassword   string   `json:"panel_password"`
}

func (ac *AdminController) CreateServer(c *gin.Context) {
	var req CreateServerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Устанавливаем дефолтные значения
	if req.MaxUsers == 0 {
		req.MaxUsers = 100
	}
	
	// Извлекаем IP из URL если не указан
	if req.IPAddress == "" {
		req.IPAddress = extractIPFromURL(req.WGDashboardURL)
	}
	
	// Автоматически определяем локацию по IP если не указана
	if (req.Location == "" || req.Country == "") && req.IPAddress != "" && req.IPAddress != "0.0.0.0" {
		if geo, err := services.GetIPGeolocation(req.IPAddress); err == nil {
			if req.Location == "" {
				req.Location = geo.GetLocationString()
			}
			if req.Country == "" {
				req.Country = geo.Country
			}
			// Сохраняем код страны для флага
			if geo.CountryCode != "" {
				req.Country = geo.CountryCode // Используем код страны (RU, US, NL и т.д.)
			}
		}
	}
	
	// Фоллбэк на дефолтные значения
	if req.Location == "" {
		req.Location = "Unknown"
	}
	if req.Country == "" {
		req.Country = "Unknown"
	}
	
	if len(req.Protocols) == 0 {
		req.Protocols = []string{"wireguard"}
	}
	if req.WGConfigName == "" {
		req.WGConfigName = "wg0"
	}

	if req.UsageType != "dedicated" {
		req.UsageType = "shared"
	}
	if req.PanelType == "" {
		req.PanelType = "wgdashboard"
	}

	server := models.Server{
		Name:            req.Name,
		Location:        req.Location,
		Country:         req.Country,
		IPAddress:       req.IPAddress,
		Status:          "active",
		Load:            0,
		Protocols:       pq.StringArray(req.Protocols),
		MaxUsers:        req.MaxUsers,
		UsageType:       req.UsageType,
		DedicatedUserID: req.DedicatedUserID,
		PanelType:       req.PanelType,
		PanelUser:       req.PanelUser,
		PanelPassword:   req.PanelPassword,
		WGDashboardURL:  req.WGDashboardURL,
		WGDashboardKey:  req.WGDashboardKey,
		WGConfigName:    req.WGConfigName,
		WGDashboardPort: req.WGDashboardPort,
		WGListenPort:    req.WGListenPort,
	}

	if err := ac.db.Create(&server).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create server"})
		return
	}

	c.JSON(http.StatusCreated, server)
}

// extractIPFromURL извлекает IP адрес из URL
func extractIPFromURL(url string) string {
	// Простое извлечение IP из URL типа http://1.2.3.4:port
	if url == "" {
		return "0.0.0.0"
	}
	// Убираем протокол
	url = strings.TrimPrefix(url, "http://")
	url = strings.TrimPrefix(url, "https://")
	// Убираем порт
	if idx := strings.Index(url, ":"); idx != -1 {
		url = url[:idx]
	}
	return url
}

func (ac *AdminController) GetServer(c *gin.Context) {
	id := c.Param("id")

	var server models.Server
	if err := ac.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Подсчитываем количество пиров из кэша
	var peerCount int64
	ac.db.Model(&models.WGPeerCache{}).
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

func (ac *AdminController) UpdateServer(c *gin.Context) {
	id := c.Param("id")

	var server models.Server
	if err := ac.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	var req CreateServerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	server.Name = req.Name
	server.Location = req.Location
	server.Country = req.Country
	server.IPAddress = req.IPAddress
	server.Protocols = pq.StringArray(req.Protocols)
	if req.MaxUsers > 0 {
		server.MaxUsers = req.MaxUsers
	}
	
	// Обновляем поля WGDashboard если они переданы
	if req.WGDashboardURL != "" {
		server.WGDashboardURL = req.WGDashboardURL
	}
	if req.WGDashboardKey != "" {
		server.WGDashboardKey = req.WGDashboardKey
	}
	if req.WGConfigName != "" {
		server.WGConfigName = req.WGConfigName
	}
	if req.WGDashboardPort > 0 {
		server.WGDashboardPort = req.WGDashboardPort
	}
	if req.WGListenPort > 0 {
		server.WGListenPort = req.WGListenPort
	}
	if req.UsageType == "shared" || req.UsageType == "dedicated" {
		server.UsageType = req.UsageType
	}
	server.DedicatedUserID = req.DedicatedUserID
	if req.PanelType != "" {
		server.PanelType = req.PanelType
	}
	if req.PanelUser != "" {
		server.PanelUser = req.PanelUser
	}
	if req.PanelPassword != "" {
		server.PanelPassword = req.PanelPassword
	}

	if err := ac.db.Save(&server).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update server"})
		return
	}

	c.JSON(http.StatusOK, server)
}

func (ac *AdminController) DeleteServer(c *gin.Context) {
	id := c.Param("id")

	var server models.Server
	if err := ac.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if err := ac.db.Delete(&server).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete server"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Server deleted successfully"})
}

// UpdateServerGeolocation обновляет геолокацию сервера по его IP адресу
func (ac *AdminController) UpdateServerGeolocation(c *gin.Context) {
	id := c.Param("id")

	var server models.Server
	if err := ac.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Проверяем что есть IP адрес
	if server.IPAddress == "" || server.IPAddress == "0.0.0.0" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Server has no valid IP address"})
		return
	}

	// Получаем геолокацию
	geo, err := services.GetIPGeolocation(server.IPAddress)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": fmt.Sprintf("Failed to get geolocation: %v", err)})
		return
	}

	// Обновляем сервер
	server.Location = geo.GetLocationString()
	server.Country = geo.CountryCode

	if err := ac.db.Save(&server).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update server"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Geolocation updated successfully",
		"server":   server,
		"geo_data": geo,
	})
}


// GetAllKeys возвращает все VPN ключи для админа
func (ac *AdminController) GetAllKeys(c *gin.Context) {
	var keys []models.VPNKey
	
	// Загружаем ключи с информацией о пользователе и сервере
	if err := ac.db.Preload("User").Preload("Server").Find(&keys).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch keys"})
		return
	}

	c.JSON(http.StatusOK, keys)
}
