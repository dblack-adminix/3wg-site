package services

import (
	"testing"

	"github.com/3wg/vpn-backend/models"
	"github.com/leanovate/gopter"
	"github.com/leanovate/gopter/gen"
	"github.com/leanovate/gopter/prop"
)

// **Property 1: Download speed measurement validity**
// **Validates: Requirements 1.1, 1.4**
func TestProperty_DownloadSpeedMeasurementValidity(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	properties := gopter.NewProperties(nil)

	properties.Property("download speed measurement should be valid", prop.ForAll(
		func(dataSize int64) bool {
			// Ограничиваем размер данных разумными пределами (1KB - 100MB)
			if dataSize < 1024 || dataSize > 100*1024*1024 {
				return true // Skip invalid sizes
			}

			speed, err := service.MeasureDownloadSpeed(user.ID, server.ID, dataSize)
			
			// Проверяем, что нет ошибки
			if err != nil {
				t.Logf("Unexpected error for dataSize %d: %v", dataSize, err)
				return false
			}

			// Проверяем, что скорость неотрицательная
			if speed < 0 {
				t.Logf("Speed should be non-negative, got %.2f for dataSize %d", speed, dataSize)
				return false
			}

			// Проверяем, что скорость округлена до 2 знаков после запятой
			rounded := float64(int(speed*100)) / 100
			if speed != rounded {
				t.Logf("Speed should be rounded to 2 decimal places, got %.6f, expected %.2f", speed, rounded)
				return false
			}

			// Проверяем разумность скорости (не должна быть слишком большой)
			// Максимальная теоретическая скорость ~10 Gbps = 10000 Mbps
			if speed > 10000 {
				t.Logf("Speed seems unrealistic: %.2f Mbps for dataSize %d", speed, dataSize)
				return false
			}

			return true
		},
		gen.Int64Range(1024, 100*1024*1024), // 1KB to 100MB
	))

	properties.TestingRun(t)
}

// **Property 2: Upload speed measurement validity**
// **Validates: Requirements 1.2, 1.4**
func TestProperty_UploadSpeedMeasurementValidity(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	properties := gopter.NewProperties(nil)

	properties.Property("upload speed measurement should be valid", prop.ForAll(
		func(dataSize int64) bool {
			// Ограничиваем размер данных разумными пределами (1KB - 100MB)
			if dataSize < 1024 || dataSize > 100*1024*1024 {
				return true // Skip invalid sizes
			}

			speed, err := service.MeasureUploadSpeed(user.ID, server.ID, dataSize)
			
			// Проверяем, что нет ошибки
			if err != nil {
				t.Logf("Unexpected error for dataSize %d: %v", dataSize, err)
				return false
			}

			// Проверяем, что скорость неотрицательная
			if speed < 0 {
				t.Logf("Speed should be non-negative, got %.2f for dataSize %d", speed, dataSize)
				return false
			}

			// Проверяем, что скорость округлена до 2 знаков после запятой
			rounded := float64(int(speed*100)) / 100
			if speed != rounded {
				t.Logf("Speed should be rounded to 2 decimal places, got %.6f, expected %.2f", speed, rounded)
				return false
			}

			// Проверяем разумность скорости (не должна быть слишком большой)
			if speed > 10000 {
				t.Logf("Speed seems unrealistic: %.2f Mbps for dataSize %d", speed, dataSize)
				return false
			}

			return true
		},
		gen.Int64Range(1024, 100*1024*1024), // 1KB to 100MB
	))

	properties.TestingRun(t)
}

