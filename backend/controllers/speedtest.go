package controllers

import (
	cryptorand "crypto/rand"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/3wg/vpn-backend/models"
	"github.com/3wg/vpn-backend/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type SpeedTestController struct {
	db      *gorm.DB
	service *services.SpeedTestService
}

func NewSpeedTestController(db *gorm.DB) *SpeedTestController {
	return &SpeedTestController{
		db:      db,
		service: services.NewSpeedTestService(db),
	}
}

// StartTest инициирует тест скорости
// POST /api/v1/speed-test/start
func (stc *SpeedTestController) StartTest(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Начинаем тест скорости для пользователя %d", userID)
	
	// Получаем server_id из параметров запроса
	serverIDStr := c.Query("server_id")
	if serverIDStr == "" {
		log.Printf("[SpeedTest] Ошибка: server_id не указан")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "server_id обязателен",
			"suggestion": "Укажите server_id в параметрах запроса",
		})
		return
	}
	
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка парсинга server_id: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат server_id",
			"suggestion": "server_id должен быть числом",
		})
		return
	}
	
	// Проверяем существование сервера
	var server models.Server
	if err := stc.db.First(&server, serverID).Error; err != nil {
		log.Printf("[SpeedTest] Сервер %d не найден: %v", serverID, err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Сервер не найден",
			"suggestion": "Проверьте правильность server_id",
		})
		return
	}
	
	log.Printf("[SpeedTest] Тест скорости инициирован для сервера %s", server.Name)
	c.JSON(http.StatusOK, gin.H{
		"message": "Тест скорости инициирован",
		"server_id": serverID,
		"server_name": server.Name,
		"test_id": time.Now().Unix(), // Простой ID теста
	})
}

// DownloadTest выполняет тест скорости загрузки
// GET /api/v1/speed-test/download
func (stc *SpeedTestController) DownloadTest(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Тест загрузки для пользователя %d", userID)
	
	// Получаем server_id из параметров запроса
	serverIDStr := c.Query("server_id")
	if serverIDStr == "" {
		log.Printf("[SpeedTest] Ошибка: server_id не указан")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "server_id обязателен",
		})
		return
	}
	
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка парсинга server_id: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат server_id",
		})
		return
	}
	
	_ = serverID

	// Размер тестовых данных (МБ), по умолчанию 30, максимум 100
	sizeMB := 30
	if s := c.Query("size_mb"); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v > 0 {
			sizeMB = v
		}
	}
	if sizeMB > 100 {
		sizeMB = 100
	}

	// Отдаём поток случайных данных — браузер измеряет реальную скорость.
	// Случайные байты не сжимаются прокси/браузером, замер честный.
	chunk := make([]byte, 1024*1024)
	cryptorand.Read(chunk)

	c.Header("Content-Type", "application/octet-stream")
	c.Header("Cache-Control", "no-store, no-cache")
	c.Header("Content-Length", strconv.Itoa(sizeMB*1024*1024))
	c.Status(http.StatusOK)

	for i := 0; i < sizeMB; i++ {
		if _, err := c.Writer.Write(chunk); err != nil {
			return // клиент отключился
		}
		c.Writer.Flush()
	}
}

// UploadTest выполняет тест скорости отдачи
// POST /api/v1/speed-test/upload
func (stc *SpeedTestController) UploadTest(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Тест отдачи для пользователя %d", userID)
	
	// Получаем server_id из параметров запроса
	serverIDStr := c.Query("server_id")
	if serverIDStr == "" {
		log.Printf("[SpeedTest] Ошибка: server_id не указан")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "server_id обязателен",
		})
		return
	}
	
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка парсинга server_id: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат server_id",
		})
		return
	}
	
	_ = serverID

	// Принимаем загружаемые данные и считаем объём — время меряет браузер
	received, err := io.Copy(io.Discard, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Ошибка чтения данных"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"received_bytes": received,
	})
}

