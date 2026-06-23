package controllers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/nodeclient"
	"github.com/3wg/vpn-backend/panel3wg"
	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type WGDashboardController struct {
	db *gorm.DB
}

func NewWGDashboardController(db *gorm.DB) *WGDashboardController {
	return &WGDashboardController{db: db}
}

// getWGClient создает клиент WGDashboard для сервера
func (wc *WGDashboardController) getWGClient(serverID uint) (nodeclient.Client, error) {
	var server models.Server
	if err := wc.db.First(&server, serverID).Error; err != nil {
		return nil, fmt.Errorf("server not found")
	}

	if server.WGDashboardURL == "" {
		return nil, fmt.Errorf("panel not configured for this server")
	}
	if server.PanelType != nodeclient.PanelType3WG && server.WGDashboardKey == "" {
		return nil, fmt.Errorf("WGDashboard not configured for this server")
	}

	return nodeclient.ForServer(&server, ""), nil
}

// TestConnection проверяет подключение к WGDashboard сервера
func (wc *WGDashboardController) TestConnection(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	client, err := wc.getWGClient(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := client.TestConnection(); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "error",
			"error":  err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Connection successful",
	})
}

// GetServerConfig получает все конфигурации WireGuard с сервера
func (wc *WGDashboardController) GetServerConfig(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	client, err := wc.getWGClient(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config, err := client.GetConfig()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": true,
		"data":   config.Data,
	})
}

// GetServerPeers получает список всех пиров на сервере для конкретной конфигурации
func (wc *WGDashboardController) GetServerPeers(c *gin.Context) {
	serverID := c.Param("id")
	configName := c.Query("config") // Опциональный параметр для выбора конфигурации
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	// Получаем сервер из БД
	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Если конфигурация не указана, используем дефолтную из сервера
	if configName == "" {
		configName = server.WGConfigName
	}

	// Создаем клиент с нужной конфигурацией
	client := nodeclient.ForServer(&server, configName)

	peers, err := client.GetAllPeers()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error":   err.Error(),
			"message": "Failed to get peers",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"peers":  peers,
		"total":  len(peers),
		"config": configName,
	})
}

// GetSystemStatus получает системный статус сервера
func (wc *WGDashboardController) GetSystemStatus(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	client, err := wc.getWGClient(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	status, err := client.GetSystemStatus()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, status)
}