// **Property 9: Latency statistics calculation**
// **Validates: Requirements 2.2**
func TestProperty_LatencyStatisticsCalculation(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	server := createTestServer(t, db)

	properties := gopter.NewProperties(nil)

	properties.Property("latency statistics should be calculated correctly", prop.ForAll(
		func(pingCount int) bool {
			// Ограничиваем количество пингов разумными пределами (5-50)
			if pingCount < 5 || pingCount > 50 {
				return true // Skip invalid ping counts
			}

			stats, err := service.MeasureLatency(server.ID, pingCount)
			
			// Проверяем, что нет ошибки
			if err != nil {
				t.Logf("Unexpected error for pingCount %d: %v", pingCount, err)
				return false
			}

			// Проверяем, что статистика не nil
			if stats == nil {
				t.Logf("Stats should not be nil for pingCount %d", pingCount)
				return false
			}

			// Проверяем, что все значения неотрицательные
			if stats.Average < 0 || stats.Min < 0 || stats.Max < 0 || stats.Jitter < 0 {
				t.Logf("All latency values should be non-negative: avg=%.2f, min=%.2f, max=%.2f, jitter=%.2f", 
					stats.Average, stats.Min, stats.Max, stats.Jitter)
				return false
			}

			// Проверяем логическую корректность: min <= avg <= max
			if stats.Min > stats.Average {
				t.Logf("Min latency (%.2f) should not be greater than average (%.2f)", stats.Min, stats.Average)
				return false
			}

			if stats.Max < stats.Average {
				t.Logf("Max latency (%.2f) should not be less than average (%.2f)", stats.Max, stats.Average)
				return false
			}

			// Проверяем, что значения округлены до 2 знаков после запятой
			if stats.Average != float64(int(stats.Average*100))/100 {
				t.Logf("Average should be rounded to 2 decimal places: %.6f", stats.Average)
				return false
			}

			// Проверяем разумность значений (задержка не должна быть слишком большой)
			if stats.Average > 5000 { // 5 секунд
				t.Logf("Average latency seems unrealistic: %.2f ms", stats.Average)
				return false
			}

			return true
		},
		gen.IntRange(5, 50), // 5 to 50 pings
	))

	properties.TestingRun(t)
}

// **Property 4: Test result persistence round-trip**
// **Validates: Requirements 3.1, 3.3, 10.3**
func TestProperty_TestResultPersistenceRoundTrip(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)
	user := createTestUser(t, db)
	server := createTestServer(t, db)

	properties := gopter.NewProperties(nil)

	properties.Property("test result should persist and retrieve correctly", prop.ForAll(
		func(downloadSpeed, uploadSpeed, latencyAvg, latencyMin, latencyMax, jitter float64, testDuration int, dataTransferred int64) bool {
			// Создаем валидные значения
			if downloadSpeed < 0 || uploadSpeed < 0 || latencyAvg < 0 || latencyMin < 0 || latencyMax < 0 || jitter < 0 {
				return true // Skip invalid values
			}
			if testDuration <= 0 || dataTransferred <= 0 {
				return true // Skip invalid values
			}
			if latencyMin > latencyAvg || latencyMax < latencyAvg {
				return true // Skip logically invalid latency values
			}

			// Округляем значения до 2 знаков после запятой
			downloadSpeed = float64(int(downloadSpeed*100)) / 100
			uploadSpeed = float64(int(uploadSpeed*100)) / 100
			latencyAvg = float64(int(latencyAvg*100)) / 100
			latencyMin = float64(int(latencyMin*100)) / 100
			latencyMax = float64(int(latencyMax*100)) / 100
			jitter = float64(int(jitter*100)) / 100

			// Создаем результат теста
			original := &models.SpeedTestResult{
				UserID:          user.ID,
				ServerID:        server.ID,
				DownloadSpeed:   downloadSpeed,
				UploadSpeed:     uploadSpeed,
				LatencyAvg:      latencyAvg,
				LatencyMin:      latencyMin,
				LatencyMax:      latencyMax,
				Jitter:          jitter,
				TestDuration:    testDuration,
				DataTransferred: dataTransferred,
			}

			// Сохраняем результат
			err := service.SaveTestResult(original)
			if err != nil {
				t.Logf("Failed to save test result: %v", err)
				return false
			}

			// Получаем историю пользователя
			history, err := service.GetUserHistory(user.ID, 1)
			if err != nil {
				t.Logf("Failed to get user history: %v", err)
				return false
			}

			if len(history) == 0 {
				t.Logf("History should contain at least one result")
				return false
			}

			// Проверяем, что данные сохранились корректно
			retrieved := history[0]
			if retrieved.UserID != original.UserID ||
				retrieved.ServerID != original.ServerID ||
				retrieved.DownloadSpeed != original.DownloadSpeed ||
				retrieved.UploadSpeed != original.UploadSpeed ||
				retrieved.LatencyAvg != original.LatencyAvg ||
				retrieved.LatencyMin != original.LatencyMin ||
				retrieved.LatencyMax != original.LatencyMax ||
				retrieved.Jitter != original.Jitter ||
				retrieved.TestDuration != original.TestDuration ||
				retrieved.DataTransferred != original.DataTransferred {
				
				t.Logf("Retrieved data doesn't match original")
				return false
			}

			// Проверяем, что timestamp установлен
			if retrieved.CreatedAt.IsZero() {
				t.Logf("CreatedAt should be set")
				return false
			}

			return true
		},
		gen.Float64Range(0, 1000),    // downloadSpeed
		gen.Float64Range(0, 1000),    // uploadSpeed  
		gen.Float64Range(0, 500),     // latencyAvg
		gen.Float64Range(0, 500),     // latencyMin
		gen.Float64Range(0, 500),     // latencyMax
		gen.Float64Range(0, 100),     // jitter
		gen.IntRange(1, 300),         // testDuration (1-300 seconds)
		gen.Int64Range(1024, 1024*1024*1024), // dataTransferred (1KB-1GB)
	))

	properties.TestingRun(t)
}

