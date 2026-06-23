package wgdashboard

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// Client представляет клиент для работы с WGDashboard API
type Client struct {
	BaseURL    string
	APIKey     string
	ConfigName string
	HTTPClient *http.Client
}

// NewClient создает новый клиент WGDashboard
func NewClient(baseURL, apiKey, configName string) *Client {
	return &Client{
		BaseURL:    baseURL,
		APIKey:     apiKey,
		ConfigName: configName,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// PeerConfig представляет конфигурацию пира
type PeerConfig struct {
	ID                string   `json:"id"`
	PrivateKey        string   `json:"private_key"`
	PublicKey         string   `json:"publicKey"`
	AllowedIPs        []string `json:"allowed_ip"`
	Name              string   `json:"name"`
	Status            string   `json:"status"` // running, stopped
	Endpoint          string   `json:"endpoint"`
	DNS               string   `json:"DNS"`
	MTU               int      `json:"mtu"`
	KeepAlive         int      `json:"keepalive"`
	PresharedKey      string   `json:"preshared_key"`
	TotalReceive      float64  `json:"total_receive"` // В GB
	TotalSent         float64  `json:"total_sent"`    // В GB
	TotalData         float64  `json:"total_data"`    // В GB
	LatestHandshake   string   `json:"latest_handshake"`
	CumulativeReceive float64  `json:"cumu_receive"` // В GB
	CumulativeSent    float64  `json:"cumu_sent"`    // В GB
	CumulativeData    float64  `json:"cumu_data"`    // В GB
	Category          string   `json:"category,omitempty"` // Категория пира (3wg-panel)
}

// AddPeerRequest представляет запрос на добавление пира
type AddPeerRequest struct {
	PublicKey    string   `json:"public_key"`
	AllowedIPs   []string `json:"allowed_ips"`
	Name         string   `json:"name"`
	PresharedKey string   `json:"preshared_key,omitempty"`
}

// AddPeerResponse представляет ответ на добавление пира
type AddPeerResponse struct {
	Status  bool        `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"` // Может быть любым типом
}

// GetConfigResponse представляет ответ с конфигурацией
type GetConfigResponse struct {
	Status  bool   `json:"status"`
	Message string `json:"message"`
	Data    []struct {
		Name           string `json:"Name"`
		Status         bool   `json:"Status"`
		PublicKey      string `json:"PublicKey"`
		ListenPort     string `json:"ListenPort"`
		Address        string `json:"Address"`
		TotalPeers     int    `json:"TotalPeers"`
		ConnectedPeers int    `json:"ConnectedPeers"`
		DataUsage      struct {
			Receive float64 `json:"Receive"`
			Sent    float64 `json:"Sent"`
			Total   float64 `json:"Total"`
		} `json:"DataUsage"`
	} `json:"data"`
}

// doRequest выполняет HTTP запрос к API
func (c *Client) doRequest(method, endpoint string, body interface{}) ([]byte, error) {
	var reqBody io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		reqBody = bytes.NewBuffer(jsonData)
	}

	url := fmt.Sprintf("%s%s", c.BaseURL, endpoint)
	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("wg-dashboard-apikey", c.APIKey)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// GetConfig получает конфигурацию WireGuard
func (c *Client) GetConfig() (*GetConfigResponse, error) {
	endpoint := "/api/getWireguardConfigurations"
	respBody, err := c.doRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var response GetConfigResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &response, nil
}

// SystemStatusResponse представляет ответ с системным статусом
type SystemStatusResponse struct {
	Status bool `json:"status"`
	Data   struct {
		CPU struct {
			CPUPercent       float64   `json:"cpu_percent"`
			CPUPercentPerCPU []float64 `json:"cpu_percent_per_cpu"`
		} `json:"CPU"`
		Memory struct {
			VirtualMemory struct {
				Total     int64   `json:"total"`
				Available int64   `json:"available"`
				Percent   float64 `json:"percent"`
			} `json:"VirtualMemory"`
			SwapMemory struct {
				Total     int64   `json:"total"`
				Available int64   `json:"available"`
				Percent   float64 `json:"percent"`
			} `json:"SwapMemory"`
		} `json:"Memory"`
		Disks []struct {
			MountPoint string  `json:"mountPoint"`
			Total      int64   `json:"total"`
			Used       int64   `json:"used"`
			Free       int64   `json:"free"`
			Percent    float64 `json:"percent"`
		} `json:"Disks"`
	} `json:"data"`
}

// GetSystemStatus получает системный статус сервера
func (c *Client) GetSystemStatus() (*SystemStatusResponse, error) {
	endpoint := "/api/systemStatus"
	respBody, err := c.doRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var response SystemStatusResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &response, nil
}

// GetRawConfig получает raw содержимое конфигурационного файла
func (c *Client) GetRawConfig() (string, error) {
	endpoint := fmt.Sprintf("/api/getWireguardConfigurationRawFile?configurationName=%s", c.ConfigName)
	respBody, err := c.doRequest("GET", endpoint, nil)
	if err != nil {
		return "", err
	}

	var response struct {
		Status bool `json:"status"`
		Data   struct {
			Content string `json:"content"`
			Path    string `json:"path"`
		} `json:"data"`
	}
	if err := json.Unmarshal(respBody, &response); err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return "", fmt.Errorf("API returned status false")
	}

	return response.Data.Content, nil
}

// UpdateRawConfig обновляет raw содержимое конфигурационного файла
func (c *Client) UpdateRawConfig(rawConfig string) error {
	endpoint := "/api/updateWireguardConfigurationRawFile"
	body := map[string]string{
		"configurationName": c.ConfigName,
		"rawConfiguration":  rawConfig,
	}

	respBody, err := c.doRequest("POST", endpoint, body)
	if err != nil {
		return err
	}

	var response struct {
		Status  bool   `json:"status"`
		Message string `json:"message"`
	}
	if err := json.Unmarshal(respBody, &response); err != nil {
		return fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return fmt.Errorf("API returned status false: %s", response.Message)
	}

	return nil
}

// AddPeer добавляет нового пира в конфигурацию через API WGDashboard
func (c *Client) AddPeer(publicKey string, privateKey string, allowedIPs []string, name string) (*AddPeerResponse, error) {
	// Используем правильный API эндпоинт: POST /api/addPeers/{configName}
	endpoint := fmt.Sprintf("/api/addPeers/%s", c.ConfigName)
	
	// Формируем тело запроса в точном формате WGDashboard UI
	// ВАЖНО: Если privateKey пустой, сервер сгенерирует пару ключей сам
	body := map[string]interface{}{
		"bulkAdd":                 false, // boolean, не строка!
		"bulkAddAmount":           1,     // ВАЖНО: должно быть 1 для одиночного добавления, не 0!
		"name":                    name,
		"private_key":             privateKey, // Пустой = сервер генерирует сам
		"public_key":              publicKey,  // Пустой = сервер генерирует сам
		"allowed_ips":             allowedIPs, // массив строк, не строка!
		"allowed_ips_validation":  true,
		"endpoint_allowed_ip":     "0.0.0.0/0",
		"DNS":                     "1.1.1.1",
		"mtu":                     1420,
		"keepalive":               21,
		"preshared_key":           "",
		"preshared_key_bulkAdd":   false,
		"advanced_security":       "off",
	}

	respBody, err := c.doRequest("POST", endpoint, body)
	if err != nil {
		return nil, err
	}

	var response AddPeerResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return nil, fmt.Errorf("API returned status false: %s", response.Message)
	}

	return &response, nil
}