// AddPeerToServer добавляет пира на сервер
func (wc *WGDashboardController) AddPeerToServer(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var req struct {
		PublicKey  string   `json:"public_key"`  // Опциональный - сервер сгенерирует если пустой
		PrivateKey string   `json:"private_key"` // Опциональный - сервер сгенерирует если пустой
		AllowedIPs []string `json:"allowed_ips" binding:"required"`
		Name       string   `json:"name" binding:"required"`
		Config     string   `json:"config"` // Опциональная конфигурация
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем сервер из БД
	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Используем переданную конфигурацию или дефолтную
	configName := req.Config
	if configName == "" {
		configName = server.WGConfigName
	}

	// Создаем клиент с нужной конфигурацией
	client := nodeclient.ForServer(&server, configName)

	response, err := client.AddPeer(req.PublicKey, req.PrivateKey, req.AllowedIPs, req.Name)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}

// GetPeerConfig генерирует WireGuard конфиг для пира
func (wc *WGDashboardController) GetPeerConfig(c *gin.Context) {
	serverID := c.Param("id")
	publicKey := c.Query("publicKey")
	
	if publicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	// Получаем сервер
	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Получаем пир из кэша
	var peer models.WGPeerCache
	if err := wc.db.Where("server_id = ? AND public_key = ?", id, publicKey).First(&peer).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Peer not found"})
		return
	}

	// Для 3wg-panel конфиг берём напрямую из панели по публичному ключу
	if server.PanelType == nodeclient.PanelType3WG {
		panelClient := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, peer.ConfigName)
		panelClient.APIKey = server.WGDashboardKey
		config, err := panelClient.GetPeerConfigByPublicKey(publicKey)
		if err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": fmt.Sprintf("Failed to get peer config from panel: %v", err)})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status":    "success",
			"config":    config,
			"peer_name": peer.Name,
		})
		return
	}

	// Получаем конфигурацию сервера из кэша
	var serverConfig models.WGConfigCache
	if err := wc.db.Where("server_id = ? AND name = ?", id, peer.ConfigName).First(&serverConfig).Error; err != nil {
		log.Printf("[GetPeerConfig] Server config not found: server_id=%d, config_name=%s, error=%v", id, peer.ConfigName, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Server config not found"})
		return
	}

	// Получаем приватный ключ напрямую из панели
	client := nodeclient.ForServer(&server, peer.ConfigName)

	// Получаем полную информацию о пире
	peers, err := client.GetAllPeers()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to get peer details from WGDashboard"})
		return
	}

	// Ищем нужного пира
	var privateKey string
	for _, p := range peers {
		if p.PublicKey == publicKey {
			privateKey = p.PrivateKey
			break
		}
	}

	if privateKey == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Peer private key not found"})
		return
	}

	// Парсим порт из строки
	var listenPort int
	fmt.Sscanf(serverConfig.ListenPort, "%d", &listenPort)

	// Получаем IP адрес пира
	allowedIP := "10.0.0.2/32"
	if len(peer.AllowedIPs) > 0 {
		allowedIP = peer.AllowedIPs[0]
	}

	// Генерируем конфиг в формате WGDashboard
	config := fmt.Sprintf(`[Interface]
PrivateKey = %s
Address = %s
MTU = 1420
DNS = 1.1.1.1

[Peer]
PublicKey = %s
AllowedIPs = 0.0.0.0/0
Endpoint = %s:%d
PersistentKeepalive = 21
`,
		privateKey,
		allowedIP,
		serverConfig.PublicKey,
		server.IPAddress,
		listenPort,
	)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"config": config,
		"peer_name": peer.Name,
	})
}

// RemovePeerFromServer удаляет пира с сервера
func (wc *WGDashboardController) RemovePeerFromServer(c *gin.Context) {
	serverID := c.Param("id")
	peerID := c.Query("publicKey") // Изменено: получаем из query параметра
	
	if peerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	client, err := wc.getWGClient(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Пытаемся удалить пир из WGDashboard
	err = client.RemovePeer(peerID)
	if err != nil {
		log.Printf("[RemovePeer] Failed to remove peer from WGDashboard: %v (peer may already be deleted)", err)
		// Не возвращаем ошибку - пир может быть уже удален через UI WGDashboard
	}

	// Удаляем пир из кэша БД в любом случае
	result := wc.db.Where("server_id = ? AND public_key = ?", id, peerID).Delete(&models.WGPeerCache{})
	if result.Error != nil {
		log.Printf("[RemovePeer] Failed to remove peer from cache: %v", result.Error)
	} else if result.RowsAffected > 0 {
		log.Printf("[RemovePeer] Removed peer from cache: %s (rows affected: %d)", peerID, result.RowsAffected)
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Peer removed successfully",
	})
}


// GetCachedPeers получает пиры из кэша (быстро!)
func (wc *WGDashboardController) GetCachedPeers(c *gin.Context) {
	serverID := c.Param("id")
	configName := c.Query("config")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}
	
	var peers []models.WGPeerCache
	query := wc.db.Where("server_id = ?", id)
	if configName != "" {
		query = query.Where("config_name = ?", configName)
	}
	
	if err := query.Order("name ASC").Find(&peers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Преобразуем в формат совместимый с фронтендом
	result := make([]gin.H, len(peers))
	for i, peer := range peers {
		result[i] = gin.H{
			"publicKey":         peer.PublicKey,
			"name":              peer.Name,
			"status":            peer.Status,
			"allowed_ip":        peer.AllowedIPs,
			"endpoint":          peer.Endpoint,
			"DNS":               peer.DNS,
			"mtu":               peer.MTU,
			"keepalive":         peer.KeepAlive,
			"total_receive":     peer.TotalReceive,
			"total_sent":        peer.TotalSent,
			"total_data":        peer.TotalData,
			"latest_handshake":  peer.LatestHandshake,
			"category":          peer.Category,
		}
	}
	
	var lastSync time.Time
	if len(peers) > 0 {
		lastSync = peers[0].LastSyncedAt
	}
	
	// Всегда возвращаем 200, даже если кэш пустой
	c.JSON(http.StatusOK, gin.H{
		"peers":     result,
		"total":     len(result),
		"config":    configName,
		"cached":    true,
		"last_sync": lastSync,
		"empty":     len(result) == 0, // Флаг что кэш пустой
	})
}

