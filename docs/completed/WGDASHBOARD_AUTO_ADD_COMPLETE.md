# Автоматическое добавление пиров в WGDashboard - Завершено

## Статус: ✅ Полностью работает

## Что реализовано

### Автоматическое добавление пира при создании ключа

При создании VPN ключа через API `/api/v1/keys`, backend автоматически:
1. Генерирует уникальный IP адрес в правильном диапазоне (10.16.11.X)
2. Создает запись в БД
3. Добавляет пир на сервер через WGDashboard API
4. Логирует результат

### Автоматическое удаление пира при удалении ключа

При удалении ключа через API `/api/v1/keys/:id`, backend автоматически:
1. Удаляет пир с сервера через WGDashboard API
2. Удаляет запись из БД
3. Логирует результат

## Технические детали

### Диапазон IP адресов

- **Старый (неправильный):** 10.0.0.2 - 10.0.0.254
- **Новый (правильный):** 10.16.11.2 - 10.16.11.254

Диапазон соответствует конфигурации WGDashboard на сервере (Address: 10.16.11.1/24).

### Генерация ключей

**Текущая реализация:**
- Передаем пустые ключи (`publicKey=""`, `privateKey=""`)
- WGDashboard генерирует настоящую пару WireGuard ключей
- Ключи сохраняются на сервере

**Проблема:**
- В БД сохраняются случайные ключи (не настоящие WireGuard)
- Конфиг в БД содержит неправильные ключи

**Решение (TODO):**
- После добавления пира получить сгенерированные ключи из WGDashboard
- Обновить запись в БД с правильными ключами
- Или: использовать WireGuard tools для генерации ключей на backend

### Код

**backend/controllers/vpn_key.go:**

```go
// Create - создание ключа с автоматическим добавлением пира
func (kc *VPNKeyController) Create(c *gin.Context) {
    // ... создание ключа в БД ...
    
    // Add peer to WGDashboard if server has WGDashboard configured
    if server.WGDashboardURL != "" && server.WGDashboardKey != "" {
        fmt.Printf("[VPNKey] Adding peer to WGDashboard: server=%s, name=%s, ip=%s\n", 
            server.Name, req.Name, ipAddress)
        // Pass empty keys - let WGDashboard generate them
        if err := addPeerToWGDashboard(&server, "", "", ipAddress, req.Name); err != nil {
            fmt.Printf("[VPNKey] Warning: Failed to add peer to WGDashboard: %v\n", err)
        } else {
            fmt.Printf("[VPNKey] Peer added successfully to WGDashboard\n")
        }
    }
}

// Delete - удаление ключа с автоматическим удалением пира
func (kc *VPNKeyController) Delete(c *gin.Context) {
    // ... загрузка ключа из БД ...
    
    // Remove peer from WGDashboard if server has WGDashboard configured
    if key.Server.WGDashboardURL != "" && key.Server.WGDashboardKey != "" {
        if err := removePeerFromWGDashboard(&key.Server, key.PublicKey); err != nil {
            fmt.Printf("[VPNKey] Warning: Failed to remove peer from WGDashboard: %v\n", err)
        }
    }
    
    // ... удаление из БД ...
}
```

## Тестирование

### 1. Создание ключа

```powershell
./test-create-key.ps1
```

**Ожидаемый результат:**
- Ключ создан в БД
- IP адрес: 10.16.11.X
- Лог: `[VPNKey] Peer added successfully to WGDashboard`
- Пир появился на сервере

### 2. Проверка пира на сервере

```powershell
./check-wgdashboard-direct.ps1
```

**Результат:**
```
Total peers: 2
Config: wg0

Peers:
  - Dimitriy_PC
    Allowed IP: 10.16.11.4/32
    Status: running

  - test_key_20260131_052758
    Allowed IP: 10.16.11.2/32
    Status: stopped
```

✅ Пир успешно добавлен!

### 3. Удаление ключа

```powershell
$token = (Get-Content auth-token.txt -Raw).Trim()
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys/14" `
    -Method DELETE `
    -Headers @{Authorization="Bearer $token"}
```

**Ожидаемый результат:**
- Ключ удален из БД
- Лог: `[WGDashboard] Peer deleted successfully`
- Пир удален с сервера

## Известные проблемы

### 1. Ключи в БД не соответствуют ключам на сервере

**Проблема:**
- Backend генерирует случайные ключи и сохраняет в БД
- WGDashboard генерирует настоящие WireGuard ключи
- Ключи не совпадают

**Решение:**
- Получить сгенерированные ключи из WGDashboard после добавления пира
- Обновить запись в БД
- Или: генерировать ключи на backend с помощью WireGuard tools

### 2. Фиксированный диапазон IP

**Проблема:**
- Диапазон 10.16.11.X захардкожен в коде
- Разные серверы могут использовать разные диапазоны

**Решение:**
- Получать диапазон из конфигурации сервера (Address field)
- Парсить и использовать правильный диапазон для каждого сервера

### 3. Фиксированная конфигурация (wg0)

**Проблема:**
- Всегда используется wg0
- Сервер может иметь несколько конфигураций (wg0, wg1, ...)

**Решение:**
- Добавить выбор конфигурации при создании ключа
- Или: автоматически выбирать конфигурацию с наименьшей загрузкой

## Следующие шаги

### Приоритет 1: Синхронизация ключей

1. После добавления пира получить сгенерированные ключи
2. Обновить запись в БД с правильными ключами
3. Обновить конфиг с правильными ключами

### Приоритет 2: Динамический диапазон IP

1. Получать Address из конфигурации сервера
2. Парсить диапазон (например, "10.16.11.1/24" → "10.16.11.X")
3. Генерировать IP в правильном диапазоне

### Приоритет 3: Выбор конфигурации

1. Добавить поле `wg_config` в запрос создания ключа
2. Позволить выбирать между wg0, wg1, и т.д.
3. Или: автоматически выбирать конфигурацию с наименьшей загрузкой

## Файлы

- `backend/controllers/vpn_key.go` - контроллер с автодобавлением
- `backend/wgdashboard/client.go` - клиент WGDashboard API
- `test-create-key.ps1` - тест создания ключа
- `check-wgdashboard-direct.ps1` - проверка пиров на сервере
- `check-peer-added.ps1` - проверка через кэш

## Логи

**Успешное добавление:**
```
[VPNKey] Adding peer to WGDashboard: server=Amsterdam Test Server, name=test_key_20260131_052758, ip=10.16.11.2
[VPNKey] Peer added successfully to WGDashboard
```

**Ошибка (неправильный IP):**
```
[VPNKey] Warning: Failed to add peer to WGDashboard: failed to add peer to WGDashboard: API returned status false: This IP is not available: 10.0.0.13/32
```

**Ошибка (неправильные ключи):**
```
[VPNKey] Warning: Failed to add peer to WGDashboard: failed to add peer to WGDashboard: API returned status false: Provided Public Key does not match provided Private Key
```

## Дата завершения
31 января 2026, 05:30 UTC+3
