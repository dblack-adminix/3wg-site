package services

import (
	"log"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/nodeclient"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type SyncWorker struct {
	db                *gorm.DB
	metricsInterval   time.Duration // Интервал для метрик (CPU, RAM, Disk)
	dataInterval      time.Duration // Интервал для пиров и конфигураций
	stopMetricsChan   chan bool
	stopDataChan      chan bool
}

func NewSyncWorker(db *gorm.DB, metricsInterval, dataInterval time.Duration) *SyncWorker {
	return &SyncWorker{
		db:              db,
		metricsInterval: metricsInterval,
		dataInterval:    dataInterval,
		stopMetricsChan: make(chan bool),
		stopDataChan:    make(chan bool),
	}
}

// Start запускает два воркера с разными интервалами
func (sw *SyncWorker) Start() {
	log.Printf("Starting sync workers: metrics=%v, data=%v", sw.metricsInterval, sw.dataInterval)
	
	// Воркер для метрик (быстрый - каждые 2 секунды)
	go sw.startMetricsWorker()
	
	// Воркер для данных (медленный - каждые 30 секунд)
	go sw.startDataWorker()
}

// Stop останавливает оба воркера
func (sw *SyncWorker) Stop() {
	sw.stopMetricsChan <- true
	sw.stopDataChan <- true
}

// startMetricsWorker синхронизирует только метрики (CPU, RAM, Disk)
func (sw *SyncWorker) startMetricsWorker() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[Metrics Worker] PANIC: %v", r)
		}
	}()
	
	log.Println("[Metrics Worker] Starting initial sync...")
	ticker := time.NewTicker(sw.metricsInterval)
	defer ticker.Stop()
	
	// Первая синхронизация сразу
	sw.syncAllMetrics()
	log.Println("[Metrics Worker] Initial sync completed, starting periodic sync...")
	
	for {
		select {
		case <-ticker.C:
			sw.syncAllMetrics()
		case <-sw.stopMetricsChan:
			log.Println("Metrics worker stopped")
			return
		}
	}
}

// startDataWorker синхронизирует пиры и конфигурации
func (sw *SyncWorker) startDataWorker() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("[Data Worker] PANIC: %v", r)
		}
	}()
	
	log.Println("[Data Worker] Starting initial sync...")
	ticker := time.NewTicker(sw.dataInterval)
	defer ticker.Stop()
	
	// Первая синхронизация сразу
	sw.syncAllData()
	log.Println("[Data Worker] Initial sync completed, starting periodic sync...")
	
	for {
		select {
		case <-ticker.C:
			sw.syncAllData()
		case <-sw.stopDataChan:
			log.Println("Data worker stopped")
			return
		}
	}
}

// syncAllMetrics синхронизирует метрики для всех серверов
func (sw *SyncWorker) syncAllMetrics() {
	var servers []models.Server
	sw.db.Where("wg_dashboard_url IS NOT NULL AND wg_dashboard_url != ''").Find(&servers)
	
	for _, server := range servers {
		go sw.syncServerMetrics(server)
	}
}

// syncAllData синхронизирует пиры и конфигурации для всех серверов
func (sw *SyncWorker) syncAllData() {
	var servers []models.Server
	sw.db.Where("wg_dashboard_url IS NOT NULL AND wg_dashboard_url != ''").Find(&servers)
	
	for _, server := range servers {
		go sw.syncServerData(server)
	}
}