// GetCachedConfig получает конфигурации из кэша (быстро!)
func (wc *WGDashboardController) GetCachedConfig(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}
	
	var configs []models.WGConfigCache
	if err := wc.db.Where("server_id = ?", id).Find(&configs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Преобразуем в формат совместимый с фронтендом
	result := make([]gin.H, len(configs))
	for i, config := range configs {
		result[i] = gin.H{
			"Name":           config.Name,
			"Status":         config.Status,
			"PublicKey":      config.PublicKey,
			"ListenPort":     config.ListenPort,
			"Address":        config.Address,
			"TotalPeers":     config.TotalPeers,
			"ConnectedPeers": config.ConnectedPeers,
			"DataUsage": gin.H{
				"Receive": config.DataReceive,
				"Sent":    config.DataSent,
				"Total":   config.DataTotal,
			},
		}
	}
	
	var lastSync time.Time
	if len(configs) > 0 {
		lastSync = configs[0].LastSyncedAt
	}
	
	// Всегда возвращаем 200, даже если кэш пустой
	c.JSON(http.StatusOK, gin.H{
		"status":    true,
		"data":      result,
		"cached":    true,
		"last_sync": lastSync,
		"empty":     len(result) == 0, // Флаг что кэш пустой
	})
}

// GetCachedSystemStatus получает системный статус из кэша (быстро!)
func (wc *WGDashboardController) GetCachedSystemStatus(c *gin.Context) {
	serverID := c.Param("id")
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}
	
	var status models.SystemStatusCache
	err := wc.db.Where("server_id = ?", id).First(&status).Error
	
	// Если кэш пустой - возвращаем пустой объект вместо 404
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusOK, gin.H{
				"status": true,
				"data": gin.H{
					"CPU": gin.H{
						"cpu_percent": 0,
					},
					"Memory": gin.H{
						"VirtualMemory": gin.H{
							"total":   0,
							"used":    0,
							"percent": 0,
						},
					},
					"Disks": []gin.H{
						{
							"total":   0,
							"used":    0,
							"percent": 0,
						},
					},
				},
				"cached":    true,
				"last_sync": time.Time{},
				"empty":     true, // Флаг что кэш пустой
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Преобразуем в формат совместимый с фронтендом
	c.JSON(http.StatusOK, gin.H{
		"status": true,
		"data": gin.H{
			"CPU": gin.H{
				"cpu_percent": status.CPUPercent,
			},
			"Memory": gin.H{
				"VirtualMemory": gin.H{
					"total":   status.MemoryTotal,
					"used":    status.MemoryUsed,
					"percent": status.MemoryPercent,
				},
			},
			"Disks": []gin.H{
				{
					"total":   status.DiskTotal,
					"used":    status.DiskUsed,
					"percent": status.DiskPercent,
				},
			},
		},
		"cached":    true,
		"last_sync": status.LastSyncedAt,
		"empty":     false,
	})
}

// GetPeerVPNConfig отдаёт AmneziaVPN-конфиг (vpn://...) пира (только 3wg-panel)
func (wc *WGDashboardController) GetPeerVPNConfig(c *gin.Context) {
	serverID := c.Param("id")
	publicKey := c.Query("publicKey")

	if publicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}

	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if server.PanelType != nodeclient.PanelType3WG {
		c.JSON(http.StatusOK, gin.H{"status": "unsupported"})
		return
	}

	panelClient := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, "")
	panelClient.APIKey = server.WGDashboardKey

	vpn, err := panelClient.GetPeerAmneziaVPNByPublicKey(publicKey)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "vpn_config": vpn})
}

