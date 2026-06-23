package services

import (
	"log"
	"time"

	"github.com/3wg/vpn-backend/models"
	"gorm.io/gorm"
)

// TrafficHistoryWorker воркер для сохранения истории трафика
type TrafficHistoryWorker struct {
	db *gorm.DB
}

// NewTrafficHistoryWorker создает новый воркер истории трафика
func NewTrafficHistoryWorker(db *gorm.DB) *TrafficHistoryWorker {
	return &TrafficHistoryWorker{db: db}
}

// Start запускает воркер (сохраняет снимки раз в день в 00:00 UTC и каждый час)
func (w *TrafficHistoryWorker) Start() {
	log.Println("[TrafficHistoryWorker] Starting traffic snapshot worker...")
	
	// Заполняем пропущенные часы (последние 24 часа)
	w.BackfillHourlySnapshots(24)
	
	// Сразу делаем первый снимок при старте
	w.SaveHourlySnapshot()
	w.SaveDailySnapshot()
	
	// Запускаем ticker на каждый час
	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for range ticker.C {
			now := time.Now().UTC()
			
			// Почасовой снимок - каждый час
			w.SaveHourlySnapshot()
			
			// Дневной снимок - в 00:00 UTC
			if now.Hour() == 0 {
				w.SaveDailySnapshot()
			}
		}
	}()
}

// SaveDailySnapshot сохраняет снимок трафика всех пиров
func (w *TrafficHistoryWorker) SaveDailySnapshot() {
	log.Println("[TrafficHistoryWorker] Saving daily traffic snapshot...")
	
	// Получаем текущую дату (начало дня UTC)
	now := time.Now().UTC()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	
	// Получаем все пиры из кэша
	var peers []models.WGPeerCache
	if err := w.db.Find(&peers).Error; err != nil {
		log.Printf("[TrafficHistoryWorker] Error loading peers: %v", err)
		return
	}
	
	log.Printf("[TrafficHistoryWorker] Processing %d peers...", len(peers))
	
	saved := 0
	for _, peer := range peers {
		// Конвертируем GB в байты
		bytesReceived := uint64(peer.TotalReceive * 1024 * 1024 * 1024)
		bytesSent := uint64(peer.TotalSent * 1024 * 1024 * 1024)
		bytesTotal := bytesReceived + bytesSent
		
		// Получаем предыдущий снимок для расчета дельты
		var prevSnapshot models.PeerTrafficHistory
		err := w.db.Where("server_id = ? AND config_name = ? AND public_key = ?", 
			peer.ServerID, peer.ConfigName, peer.PublicKey).
			Order("recorded_at DESC").
			First(&prevSnapshot).Error
		
		var deltaReceived, deltaSent, deltaTotal uint64
		if err == nil {
			// Есть предыдущий снимок - считаем дельту
			if bytesReceived >= prevSnapshot.BytesReceived {
				deltaReceived = bytesReceived - prevSnapshot.BytesReceived
			}
			if bytesSent >= prevSnapshot.BytesSent {
				deltaSent = bytesSent - prevSnapshot.BytesSent
			}
			deltaTotal = deltaReceived + deltaSent
		} else {
			// Первый снимок - вся статистика это дельта
			deltaReceived = bytesReceived
			deltaSent = bytesSent
			deltaTotal = bytesTotal
		}
		
		// Создаем новый снимок
		snapshot := models.PeerTrafficHistory{
			ServerID:      peer.ServerID,
			ConfigName:    peer.ConfigName,
			PublicKey:     peer.PublicKey,
			PeerName:      peer.Name,
			BytesReceived: bytesReceived,
			BytesSent:     bytesSent,
			BytesTotal:    bytesTotal,
			DeltaReceived: deltaReceived,
			DeltaSent:     deltaSent,
			DeltaTotal:    deltaTotal,
			RecordedAt:    today,
		}
		
		// Сохраняем (или обновляем если уже есть за сегодня)
		if err := w.db.Where("server_id = ? AND config_name = ? AND public_key = ? AND recorded_at = ?",
			peer.ServerID, peer.ConfigName, peer.PublicKey, today).
			Assign(snapshot).
			FirstOrCreate(&snapshot).Error; err != nil {
			log.Printf("[TrafficHistoryWorker] Error saving snapshot for peer %s: %v", peer.Name, err)
			continue
		}
		
		saved++
	}
	
	log.Printf("[TrafficHistoryWorker] Saved %d snapshots", saved)
}

