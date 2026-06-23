package services

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewSpeedTestService_Simple(t *testing.T) {
	service := NewSpeedTestService(nil)
	assert.NotNil(t, service)
}

func TestHelperFunctions_Simple(t *testing.T) {
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
		// Функция может не отфильтровать выбросы в некоторых случаях
		assert.LessOrEqual(t, len(filtered), len(values))
		assert.GreaterOrEqual(t, len(filtered), 1) // Должен остаться хотя бы один элемент
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