package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/nodeclient"
	"github.com/3wg/vpn-backend/panel3wg"
	"github.com/3wg/vpn-backend/services"
	"github.com/3wg/vpn-backend/wgdashboard"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type VPNKeyController struct {
	db            *gorm.DB
	limitsService *services.LimitsService
}

func NewVPNKeyController(db *gorm.DB) *VPNKeyController {
	return &VPNKeyController{
		db:            db,
		limitsService: services.NewLimitsService(db),
	}
}

type CreateKeyRequest struct {
	Name     string `json:"name" binding:"required"`
	ServerID uint   `json:"server_id" binding:"required"`
	Protocol string `json:"protocol" binding:"required,oneof=wireguard amneziawg"`
}

func (kc *VPNKeyController) GetMyKeys(c *gin.Context) {
	userID := c.GetUint("user_id")

	var keys []models.VPNKey
	if err := kc.db.Where("user_id = ?", userID).
		Preload("Server").
		Order("created_at DESC").
		Find(&keys).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get keys"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"keys":  keys,
		"total": len(keys),
	})
}

func (kc *VPNKeyController) Create(c *gin.Context) {
	userID := c.GetUint("user_id")

	var req CreateKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("[VPNKey] Create request: user_id=%d, server_id=%d, name=%s, protocol=%s\n", 
		userID, req.ServerID, req.Name, req.Protocol)

	// Проверка лимитов и баланса
	checkResult, err := kc.limitsService.CanCreateKey(userID, req.ServerID)
	if err != nil {
		fmt.Printf("[VPNKey] Error checking limits: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check limits"})
		return
	}

	if !checkResult.Allowed {
		fmt.Printf("[VPNKey] Creation not allowed: %s\n", checkResult.Reason)
		c.JSON(http.StatusForbidden, gin.H{
			"error":         checkResult.Reason,
			"current_keys":  checkResult.CurrentKeys,
			"max_keys":      checkResult.MaxKeys,
			"balance":       checkResult.Balance,
			"cost":          checkResult.Cost,
			"balance_after": checkResult.BalanceAfter,
		})
		return
	}

	fmt.Printf("[VPNKey] Limits check passed: keys=%d/%d, balance=%.2f, cost=%.2f\n", 
		checkResult.CurrentKeys, checkResult.MaxKeys, checkResult.Balance, checkResult.Cost)

	// Check if server exists
	var server models.Server
	if err := kc.db.First(&server, req.ServerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Generate unique IP address for this client
	ipAddress, err := generateClientIP(kc.db, req.ServerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate IP address"})
		return
	}

	var publicKey, privateKey, config string

	// Add peer to WGDashboard if server has WGDashboard configured
	if server.WGDashboardURL != "" && server.WGDashboardKey != "" && server.WGConfigName != "" {
		fmt.Printf("[VPNKey] Adding peer to WGDashboard: server=%s, name=%s, ip=%s, config=%s\n",
			server.Name, req.Name, ipAddress, server.WGConfigName)

		// На общих 3wg-panel серверах пиры клиента складываются в его категорию;
		// на выделенных категориями управляет сам владелец сервера.
		categoryName := ""
		if server.PanelType == nodeclient.PanelType3WG && server.UsageType != "dedicated" {
			var keyOwner models.User
			if err := kc.db.First(&keyOwner, userID).Error; err == nil {
				categoryName = fmt.Sprintf("%s #%d", keyOwner.Email, keyOwner.ID)
			} else {
				categoryName = fmt.Sprintf("client #%d", userID)
			}
		}

		// Add peer to WGDashboard (it will generate keys)
		if err := addPeerToWGDashboard(&server, "", "", ipAddress, req.Name, categoryName); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to add peer to WGDashboard: %v", err)})
			return
		}
		
		fmt.Printf("[VPNKey] Peer added successfully to WGDashboard, waiting for sync...\n")
		
		// Wait for WGDashboard to process and sync
		time.Sleep(2 * time.Second)
		
		// Get peer details from WGDashboard to retrieve generated keys
		client := nodeclient.ForServer(&server, "")
		
		// Get configuration info with peers
		configInfo, err := client.GetConfigurationInfo()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get configuration info from WGDashboard"})
			return
		}
		
		// Find the peer we just added by IP address or name
		var foundPeer *wgdashboard.ConfigurationPeer
		for i := range configInfo.Data.ConfigurationPeers {
			peer := &configInfo.Data.ConfigurationPeers[i]
			// Check by name first
			if peer.Name == req.Name {
				foundPeer = peer
				break
			}
			// Check by IP (AllowedIP is a string, not array)
			if peer.AllowedIP == ipAddress+"/32" || peer.AllowedIP == ipAddress {
				foundPeer = peer
				break
			}
		}
		
		if foundPeer == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Peer was added but not found in WGDashboard"})
			return
		}
		
		publicKey = foundPeer.ID // ID содержит публичный ключ
		privateKey = foundPeer.PrivateKey
		
		fmt.Printf("[VPNKey] Retrieved keys from WGDashboard: public=%s\n", publicKey)
		
		// Get server config for generating client config
		var serverConfig models.WGConfigCache
		if err := kc.db.Where("server_id = ? AND name = ?", req.ServerID, server.WGConfigName).First(&serverConfig).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server config not found in cache"})
			return
		}
		
		// Parse port
		var listenPort int
		fmt.Sscanf(serverConfig.ListenPort, "%d", &listenPort)
		
		// Generate config in WGDashboard format
		config = fmt.Sprintf(`[Interface]
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
			ipAddress+"/32",
			serverConfig.PublicKey,
			server.IPAddress,
			listenPort,
		)
		
		fmt.Printf("[VPNKey] Config generated successfully\n")
	} else {
		// Fallback: generate keys locally if WGDashboard not configured
		fmt.Printf("[VPNKey] WGDashboard not configured (URL=%s, Key=%s, Config=%s), generating keys locally\n", 
			server.WGDashboardURL, server.WGDashboardKey, server.WGConfigName)
		privateKey, publicKey, err = generateWireGuardKeys()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate keys"})
			return
		}
		config = generateWireGuardConfig(privateKey, publicKey, server.IPAddress, ipAddress, req.Protocol)
	}

	// Create key in database
	key := models.VPNKey{
		UserID:     userID,
		ServerID:   req.ServerID,
		Name:       req.Name,
		Protocol:   req.Protocol,
		PublicKey:  publicKey,
		PrivateKey: privateKey,
		IPAddress:  ipAddress,
		Config:     config,
		Status:     "active",
	}

	if err := kc.db.Create(&key).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create key"})
		return
	}

	fmt.Printf("[VPNKey] Key created in database: id=%d\n", key.ID)

	// Списываем средства за создание ключа
	if err := kc.limitsService.ChargeForKey(userID); err != nil {
		fmt.Printf("[VPNKey] Warning: Failed to charge for key: %v\n", err)
		// Не прерываем создание ключа, но логируем ошибку
	} else {
		fmt.Printf("[VPNKey] Balance charged successfully: cost=%.2f\n", checkResult.Cost)
	}

	// Load server relation
	kc.db.Preload("Server").First(&key, key.ID)

	// Возвращаем ключ с информацией о балансе
	response := gin.H{
		"id":             key.ID,
		"user_id":        key.UserID,
		"server_id":      key.ServerID,
		"name":           key.Name,
		"protocol":       key.Protocol,
		"public_key":     key.PublicKey,
		"private_key":    key.PrivateKey,
		"ip_address":     key.IPAddress,
		"config":         key.Config,
		"status":         key.Status,
		"server":         key.Server,
		"created_at":     key.CreatedAt,
		"cost":           checkResult.Cost,
		"balance_before": checkResult.Balance,
		"balance_after":  checkResult.BalanceAfter,
	}

	c.JSON(http.StatusCreated, response)
}

func (kc *VPNKeyController) GetByID(c *gin.Context) {
	userID := c.GetUint("user_id")
	keyID := c.Param("id")

	var key models.VPNKey
	if err := kc.db.Where("id = ? AND user_id = ?", keyID, userID).
		Preload("Server").
		First(&key).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found"})
		return
	}

	c.JSON(http.StatusOK, key)
}

func (kc *VPNKeyController) Delete(c *gin.Context) {
	userID := c.GetUint("user_id")
	keyID := c.Param("id")

	var key models.VPNKey
	if err := kc.db.Where("id = ? AND user_id = ?", keyID, userID).
		Preload("Server").
		First(&key).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found"})
		return
	}

	fmt.Printf("[VPNKey] Deleting key: id=%s, name=%s, public_key=%s\n", keyID, key.Name, key.PublicKey)

	// Remove peer from WGDashboard if server has WGDashboard configured
	var wgdashboardError error
	if key.Server.WGDashboardURL != "" && key.Server.WGDashboardKey != "" && key.Server.WGConfigName != "" {
		fmt.Printf("[VPNKey] Removing peer from WGDashboard: server=%s, config=%s, public_key=%s\n", 
			key.Server.Name, key.Server.WGConfigName, key.PublicKey)
		
		if err := removePeerFromWGDashboard(&key.Server, key.PublicKey); err != nil {
			wgdashboardError = err
			fmt.Printf("[VPNKey] Warning: Failed to remove peer from WGDashboard: %v\n", err)
			// Don't fail the request, but include warning in response
		} else {
			fmt.Printf("[VPNKey] Peer removed successfully from WGDashboard\n")
		}
	} else {
		fmt.Printf("[VPNKey] WGDashboard not configured, skipping peer removal\n")
	}

	// Delete from database
	if err := kc.db.Delete(&key).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete key from database"})
		return
	}

	fmt.Printf("[VPNKey] Key deleted successfully from database\n")

	// Return success with optional warning
	response := gin.H{
		"message": "Key deleted successfully",
		"deleted_from_database": true,
	}

	if wgdashboardError != nil {
		response["warning"] = fmt.Sprintf("Key deleted from database, but failed to remove from WGDashboard: %v", wgdashboardError)
		response["deleted_from_wgdashboard"] = false
	} else if key.Server.WGDashboardURL != "" {
		response["deleted_from_wgdashboard"] = true
	}

	c.JSON(http.StatusOK, response)
}

func (kc *VPNKeyController) GetConfig(c *gin.Context) {
	userID := c.GetUint("user_id")
	keyID := c.Param("id")

	var key models.VPNKey
	if err := kc.db.Where("id = ? AND user_id = ?", keyID, userID).First(&key).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found"})
		return
	}

	// Получаем сервер
	var server models.Server
	if err := kc.db.First(&server, key.ServerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Если WGDashboard настроен, получаем конфиг напрямую с сервера
	if server.WGDashboardURL != "" && server.WGDashboardKey != "" && server.WGConfigName != "" {
		// Получаем пир из кэша для определения config name
		var peer models.WGPeerCache
		configName := server.WGConfigName
		if err := kc.db.Where("server_id = ? AND public_key = ?", key.ServerID, key.PublicKey).First(&peer).Error; err == nil {
			configName = peer.ConfigName
		}

		client := nodeclient.ForServer(&server, configName)

		// Получаем конфиг по приватному ключу
		config, err := client.GetPeerConfigByPrivateKey(key.PrivateKey)
		if err == nil && config != "" {
			// Обновляем конфигурацию в базе данных
			kc.db.Model(&key).Update("config", config)
			// Возвращаем конфигурацию с сервера
			c.String(http.StatusOK, config)
			return
		}
		
		fmt.Printf("[GetConfig] Failed to get config from WGDashboard: %v, falling back to cached config\n", err)
	}

	// Fallback: возвращаем сохраненную конфигурацию
	c.String(http.StatusOK, key.Config)
}

func (kc *VPNKeyController) GetAmneziaJSON(c *gin.Context) {
	userID := c.GetUint("user_id")
	keyID := c.Param("id")

	var key models.VPNKey
	if err := kc.db.Where("id = ? AND user_id = ?", keyID, userID).First(&key).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found"})
		return
	}

	// Получаем сервер
	var server models.Server
	if err := kc.db.First(&server, key.ServerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Server not found"})
		return
	}

	// Проверяем что это AmneziaWG ключ
	if !strings.Contains(strings.ToLower(key.Protocol), "amnezia") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This endpoint is only for AmneziaWG keys"})
		return
	}

	// Если WGDashboard настроен, получаем AmneziaVPN JSON с сервера
	if server.WGDashboardURL != "" && server.WGDashboardKey != "" && server.WGConfigName != "" {
		// Получаем пир из кэша для определения config name
		var peer models.WGPeerCache
		configName := server.WGConfigName
		if err := kc.db.Where("server_id = ? AND public_key = ?", key.ServerID, key.PublicKey).First(&peer).Error; err == nil {
			configName = peer.ConfigName
		}

		client := nodeclient.ForServer(&server, configName)

		// Получаем AmneziaVPN JSON по приватному ключу
		amneziaJSON, err := client.GetPeerAmneziaJSON(key.PrivateKey)
		if err == nil && amneziaJSON != "" {
			// Возвращаем JSON конфигурацию
			c.String(http.StatusOK, amneziaJSON)
			return
		}
		
		fmt.Printf("[GetAmneziaJSON] Failed to get amnezia config from WGDashboard: %v\n", err)
	}

	// Fallback: возвращаем ошибку если не удалось получить
	c.JSON(http.StatusNotFound, gin.H{"error": "AmneziaVPN config not available"})
}

// Helper functions
func generateWireGuardKeys() (privateKey, publicKey string, err error) {
	// Generate random private key (32 bytes)
	privKey := make([]byte, 32)
	if _, err := rand.Read(privKey); err != nil {
		return "", "", err
	}

	privateKey = base64.StdEncoding.EncodeToString(privKey)

	// In production, use actual WireGuard key generation
	// For now, generate a mock public key
	pubKey := make([]byte, 32)
	if _, err := rand.Read(pubKey); err != nil {
		return "", "", err
	}

	publicKey = base64.StdEncoding.EncodeToString(pubKey)

	return privateKey, publicKey, nil
}

func generateClientIP(db *gorm.DB, serverID uint) (string, error) {
	// Get server info
	var server models.Server
	if err := db.First(&server, serverID).Error; err != nil {
		return "", err
	}

	// Get all existing IPs from WGDashboard if configured
	usedIPs := make(map[string]bool)
	var subnet string
	var startIP int

	if server.WGDashboardURL != "" && server.WGDashboardKey != "" && server.WGConfigName != "" {
		// Get peers from WGDashboard to find used IPs and subnet
		client := nodeclient.ForServer(&server, "")

		peers, err := client.GetAllPeers()
		if err == nil && len(peers) > 0 {
			// Extract subnet from first peer's IP
			// Example: "10.50.0.2/32" -> subnet "10.50.0", startIP 2
			for _, peer := range peers {
				if len(peer.AllowedIPs) > 0 {
					// Parse IP like "10.50.0.2/32"
					allowedIP := peer.AllowedIPs[0]
					parts := strings.Split(allowedIP, "/")
					if len(parts) > 0 {
						ip := parts[0]
						usedIPs[ip] = true
						
						// Extract subnet if not set yet
						if subnet == "" {
							ipParts := strings.Split(ip, ".")
							if len(ipParts) == 4 {
								subnet = fmt.Sprintf("%s.%s.%s", ipParts[0], ipParts[1], ipParts[2])
								// Start from 2 (1 is usually server)
								startIP = 2
							}
						}
					}
				}
			}
		}
	}

	// Fallback to default subnet if not detected
	if subnet == "" {
		subnet = "10.16.11"
		startIP = 2
	}

	// Also check local database for this server
	var keys []models.VPNKey
	if err := db.Where("server_id = ? AND status = ?", serverID, "active").
		Select("ip_address").
		Find(&keys).Error; err == nil {
		for _, key := range keys {
			usedIPs[key.IPAddress] = true
		}
	}

	// Generate IP in range subnet.2 - subnet.254
	// (subnet.1 is usually reserved for server)
	for i := startIP; i <= 254; i++ {
		ip := fmt.Sprintf("%s.%d", subnet, i)
		if !usedIPs[ip] {
			return ip, nil
		}
	}

	return "", fmt.Errorf("no available IP addresses in subnet %s", subnet)
}

func generateWireGuardConfig(privateKey, publicKey, serverIP, clientIP, protocol string) string {
	config := fmt.Sprintf(`[Interface]
PrivateKey = %s
Address = %s/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = %s
Endpoint = %s:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`, privateKey, clientIP, publicKey, serverIP)

	if protocol == "amneziawg" {
		config += "\n# AmneziaWG specific settings\n"
		config += "Jc = 4\n"
		config += "Jmin = 40\n"
		config += "Jmax = 70\n"
		config += "S1 = 86\n"
		config += "S2 = 37\n"
		config += "H1 = 1234567890\n"
		config += "H2 = 9876543210\n"
		config += "H3 = 5555555555\n"
		config += "H4 = 1111111111\n"
	}

	return config
}

// addPeerToWGDashboard добавляет пир на сервер через WGDashboard API.
// categoryName — для общих 3wg-panel серверов: пир попадает в категорию клиента.
func addPeerToWGDashboard(server *models.Server, publicKey, privateKey, ipAddress, name, categoryName string) error {
	wgClient := nodeclient.ForServer(server, "")

	// На общих 3wg-panel серверах пиры группируются по категории клиента
	if pc, ok := wgClient.(*panel3wg.Client); ok && categoryName != "" {
		pc.DefaultCategoryName = categoryName
	}

	// Add peer with allowed IPs
	allowedIPs := []string{fmt.Sprintf("%s/32", ipAddress)}

	_, err := wgClient.AddPeer(publicKey, privateKey, allowedIPs, name)
	if err != nil {
		return fmt.Errorf("failed to add peer to WGDashboard: %w", err)
	}

	return nil
}

// removePeerFromWGDashboard удаляет пир с сервера через WGDashboard API
func removePeerFromWGDashboard(server *models.Server, publicKey string) error {
	// Import wgdashboard package
	wgClient := nodeclient.ForServer(server, "")

	err := wgClient.RemovePeer(publicKey)
	if err != nil {
		return fmt.Errorf("failed to remove peer from WGDashboard: %w", err)
	}

	return nil
}
