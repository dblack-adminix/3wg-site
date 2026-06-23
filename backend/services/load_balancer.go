package services

import (
	"fmt"
	"sort"

	"github.com/3wg/vpn-backend/models"
	"gorm.io/gorm"
)

// LoadBalancer управляет распределением пиров по серверам
type LoadBalancer struct {
	db *gorm.DB
}

// NewLoadBalancer создает новый балансировщик нагрузки
func NewLoadBalancer(db *gorm.DB) *LoadBalancer {
	return &LoadBalancer{db: db}
}

// ServerLoad представляет информацию о загрузке сервера
type ServerLoad struct {
	Server       models.Server
	CurrentPeers int
	MaxPeers     int
	LoadPercent  float64
	Available    bool
}

// GetAvailableServers возвращает список доступных серверов для страны
func (lb *LoadBalancer) GetAvailableServers(country string) ([]ServerLoad, error) {
	// Получаем все активные серверы для страны
	var servers []models.Server
	query := lb.db.Where("status = ? AND country = ?", "active", country)
	
	if err := query.Find(&servers).Error; err != nil {
		return nil, fmt.Errorf("failed to get servers: %w", err)
	}
	
	if len(servers) == 0 {
		return nil, fmt.Errorf("no servers found for country: %s", country)
	}
	
	// Подсчитываем загрузку каждого сервера
	var serverLoads []ServerLoad
	
	for _, server := range servers {
		// Подсчитываем текущее количество пиров из кэша
		var peerCount int64
		lb.db.Model(&models.WGPeerCache{}).
			Where("server_id = ?", server.ID).
			Count(&peerCount)
		
		currentPeers := int(peerCount)
		maxPeers := server.MaxUsers
		
		// Вычисляем процент загрузки
		loadPercent := 0.0
		if maxPeers > 0 {
			loadPercent = float64(currentPeers) / float64(maxPeers) * 100
		}
		
		// Сервер доступен если не достигнут лимит
		available := currentPeers < maxPeers
		
		serverLoads = append(serverLoads, ServerLoad{
			Server:       server,
			CurrentPeers: currentPeers,
			MaxPeers:     maxPeers,
			LoadPercent:  loadPercent,
			Available:    available,
		})
	}
	
	return serverLoads, nil
}

// SelectBestServer выбирает наименее загруженный сервер для страны
func (lb *LoadBalancer) SelectBestServer(country string) (*models.Server, error) {
	serverLoads, err := lb.GetAvailableServers(country)
	if err != nil {
		return nil, err
	}
	
	// Фильтруем только доступные серверы
	var available []ServerLoad
	for _, sl := range serverLoads {
		if sl.Available {
			available = append(available, sl)
		}
	}
	
	if len(available) == 0 {
		return nil, fmt.Errorf("all servers for country %s are full", country)
	}
	
	// Сортируем по загрузке (от меньшей к большей)
	sort.Slice(available, func(i, j int) bool {
		return available[i].LoadPercent < available[j].LoadPercent
	})
	
	// Возвращаем наименее загруженный сервер
	return &available[0].Server, nil
}

// SelectServersForMultiplePeers выбирает серверы для нескольких пиров
// Распределяет равномерно по доступным серверам
func (lb *LoadBalancer) SelectServersForMultiplePeers(country string, count int) ([]models.Server, error) {
	serverLoads, err := lb.GetAvailableServers(country)
	if err != nil {
		return nil, err
	}
	
	// Фильтруем только доступные серверы
	var available []ServerLoad
	for _, sl := range serverLoads {
		if sl.Available {
			available = append(available, sl)
		}
	}
	
	if len(available) == 0 {
		return nil, fmt.Errorf("all servers for country %s are full", country)
	}
	
	// Сортируем по загрузке
	sort.Slice(available, func(i, j int) bool {
		return available[i].LoadPercent < available[j].LoadPercent
	})
	
	// Проверяем что есть достаточно места
	totalAvailable := 0
	for _, sl := range available {
		totalAvailable += (sl.MaxPeers - sl.CurrentPeers)
	}
	
	if totalAvailable < count {
		return nil, fmt.Errorf("not enough capacity: need %d peers, available %d", count, totalAvailable)
	}
	
	// Распределяем пиры по серверам равномерно
	var selectedServers []models.Server
	serverIndex := 0
	
	for i := 0; i < count; i++ {
		// Выбираем сервер по кругу (round-robin)
		server := available[serverIndex].Server
		selectedServers = append(selectedServers, server)
		
		// Обновляем счетчик для следующей итерации
		available[serverIndex].CurrentPeers++
		
		// Переходим к следующему серверу
		serverIndex = (serverIndex + 1) % len(available)
		
		// Если текущий сервер заполнен, пропускаем его
		for available[serverIndex].CurrentPeers >= available[serverIndex].MaxPeers {
			serverIndex = (serverIndex + 1) % len(available)
		}
	}
	
	return selectedServers, nil
}

// GetServerStats возвращает статистику по всем серверам
func (lb *LoadBalancer) GetServerStats() (map[string][]ServerLoad, error) {
	// Получаем все активные серверы
	var servers []models.Server
	if err := lb.db.Where("status = ?", "active").Find(&servers).Error; err != nil {
		return nil, fmt.Errorf("failed to get servers: %w", err)
	}
	
	// Группируем по странам
	statsByCountry := make(map[string][]ServerLoad)
	
	for _, server := range servers {
		// Подсчитываем текущее количество пиров
		var peerCount int64
		lb.db.Model(&models.WGPeerCache{}).
			Where("server_id = ?", server.ID).
			Count(&peerCount)
		
		currentPeers := int(peerCount)
		maxPeers := server.MaxUsers
		
		loadPercent := 0.0
		if maxPeers > 0 {
			loadPercent = float64(currentPeers) / float64(maxPeers) * 100
		}
		
		available := currentPeers < maxPeers
		
		sl := ServerLoad{
			Server:       server,
			CurrentPeers: currentPeers,
			MaxPeers:     maxPeers,
			LoadPercent:  loadPercent,
			Available:    available,
		}
		
		statsByCountry[server.Country] = append(statsByCountry[server.Country], sl)
	}
	
	return statsByCountry, nil
}