// syncServerMetrics синхронизирует только метрики для одного сервера
func (sw *SyncWorker) syncServerMetrics(server models.Server) {
	client := nodeclient.ForServer(&server, "")
	
	// Синхронизируем системный статус
	status, err := client.GetSystemStatus()
	if err != nil {
		log.Printf("[Metrics] Failed to sync status for server %d: %v", server.ID, err)
		return
	}
	
	// Upsert в БД
	statusCache := models.SystemStatusCache{
		ServerID:      server.ID,
		CPUPercent:    status.Data.CPU.CPUPercent,
		MemoryPercent: status.Data.Memory.VirtualMemory.Percent,
		MemoryTotal:   status.Data.Memory.VirtualMemory.Total,
		MemoryUsed:    status.Data.Memory.VirtualMemory.Total - status.Data.Memory.VirtualMemory.Available, // Вычисляем Used
		DiskPercent:   0,
		DiskTotal:     0,
		DiskUsed:      0,
		LastSyncedAt:  time.Now(),
		UpdatedAt:     time.Now(),
	}
	
	// Проверяем наличие дисков
	if len(status.Data.Disks) > 0 {
		statusCache.DiskPercent = status.Data.Disks[0].Percent
		statusCache.DiskTotal = status.Data.Disks[0].Total
		statusCache.DiskUsed = status.Data.Disks[0].Used
	}
	
	// Используем Clauses для upsert
	sw.db.Exec(`
		INSERT INTO system_status_cache 
		(server_id, cpu_percent, memory_percent, memory_total, memory_used, disk_percent, disk_total, disk_used, last_synced_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT (server_id) 
		DO UPDATE SET 
			cpu_percent = EXCLUDED.cpu_percent,
			memory_percent = EXCLUDED.memory_percent,
			memory_total = EXCLUDED.memory_total,
			memory_used = EXCLUDED.memory_used,
			disk_percent = EXCLUDED.disk_percent,
			disk_total = EXCLUDED.disk_total,
			disk_used = EXCLUDED.disk_used,
			last_synced_at = EXCLUDED.last_synced_at,
			updated_at = EXCLUDED.updated_at
	`, statusCache.ServerID, statusCache.CPUPercent, statusCache.MemoryPercent, statusCache.MemoryTotal,
		statusCache.MemoryUsed, statusCache.DiskPercent, statusCache.DiskTotal, statusCache.DiskUsed,
		statusCache.LastSyncedAt, statusCache.UpdatedAt)
	
	log.Printf("[Metrics] Synced server %d (CPU: %.1f%%, RAM: %.1f%%, Disk: %.1f%%)",
		server.ID, statusCache.CPUPercent, statusCache.MemoryPercent, statusCache.DiskPercent)
}

