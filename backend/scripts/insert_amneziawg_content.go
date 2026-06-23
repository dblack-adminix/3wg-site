package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Database connection
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "")
	dbName := getEnv("DB_NAME", "vpn_service")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	fmt.Println("Connected to database")

	// Prepare content
	content := map[string]interface{}{
		"hero": map[string]string{
			"badge":            "STEALTH_PROTOCOL",
			"title":            "Amnezia",
			"titleHighlight":   "WG",
			"subtitle":         "Невидимый щит",
			"subtitleHighlight": "3WG.RU",
			"description":      "Протокол, который невозможно заблокировать",
		},
		"problem": map[string]string{
			"badge":       "ПРОБЛЕМА",
			"title":       "Почему стандартные VPN больше не работают?",
			"description": "Обычные протоколы (WireGuard, OpenVPN) имеют характерный \"цифровой почерк\". Современные системы анализа трафика (DPI) легко распознают их и блокируют за миллисекунды.",
			"solution":    "AmneziaWG — это эволюция WireGuard, созданная для того, чтобы ваш трафик выглядел как обычный шум или безобидный веб-серфинг.",
		},
		"howItWorks": map[string]interface{}{
			"badge":       "amzwg.ru",
			"title":       "Как это работает в 3WG?",
			"description": "Технология AmneziaWG модифицирует заголовки пакетов WireGuard, лишая их узнаваемых признаков. В нашей инфраструктуре мы довели эту технологию до абсолюта.",
			"features": []map[string]string{
				{
					"title":       "Маскировка параметров",
					"subtitle":    "Junk Data",
					"description": "Мы добавляем случайные байты в начало пакетов (Init Packet). Для цензора это выглядит как хаотичный набор данных, который невозможно классифицировать.",
				},
				{
					"title":       "Изменение размеров",
					"subtitle":    "Packet Resizing",
					"description": "Стандартные пакеты VPN имеют фиксированный размер. AmneziaWG динамически меняет их длину, имитируя передачу обычного HTTPS-трафика.",
				},
				{
					"title":       "Бесшумное рукопожатие",
					"subtitle":    "Silent Handshake",
					"description": "Процесс \"рукопожатия\" происходит бесшумно и не вызывает подозрений у систем мониторинга провайдера.",
				},
			},
		},
		"nodeAdvantages": map[string]interface{}{
			"title":          "Преимущества для пользователя",
			"titleHighlight": "NODE-1",
			"description":    "Использование AmneziaWG на нашем роутере 3WG NODE-1",
			"advantages": []map[string]string{
				{
					"title":       "Работа в \"белых списках\"",
					"description": "Даже если в вашей сети разрешен только ограниченный список сайтов, AmneziaWG найдет лазейку.",
				},
				{
					"title":       "Минимальный пинг",
					"description": "В отличие от тяжелых протоколов маскировки, AmneziaWG работает на уровне ядра (Kernel-space), сохраняя скорость.",
				},
				{
					"title":       "Автоматизация",
					"description": "Вам не нужно знать порты и ключи. Прошивка сама выбирает оптимальные параметры маскировки.",
				},
			},
		},
		"comparison": map[string]interface{}{
			"title": "Сравнение протоколов",
			"rows": []map[string]string{
				{"feature": "Скорость", "wireguard": "До 1 Гбит/с", "amnezia": "До 800 Мбит/с"},
				{"feature": "Маскировка", "wireguard": "Базовая", "amnezia": "Ультра (Anti-DPI)"},
				{"feature": "Назначение", "wireguard": "Игры, 4K, Стриминг", "amnezia": "Обход жестких блокировок"},
				{"feature": "Расход батареи", "wireguard": "Минимальный", "amnezia": "Минимальный"},
			},
		},
		"cta": map[string]string{
			"title":             "Попробуйте AmneziaWG в действии",
			"subtitle":          "с роутером",
			"subtitleHighlight": "NODE-1",
			"button1Text":       "Купить Hardware",
			"button2Text":       "Смотреть тарифы",
		},
	}

	// Convert to JSON
	jsonData, err := json.Marshal(content)
	if err != nil {
		log.Fatal("Failed to marshal JSON:", err)
	}

	// Insert into database
	query := `
		INSERT INTO site_settings (key, value, updated_at) 
		VALUES ($1, $2, $3)
		ON CONFLICT (key) 
		DO UPDATE SET 
			value = EXCLUDED.value,
			updated_at = EXCLUDED.updated_at
	`

	_, err = db.Exec(query, "block_content_amneziawg_page", string(jsonData), time.Now())
	if err != nil {
		log.Fatal("Failed to insert AmneziaWG content:", err)
	}

	fmt.Println("AmneziaWG content inserted successfully!")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
