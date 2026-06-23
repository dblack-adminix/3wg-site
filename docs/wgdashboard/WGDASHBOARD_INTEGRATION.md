# 🔌 Интеграция с WGDashboard

## Информация о сервере

**URL**: http://46.30.43.35:10086/
**API Key**: `DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM`

## WGDashboard API

WGDashboard предоставляет REST API для управления WireGuard конфигурациями.

### Базовый URL
```
http://46.30.43.35:10086/api
```

### Аутентификация
Все запросы должны содержать API ключ в заголовке:
```
wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

## Основные эндпоинты

### 1. Получить список конфигураций
```http
GET /api/getWireguardConfigurations
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

**Ответ:**
```json
{
  "data": [
    {
      "Name": "wg0",
      "Status": "running",
      "PublicKey": "...",
      "ListenPort": 51820,
      "Address": "10.0.0.1/24",
      "PeersCount": 5
    }
  ]
}
```

### 2. Получить список пиров (peers)
```http
GET /api/getWireguardConfigurationPeers/{config_name}
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

**Пример:**
```http
GET /api/getWireguardConfigurationPeers/wg0
```

**Ответ:**
```json
{
  "data": [
    {
      "id": "peer1",
      "name": "Client 1",
      "publicKey": "...",
      "allowedIPs": "10.0.0.2/32",
      "latestHandshake": "2025-01-28 10:30:00",
      "transferRx": 1024000,
      "transferTx": 2048000
    }
  ]
}
```

### 3. Добавить нового пира
```http
POST /api/addWireguardConfigurationPeer/{config_name}
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
  Content-Type: application/json

Body:
{
  "name": "Client Name",
  "allowedIPs": "10.0.0.2/32",
  "publicKey": "...",
  "presharedKey": "..." (optional)
}
```

### 4. Удалить пира
```http
DELETE /api/deleteWireguardConfigurationPeer/{config_name}/{peer_id}
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

### 5. Получить конфигурацию пира
```http
GET /api/downloadWireguardConfigurationPeer/{config_name}/{peer_id}
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

**Ответ:** Текстовый файл .conf

### 6. Получить статистику сервера
```http
GET /api/getServerStatistics
Headers:
  wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
