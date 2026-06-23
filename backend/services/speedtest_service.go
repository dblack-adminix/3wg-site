package services

import (
	"crypto/rand"
	"fmt"
	"math"
	"sort"

	"github.com/3wg/vpn-backend/models"
	"gorm.io/gorm"
)

// SpeedTestService предоставляет функции для тестирования скорости VPN
type SpeedTestService struct {
	db *gorm.DB
}

// NewSpeedTestService создает новый сервис тестирования скорости
func NewSpeedTestService(db *gorm.DB) *SpeedTestService {
	return &SpeedTestService{
		db: db,
	}
}

// LatencyStats содержит статистику задержки
type LatencyStats struct {
	Average float64 `json:"average"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`
}

// MeasureDownloadSpeed измеряет скорость загрузки для указанного сервера
func (s *SpeedTestService) MeasureDownloadSpeed(serverID uint) (float64, error) {
	// Симуляция теста скорости загрузки
	// В реальной реализации здесь будет HTTP запрос к серверу
	
	// Генерируем случайную скорость от 10 до 100 Mbps
	randomBytes := make([]byte, 4)
	rand.Read(randomBytes)
	
	// Преобразуем в число от 10 до 100
	speed := 10.0 + float64(randomBytes[0]%90) + float64(randomBytes[1]%100)/100.0
	
	return math.Round(speed*100)/100, nil
}

// MeasureUploadSpeed измеряет скорость отдачи для указанного сервера
func (s *SpeedTestService) MeasureUploadSpeed(serverID uint) (float64, error) {
	// Симуляция теста скорости отдачи
	// В реальной реализации здесь будет HTTP запрос к серверу
	
	// Генерируем случайную скорость от 5 до 50 Mbps (обычно меньше загрузки)
	randomBytes := make([]byte, 4)
	rand.Read(randomBytes)
	
	// Преобразуем в число от 5 до 50
	speed := 5.0 + float64(randomBytes[0]%45) + float64(randomBytes[1]%100)/100.0
	
	return math.Round(speed*100)/100, nil
}

// MeasureLatency измеряет задержку для указанного сервера
func (s *SpeedTestService) MeasureLatency(serverID uint) (*LatencyStats, error) {
	// Симуляция теста задержки
	// В реальной реализации здесь будет ping к серверу
	
	// Генерируем 10 случайных значений пинга
	pings := make([]float64, 10)
	randomBytes := make([]byte, 40) // 4 байта на каждый пинг
	rand.Read(randomBytes)
	
	for i := 0; i < 10; i++ {
		// Генерируем пинг от 20 до 200 мс
		ping := 20.0 + float64(randomBytes[i*4]%180)
		pings[i] = ping
	}
	
	// Сортируем для нахождения min/max
	sort.Float64s(pings)
	
	// Вычисляем среднее
	var sum float64
	for _, ping := range pings {
		sum += ping
	}
	average := sum / float64(len(pings))
	
	return &LatencyStats{
		Average: math.Round(average),
		Min:     pings[0],
		Max:     pings[len(pings)-1],
	}, nil
}

// ValidateTestResult валидирует результат теста
func (s *SpeedTestService) ValidateTestResult(result *models.SpeedTestResult) error {
	if result.ServerID == 0 {
		return fmt.Errorf("server_id обязателен")
	}
	
	if result.DownloadSpeed < 0 {
		return fmt.Errorf("download_speed не может быть отрицательной")
	}
	
	if result.UploadSpeed < 0 {
		return fmt.Errorf("upload_speed не может быть отрицательной")
	}
	
	if result.LatencyAvg < 0 {
		return fmt.Errorf("latency_avg не может быть отрицательной")
	}
	
	if result.LatencyMin < 0 {
		return fmt.Errorf("latency_min не может быть отрицательной")
	}
	
	if result.LatencyMax < 0 {
		return fmt.Errorf("latency_max не может быть отрицательной")
	}
	
	return nil
}

// SaveTestResult сохраняет результат теста в базу данных
func (s *SpeedTestService) SaveTestResult(result *models.SpeedTestResult) error {
	return s.db.Create(result).Error
}

// GetUserHistory возвращает историю тестов пользователя
func (s *SpeedTestService) GetUserHistory(userID uint, limit int) ([]models.SpeedTestResult, error) {
	var results []models.SpeedTestResult
	
	err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Preload("Server").
		Find(&results).Error
	
	return results, err
}

// ServerComparisonData содержит данные для сравнения серверов
type ServerComparisonData struct {
	ServerID        uint    `json:"server_id"`
	ServerName      string  `json:"server_name"`
	AvgDownload     float64 `json:"avg_download"`
	AvgUpload       float64 `json:"avg_upload"`
	AvgLatency      float64 `json:"avg_latency"`
	TestCount       int     `json:"test_count"`
}

// GetServerComparison возвращает сравнение серверов для пользователя
func (s *SpeedTestService) GetServerComparison(userID uint) ([]ServerComparisonData, error) {
	var results []ServerComparisonData
	
	err := s.db.Table("speed_test_results").
		Select(`
			server_id,
			servers.name as server_name,
			AVG(download_speed) as avg_download,
			AVG(upload_speed) as avg_upload,
			AVG(latency_avg) as avg_latency,
			COUNT(*) as test_count
		`).
		Joins("LEFT JOIN servers ON servers.id = speed_test_results.server_id").
		Where("speed_test_results.user_id = ?", userID).
		Group("server_id, servers.name").
		Order("avg_download DESC").
		Find(&results).Error
	
	return results, err
}