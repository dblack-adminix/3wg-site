package panel3wg

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/3wg/vpn-backend/wgdashboard"
)

// Client — адаптер 3wg-panel (FastAPI, cookie-сессия) под интерфейс,
// совместимый с wgdashboard.Client. Использует типы wgdashboard для ответов.
type Client struct {
	BaseURL    string
	Username   string
	Password   string
	APIKey     string // если задан — заголовок X-API-Key вместо cookie-сессии
	Protocol   string // wireguard | amneziawg
	// DefaultCategoryName — если задана, новые пиры попадают в эту категорию
	// (создаётся при необходимости). Используется для общих серверов: категория = клиент.
	DefaultCategoryName string
	HTTPClient          *http.Client

	mu       sync.Mutex
	loggedIn bool
}

// NewClient создаёт клиент 3wg-panel. configName маппится на протокол:
// "awg"/"amnezia*" → amneziawg, иначе wireguard.
func NewClient(baseURL, username, password, configName string) *Client {
	jar, _ := cookiejar.New(nil)
	return &Client{
		BaseURL:  strings.TrimRight(baseURL, "/"),
		Username: username,
		Password: password,
		Protocol: ProtocolFromConfigName(configName),
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
			Jar:     jar,
		},
	}
}

func ProtocolFromConfigName(configName string) string {
	name := strings.ToLower(configName)
	if strings.Contains(name, "awg") || strings.Contains(name, "amnezia") {
		return "amneziawg"
	}
	return "wireguard"
}