// **Property 21: Test result validation**
// **Validates: Requirements 10.5**
func TestProperty_TestResultValidation(t *testing.T) {
	db := setupTestDB(t)
	service := NewSpeedTestService(db)

	properties := gopter.NewProperties(nil)

	properties.Property("validation should correctly identify invalid test results", prop.ForAll(
		func(userID, serverID uint, downloadSpeed, uploadSpeed, latencyAvg, latencyMin, latencyMax float64, testDuration int, dataTransferred int64) bool {
			result := &models.SpeedTestResult{
				UserID:          userID,
				ServerID:        serverID,
				DownloadSpeed:   downloadSpeed,
				UploadSpeed:     uploadSpeed,
				LatencyAvg:      latencyAvg,
				LatencyMin:      latencyMin,
				LatencyMax:      latencyMax,
				TestDuration:    testDuration,
				DataTransferred: dataTransferred,
			}

			err := service.ValidateTestResult(result)

			// Определяем, должна ли валидация пройти
			shouldBeValid := userID > 0 && serverID > 0 &&
				downloadSpeed >= 0 && uploadSpeed >= 0 &&
				latencyAvg >= 0 && latencyMin >= 0 && latencyMax >= 0 &&
				latencyMin <= latencyAvg && latencyMax >= latencyAvg &&
				testDuration > 0 && dataTransferred > 0

			if shouldBeValid && err != nil {
				t.Logf("Valid result was rejected: %v", err)
				return false
			}

			if !shouldBeValid && err == nil {
				t.Logf("Invalid result was accepted: %+v", result)
				return false
			}

			return true
		},
		gen.UIntRange(0, 10),         // userID (0 should be invalid)
		gen.UIntRange(0, 10),         // serverID (0 should be invalid)
		gen.Float64Range(-100, 1000), // downloadSpeed (negative should be invalid)
		gen.Float64Range(-100, 1000), // uploadSpeed (negative should be invalid)
		gen.Float64Range(-100, 500),  // latencyAvg (negative should be invalid)
		gen.Float64Range(-100, 500),  // latencyMin (negative should be invalid)
		gen.Float64Range(-100, 500),  // latencyMax (negative should be invalid)
		gen.IntRange(-10, 300),       // testDuration (non-positive should be invalid)
		gen.Int64Range(-1024, 1024*1024*1024), // dataTransferred (non-positive should be invalid)
	))

	properties.TestingRun(t)
}