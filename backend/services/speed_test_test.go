package services

import (
	"testing"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// setupTestDB создает тестовую базу данных в памяти
func setupTestDB(t *testing.T) *gorm.DB {
	// Используем мок базу данных для тестов без CGO
	// В реальных тестах можно использовать PostgreSQL
	return nil // Временно возвращаем nil
}

// createTestUser создает тестового пользователя
func createTestUser(t *testing.T, db *gorm.DB) *models.User {
	user := &models.User{
		Email:        "test@example.com",
		PasswordHash: "hashedpassword",
		Tariff:       "free",
		Balance:      100.0,
	}
	if err := db.Create(user).Error; err != nil {
		t.Fatalf("Failed to create test user: %v", err)
	}
	return user
}

// createTestServer создает тестовый сервер
func createTestServer(t *testing.T, db *gorm.DB) *models.Server {
	server := &models.Server{
		Name:      "Test Server",
		Location:  "US",
		Country:   "United States",
		IPAddress: "192.168.1.1",
		Status:    "active",
	}
	if err := db.Create(server).Error; err != nil {
		t.Fatalf("Failed to create test server: %v", err)
	}
	return server
}

func TestNewSpeedTestService(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)

	assert.NotNil(t, service)
	assert.NotNil(t, service.db)
}

func TestMeasureDownloadSpeed(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	t.Run("successful measurement", func(t *testing.T) {
		speed, err := service.MeasureDownloadSpeed(user.ID, server.ID, 1024*1024) // 1MB
		assert.NoError(t, err)
		assert.GreaterOrEqual(t, speed, 0.0)
		// Проверяем, что скорость округлена до 2 знаков
		assert.Equal(t, speed, float64(int(speed*100))/100)
	})

	t.Run("user not found", func(t *testing.T) {
		_, err := service.MeasureDownloadSpeed(9999, server.ID, 1024*1024)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user not found")
	})

	t.Run("server not found", func(t *testing.T) {
		_, err := service.MeasureDownloadSpeed(user.ID, 9999, 1024*1024)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "server not found")
	})

	t.Run("different data sizes", func(t *testing.T) {
		sizes := []int64{1024, 10240, 102400} // 1KB, 10KB, 100KB
		for _, size := range sizes {
			speed, err := service.MeasureDownloadSpeed(user.ID, server.ID, size)
			assert.NoError(t, err)
			assert.GreaterOrEqual(t, speed, 0.0)
		}
	})
}

func TestMeasureUploadSpeed(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	t.Run("successful measurement", func(t *testing.T) {
		speed, err := service.MeasureUploadSpeed(user.ID, server.ID, 1024*1024) // 1MB
		assert.NoError(t, err)
		assert.GreaterOrEqual(t, speed, 0.0)
		// Проверяем, что скорость округлена до 2 знаков
		assert.Equal(t, speed, float64(int(speed*100))/100)
	})

	t.Run("user not found", func(t *testing.T) {
		_, err := service.MeasureUploadSpeed(9999, server.ID, 1024*1024)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user not found")
	})

	t.Run("server not found", func(t *testing.T) {
		_, err := service.MeasureUploadSpeed(user.ID, 9999, 1024*1024)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "server not found")
	})
}

func TestMeasureLatency(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	server := createTestServer(t, db)

	t.Run("successful measurement with 5 pings", func(t *testing.T) {
		stats, err := service.MeasureLatency(server.ID, 5)
		assert.NoError(t, err)
		assert.NotNil(t, stats)
		assert.GreaterOrEqual(t, stats.Average, 0.0)
		assert.GreaterOrEqual(t, stats.Min, 0.0)
		assert.GreaterOrEqual(t, stats.Max, 0.0)
		assert.GreaterOrEqual(t, stats.Jitter, 0.0)
		// Проверяем логическую корректность
		assert.LessOrEqual(t, stats.Min, stats.Average)
		assert.GreaterOrEqual(t, stats.Max, stats.Average)
	})

	t.Run("successful measurement with 10 pings", func(t *testing.T) {
		stats, err := service.MeasureLatency(server.ID, 10)
		assert.NoError(t, err)
		assert.NotNil(t, stats)
	})

	t.Run("ping count less than 5", func(t *testing.T) {
		_, err := service.MeasureLatency(server.ID, 3)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "ping count must be at least 5")
	})

	t.Run("server not found", func(t *testing.T) {
		_, err := service.MeasureLatency(9999, 5)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "server not found")
	})
}