// RemovePeer удаляет пира из конфигурации через API WGDashboard
func (c *Client) RemovePeer(publicKey string) error {
	log.Printf("[WGDashboard] Removing peer with public key: %s", publicKey)
	
	// Используем правильный API endpoint: POST /api/deletePeers/{configName}
	endpoint := fmt.Sprintf("/api/deletePeers/%s", c.ConfigName)
	
	// Формируем тело запроса
	body := map[string]interface{}{
		"peers": []string{publicKey},
	}

	respBody, err := c.doRequest("POST", endpoint, body)
	if err != nil {
		return fmt.Errorf("failed to delete peer: %w", err)
	}

	var response struct {
		Status  bool   `json:"status"`
		Message string `json:"message"`
		Data    interface{} `json:"data"`
	}
	if err := json.Unmarshal(respBody, &response); err != nil {
		return fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return fmt.Errorf("API returned status false: %s", response.Message)
	}

	log.Printf("[WGDashboard] Peer deleted successfully: %s", response.Message)
	return nil
}

// GetPeer получает информацию о конкретном пире через raw config
func (c *Client) GetPeer(publicKey string) (*PeerConfig, error) {
	peers, err := c.GetAllPeers()
	if err != nil {
		return nil, err
	}

	for _, peer := range peers {
		if peer.PublicKey == publicKey {
			return &peer, nil
		}
	}

	return nil, fmt.Errorf("peer not found")
}