// PingTest выполняет тест задержки
// GET /api/v1/speed-test/ping
func (stc *SpeedTestController) PingTest(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Тест пинга для пользователя %d", userID)
	
	// Получаем server_id из параметров запроса
	serverIDStr := c.Query("server_id")
	if serverIDStr == "" {
		log.Printf("[SpeedTest] Ошибка: server_id не указан")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "server_id обязателен",
		})
		return
	}
	
	serverID, err := strconv.ParseUint(serverIDStr, 10, 32)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка парсинга server_id: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат server_id",
		})
		return
	}
	
	_ = serverID

	// Лёгкий ответ — RTT измеряет браузер серией таких запросов
	c.Header("Cache-Control", "no-store, no-cache")
	c.JSON(http.StatusOK, gin.H{"pong": true, "ts": time.Now().UnixNano()})
}

// SaveResult сохраняет результат теста
// POST /api/v1/speed-test/result
func (stc *SpeedTestController) SaveResult(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Сохранение результата для пользователя %d", userID)
	
	var result models.SpeedTestResult
	if err := c.ShouldBindJSON(&result); err != nil {
		log.Printf("[SpeedTest] Ошибка парсинга JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат данных",
			"suggestion": "Проверьте структуру JSON",
		})
		return
	}
	
	// Устанавливаем ID пользователя
	result.UserID = userID
	result.CreatedAt = time.Now()
	
	// Устанавливаем значения по умолчанию для обязательных полей
	if result.TestDuration <= 0 {
		result.TestDuration = 10 // 10 секунд по умолчанию
	}
	if result.DataTransferred <= 0 {
		result.DataTransferred = 1024 * 1024 // 1 MB по умолчанию
	}
	
	// Валидируем результат
	if err := stc.service.ValidateTestResult(&result); err != nil {
		log.Printf("[SpeedTest] Ошибка валидации: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверные данные теста",
			"suggestion": err.Error(),
		})
		return
	}
	
	// Сохраняем результат
	if err := stc.service.SaveTestResult(&result); err != nil {
		log.Printf("[SpeedTest] Ошибка сохранения: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка сохранения результата",
			"suggestion": "Попробуйте еще раз",
		})
		return
	}
	
	log.Printf("[SpeedTest] Результат сохранен с ID %d", result.ID)
	c.JSON(http.StatusCreated, gin.H{
		"message": "Результат сохранен",
		"result_id": result.ID,
	})
}

// GetHistory возвращает историю тестов пользователя
// GET /api/v1/speed-test/history
func (stc *SpeedTestController) GetHistory(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Получение истории для пользователя %d", userID)
	
	// Получаем лимит из параметров запроса (по умолчанию 50)
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 || limit > 100 {
		limit = 50
	}
	
	// Получаем историю тестов
	history, err := stc.service.GetUserHistory(userID, limit)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка получения истории: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка получения истории",
			"suggestion": "Попробуйте еще раз",
		})
		return
	}
	
	log.Printf("[SpeedTest] Найдено %d записей в истории", len(history))
	c.JSON(http.StatusOK, gin.H{
		"history": history,
		"count": len(history),
	})
}

// GetComparison возвращает сравнение серверов
// GET /api/v1/speed-test/comparison
func (stc *SpeedTestController) GetComparison(c *gin.Context) {
	userID := c.GetUint("user_id")
	log.Printf("[SpeedTest] Получение сравнения серверов для пользователя %d", userID)
	
	// Получаем сравнение серверов
	comparison, err := stc.service.GetServerComparison(userID)
	if err != nil {
		log.Printf("[SpeedTest] Ошибка получения сравнения: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Ошибка получения сравнения серверов",
			"suggestion": "Попробуйте еще раз",
		})
		return
	}
	
	log.Printf("[SpeedTest] Найдено %d серверов для сравнения", len(comparison))
	c.JSON(http.StatusOK, gin.H{
		"comparison": comparison,
		"count": len(comparison),
	})
}