func (c *Client) login() error {
	body, _ := json.Marshal(map[string]string{
		"username": c.Username,
		"password": c.Password,
	})
	resp, err := c.HTTPClient.Post(c.BaseURL+"/api/auth/login", "application/json", bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("panel login failed: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("panel login failed: status %d: %s", resp.StatusCode, string(b))
	}
	c.loggedIn = true
	return nil
}

// doRequest выполняет запрос с автоматическим (ре)логином по cookie-сессии.
func (c *Client) doRequest(method, path string, body interface{}) ([]byte, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.APIKey == "" && !c.loggedIn {
		if err := c.login(); err != nil {
			return nil, err
		}
	}

	do := func() (*http.Response, error) {
		var reqBody io.Reader
		if body != nil {
			data, err := json.Marshal(body)
			if err != nil {
				return nil, err
			}
			reqBody = bytes.NewReader(data)
		}
		req, err := http.NewRequest(method, c.BaseURL+path, reqBody)
		if err != nil {
			return nil, err
		}
		req.Header.Set("Content-Type", "application/json")
		if c.APIKey != "" {
			req.Header.Set("X-API-Key", c.APIKey)
		}
		return c.HTTPClient.Do(req)
	}

	resp, err := do()
	if err != nil {
		return nil, fmt.Errorf("panel request failed: %w", err)
	}
	if resp.StatusCode == http.StatusUnauthorized && c.APIKey == "" {
		resp.Body.Close()
		if err := c.login(); err != nil {
			return nil, err
		}
		resp, err = do()
		if err != nil {
			return nil, fmt.Errorf("panel request failed after relogin: %w", err)
		}
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read panel response: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("panel API returned status %d: %s", resp.StatusCode, string(respBody))
	}
	return respBody, nil
}

// --- Типы ответов панели ---

type panelPeer struct {
	ID                  int                    `json:"id"`
	Name                string                 `json:"name"`
	Protocol            string                 `json:"protocol"`
	IPCidr              string                 `json:"ip_cidr"`
	PublicKey           string                 `json:"public_key"`
	Enabled             bool                   `json:"enabled"`
	CreatedAt           int64                  `json:"created_at"`
	Endpoint            string                 `json:"endpoint"`
	Status              string                 `json:"status"` // active | offline | disabled
	CategoryName        string                 `json:"category_name"`
	HandshakeAgeSeconds *float64               `json:"handshake_age_seconds"`
	Live                map[string]interface{} `json:"live"`
	Config              string                 `json:"config,omitempty"`
}

type peersResponse struct {
	OK    bool        `json:"ok"`
	Peers []panelPeer `json:"peers"`
}

type peerResponse struct {
	OK   bool      `json:"ok"`
	Peer panelPeer `json:"peer"`
}

type nodeStatusResponse struct {
	OK           bool   `json:"ok"`
	EndpointHost string `json:"endpoint_host"`
	ClientsTotal int    `json:"clients_total"`
	PeersTotal   int    `json:"peers_total"`
	PeersOnline  int    `json:"peers_online"`
	Protocols    map[string]struct {
		Available bool   `json:"available"`
		Container string `json:"container"`
		Interface string `json:"interface"`
		Endpoint  string `json:"endpoint"`
		Port      int    `json:"port"`
	} `json:"protocols"`
}

// --- Методы интерфейса ---

func (c *Client) TestConnection() error {
	_, err := c.doRequest("GET", "/api/node/status", nil)
	return err
}

// GetConfig маппит статус протоколов панели в формат WGDashboard-конфигураций.
func (c *Client) GetConfig() (*wgdashboard.GetConfigResponse, error) {
	respBody, err := c.doRequest("GET", "/api/node/status", nil)
	if err != nil {
		return nil, err
	}
	var status nodeStatusResponse
	if err := json.Unmarshal(respBody, &status); err != nil {
		return nil, fmt.Errorf("failed to unmarshal node status: %w", err)
	}

	result := &wgdashboard.GetConfigResponse{Status: true, Message: "3wg-panel"}
	const gb = 1024 * 1024 * 1024
	for name, p := range status.Protocols {
		// Текущие счётчики интерфейса — из снапшота истории трафика
		var rxGB, txGB float64
		if th, err := c.GetTrafficHistory(name, 1); err == nil && th.Current != nil {
			rxGB = float64(th.Current.RX) / gb
			txGB = float64(th.Current.TX) / gb
		}
		result.Data = append(result.Data, struct {
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
		}{
			Name:           name,
			Status:         p.Available,
			ListenPort:     fmt.Sprintf("%d", p.Port),
			Address:        p.Endpoint,
			TotalPeers:     status.PeersTotal,
			ConnectedPeers: status.PeersOnline,
		})
		last := &result.Data[len(result.Data)-1]
		last.DataUsage.Receive = rxGB
		last.DataUsage.Sent = txGB
		last.DataUsage.Total = rxGB + txGB
	}
	return result, nil
}

// GetSystemStatus получает метрики хоста через /api/node/system панели.
func (c *Client) GetSystemStatus() (*wgdashboard.SystemStatusResponse, error) {
	respBody, err := c.doRequest("GET", "/api/node/system", nil)
	if err != nil {
		return nil, err
	}
	var sys struct {
		OK         bool    `json:"ok"`
		CPUPercent float64 `json:"cpu_percent"`
		Memory     struct {
			Total     int64   `json:"total"`
			Available int64   `json:"available"`
			Percent   float64 `json:"percent"`
		} `json:"memory"`
		Disk struct {
			Total   int64   `json:"total"`
			Used    int64   `json:"used"`
			Free    int64   `json:"free"`
			Percent float64 `json:"percent"`
		} `json:"disk"`
	}
	if err := json.Unmarshal(respBody, &sys); err != nil {
		return nil, fmt.Errorf("failed to unmarshal system status: %w", err)
	}

	result := &wgdashboard.SystemStatusResponse{Status: true}
	result.Data.CPU.CPUPercent = sys.CPUPercent
	result.Data.Memory.VirtualMemory.Total = sys.Memory.Total
	result.Data.Memory.VirtualMemory.Available = sys.Memory.Available
	result.Data.Memory.VirtualMemory.Percent = sys.Memory.Percent
	result.Data.Disks = append(result.Data.Disks, struct {
		MountPoint string  `json:"mountPoint"`
		Total      int64   `json:"total"`
		Used       int64   `json:"used"`
		Free       int64   `json:"free"`
		Percent    float64 `json:"percent"`
	}{
		MountPoint: "/",
		Total:      sys.Disk.Total,
		Used:       sys.Disk.Used,
		Free:       sys.Disk.Free,
		Percent:    sys.Disk.Percent,
	})
	return result, nil
}

func (c *Client) fetchPeers() ([]panelPeer, error) {
	respBody, err := c.doRequest("GET", "/api/peers", nil)
	if err != nil {
		return nil, err
	}
	var resp peersResponse
	if err := json.Unmarshal(respBody, &resp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal peers: %w", err)
	}
	peers := make([]panelPeer, 0, len(resp.Peers))
	for _, p := range resp.Peers {
		if p.Protocol == c.Protocol {
			peers = append(peers, p)
		}
	}
	return peers, nil
}

func liveFloat(live map[string]interface{}, keys ...string) float64 {
	for _, k := range keys {
		v, ok := live[k]
		if !ok {
			continue
		}
		switch val := v.(type) {
		case float64:
			return val
		case string:
			// Панель отдаёт счётчики строками ("123456")
			if f, err := strconv.ParseFloat(strings.TrimSpace(val), 64); err == nil {
				return f
			}
		}
	}
	return 0
}

func (c *Client) toPeerConfig(p panelPeer) wgdashboard.PeerConfig {
	status := "stopped"
	switch p.Status {
	case "active":
		status = "running"
	case "disabled":
		status = "disabled"
	}
	allowedIPs := []string{}
	if p.IPCidr != "" {
		allowedIPs = []string{p.IPCidr}
	}
	handshake := ""
	if p.HandshakeAgeSeconds != nil {
		handshake = fmt.Sprintf("%.0f", *p.HandshakeAgeSeconds)
	}
	const gb = 1024 * 1024 * 1024
	rx := liveFloat(p.Live, "transfer_rx", "rx", "rx_bytes") / gb
	tx := liveFloat(p.Live, "transfer_tx", "tx", "tx_bytes") / gb
	endpoint := ""
	if p.Live != nil {
		if e, ok := p.Live["endpoint"].(string); ok && e != "(none)" {
			endpoint = e
		}
	}
	return wgdashboard.PeerConfig{
		ID:              fmt.Sprintf("%d", p.ID),
		PublicKey:       p.PublicKey,
		Name:            p.Name,
		Status:          status,
		Category:        p.CategoryName,
		AllowedIPs:      allowedIPs,
		Endpoint:        endpoint,
		LatestHandshake: handshake,
		TotalReceive:    rx,
		TotalSent:       tx,
		TotalData:       rx + tx,
	}
}

func (c *Client) GetAllPeers() ([]wgdashboard.PeerConfig, error) {
	panelPeers, err := c.fetchPeers()
	if err != nil {
		return nil, err
	}
	peers := make([]wgdashboard.PeerConfig, 0, len(panelPeers))
	for _, p := range panelPeers {
		peers = append(peers, c.toPeerConfig(p))
	}
	return peers, nil
}

// GetConfigurationInfo собирает пиров с приватными ключами (из конфигов панели).
func (c *Client) GetConfigurationInfo() (*wgdashboard.ConfigurationInfoResponse, error) {
	panelPeers, err := c.fetchPeers()
	if err != nil {
		return nil, err
	}
	result := &wgdashboard.ConfigurationInfoResponse{Status: true}
	for _, p := range panelPeers {
		peer := wgdashboard.ConfigurationPeer{
			ID:              p.PublicKey,
			Name:            p.Name,
			AllowedIP:       p.IPCidr,
			LatestHandshake: "",
		}
		if p.Status == "active" {
			peer.Status = "running"
		} else {
			peer.Status = "stopped"
		}
		// Приватный ключ доступен только в тексте конфига клиента
		if conf, err := c.getPeerConfigByID(p.ID); err == nil {
			peer.PrivateKey = parseConfValue(conf, "PrivateKey")
		}
		result.Data.ConfigurationPeers = append(result.Data.ConfigurationPeers, peer)
	}
	return result, nil
}

// Category — категория пиров в панели.
type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// ListCategories возвращает категории панели.
func (c *Client) ListCategories() ([]Category, error) {
	respBody, err := c.doRequest("GET", "/api/categories", nil)
	if err != nil {
		return nil, err
	}
	var resp struct {
		OK         bool       `json:"ok"`
		Categories []Category `json:"categories"`
	}
	if err := json.Unmarshal(respBody, &resp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal categories: %w", err)
	}
	return resp.Categories, nil
}

// EnsureCategory находит категорию по имени или создаёт новую, возвращает её ID.
func (c *Client) EnsureCategory(name string) (int, error) {
	categories, err := c.ListCategories()
	if err != nil {
		return 0, err
	}
	for _, cat := range categories {
		if cat.Name == name {
			return cat.ID, nil
		}
	}
	respBody, err := c.doRequest("POST", "/api/categories", map[string]string{"name": name})
	if err != nil {
		// 409 — категорию успели создать параллельно; перечитываем
		if categories, lerr := c.ListCategories(); lerr == nil {
			for _, cat := range categories {
				if cat.Name == name {
					return cat.ID, nil
				}
			}
		}
		return 0, err
	}
	var resp struct {
		OK       bool      `json:"ok"`
		Category *Category `json:"category"`
	}
	if err := json.Unmarshal(respBody, &resp); err != nil || resp.Category == nil {
		return 0, fmt.Errorf("failed to parse created category")
	}
	return resp.Category.ID, nil
}

// AddPeer создаёт клиента в панели. Панель сама генерирует ключи,
// переданные publicKey/privateKey игнорируются (как WGDashboard с пустыми ключами).
func (c *Client) AddPeer(publicKey string, privateKey string, allowedIPs []string, name string) (*wgdashboard.AddPeerResponse, error) {
	body := map[string]interface{}{
		"name":      name,
		"protocols": []string{c.Protocol},
	}
	if c.DefaultCategoryName != "" {
		if catID, err := c.EnsureCategory(c.DefaultCategoryName); err == nil {
			body["category_id"] = catID
		}
	}
	respBody, err := c.doRequest("POST", "/api/peers", body)
	if err != nil {
		return nil, err
	}
	var resp struct {
		OK         bool        `json:"ok"`
		CreatedIDs []int       `json:"created_ids"`
		Peers      []panelPeer `json:"peers"`
		Error      string      `json:"error"`
	}
	if err := json.Unmarshal(respBody, &resp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal create peer response: %w", err)
	}
	if !resp.OK {
		return nil, fmt.Errorf("panel API error: %s", resp.Error)
	}
	return &wgdashboard.AddPeerResponse{
		Status:  true,
		Message: "Peer created via 3wg-panel",
		Data:    resp.Peers,
	}, nil
}

// findPeerByPublicKey ищет пира среди всех протоколов — публичный ключ уникален.
func (c *Client) findPeerByPublicKey(publicKey string) (*panelPeer, error) {
	respBody, err := c.doRequest("GET", "/api/peers", nil)
	if err != nil {
		return nil, err
	}
	var resp peersResponse
	if err := json.Unmarshal(respBody, &resp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal peers: %w", err)
	}
	for i := range resp.Peers {
		if resp.Peers[i].PublicKey == publicKey {
			return &resp.Peers[i], nil
		}
	}
	return nil, fmt.Errorf("peer not found")
}

func (c *Client) RemovePeer(publicKey string) error {
	peer, err := c.findPeerByPublicKey(publicKey)
	if err != nil {
		return err
	}
	_, err = c.doRequest("DELETE", fmt.Sprintf("/api/peers/%d", peer.ID), nil)
	return err
}

func (c *Client) getPeerConfigByID(id int) (string, error) {
	respBody, err := c.doRequest("GET", fmt.Sprintf("/api/peers/%d", id), nil)
	if err != nil {
		return "", err
	}
	var resp peerResponse
	if err := json.Unmarshal(respBody, &resp); err != nil {
		return "", fmt.Errorf("failed to unmarshal peer: %w", err)
	}
	if resp.Peer.Config == "" {
		return "", fmt.Errorf("peer config is empty")
	}
	return resp.Peer.Config, nil
}

// GetPeerConfigByPublicKey получает конфиг клиента панели по публичному ключу.
func (c *Client) GetPeerConfigByPublicKey(publicKey string) (string, error) {
	peer, err := c.findPeerByPublicKey(publicKey)
	if err != nil {
		return "", err
	}
	return c.getPeerConfigByID(peer.ID)
}

// GetPeerAmneziaVPNByPublicKey получает AmneziaVPN-конфиг (vpn://...) по публичному ключу.
func (c *Client) GetPeerAmneziaVPNByPublicKey(publicKey string) (string, error) {
	peer, err := c.findPeerByPublicKey(publicKey)
	if err != nil {
		return "", err
	}
	respBody, err := c.doRequest("GET", fmt.Sprintf("/api/peers/%d/vpn", peer.ID), nil)
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(string(respBody)), nil
}

// UpdatePeer меняет имя и/или категорию пира по публичному ключу.
// categoryName == "" — снять категорию.
func (c *Client) UpdatePeer(publicKey, newName, categoryName string) error {
	peer, err := c.findPeerByPublicKey(publicKey)
	if err != nil {
		return err
	}
	body := map[string]interface{}{}
	if newName != "" {
		body["name"] = newName
	}
	if categoryName != "" {
		catID, err := c.EnsureCategory(categoryName)
		if err != nil {
			return fmt.Errorf("failed to ensure category: %w", err)
		}
		body["category_id"] = catID
	} else {
		body["category_id"] = nil
	}
	_, err = c.doRequest("PATCH", fmt.Sprintf("/api/peers/%d", peer.ID), body)
	return err
}

// SetPeerEnabled включает/отключает клиента панели по публичному ключу.
func (c *Client) SetPeerEnabled(publicKey string, enabled bool) error {
	peer, err := c.findPeerByPublicKey(publicKey)
	if err != nil {
		return err
	}
	action := "disable"
	if enabled {
		action = "enable"
	}
	_, err = c.doRequest("POST", fmt.Sprintf("/api/peers/%d/%s", peer.ID, action), nil)
	return err
}

// GetPeerConfigByPrivateKey ищет конфиг клиента, содержащий приватный ключ.
func (c *Client) GetPeerConfigByPrivateKey(privateKey string) (string, error) {
	peers, err := c.fetchPeers()
	if err != nil {
		return "", err
	}
	for _, p := range peers {
		conf, err := c.getPeerConfigByID(p.ID)
		if err != nil {
			continue
		}
		if strings.Contains(conf, privateKey) {
			return conf, nil
		}
	}
	return "", fmt.Errorf("peer config not found for private key")
}

// GetPeerAmneziaJSON — панель не отдаёт AmneziaVPN JSON через REST API.
func (c *Client) GetPeerAmneziaJSON(privateKey string) (string, error) {
	return "", fmt.Errorf("amnezia JSON is not supported by 3wg-panel API")
}

// TrafficHistory — история трафика интерфейса по дням.
type TrafficHistory struct {
	OK        bool   `json:"ok"`
	Protocol  string `json:"protocol"`
	Title     string `json:"title"`
	Interface string `json:"interface"`
	Days      int    `json:"days"`
	Current   *struct {
		RX int64 `json:"rx"`
		TX int64 `json:"tx"`
		TS int64 `json:"ts"`
	} `json:"current"`
	Series []struct {
		Day   int64 `json:"day"`
		RX    int64 `json:"rx"`
		TX    int64 `json:"tx"`
		Total int64 `json:"total"`
	} `json:"series"`
	MonthTotal int64 `json:"month_total"`
}

// GetTrafficHistory получает историю трафика протокола за N дней.
func (c *Client) GetTrafficHistory(protocol string, days int) (*TrafficHistory, error) {
	if protocol == "" {
		protocol = c.Protocol
	}
	respBody, err := c.doRequest("GET", fmt.Sprintf("/api/traffic/history?protocol=%s&days=%d", protocol, days), nil)
	if err != nil {
		return nil, err
	}
	var th TrafficHistory
	if err := json.Unmarshal(respBody, &th); err != nil {
		return nil, fmt.Errorf("failed to unmarshal traffic history: %w", err)
	}
	return &th, nil
}

func parseConfValue(conf, key string) string {
	for _, line := range strings.Split(conf, "\n") {
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 && strings.TrimSpace(parts[0]) == key {
			return strings.TrimSpace(parts[1])
		}
	}
	return ""
}
