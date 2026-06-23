# 🔌 WGDashboard Integration

Интеграция с панелью управления WireGuard - WGDashboard.

## 📋 Что это?

WGDashboard - это веб-панель для управления WireGuard серверами. Наша интеграция позволяет:

- ✅ Автоматически создавать VPN ключи на серверах
- ✅ Управлять пирами (peers) через API
- ✅ Получать статистику использования
- ✅ Мониторить статус подключений
- ✅ Скачивать конфигурации клиентов

## 🎯 Тестовый сервер

**URL**: http://46.30.43.35:10086/  
**API Key**: `DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM`  
**Конфигурация**: `wg0` на порту `51820`

## 🚀 Быстрый старт

### 1. Применить миграцию
```powershell
cd backend
.\apply-migration.ps1
```

### 2. Перезапустить бэкенд
```powershell
.\manage.ps1 restart
```

### 3. Добавить тестовый сервер
```powershell
cd ..
.\add-test-server.ps1
```

### 4. Протестировать
```powershell
.\test-wgdashboard-integration.ps1
```

## 📁 Структура файлов

```
backend/
├── models/
│   └── server.go                    # Модель с полями WGDashboard
├── controllers/
│   ├── admin.go                     # Управление серверами
│   └── wgdashboard.go              # Контроллер WGDashboard
├── wgdashboard/
│   └── client.go                    # HTTP клиент для WGDashboard API
├── routes/
│   └── routes.go                    # Роуты для WGDashboard
└── migrations/
    └── add_wgdashboard_fields.sql  # SQL миграция

Скрипты:
├── add-test-server.ps1              # Добавить тестовый сервер
├── test-wgdashboard.ps1             # Тест прямого подключения
├── test-wgdashboard-integration.ps1 # Тест через наш API
└── backend/apply-migration.ps1      # Применить миграцию

Документация:
├── WGDASHBOARD_INTEGRATION.md       # Полная документация
├── WGDASHBOARD_QUICKSTART.md        # Быстрый старт
└── WGDASHBOARD_README.md            # Этот файл
```

## 🔧 API Эндпоинты

### Управление серверами
```
POST   /api/v1/admin/servers              # Создать сервер
PUT    /api/v1/admin/servers/:id          # Обновить сервер
DELETE /api/v1/admin/servers/:id          # Удалить сервер
```

### WGDashboard интеграция
```
GET    /api/v1/admin/servers/:id/wg/test           # Тест подключения
GET    /api/v1/admin/servers/:id/wg/config         # Конфигурация WireGuard
GET    /api/v1/admin/servers/:id/wg/peers          # Список пиров
POST   /api/v1/admin/servers/:id/wg/peers          # Добавить пира
DELETE /api/v1/admin/servers/:id/wg/peers/:peer_id # Удалить пира
```

## 📊 Модель данных

### Server (расширенная)
```go
type Server struct {
    // Основные поля
    ID        uint
    Name      string
    Location  string
    Country   string
    IPAddress string
    Status    string
    Protocols []string
    MaxUsers  int
    
    // WGDashboard интеграция
    WGDashboardURL  string  // http://46.30.43.35:10086
    WGDashboardKey  string  // API ключ
    WGConfigName    string  // wg0
    WGDashboardPort int     // 10086
    WGListenPort    int     // 51820
}
```

## 🔐 Безопасность

- ✅ API ключи хранятся в БД
- ✅ Все запросы требуют авторизации админа
- ✅ Валидация всех входных данных
- ⏳ Шифрование API ключей (TODO)
- ⏳ HTTPS для production (TODO)

## 📈 Статус разработки

### ✅ Завершено (Этап 1-2)
- [x] Модель данных с полями WGDashboard
- [x] SQL миграция
- [x] HTTP клиент для WGDashboard API
- [x] Контроллер для управления
- [x] API эндпоинты
- [x] Скрипты для тестирования

### 🔄 В работе (Этап 3)
- [ ] Автоматическое создание пиров при создании VPN ключей
- [ ] Автоматическое удаление пиров при удалении ключей
- [ ] Синхронизация статуса ключей

### ⏳ Запланировано (Этап 4-5)
- [ ] UI для управления серверами
- [ ] Отображение статуса подключения
- [ ] Мониторинг и статистика
- [ ] Алерты при проблемах

## 🧪 Тестирование

### Прямое подключение к WGDashboard
```powershell
.\test-wgdashboard.ps1
```

### Через наш API
```powershell
.\test-wgdashboard-integration.ps1
```

### Ожидаемый результат
```
✓ Подключение успешно!
✓ Конфигурация получена!
✓ Список пиров получен!
✓ Все тесты пройдены успешно!
```

## 📚 Документация

- **WGDASHBOARD_INTEGRATION.md** - Полная документация по интеграции
- **WGDASHBOARD_QUICKSTART.md** - Пошаговая инструкция запуска
- **WGDASHBOARD_README.md** - Этот файл (обзор)

## 🤝 Связанные задачи

- **Задача 4**: Интеграция с WGDashboard (текущая)
- **Задача 5**: Генерация VPN ключей (следующая)
- **Задача 7**: Управление серверами (UI)

## 💡 Примеры использования

### Добавить сервер с WGDashboard
```json
POST /api/v1/admin/servers
{
  "name": "Amsterdam Server",
  "location": "Amsterdam, Netherlands",
  "country": "NL",
  "ip_address": "46.30.43.35",
  "protocols": ["wireguard"],
  "max_users": 100,
  "wg_dashboard_url": "http://46.30.43.35:10086",
  "wg_dashboard_key": "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM",
  "wg_config_name": "wg0",
  "wg_dashboard_port": 10086,
  "wg_listen_port": 51820
}
```

### Добавить пира на сервер
```json
POST /api/v1/admin/servers/1/wg/peers
{
  "public_key": "YOUR_PUBLIC_KEY",
  "allowed_ips": ["10.0.0.5/32"],
  "name": "Client Name"
}
```

---

**Версия**: 1.0  
**Дата**: 29 января 2026  
**Статус**: 🔄 Активная разработка