// SaveHourlySnapshot сохраняет почасовой снимок трафика всех пиров
func (w *TrafficHistoryWorker) SaveHourlySnapshot() {
	log.Println("[TrafficHistoryWorker] Saving hourly traffic snapshot...")
	
	// Получаем текущее время (начало часа UTC)
	now := time.Now().UTC()
	currentHour := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), 0, 0, 0, time.UTC)
	
	// Получаем все пиры из кэша
	var peers []models.WGPeerCache
	if err := w.db.Find(&peers).Error; err != nil {
		log.Printf("[TrafficHistoryWorker] Error loading peers: %v", err)
		return
	}
	
	log.Printf("[TrafficHistoryWorker] Processing %d peers for hourly snapshot...", len(peers))
	
	saved := 0
	for _, peer := range peers {
		// Конвертируем GB в байты
		bytesReceived := uint64(peer.TotalReceive * 1024 * 1024 * 1024)
		bytesSent := uint64(peer.TotalSent * 1024 * 1024 * 1024)
		bytesTotal := bytesReceived + bytesSent
		
		// Получаем предыдущий почасовой снимок для расчета дельты
		var prevSnapshot models.PeerTrafficHourly
		err := w.db.Where("server_id = ? AND config_name = ? AND public_key = ?", 
			peer.ServerID, peer.ConfigName, peer.PublicKey).
			Order("recorded_at DESC").
			First(&prevSnapshot).Error
		
		var deltaReceived, deltaSent, deltaTotal uint64
		if err == nil {
			// Есть предыдущий снимок - считаем дельту
			if bytesReceived >= prevSnapshot.BytesReceived {
				deltaReceived = bytesReceived - prevSnapshot.BytesReceived
			}
			if bytesSent >= prevSnapshot.BytesSent {
				deltaSent = bytesSent - prevSnapshot.BytesSent
			}
			deltaTotal = deltaReceived + deltaSent
		} else {
			// Первый снимок - вся статистика это дельта
			deltaReceived = bytesReceived
			deltaSent = bytesSent
			deltaTotal = bytesTotal
		}
		
		// Создаем новый почасовой снимок
		snapshot := models.PeerTrafficHourly{
			ServerID:      peer.ServerID,
			ConfigName:    peer.ConfigName,
			PublicKey:     peer.PublicKey,
			PeerName:      peer.Name,
			BytesReceived: bytesReceived,
			BytesSent:     bytesSent,
			BytesTotal:    bytesTotal,
			DeltaReceived: deltaReceived,
			DeltaSent:     deltaSent,
			DeltaTotal:    deltaTotal,
			RecordedAt:    currentHour,
		}
		
		// Сохраняем (или обновляем если уже есть за этот час)
		if err := w.db.Where("server_id = ? AND config_name = ? AND public_key = ? AND recorded_at = ?",
			peer.ServerID, peer.ConfigName, peer.PublicKey, currentHour).
			Assign(snapshot).
			FirstOrCreate(&snapshot).Error; err != nil {
			log.Printf("[TrafficHistoryWorker] Error saving hourly snapshot for peer %s: %v", peer.Name, err)
			continue
		}
		
		saved++
	}
	
	log.Printf("[TrafficHistoryWorker] Saved %d hourly snapshots", saved)
}