// GetServerCategories возвращает категории пиров сервера (только 3wg-panel)
func (wc *WGDashboardController) GetServerCategories(c *gin.Context) {
	serverID := c.Param("id")

	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if server.PanelType != nodeclient.PanelType3WG {
		c.JSON(http.StatusOK, gin.H{"status": "unsupported", "categories": []string{}})
		return
	}

	panelClient := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, "")
	panelClient.APIKey = server.WGDashboardKey

	categories, err := panelClient.ListCategories()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "categories": categories})
}

// UpdatePeerInfo меняет имя/категорию пира (только 3wg-panel)
func (wc *WGDashboardController) UpdatePeerInfo(c *gin.Context) {
	serverID := c.Param("id")
	publicKey := c.Query("publicKey")

	if publicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}

	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var req struct {
		Name     string `json:"name"`
		Category string `json:"category"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if server.PanelType != nodeclient.PanelType3WG {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Peer editing is supported for 3wg-panel servers only"})
		return
	}

	panelClient := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, "")
	panelClient.APIKey = server.WGDashboardKey

	if err := panelClient.UpdatePeer(publicKey, req.Name, req.Category); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	// Обновляем кэш сразу, чтобы изменения были видны без ожидания синка
	updates := map[string]interface{}{"category": req.Category}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	wc.db.Model(&models.WGPeerCache{}).
		Where("server_id = ? AND public_key = ?", id, publicKey).
		Updates(updates)

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

// TogglePeer включает/отключает пира (только 3wg-panel)
func (wc *WGDashboardController) TogglePeer(c *gin.Context) {
	serverID := c.Param("id")
	publicKey := c.Query("publicKey")
	enable := c.Query("enable") == "true"

	if publicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}

	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if server.PanelType != nodeclient.PanelType3WG {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Enable/disable is supported for 3wg-panel servers only"})
		return
	}

	panelClient := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, "")
	panelClient.APIKey = server.WGDashboardKey

	if err := panelClient.SetPeerEnabled(publicKey, enable); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "enabled": enable})
}

// GetInterfaceTraffic получает историю трафика интерфейсов (только 3wg-panel)
func (wc *WGDashboardController) GetInterfaceTraffic(c *gin.Context) {
	serverID := c.Param("id")

	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	days := 30
	if d := c.Query("days"); d != "" {
		fmt.Sscanf(d, "%d", &days)
	}

	var server models.Server
	if err := wc.db.First(&server, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	if server.PanelType != nodeclient.PanelType3WG {
		// Для WGDashboard-серверов отдаём счётчики из кэша конфигураций (без посуточной серии)
		var configs []models.WGConfigCache
		if err := wc.db.Where("server_id = ?", id).Find(&configs).Error; err != nil || len(configs) == 0 {
			c.JSON(http.StatusOK, gin.H{"status": "unsupported", "message": "No traffic data available"})
			return
		}
		const gb = 1024 * 1024 * 1024
		result := gin.H{}
		for _, cfg := range configs {
			result[cfg.Name] = gin.H{
				"ok":        true,
				"protocol":  cfg.Name,
				"title":     cfg.Name,
				"interface": cfg.Name,
				"days":      days,
				"current": gin.H{
					"rx": int64(cfg.DataReceive * gb),
					"tx": int64(cfg.DataSent * gb),
					"ts": cfg.LastSyncedAt.Unix(),
				},
				"series":      []gin.H{},
				"month_total": int64(cfg.DataTotal * gb),
			}
		}
		c.JSON(http.StatusOK, gin.H{"status": "success", "data": result})
		return
	}

	client := panel3wg.NewClient(server.WGDashboardURL, server.PanelUser, server.PanelPassword, "")
	client.APIKey = server.WGDashboardKey

	result := gin.H{}
	for _, protocol := range []string{"wireguard", "amneziawg"} {
		history, err := client.GetTrafficHistory(protocol, days)
		if err != nil {
			log.Printf("[InterfaceTraffic] server %d protocol %s: %v", id, protocol, err)
			continue
		}
		result[protocol] = history
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": result})
}

// GetPeerGeolocation получает геолокацию пира по его endpoint IP
func (wc *WGDashboardController) GetPeerGeolocation(c *gin.Context) {
	serverID := c.Param("id")
	peerPublicKey := c.Query("publicKey") // Изменено: получаем из query параметра
	
	if peerPublicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}
	
	log.Printf("[Geolocation] Request received: server_id=%s, peer_id=%s", serverID, peerPublicKey)
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		log.Printf("[Geolocation] Invalid server ID: %s", serverID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	// Получаем пира из кэша
	var peer models.WGPeerCache
	if err := wc.db.Where("server_id = ? AND public_key = ?", id, peerPublicKey).First(&peer).Error; err != nil {
		log.Printf("[Geolocation] Peer not found: server_id=%d, public_key=%s, error=%v", id, peerPublicKey, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Peer not found"})
		return
	}

	log.Printf("[Geolocation] Found peer: name=%s, endpoint=%s, last_known_endpoint=%s", peer.Name, peer.Endpoint, peer.LastKnownEndpoint)

	// Извлекаем IP из endpoint (формат: IP:PORT)
	// Используем last_known_endpoint если текущий endpoint пустой
	endpoint := peer.Endpoint
	if endpoint == "" || endpoint == "0.0.0.0/0" || endpoint == "(none)" {
		// Пытаемся использовать последний известный endpoint
		if peer.LastKnownEndpoint != "" && peer.LastKnownEndpoint != "0.0.0.0/0" && peer.LastKnownEndpoint != "(none)" {
			endpoint = peer.LastKnownEndpoint
			log.Printf("[Geolocation] Using last known endpoint: %s", endpoint)
		} else {
			log.Printf("[Geolocation] Peer %s has no real endpoint, never connected", peer.Name)
			c.JSON(http.StatusOK, gin.H{
				"status": "no_connection",
				"message": "Peer has not connected yet",
			})
			return
		}
	}

	// Парсим IP из endpoint
	var ip string
	if _, err := fmt.Sscanf(endpoint, "%s:", &ip); err != nil {
		// Если нет порта, берем весь endpoint как IP
		ip = endpoint
	}

	log.Printf("[Geolocation] Getting geolocation for peer %s, IP: %s", peer.Name, ip)

	// Получаем геолокацию через сервис
	geoService := services.NewIPGeolocationService()
	geo, err := geoService.GetGeolocation(ip)
	if err != nil {
		log.Printf("[Geolocation] Error getting geolocation: %v", err)
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"error": fmt.Sprintf("Failed to get geolocation: %v", err),
		})
		return
	}

	log.Printf("[Geolocation] Success: %s, %s (%f, %f)", geo.City, geo.Country, geo.Lat, geo.Lon)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"ip":          geo.Query,
			"country":     geo.Country,
			"countryCode": geo.CountryCode,
			"region":      geo.RegionName,
			"city":        geo.City,
			"lat":         geo.Lat,
			"lon":         geo.Lon,
			"isp":         geo.ISP,
		},
	})
}


// GetPeerTrafficHistory получает историю трафика пира за последние N дней
func (wc *WGDashboardController) GetPeerTrafficHistory(c *gin.Context) {
	serverID := c.Param("id")
	peerPublicKey := c.Query("publicKey") // Изменено: получаем из query параметра
	
	if peerPublicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}
	
	log.Printf("[TrafficHistory] Request for server %s, peer %s", serverID, peerPublicKey)
	
	// Количество дней (по умолчанию 7)
	days := 7
	if daysParam := c.Query("days"); daysParam != "" {
		if d, err := fmt.Sscanf(daysParam, "%d", &days); err == nil && d > 0 {
			if days > 30 {
				days = 30 // Максимум 30 дней
			}
		}
	}
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	// Получаем историю из БД
	var history []models.PeerTrafficHistory
	startDate := time.Now().UTC().AddDate(0, 0, -days)
	
	log.Printf("[TrafficHistory] Searching for server_id=%d, public_key=%s, date>=%s", id, peerPublicKey, startDate.Format("2006-01-02"))
	
	if err := wc.db.Where("server_id = ? AND public_key = ? AND recorded_at >= ?", 
		id, peerPublicKey, startDate).
		Order("recorded_at ASC").
		Find(&history).Error; err != nil {
		log.Printf("[TrafficHistory] Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[TrafficHistory] Found %d records", len(history))

	// Форматируем данные для фронтенда
	result := make([]gin.H, len(history))
	for i, h := range history {
		result[i] = gin.H{
			"date":           h.RecordedAt.Format("2006-01-02"),
			"bytes_received": h.BytesReceived,
			"bytes_sent":     h.BytesSent,
			"bytes_total":    h.BytesTotal,
			"delta_received": h.DeltaReceived,
			"delta_sent":     h.DeltaSent,
			"delta_total":    h.DeltaTotal,
			// Конвертируем в GB для графика
			"gb_received": float64(h.DeltaReceived) / 1024 / 1024 / 1024,
			"gb_sent":     float64(h.DeltaSent) / 1024 / 1024 / 1024,
			"gb_total":    float64(h.DeltaTotal) / 1024 / 1024 / 1024,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   result,
		"count":  len(result),
	})
}

// GetPeerTrafficHourly получает почасовую историю трафика пира за последние N часов
func (wc *WGDashboardController) GetPeerTrafficHourly(c *gin.Context) {
	serverID := c.Param("id")
	peerPublicKey := c.Query("publicKey")
	
	if peerPublicKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
		return
	}
	
	log.Printf("[TrafficHourly] Request for server %s, peer %s", serverID, peerPublicKey)
	
	// Количество часов (по умолчанию 24)
	hours := 24
	if hoursParam := c.Query("hours"); hoursParam != "" {
		if h, err := fmt.Sscanf(hoursParam, "%d", &hours); err == nil && h > 0 {
			if hours > 168 { // Максимум неделя
				hours = 168
			}
		}
	}
	
	var id uint
	if _, err := fmt.Sscanf(serverID, "%d", &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	// Получаем почасовую историю из БД
	var history []models.PeerTrafficHourly
	startTime := time.Now().UTC().Add(-time.Duration(hours) * time.Hour)
	
	log.Printf("[TrafficHourly] Searching for server_id=%d, public_key=%s, time>=%s", id, peerPublicKey, startTime.Format("2006-01-02 15:04"))
	
	if err := wc.db.Where("server_id = ? AND public_key = ? AND recorded_at >= ?", 
		id, peerPublicKey, startTime).
		Order("recorded_at ASC").
		Find(&history).Error; err != nil {
		log.Printf("[TrafficHourly] Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[TrafficHourly] Found %d records", len(history))

	// Форматируем данные для фронтенда
	result := make([]gin.H, len(history))
	for i, h := range history {
		result[i] = gin.H{
			"hour":           h.RecordedAt.Format("2006-01-02 15:04"),
			"timestamp":      h.RecordedAt.Unix(),
			"bytes_received": h.BytesReceived,
			"bytes_sent":     h.BytesSent,
			"bytes_total":    h.BytesTotal,
			"delta_received": h.DeltaReceived,
			"delta_sent":     h.DeltaSent,
			"delta_total":    h.DeltaTotal,
			// Конвертируем в GB для графика
			"gb_received": float64(h.DeltaReceived) / 1024 / 1024 / 1024,
			"gb_sent":     float64(h.DeltaSent) / 1024 / 1024 / 1024,
			"gb_total":    float64(h.DeltaTotal) / 1024 / 1024 / 1024,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   result,
		"count":  len(result),
	})
}

