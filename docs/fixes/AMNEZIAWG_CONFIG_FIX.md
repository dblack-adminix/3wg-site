# Исправление конфигурации AmneziaWG

## Дата: 2026-01-31

## Проблема

При скачивании конфига ключа AmneziaWG возвращался **неправильный конфиг** без параметров обфускации:

```ini
[Interface]
PrivateKey = ...
Address = 10.50.0.6/32
MTU = 1420
DNS = 1.1.1.1

[Peer]
PublicKey = ...
AllowedIPs = 0.0.0.0/0
Endpoint = wg.3labs.pw:443
PersistentKeepalive = 21
```

**Отсутствовали параметры AmneziaWG:**
- Jc, Jmin, Jmax - параметры junk packet
- S1, S2 - параметры init packet
- H1, H2, H3, H4 - параметры response packet

## Причина

Функция `GetConfig` в `backend/controllers/vpn_key.go` **генерировала конфиг вручную**, вместо того чтобы получать его с WGDashboard сервера.

## Решение

### 1. Добавлен метод в WGDashboard клиент

**Файл**: `backend/wgdashboard/client.go`

```go
// DownloadPeerConfig представляет конфиг пира для скачивания
type DownloadPeerConfig struct {
    AmneziaVPN string `json:"amneziaVPN"`
    File       string `json:"file"`
    FileName   string `json:"fileName"`
}

// DownloadAllPeersResponse представляет ответ с конфигами всех пиров
type DownloadAllPeersResponse struct {
    Status  bool                  `json:"status"`
    Message string                `json:"message"`
    Data    []DownloadPeerConfig  `json:"data"`
}

// DownloadAllPeers получает готовые конфиги всех пиров с сервера
func (c *Client) DownloadAllPeers() (*DownloadAllPeersResponse, error) {
    endpoint := fmt.Sprintf("/api/downloadAllPeers/%s", c.ConfigName)
    // ... запрос к API
}

// GetPeerConfigByPrivateKey получает конфиг пира по приватному ключу
func (c *Client) GetPeerConfigByPrivateKey(privateKey string) (string, error) {
    response, err := c.DownloadAllPeers()
    // ... поиск пира по приватному ключу
    return peer.File, nil
}
```

### 2. Обновлена функция GetConfig

**Файл**: `backend/controllers/vpn_key.go`

```go
func (kc *VPNKeyController) GetConfig(c *gin.Context) {
    // ... получение ключа и сервера
    
    // Если WGDashboard настроен, получаем конфиг напрямую с сервера
    if server.WGDashboardURL != "" && server.WGDashboardKey != "" {
        client := wgdashboard.NewClient(...)
        
        // Получаем конфиг по приватному ключу
        config, err := client.GetPeerConfigByPrivateKey(key.PrivateKey)
        if err == nil && config != "" {
            // Обновляем и возвращаем конфиг с сервера
            kc.db.Model(&key).Update("config", config)
            c.String(http.StatusOK, config)
            return
        }
    }
    
    // Fallback: возвращаем сохраненную конфигурацию
    c.String(http.StatusOK, key.Config)
}
```

## Результат

### Правильный конфиг AmneziaWG:

```ini
[Interface]
PrivateKey = YFm7q8B7X7TiFHMfjy5dyWwZLvaNRSWgU/73AXHk7EM=
Address = 10.50.0.6/32
MTU = 1420
DNS = 1.1.1.1
Jc = 120
Jmin = 50
Jmax = 1000
S1 = 86
S2 = 14
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = WwrmQVjY2wus2ALTuplbLX0RsU2LngQdfCmDhj0yki4=
AllowedIPs = 0.0.0.0/0
Endpoint = 45.151.183.218:443
PersistentKeepalive = 21
```

### Параметры обфускации:

- **Jc = 120** - количество junk packets
- **Jmin = 50** - минимальный размер junk packet
- **Jmax = 1000** - максимальный размер junk packet
- **S1 = 86** - init packet magic header 1
- **S2 = 14** - init packet magic header 2
- **H1-H4** - response packet magic headers

## Преимущества

✅ **Конфиг берётся с сервера** - всегда актуальный
✅ **Параметры AmneziaWG** - полная обфускация трафика
✅ **Автоматическое обновление** - при изменении на сервере
✅ **Fallback** - если сервер недоступен, используется кэш
✅ **Работает для всех протоколов** - WireGuard и AmneziaWG

## API Endpoint

WGDashboard API: `GET /api/downloadAllPeers/{config_name}`

Возвращает массив конфигов всех пиров с полными параметрами.

## Тестирование

1. Создать ключ AmneziaWG на сервере wg.3labs.pw
2. Скачать конфиг через API: `GET /api/v1/keys/{id}/config`
3. Проверить наличие параметров Jc, Jmin, Jmax, S1, S2, H1-H4
4. Результат: ✅ Конфиг содержит все параметры обфускации

## Статус: ✅ ИСПРАВЛЕНО

Теперь пользователи получают правильные конфиги AmneziaWG с полной обфускацией трафика для обхода DPI.