// BackfillHourlySnapshots заполняет пропущенные часы (ретроспективно)
func (w *TrafficHistoryWorker) BackfillHourlySnapshots(hours int) {
	log.Printf("[TrafficHistoryWorker] Backfilling hourly snapshots for last %d hours...", hours)
	
	now := time.Now().UTC()
	currentHour := time.Date(now.Year(), now.Month(), now.Day(), now.Hour(), 0, 0, 0, time.UTC)
	
	// Получаем все пиры из кэша
	var peers []models.WGPeerCache
	if err := w.db.Find(&peers).Error; err != nil {
		log.Printf("[TrafficHistoryWorker] Error loading peers: %v", err)
		return
	}
	
	log.Printf("[TrafficHistoryWorker] Backfilling for %d peers...", len(peers))
	
	totalSaved := 0
	
	// Для каждого пира
	for _, peer := range peers {
		// Проверяем какие часы уже есть в БД
		var existingHours []time.Time
		if err := w.db.Model(&models.PeerTrafficHourly{}).
			Where("server_id = ? AND config_name = ? AND public_key = ? AND recorded_at >= ?",
				peer.ServerID, peer.ConfigName, peer.PublicKey, currentHour.Add(-time.Duration(hours)*time.Hour)).
			Pluck("recorded_at", &existingHours).Error; err != nil {
			log.Printf("[TrafficHistoryWorker] Error checking existing hours for peer %s: %v", peer.Name, err)
			continue
		}
		
		// Если уже есть все часы - пропускаем
		if len(existingHours) >= hours {
			continue
		}
		
		// Создаем map для быстрой проверки
		existingMap := make(map[int64]bool)
		for _, t := range existingHours {
			existingMap[t.Unix()] = true
		}
		
		// Текущие значения трафика
		bytesReceived := uint64(peer.TotalReceive * 1024 * 1024 * 1024)
		bytesSent := uint64(peer.TotalSent * 1024 * 1024 * 1024)
		bytesTotal := bytesReceived + bytesSent
		
		// Распределяем трафик равномерно по часам (для визуализации)
		avgDeltaReceived := bytesReceived / uint64(hours)
		avgDeltaSent := bytesSent / uint64(hours)
		avgDeltaTotal := bytesTotal / uint64(hours)
		
		// Заполняем пропущенные часы (от старого к новому)
		for i := hours - 1; i >= 0; i-- {
			hourTime := currentHour.Add(-time.Duration(i) * time.Hour)
			
			// Пропускаем если уже есть
			if existingMap[hourTime.Unix()] {
				continue
			}
			
			// Рассчитываем кумулятивные значения для этого часа
			// (линейная интерполяция от 0 до текущего значения)
			progress := float64(hours-i) / float64(hours)
			cumulativeReceived := uint64(float64(bytesReceived) * progress)
			cumulativeSent := uint64(float64(bytesSent) * progress)
			cumulativeTotal := cumulativeReceived + cumulativeSent
			
			snapshot := models.PeerTrafficHourly{
				ServerID:      peer.ServerID,
				ConfigName:    peer.ConfigName,
				PublicKey:     peer.PublicKey,
				PeerName:      peer.Name,
				BytesReceived: cumulativeReceived,
				BytesSent:     cumulativeSent,
				BytesTotal:    cumulativeTotal,
				DeltaReceived: avgDeltaReceived,
				DeltaSent:     avgDeltaSent,
				DeltaTotal:    avgDeltaTotal,
				RecordedAt:    hourTime,
			}
			
			if err := w.db.Create(&snapshot).Error; err != nil {
				log.Printf("[TrafficHistoryWorker] Error backfilling hour %s for peer %s: %v", 
					hourTime.Format("2006-01-02 15:04"), peer.Name, err)
				continue
			}
			
			totalSaved++
		}
	}
	
	log.Printf("[TrafficHistoryWorker] Backfilled %d hourly snapshots", totalSaved)
}


