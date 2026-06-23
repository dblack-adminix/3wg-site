package models

import (
	"fmt"
	"os"
	"testing"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// setupTestDB creates a test database connection
func setupTestDB(t *testing.T) *gorm.DB {
	// Get database connection parameters from environment or use defaults
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "vpn_3wg")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})

	if err != nil {
		t.Skipf("Skipping integration test: cannot connect to database: %v", err)
		return nil
	}

	return db
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func TestSpeedTestResultDatabaseOperations(t *testing.T) {
	db := setupTestDB(t)
	if db == nil {
		return
	}

	// Clean up any existing test data
	db.Exec("DELETE FROM speed_test_results WHERE user_id = 999 OR server_id = 999")

	// Create test user and server (if they don't exist)
	testUser := User{
		ID:           999,
		Email:        "test_speed@example.com",
		PasswordHash: "test",
		IsActive:     true,
	}
	db.FirstOrCreate(&testUser, User{ID: 999})

	testServer := Server{
		ID:        999,
		Name:      "Test Server",
		Location:  "Test Location",
		Country:   "TS",
		IPAddress: "192.168.1.1",
		Status:    "active",
	}
	db.FirstOrCreate(&testServer, Server{ID: 999})

	t.Run("Create and retrieve speed test result", func(t *testing.T) {
		// Create a new speed test result
		result := SpeedTestResult{
			UserID:          999,
			ServerID:        999,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			Jitter:          3.2,
			TestDuration:    25,
			DataTransferred: 10485760,
			CreatedAt:       time.Now(),
		}

		// Save to database
		if err := db.Create(&result).Error; err != nil {
			t.Fatalf("Failed to create speed test result: %v", err)
		}

		// Verify ID was assigned
		if result.ID == 0 {
			t.Error("Expected ID to be assigned after creation")
		}

		// Retrieve from database
		var retrieved SpeedTestResult
		if err := db.First(&retrieved, result.ID).Error; err != nil {
			t.Fatalf("Failed to retrieve speed test result: %v", err)
		}

		// Verify all fields match
		if retrieved.UserID != result.UserID {
			t.Errorf("Expected UserID %d, got %d", result.UserID, retrieved.UserID)
		}
		if retrieved.ServerID != result.ServerID {
			t.Errorf("Expected ServerID %d, got %d", result.ServerID, retrieved.ServerID)
		}
		if retrieved.DownloadSpeed != result.DownloadSpeed {
			t.Errorf("Expected DownloadSpeed %f, got %f", result.DownloadSpeed, retrieved.DownloadSpeed)
		}
		if retrieved.UploadSpeed != result.UploadSpeed {
			t.Errorf("Expected UploadSpeed %f, got %f", result.UploadSpeed, retrieved.UploadSpeed)
		}
		if retrieved.LatencyAvg != result.LatencyAvg {
			t.Errorf("Expected LatencyAvg %f, got %f", result.LatencyAvg, retrieved.LatencyAvg)
		}

		// Clean up
		db.Delete(&result)
	})

	t.Run("Query with indexes", func(t *testing.T) {
		// Create multiple test results
		results := []SpeedTestResult{
			{
				UserID:          999,
				ServerID:        999,
				DownloadSpeed:   100.0,
				UploadSpeed:     50.0,
				LatencyAvg:      20.0,
				LatencyMin:      18.0,
				LatencyMax:      25.0,
				Jitter:          2.0,
				TestDuration:    20,
				DataTransferred: 10485760,
				CreatedAt:       time.Now().Add(-2 * time.Hour),
			},
			{
				UserID:          999,
				ServerID:        999,
				DownloadSpeed:   95.0,
				UploadSpeed:     45.0,
				LatencyAvg:      25.0,
				LatencyMin:      22.0,
				LatencyMax:      30.0,
				Jitter:          3.0,
				TestDuration:    25,
				DataTransferred: 10485760,
				CreatedAt:       time.Now().Add(-1 * time.Hour),
			},
			{
				UserID:          999,
				ServerID:        999,
				DownloadSpeed:   90.0,
				UploadSpeed:     40.0,
				LatencyAvg:      30.0,
				LatencyMin:      25.0,
				LatencyMax:      35.0,
				Jitter:          4.0,
				TestDuration:    30,
				DataTransferred: 10485760,
				CreatedAt:       time.Now(),
			},
		}

		for i := range results {
			if err := db.Create(&results[i]).Error; err != nil {
				t.Fatalf("Failed to create test result: %v", err)
			}
		}

		// Query by user_id with sorting (should use idx_speed_test_user)
		var userResults []SpeedTestResult
		err := db.Where("user_id = ?", 999).
			Order("created_at DESC").
			Find(&userResults).Error

		if err != nil {
			t.Fatalf("Failed to query by user_id: %v", err)
		}

		if len(userResults) != 3 {
			t.Errorf("Expected 3 results, got %d", len(userResults))
		}

		// Verify sorting (newest first)
		if len(userResults) >= 2 {
			if userResults[0].CreatedAt.Before(userResults[1].CreatedAt) {
				t.Error("Results are not sorted by created_at DESC")
			}
		}

		// Query by server_id (should use idx_speed_test_server)
		var serverResults []SpeedTestResult
		err = db.Where("server_id = ?", 999).
			Order("created_at DESC").
			Find(&serverResults).Error

		if err != nil {
			t.Fatalf("Failed to query by server_id: %v", err)
		}

		if len(serverResults) != 3 {
			t.Errorf("Expected 3 results, got %d", len(serverResults))
		}

		// Clean up
		for i := range results {
			db.Delete(&results[i])
		}
	})

	t.Run("Foreign key constraints", func(t *testing.T) {
		// Create a result with valid foreign keys
		result := SpeedTestResult{
			UserID:          999,
			ServerID:        999,
			DownloadSpeed:   95.50,
			UploadSpeed:     45.30,
			LatencyAvg:      25.5,
			LatencyMin:      22.1,
			LatencyMax:      30.2,
			Jitter:          3.2,
			TestDuration:    25,
			DataTransferred: 10485760,
			CreatedAt:       time.Now(),
		}

		if err := db.Create(&result).Error; err != nil {
			t.Fatalf("Failed to create speed test result: %v", err)
		}

		// Verify we can load relations
		var retrieved SpeedTestResult
		err := db.Preload("User").Preload("Server").First(&retrieved, result.ID).Error
		if err != nil {
			t.Fatalf("Failed to load relations: %v", err)
		}

		if retrieved.User.ID != 999 {
			t.Errorf("Expected User.ID 999, got %d", retrieved.User.ID)
		}
		if retrieved.Server.ID != 999 {
			t.Errorf("Expected Server.ID 999, got %d", retrieved.Server.ID)
		}

		// Clean up
		db.Delete(&result)
	})

	// Clean up test data
	db.Exec("DELETE FROM speed_test_results WHERE user_id = 999 OR server_id = 999")
	db.Exec("DELETE FROM users WHERE id = 999")
	db.Exec("DELETE FROM servers WHERE id = 999")
}