```

## Интеграция в наш бэкенд

### Модель сервера в БД

```go
type Server struct {
    ID              uint   `gorm:"primarykey"`
    Name            string `gorm:"not null"`
    Location        string
    CountryCode     string
    IPAddress       string `gorm:"not null"`
    Port            int    `gorm:"default:51820"`
    Protocol        string `gorm:"default:wireguard"`
    Status          string `gorm:"default:active"`
    MaxUsers        int    `gorm:"default:100"`
    CurrentUsers    int    `gorm:"default:0"`
    
    // WGDashboard integration
    WGDashboardURL  string // http://46.30.43.35:10086
    WGDashboardKey  string // API ключ
    WGConfigName    string // Имя конфигурации (wg0, wg1, etc.)
    
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

### Контроллер для работы с WGDashboard

```go
// backend/controllers/wgdashboard.go
package controllers

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
)

type WGDashboardClient struct {
    BaseURL string
    APIKey  string
}

func NewWGDashboardClient(baseURL, apiKey string) *WGDashboardClient {
    return &WGDashboardClient{
        BaseURL: baseURL,
        APIKey:  apiKey,
    }
}

func (c *WGDashboardClient) request(method, endpoint string, body interface{}) ([]byte, error) {
    var reqBody io.Reader
    if body != nil {
        jsonData, err := json.Marshal(body)
        if err != nil {
            return nil, err
        }
        reqBody = bytes.NewBuffer(jsonData)
    }

    req, err := http.NewRequest(method, c.BaseURL+endpoint, reqBody)
    if err != nil {
        return nil, err
    }

    req.Header.Set("wg-dashboard-apikey", c.APIKey)
    if body != nil {
        req.Header.Set("Content-Type", "application/json")
    }

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    return io.ReadAll(resp.Body)
}

// Получить список конфигураций
func (c *WGDashboardClient) GetConfigurations() ([]byte, error) {
    return c.request("GET", "/api/getWireguardConfigurations", nil)
}

// Получить список пиров
func (c *WGDashboardClient) GetPeers(configName string) ([]byte, error) {
    return c.request("GET", fmt.Sprintf("/api/getWireguardConfigurationPeers/%s", configName), nil)
}

// Добавить пира
func (c *WGDashboardClient) AddPeer(configName string, peer map[string]interface{}) ([]byte, error) {
    return c.request("POST", fmt.Sprintf("/api/addWireguardConfigurationPeer/%s", configName), peer)
}

// Удалить пира
func (c *WGDashboardClient) DeletePeer(configName, peerID string) ([]byte, error) {
    return c.request("DELETE", fmt.Sprintf("/api/deleteWireguardConfigurationPeer/%s/%s", configName, peerID), nil)
}

// Получить конфигурацию пира
func (c *WGDashboardClient) GetPeerConfig(configName, peerID string) ([]byte, error) {
    return c.request("GET", fmt.Sprintf("/api/downloadWireguardConfigurationPeer/%s/%s", configName, peerID), nil)
}
```

## План интеграции

### Этап 1: Добавить поля в модель Server ✅
- [x] WGDashboardURL
- [x] WGDashboardKey
- [x] WGConfigName
- [x] WGDashboardPort
- [x] WGListenPort
- [x] Создана миграция SQL
- [x] Обновлен контроллер admin.go

### Этап 2: Создать WGDashboard клиент ✅
- [x] Реализовать HTTP клиент (`backend/wgdashboard/client.go`)
- [x] Добавить методы для работы с API
- [x] Обработка ошибок
- [x] Создан контроллер (`backend/controllers/wgdashboard.go`)
- [x] Добавлены роуты в `backend/routes/routes.go`

### Этап 3: Интегрировать с VPN ключами 🔄
- [ ] При создании ключа - создавать пира на сервере
- [ ] При удалении ключа - удалять пира
- [ ] Синхронизация статуса ключей

### Этап 4: UI для управления ⏳
- [ ] Добавить поля WGDashboard в форму сервера
- [ ] Показывать статус подключения
- [ ] Отображать список пиров

### Этап 5: Мониторинг ⏳
- [ ] Получать статистику с серверов
- [ ] Отображать в админке
- [ ] Алерты при проблемах

## Тестирование

### Тест подключения к серверу
```bash
curl -H "wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM" \
  http://46.30.43.35:10086/api/getWireguardConfigurations
```

### Тест получения пиров
```bash
curl -H "wg-dashboard-apikey: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM" \
  http://46.30.43.35:10086/api/getWireguardConfigurationPeers/wg0
```

## Безопасность

1. **API ключи хранятся в БД** - зашифрованы
2. **HTTPS** - для production использовать только HTTPS
3. **Валидация** - проверять все входные данные
4. **Rate limiting** - ограничить количество запросов
5. **Логирование** - логировать все операции с серверами

## Следующие шаги

1. ✅ Добавить поля в модель Server в БД
2. ✅ Создать миграцию
3. ✅ Реализовать WGDashboard клиент в Go
4. ✅ Добавить эндпоинты в API для работы с серверами
5. 🔄 Применить миграцию к БД
6. 🔄 Добавить тестовый сервер через API
7. 🔄 Протестировать интеграцию
8. ⏳ Обновить UI для отображения статуса серверов
9. ⏳ Реализовать автоматическое создание пиров при создании ключей

## Созданные файлы

### Backend
- `backend/models/server.go` - обновлена модель с полями WGDashboard
- `backend/controllers/admin.go` - обновлен для поддержки WGDashboard полей
- `backend/controllers/wgdashboard.go` - новый контроллер для WGDashboard
- `backend/wgdashboard/client.go` - клиент для работы с WGDashboard API
- `backend/routes/routes.go` - добавлены роуты для WGDashboard
- `backend/migrations/add_wgdashboard_fields.sql` - SQL миграция

### Скрипты
- `add-test-server.ps1` - добавление тестового сервера (исправлен)
- `test-wgdashboard-integration.ps1` - тестирование интеграции через наш API
- `backend/apply-migration.ps1` - применение миграции БД

## API Эндпоинты

### Управление серверами
- `POST /api/v1/admin/servers` - создать сервер (с полями WGDashboard)
- `PUT /api/v1/admin/servers/:id` - обновить сервер
- `DELETE /api/v1/admin/servers/:id` - удалить сервер

### WGDashboard интеграция
- `GET /api/v1/admin/servers/:id/wg/test` - тест подключения к WGDashboard
- `GET /api/v1/admin/servers/:id/wg/config` - получить конфигурацию WireGuard
- `GET /api/v1/admin/servers/:id/wg/peers` - получить список пиров
- `POST /api/v1/admin/servers/:id/wg/peers` - добавить пира
- `DELETE /api/v1/admin/servers/:id/wg/peers/:peer_id` - удалить пира

---

**Статус**: 🔄 Активная разработка (Этап 2 завершен)
**Приоритет**: Высокий
**Связано с**: Задача 5 (Генерация VPN ключей)