// syncServerData синхронизирует пиры и конфигурации для одного сервера
func (sw *SyncWorker) syncServerData(server models.Server) {
	log.Printf("[Data] Starting sync for server %d (%s)", server.ID, server.Name)
	
	client := nodeclient.ForServer(&server, "")
	
	// Синхронизируем конфигурации
	log.Printf("[Data] Fetching configs for server %d...", server.ID)
	configs, err := client.GetConfig()
	if err != nil {
		log.Printf("[Data] Failed to sync configs for server %d: %v", server.ID, err)
		return
	}
	log.Printf("[Data] Got %d configs for server %d", len(configs.Data), server.ID)
	
	for _, config := range configs.Data {
		sw.db.Exec(`
			INSERT INTO wg_configs_cache 
			(server_id, name, status, public_key, listen_port, address, total_peers, connected_peers, data_receive, data_sent, data_total, last_synced_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT (server_id, name) 
			DO UPDATE SET 
				status = EXCLUDED.status,
				public_key = EXCLUDED.public_key,
				listen_port = EXCLUDED.listen_port,
				address = EXCLUDED.address,
				total_peers = EXCLUDED.total_peers,
				connected_peers = EXCLUDED.connected_peers,
				data_receive = EXCLUDED.data_receive,
				data_sent = EXCLUDED.data_sent,
				data_total = EXCLUDED.data_total,
				last_synced_at = EXCLUDED.last_synced_at,
				updated_at = EXCLUDED.updated_at
		`, server.ID, config.Name, config.Status, config.PublicKey, config.ListenPort, config.Address,
			config.TotalPeers, config.ConnectedPeers, config.DataUsage.Receive, config.DataUsage.Sent,
			config.DataUsage.Total, time.Now(), time.Now())
	}
	
	// Синхронизируем пиры для каждой конфигурации
	for _, config := range configs.Data {
		configClient := nodeclient.ForServer(&server, config.Name)
		
		peers, err := configClient.GetAllPeers()
		if err != nil {
			log.Printf("[Data] Failed to sync peers for server %d config %s: %v", server.ID, config.Name, err)
			continue
		}
		
		// Собираем список публичных ключей из WGDashboard
		activePeerKeys := make([]string, 0, len(peers))
		
		for _, peer := range peers {
			activePeerKeys = append(activePeerKeys, peer.PublicKey)
			
			// Определяем last_known_endpoint: если текущий endpoint реальный, используем его
			lastKnownEndpoint := peer.Endpoint
			if peer.Endpoint == "0.0.0.0/0" || peer.Endpoint == "(none)" || peer.Endpoint == "" {
				// Если текущий endpoint пустой, пытаемся сохранить предыдущий
				var existingPeer models.WGPeerCache
				if err := sw.db.Where("server_id = ? AND config_name = ? AND public_key = ?", 
					server.ID, config.Name, peer.PublicKey).First(&existingPeer).Error; err == nil {
					// Используем предыдущий last_known_endpoint если он был
					if existingPeer.LastKnownEndpoint != "" && existingPeer.LastKnownEndpoint != "0.0.0.0/0" {
						lastKnownEndpoint = existingPeer.LastKnownEndpoint
					}
				}
			}
			
			sw.db.Exec(`
				INSERT INTO wg_peers_cache 
				(server_id, config_name, public_key, name, status, allowed_ips, endpoint, last_known_endpoint, dns, mtu, keepalive, total_receive, total_sent, total_data, latest_handshake, category, last_synced_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON CONFLICT (server_id, config_name, public_key) 
				DO UPDATE SET 
					name = EXCLUDED.name,
					status = EXCLUDED.status,
					allowed_ips = EXCLUDED.allowed_ips,
					endpoint = EXCLUDED.endpoint,
					last_known_endpoint = EXCLUDED.last_known_endpoint,
					dns = EXCLUDED.dns,
					mtu = EXCLUDED.mtu,
					keepalive = EXCLUDED.keepalive,
					total_receive = EXCLUDED.total_receive,
					total_sent = EXCLUDED.total_sent,
					total_data = EXCLUDED.total_data,
					latest_handshake = EXCLUDED.latest_handshake,
					category = EXCLUDED.category,
					last_synced_at = EXCLUDED.last_synced_at,
					updated_at = EXCLUDED.updated_at
			`, server.ID, config.Name, peer.PublicKey, peer.Name, peer.Status,
				pq.Array(peer.AllowedIPs), peer.Endpoint, lastKnownEndpoint, peer.DNS, peer.MTU, peer.KeepAlive,
				peer.TotalReceive, peer.TotalSent, peer.TotalData, peer.LatestHandshake, peer.Category,
				time.Now(), time.Now())
		}
		
		// Удаляем пиры из кэша, которых больше нет в WGDashboard
		if len(activePeerKeys) > 0 {
			result := sw.db.Exec(`
				DELETE FROM wg_peers_cache 
				WHERE server_id = ? AND config_name = ? AND public_key != ALL(?)
			`, server.ID, config.Name, pq.Array(activePeerKeys))
			
			if result.RowsAffected > 0 {
				log.Printf("[Data] Removed %d stale peers from cache for server %d config %s", 
					result.RowsAffected, server.ID, config.Name)
			}
		} else {
			// Если пиров нет вообще - удаляем все для этой конфигурации
			result := sw.db.Exec(`
				DELETE FROM wg_peers_cache 
				WHERE server_id = ? AND config_name = ?
			`, server.ID, config.Name)
			
			if result.RowsAffected > 0 {
				log.Printf("[Data] Removed all %d peers from cache for server %d config %s (no peers in WGDashboard)", 
					result.RowsAffected, server.ID, config.Name)
			}
		}
		
		log.Printf("[Data] Synced server %d config %s (%d peers)", server.ID, config.Name, len(peers))
	}
}
