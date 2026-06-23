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

type FAQItem struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type FAQCategory struct {
	ID    string    `json:"id"`
	Title string    `json:"title"`
	Items []FAQItem `json:"items"`
}

type FAQContent struct {
	Hero struct {
		Badge       string `json:"badge"`
		Title       string `json:"title"`
		Subtitle    string `json:"subtitle"`
		Description string `json:"description"`
	} `json:"hero"`
	Categories []FAQCategory `json:"categories"`
	Footer     struct {
		Text  string `json:"text"`
		Email string `json:"email"`
	} `json:"footer"`
}

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

	// Prepare FAQ content
	content := FAQContent{}
	content.Hero.Badge = "FAQ_DATABASE"
	content.Hero.Title = "Частые"
	content.Hero.Subtitle = "вопросы"
	content.Hero.Description = "Техническая документация для любопытных"

	// Security category
	content.Categories = append(content.Categories, FAQCategory{
		ID:    "security",
		Title: "Безопасность",
		Items: []FAQItem{
			{
				Question: "Чем AmneziaWG отличается от обычного VPN?",
				Answer:   "Обычные VPN используют стандартные протоколы, которые легко распознаются системами Deep Packet Inspection (DPI). \n        \nAmneziaWG — это модифицированный WireGuard, который маскирует VPN-трафик под обычный HTTPS. Для систем фильтрации ваш трафик выглядит как обычный веб-сёрфинг.",
			},
			{
				Question: "Вы храните логи подключений?",
				Answer:   "**Нет.** Это не маркетинг — это архитектура.\n\nНаши серверы настроены так, что технически не могут записывать:\n• IP-адреса пользователей\n• Временные метки подключений\n• Объём переданных данных\n• Посещённые сайты\n\nМы используем RAM-only режим — при перезагрузке сервера все данные стираются.",
			},
		},
	})

	// Protocols category
	content.Categories = append(content.Categories, FAQCategory{
		ID:    "protocols",
		Title: "Протоколы",
		Items: []FAQItem{
			{
				Question: "Какая скорость у WireGuard сервера?",
				Answer:   "WireGuard — самый быстрый VPN-протокол на сегодняшний день. Наши серверы обеспечивают:\n\n• **Скорость:** до 1 Гбит/с (зависит от вашего провайдера)\n• **Пинг:** от 5ms до Европы, от 80ms до США\n• **Шифрование:** ChaCha20-Poly1305 (не замедляет соединение)\n\nИдеально для 4K стриминга, онлайн-игр и видеозвонков без лагов.",
			},
			{
				Question: "Работает ли в Китае, Иране, Туркменистане?",
				Answer:   "Да, но с нюансами. Для стран с агрессивной цензурой мы рекомендуем:\n\n1. **AmneziaWG** — основной протокол с обфускацией\n2. **ShadowSocks** — резервный вариант через CDN\n3. **Cloak** — для экстремальных случаев\n\nМы не гарантируем 100% работу в любой момент времени, но наши инженеры оперативно адаптируют конфигурации.",
			},
		},
	})

	// Billing category
	content.Categories = append(content.Categories, FAQCategory{
		ID:    "billing",
		Title: "Оплата",
		Items: []FAQItem{
			{
				Question: "Какие способы оплаты вы принимаете?",
				Answer:   "Мы принимаем:\n\n• **Банковские карты** — Visa, MasterCard, МИР\n• **Криптовалюты** — BTC, ETH, USDT\n• **СБП** — оплата по QR-коду\n• **Telegram Stars** — для микроплатежей\n\nВсе платежи защищены и анонимны (при оплате крипто).",
			},
			{
				Question: "Что значит \"личный сервер\"?",
				Answer:   "В отличие от массовых VPN-сервисов (NordVPN, ExpressVPN), где тысячи пользователей делят один IP-адрес, в 3WG вы получаете:\n\n• **Выделенный IP** — не в спам-листах, не забанен\n• **Изолированные ресурсы** — никто не влияет на вашу скорость\n• **Полный контроль** — root-доступ по запросу\n• **Приватность** — только вы знаете, что делаете через этот IP\n\nЭто как разница между коммуналкой и личной квартирой.",
			},
		},
	})

	// Hardware category
	content.Categories = append(content.Categories, FAQCategory{
		ID:    "hardware",
		Title: "Hardware",
		Items: []FAQItem{
			{
				Question: "Зачем нужен аппаратный роутер?",
				Answer:   "Аппаратный роутер 3WG NODE-1 решает несколько проблем:\n\n• **Smart TV и консоли** — не поддерживают VPN-приложения\n• **Вся сеть защищена** — не нужно настраивать каждое устройство\n• **Kill Switch** — при обрыве VPN интернет блокируется\n• **Производительность** — аппаратное шифрование не нагружает процессор\n\nPlug & Play — достали из коробки, подключили, работает.",
			},
			{
				Question: "Как управлять роутером?",
				Answer:   "Управление через наш Telegram Mini App:\n\n• **Мониторинг** — скорость, подключенные устройства, статус\n• **Перезагрузка** — удалённая перезагрузка одной кнопкой\n• **Смена локации** — переключение между серверами\n• **Уведомления** — алерты о проблемах и обновлениях\n\nНикакой командной строки — всё через удобный интерфейс.",
			},
		},
	})

	// Setup category
	content.Categories = append(content.Categories, FAQCategory{
		ID:    "setup",
		Title: "Настройка",
		Items: []FAQItem{
			{
				Question: "Как настроить VPN на телефоне/компьютере?",
				Answer:   "Мы предоставляем готовые конфигурационные файлы:\n\n**Для WireGuard:**\n1. Скачайте приложение WireGuard (iOS/Android/Windows/macOS)\n2. Импортируйте .conf файл из личного кабинета или Telegram-бота\n3. Нажмите \"Подключить\"\n\n**Для Amnezia:**\n1. Скачайте AmneziaVPN с официального сайта\n2. Отсканируйте QR-код из бота\n3. Готово!\n\nВесь процесс занимает около 2 минут.",
			},
		},
	})

	content.Footer.Text = "Не нашли ответ?"
	content.Footer.Email = "support@3wg.ru"

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

	_, err = db.Exec(query, "block_content_faq_page", string(jsonData), time.Now())
	if err != nil {
		log.Fatal("Failed to insert FAQ content:", err)
	}

	fmt.Println("FAQ content inserted successfully!")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