func TestValidateTestResult(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)

	t.Run("valid result", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			Jitter:          3.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.NoError(t, err)
	})

	t.Run("nil result", func(t *testing.T) {
		err := service.ValidateTestResult(nil)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "result is nil")
	})

	t.Run("missing user_id", func(t *testing.T) {
		result := &models.SpeedTestResult{
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "user_id is required")
	})

	t.Run("missing server_id", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "server_id is required")
	})

	t.Run("negative download speed", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   -10.0,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "download_speed must be non-negative")
	})

	t.Run("negative upload speed", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     -10.0,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "upload_speed must be non-negative")
	})

	t.Run("invalid latency values", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      30.0, // Min > Avg
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "latency_min")
	})

	t.Run("zero test duration", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    0,
			DataTransferred: 10485760,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "test_duration must be positive")
	})

	t.Run("zero data transferred", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          1,
			ServerID:        1,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 0,
		}
		err := service.ValidateTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "data_transferred must be positive")
	})
}

func TestSaveTestResult(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	t.Run("successful save", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server.ID,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			Jitter:          3.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.SaveTestResult(result)
		assert.NoError(t, err)
		assert.NotZero(t, result.ID)
		assert.False(t, result.CreatedAt.IsZero())
	})

	t.Run("save with timestamp", func(t *testing.T) {
		now := time.Now()
		result := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server.ID,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			Jitter:          3.2,
			TestDuration:    15,
			DataTransferred: 10485760,
			CreatedAt:       now,
		}
		err := service.SaveTestResult(result)
		assert.NoError(t, err)
		assert.Equal(t, now.Unix(), result.CreatedAt.Unix())
	})

	t.Run("save invalid result", func(t *testing.T) {
		result := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server.ID,
			DownloadSpeed:   -10.0, // Invalid
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		err := service.SaveTestResult(result)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "validation failed")
	})
}

func TestGetUserHistory(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	// Создаем несколько тестовых результатов
	for i := 0; i < 5; i++ {
		result := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server.ID,
			DownloadSpeed:   float64(90 + i),
			UploadSpeed:     float64(40 + i),
			LatencyAvg:      float64(20 + i),
			LatencyMin:      float64(18 + i),
			LatencyMax:      float64(25 + i),
			Jitter:          3.0,
			TestDuration:    15,
			DataTransferred: 10485760,
			CreatedAt:       time.Now().Add(time.Duration(-i) * time.Hour),
		}
		err := service.SaveTestResult(result)
		assert.NoError(t, err)
	}

	t.Run("get all history", func(t *testing.T) {
		history, err := service.GetUserHistory(user.ID, 0)
		assert.NoError(t, err)
		assert.Len(t, history, 5)
		// Проверяем сортировку (новые первыми)
		for i := 0; i < len(history)-1; i++ {
			assert.True(t, history[i].CreatedAt.After(history[i+1].CreatedAt) ||
				history[i].CreatedAt.Equal(history[i+1].CreatedAt))
		}
	})

	t.Run("get limited history", func(t *testing.T) {
		history, err := service.GetUserHistory(user.ID, 3)
		assert.NoError(t, err)
		assert.Len(t, history, 3)
	})

	t.Run("get history for user with no tests", func(t *testing.T) {
		history, err := service.GetUserHistory(9999, 10)
		assert.NoError(t, err)
		assert.Len(t, history, 0)
	})

	t.Run("history includes server info", func(t *testing.T) {
		history, err := service.GetUserHistory(user.ID, 1)
		assert.NoError(t, err)
		assert.Len(t, history, 1)
		assert.NotNil(t, history[0].Server)
		assert.Equal(t, server.Name, history[0].Server.Name)
	})
}

