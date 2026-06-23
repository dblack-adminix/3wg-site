package models

import (
	"testing"
	"time"
)

func TestSpeedTestResultTableName(t *testing.T) {
	result := SpeedTestResult{}
	expected := "speed_test_results"
	
	if result.TableName() != expected {
		t.Errorf("Expected table name %s, got %s", expected, result.TableName())
	}
}

func TestSpeedTestResultCreation(t *testing.T) {
	now := time.Now()
	
	result := SpeedTestResult{
		UserID:          1,
		ServerID:        1,
		DownloadSpeed:   95.50,
		UploadSpeed:     45.30,
		LatencyAvg:      25.5,
		LatencyMin:      22.1,
		LatencyMax:      30.2,
		Jitter:          3.2,
		TestDuration:    25,
		DataTransferred: 10485760,
		CreatedAt:       now,
	}
	
	// Verify all fields are set correctly
	if result.UserID != 1 {
		t.Errorf("Expected UserID 1, got %d", result.UserID)
	}
	if result.ServerID != 1 {
		t.Errorf("Expected ServerID 1, got %d", result.ServerID)
	}
	if result.DownloadSpeed != 95.50 {
		t.Errorf("Expected DownloadSpeed 95.50, got %f", result.DownloadSpeed)
	}
	if result.UploadSpeed != 45.30 {
		t.Errorf("Expected UploadSpeed 45.30, got %f", result.UploadSpeed)
	}
	if result.LatencyAvg != 25.5 {
		t.Errorf("Expected LatencyAvg 25.5, got %f", result.LatencyAvg)
	}
	if result.LatencyMin != 22.1 {
		t.Errorf("Expected LatencyMin 22.1, got %f", result.LatencyMin)
	}
	if result.LatencyMax != 30.2 {
		t.Errorf("Expected LatencyMax 30.2, got %f", result.LatencyMax)
	}
	if result.Jitter != 3.2 {
		t.Errorf("Expected Jitter 3.2, got %f", result.Jitter)
	}
	if result.TestDuration != 25 {
		t.Errorf("Expected TestDuration 25, got %d", result.TestDuration)
	}
	if result.DataTransferred != 10485760 {
		t.Errorf("Expected DataTransferred 10485760, got %d", result.DataTransferred)
	}
	if !result.CreatedAt.Equal(now) {
		t.Errorf("Expected CreatedAt %v, got %v", now, result.CreatedAt)
	}
}