// GetConfigurationInfo получает информацию о конфигурации включая пиры с именами
func (c *Client) GetConfigurationInfo() (*ConfigurationInfoResponse, error) {
	endpoint := fmt.Sprintf("/api/getWireguardConfigurationInfo?configurationName=%s", c.ConfigName)
	respBody, err := c.doRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var response ConfigurationInfoResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return nil, fmt.Errorf("API returned status false")
	}

	return &response, nil
}

// ConfigurationInfoResponse представляет ответ с информацией о конфигурации
type ConfigurationInfoResponse struct {
	Status bool `json:"status"`
	Data   struct {
		ConfigurationPeers []ConfigurationPeer `json:"configurationPeers"`
	} `json:"data"`
}

// ConfigurationPeer представляет пира из getWireguardConfigurationInfo
type ConfigurationPeer struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Status            string  `json:"status"` // running, stopped
	AllowedIP         string  `json:"allowed_ip"` // Это строка, а не массив!
	PrivateKey        string  `json:"private_key"`
	DNS               string  `json:"DNS"`
	Endpoint          string  `json:"endpoint_allowed_ip"`
	MTU               int     `json:"mtu"`
	KeepAlive         int     `json:"keepalive"`
	PresharedKey      string  `json:"preshared_key"`
	TotalReceive      float64 `json:"total_receive"`
	TotalSent         float64 `json:"total_sent"`
	TotalData         float64 `json:"total_data"`
	LatestHandshake   string  `json:"latest_handshake"`
	CumulativeReceive float64 `json:"cumu_receive"`
	CumulativeSent    float64 `json:"cumu_sent"`
	CumulativeData    float64 `json:"cumu_data"`
}

// GetAllPeers получает список всех пиров через getWireguardConfigurationInfo
func (c *Client) GetAllPeers() ([]PeerConfig, error) {
	// Используем новый эндпоинт для получения пиров с именами
	configInfo, err := c.GetConfigurationInfo()
	if err != nil {
		return nil, fmt.Errorf("failed to get configuration info: %w", err)
	}

	// Конвертируем ConfigurationPeer в PeerConfig
	peers := make([]PeerConfig, 0, len(configInfo.Data.ConfigurationPeers))
	for _, cp := range configInfo.Data.ConfigurationPeers {
		// Конвертируем строку allowed_ip в массив
		allowedIPs := []string{}
		if cp.AllowedIP != "" {
			allowedIPs = []string{cp.AllowedIP}
		}

		peer := PeerConfig{
			ID:                cp.ID,
			PublicKey:         cp.ID, // ID это и есть PublicKey
			Name:              cp.Name,
			Status:            cp.Status,
			AllowedIPs:        allowedIPs,
			PrivateKey:        cp.PrivateKey,
			DNS:               cp.DNS,
			Endpoint:          cp.Endpoint,
			MTU:               cp.MTU,
			KeepAlive:         cp.KeepAlive,
			PresharedKey:      cp.PresharedKey,
			TotalReceive:      cp.TotalReceive,
			TotalSent:         cp.TotalSent,
			TotalData:         cp.TotalData,
			LatestHandshake:   cp.LatestHandshake,
			CumulativeReceive: cp.CumulativeReceive,
			CumulativeSent:    cp.CumulativeSent,
			CumulativeData:    cp.CumulativeData,
		}
		peers = append(peers, peer)
	}

	return peers, nil
}