func TestGetServerComparison(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server1 := createTestServer(t, db)
	server2 := &models.Server{
		Name:      "Test Server 2",
		Location:  "EU",
		Country:   "Germany",
		IPAddress: "192.168.1.2",
		Status:    "active",
	}
	db.Create(server2)

	// Создаем результаты для разных серверов
	for i := 0; i < 3; i++ {
		result1 := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server1.ID,
			DownloadSpeed:   100.0 + float64(i),
			UploadSpeed:     50.0 + float64(i),
			LatencyAvg:      20.0 + float64(i),
			LatencyMin:      18.0,
			LatencyMax:      25.0,
			Jitter:          3.0,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		service.SaveTestResult(result1)

		result2 := &models.SpeedTestResult{
			UserID:          user.ID,
			ServerID:        server2.ID,
			DownloadSpeed:   80.0 + float64(i),
			UploadSpeed:     40.0 + float64(i),
			LatencyAvg:      30.0 + float64(i),
			LatencyMin:      28.0,
			LatencyMax:      35.0,
			Jitter:          4.0,
			TestDuration:    15,
			DataTransferred: 10485760,
		}
		service.SaveTestResult(result2)
	}

	t.Run("get comparison", func(t *testing.T) {
		comparison, err := service.GetServerComparison(user.ID)
		assert.NoError(t, err)
		assert.Len(t, comparison, 2)

		// Проверяем, что результаты отсортированы по скорости загрузки
		assert.Greater(t, comparison[0].AvgDownload, comparison[1].AvgDownload)

		// Проверяем количество тестов
		assert.Equal(t, 3, comparison[0].TestCount)
		assert.Equal(t, 3, comparison[1].TestCount)

		// Проверяем, что средние значения корректны
		for _, comp := range comparison {
			assert.Greater(t, comp.AvgDownload, 0.0)
			assert.Greater(t, comp.AvgUpload, 0.0)
			assert.Greater(t, comp.AvgLatency, 0.0)
			assert.NotEmpty(t, comp.ServerName)
			assert.NotEmpty(t, comp.ServerLocation)
		}
	})

	t.Run("comparison for user with no tests", func(t *testing.T) {
		comparison, err := service.GetServerComparison(9999)
		assert.NoError(t, err)
		assert.Len(t, comparison, 0)
	})
}

func TestHelperFunctions(t *testing.T) {
	t.Run("generateTestData", func(t *testing.T) {
		data := generateTestData(1024)
		assert.Len(t, data, 1024)
	})

	t.Run("calculateChecksum", func(t *testing.T) {
		data := []byte{1, 2, 3, 4, 5}
		checksum := calculateChecksum(data)
		assert.Equal(t, uint64(15), checksum)
	})

	t.Run("filterOutliers", func(t *testing.T) {
		values := []float64{10, 11, 12, 13, 14, 100} // 100 is outlier
		filtered := filterOutliers(values)
		assert.Less(t, len(filtered), len(values))
	})

	t.Run("filterOutliers with few values", func(t *testing.T) {
		values := []float64{10, 11}
		filtered := filterOutliers(values)
		assert.Equal(t, values, filtered)
	})

	t.Run("calculateLatencyStats", func(t *testing.T) {
		latencies := []float64{20.0, 22.0, 25.0, 23.0, 21.0}
		stats := calculateLatencyStats(latencies)
		assert.NotNil(t, stats)
		assert.Greater(t, stats.Average, 0.0)
		assert.Equal(t, 20.0, stats.Min)
		assert.Equal(t, 25.0, stats.Max)
		assert.GreaterOrEqual(t, stats.Jitter, 0.0)
	})

	t.Run("calculateLatencyStats with empty slice", func(t *testing.T) {
		stats := calculateLatencyStats([]float64{})
		assert.NotNil(t, stats)
		assert.Equal(t, 0.0, stats.Average)
	})
}
