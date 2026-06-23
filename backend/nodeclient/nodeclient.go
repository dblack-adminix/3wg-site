package nodeclient

import (
	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/panel3wg"
	"github.com/3wg/vpn-backend/wgdashboard"
)

// Client — общий интерфейс управления VPN-нодой.
// Реализации: wgdashboard.Client и panel3wg.Client.
type Client interface {
	TestConnection() error
	GetConfig() (*wgdashboard.GetConfigResponse, error)
	GetSystemStatus() (*wgdashboard.SystemStatusResponse, error)
	GetAllPeers() ([]wgdashboard.PeerConfig, error)
	GetConfigurationInfo() (*wgdashboard.ConfigurationInfoResponse, error)
	AddPeer(publicKey, privateKey string, allowedIPs []string, name string) (*wgdashboard.AddPeerResponse, error)
	RemovePeer(publicKey string) error
	GetPeerConfigByPrivateKey(privateKey string) (string, error)
	GetPeerAmneziaJSON(privateKey string) (string, error)
}

// PanelType3WG — сервер управляется через 3wg-panel вместо WGDashboard.
const PanelType3WG = "3wg-panel"

// ForServer возвращает клиент нужного типа панели для сервера.
// configName переопределяет server.WGConfigName, если непустой.
func ForServer(server *models.Server, configName string) Client {
	if configName == "" {
		configName = server.WGConfigName
	}
	if server.PanelType == PanelType3WG {
		client := panel3wg.NewClient(
			server.WGDashboardURL,
			server.PanelUser,
			server.PanelPassword,
			configName,
		)
		// API-ключ панели хранится в том же поле, что и ключ WGDashboard
		client.APIKey = server.WGDashboardKey
		return client
	}
	return wgdashboard.NewClient(
		server.WGDashboardURL,
		server.WGDashboardKey,
		configName,
	)
}