// Вспомогательные функции для парсинга
func splitLines(s string) []string {
	lines := []string{}
	current := ""
	for _, c := range s {
		if c == '\n' {
			lines = append(lines, current)
			current = ""
		} else if c != '\r' {
			current += string(c)
		}
	}
	if current != "" {
		lines = append(lines, current)
	}
	return lines
}

func joinLines(lines []string) string {
	result := ""
	for i, line := range lines {
		result += line
		if i < len(lines)-1 {
			result += "\n"
		}
	}
	return result
}

func trimSpace(s string) string {
	start := 0
	end := len(s)

	for start < end && (s[start] == ' ' || s[start] == '\t') {
		start++
	}

	for end > start && (s[end-1] == ' ' || s[end-1] == '\t') {
		end--
	}

	return s[start:end]
}

func splitKeyValue(s string) []string {
	for i, c := range s {
		if c == '=' {
			return []string{s[:i], s[i+1:]}
		}
	}
	return []string{s}
}

// TestConnection проверяет подключение к WGDashboard
func (c *Client) TestConnection() error {
	_, err := c.GetConfig()
	return err
}


// DownloadPeerConfig представляет конфиг пира для скачивания
type DownloadPeerConfig struct {
	AmneziaVPN string `json:"amneziaVPN"`
	File       string `json:"file"`
	FileName   string `json:"fileName"`
}

// DownloadAllPeersResponse представляет ответ с конфигами всех пиров
type DownloadAllPeersResponse struct {
	Status  bool                  `json:"status"`
	Message string                `json:"message"`
	Data    []DownloadPeerConfig  `json:"data"`
}

// DownloadAllPeers получает готовые конфиги всех пиров с сервера
func (c *Client) DownloadAllPeers() (*DownloadAllPeersResponse, error) {
	endpoint := fmt.Sprintf("/api/downloadAllPeers/%s", c.ConfigName)
	respBody, err := c.doRequest("GET", endpoint, nil)
	if err != nil {
		return nil, err
	}

	var response DownloadAllPeersResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if !response.Status {
		return nil, fmt.Errorf("API returned status false: %s", response.Message)
	}

	return &response, nil
}

// GetPeerConfigByPrivateKey получает конфиг пира по приватному ключу
func (c *Client) GetPeerConfigByPrivateKey(privateKey string) (string, error) {
	response, err := c.DownloadAllPeers()
	if err != nil {
		return "", err
	}

	// Ищем пира по приватному ключу в конфиге
	for _, peer := range response.Data {
		if contains(peer.File, privateKey) {
			return peer.File, nil
		}
	}

	return "", fmt.Errorf("peer config not found for private key")
}

// GetPeerAmneziaJSON получает AmneziaVPN JSON конфиг пира по приватному ключу
func (c *Client) GetPeerAmneziaJSON(privateKey string) (string, error) {
	response, err := c.DownloadAllPeers()
	if err != nil {
		return "", err
	}

	// Ищем пира по приватному ключу в конфиге
	for _, peer := range response.Data {
		if contains(peer.File, privateKey) {
			return peer.AmneziaVPN, nil
		}
	}

	return "", fmt.Errorf("peer amnezia config not found for private key")
}

// contains проверяет содержит ли строка подстроку
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || containsMiddle(s, substr)))
}

func containsMiddle(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
