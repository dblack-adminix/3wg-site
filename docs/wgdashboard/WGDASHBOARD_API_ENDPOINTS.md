# WGDashboard API Endpoints

Полная документация API на основе официальной таблицы эндпоинтов.

## General

### Handshake Server
```
GET /api/handshake
```
Проверка доступности сервера.

### Require Authorization
```
GET /api/requireAuthentication
```
Проверка требования авторизации.

## WireGuard Configuration

### Get All WireGuard Configurations
```
GET /api/getWireguardConfigurations
```
Получение списка всех конфигураций WireGuard.

**Response example:**
```json
{
  "status": true,
  "data": [
    {
      "Name": "wg0",
      "Status": true,
      "PublicKey": "...",
      "ListenPort": "51820",
      "Address": "10.16.11.1/24",
      "TotalPeers": 12,
      "ConnectedPeers": 0,
      "DataUsage": {
        "Receive": 13.24,
        "Sent": 24.08,
        "Total": 37.33
      }
    }
  ]
}
```

### Add WireGuard Configuration
```
POST /api/addWireguardConfiguration
Body: {
  "ConfigurationName": "wg1",
  "Address": "10.0.0.1/24",
  "ListenPort": "51820",
  "PrivateKey": "...",
  "Protocol": "wireguard"
}
```
Создание новой конфигурации WireGuard.

**Note:** В примерах POST может отсутствовать `wg-dashboard-apikey` в header — добавляйте его обязательно.

### Toggle WireGuard Configuration
```
GET /api/toggleWireguardConfiguration/
Query: configurationName* (required)
```
Включение/выключение конфигурации WireGuard.

### Update WireGuard Configuration
```
POST /api/updateWireguardConfiguration
Body: {
  "Name": "wg0",
  "Address": "10.0.0.1/24",
  "ListenPort": "51820",
  "PostDown": "",
  "PostUp": "",
  "PreDown": "",
  "PreUp": ""
}
```
Обновление параметров конфигурации.

### Get WireGuard Configuration Raw Content
```
GET /api/getWireguardConfigurationRawFile
Query: configurationName* (required)
```
Получение raw содержимого конфигурационного файла.

**Use case:** Можно парсить пиры из raw конфигурации, если API для пиров недоступен.

### Update WireGuard Configuration Raw Content
```
POST /api/updateWireguardConfigurationRawFile
Body: {
  "configurationName": "wg0",
  "rawConfiguration": "..."
}
```
Обновление raw содержимого конфигурационного файла.

### Delete WireGuard Configuration
```
POST /api/deleteWireguardConfiguration
Body: {
  "ConfigurationName": "wg0"
}
```
Удаление конфигурации WireGuard.

### Update WireGuard Configuration Name
```
POST /api/renameWireguardConfiguration
Body: {
  "ConfigurationName": "wg0",
  "NewConfigurationName": "wg1"
}
```
Переименование конфигурации.

### Get WireGuard Configuration Realtime Traffic Usage
```
Endpoint: (не указан в документации)
```
**Status:** Endpoint есть в меню, но секция с URL/params/examples не попала в доступную разметку. Попытки открыть request-страницу через Postman API Network завершались Timeout.

### Get WireGuard Configuration Backup
```
Endpoint: (не указан в документации)
```
**Status:** Endpoint есть в меню, но секция с URL/params/examples не попала в доступную разметку.

### Get All WireGuard Configuration Backups
```
Endpoint: (не указан в документации)
```
**Status:** Endpoint есть в меню, но секция с URL/params/examples не попала в доступную разметку.

## WireGuard Peers

### Get WireGuard Configuration Info (with Peers)
```
GET /api/getWireguardConfigurationInfo
Query: configurationName* (required)
```
Получение полной информации о конфигурации включая список пиров с именами.

**Response example:**
```json
{
  "status": true,
  "data": {
    "configurationPeers": [
      {
        "id": "publicKeyString",
        "name": "nest01",
        "allowed_ip": ["10.16.11.2/32"],
        "private_key": "",
        "DNS": "",
        "endpoint_allowed_ip": "",
        "mtu": 1420,
        "keepalive": 21,
        "preshared_key": "",
        "total_receive": 0,
        "total_sent": 0,
        "total_data": 0,
        "latest_handshake": "N/A",
        "cumu_receive": 0,
        "cumu_sent": 0,
        "cumu_data": 0
      }
    ]
  }
}
```

**Важно:** 
- Поле `id` содержит публичный ключ пира
- Поле `name` содержит имя пира (то что отображается в UI)
- Этот эндпоинт предпочтительнее парсинга raw конфигурации

### Альтернативные решения:

#### Вариант 1: Парсинг raw конфигурации
Использовать `/api/getWireguardConfigurationRawFile?configurationName=wg0` и парсить секции `[Peer]`.

**Недостаток:** Имена пиров НЕ хранятся в raw конфигурации, только в базе данных WGDashboard.

#### Вариант 2: Прямое управление через wg команды
Использовать SSH для выполнения команд:
- `wg show wg0` - показать пиры
- `wg set wg0 peer <public_key> allowed-ips <ips>` - добавить пира
- `wg set wg0 peer <public_key> remove` - удалить пира

**Недостаток:** Требует SSH доступ и не дает имена пиров.

## Headers

Все запросы должны содержать:
```
wg-dashboard-apikey: YOUR_API_KEY
Content-Type: application/json (для POST)
```

## Примечания

1. ⚠️ В документации может отсутствовать `wg-dashboard-apikey` в примерах POST - добавляйте его обязательно
2. ⚠️ Некоторые эндпоинты (Realtime Traffic, Backups) есть в меню, но детали недоступны
3. ⚠️ Query параметры помечены звездочкой (*) как обязательные
4. ⚠️ Эндпоинты для работы с пирами НЕ документированы - требуется альтернативное решение
5. ✅ Response в документации может быть очень большим (много конфигов) - сохранен первый элемент как образец

## Тестовый сервер

```
URL: http://46.30.43.35:10086/
API Key: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
Configuration: wg0
Dashboard Port: 10086
WireGuard Port: 51820
```

## Полезные ссылки

- Официальная документация: https://docs.wgdashboard.dev/api/
- Postman коллекция: https://documenter.getpostman.com/view/31393369/2sB3dTsTEi
- GitHub: https://github.com/WGDashboard/WGDashboard

---

**Обновлено**: 29 января 2026  
**Источник**: Официальная таблица API эндпоинтов
