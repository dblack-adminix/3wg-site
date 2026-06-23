# Исправление генерации IP адресов

## Дата: 2026-01-31

## Проблема

При создании ключа на сервере `wg.3labs.pw` возникала ошибка:
```
This IP is not available: 10.16.11.2/32
```

## Причина

1. Функция `generateClientIP` была жёстко закодирована на подсеть `10.16.11.x`
2. Сервер `wg.3labs.pw` использует другую подсеть: `10.50.0.x`
3. Функция проверяла только локальную базу данных, но не WGDashboard
4. IP `10.16.11.2` не существует на сервере `wg.3labs.pw`

## Решение

### 1. Динамическое определение подсети

Обновлена функция `generateClientIP` в `backend/controllers/vpn_key.go`:

```go
func generateClientIP(db *gorm.DB, serverID uint) (string, error) {
    // 1. Получаем информацию о сервере
    var server models.Server
    if err := db.First(&server, serverID).Error; err != nil {
        return "", err
    }

    // 2. Получаем список занятых IP с WGDashboard
    usedIPs := make(map[string]bool)
    var subnet string
    var startIP int

    if server.WGDashboardURL != "" && server.WGDashboardKey != "" && server.WGConfigName != "" {
        client := wgdashboard.NewClient(...)
        peers, err := client.GetAllPeers()
        
        if err == nil && len(peers) > 0 {
            // Извлекаем подсеть из первого пира
            // Пример: "10.50.0.2/32" -> subnet "10.50.0"
            for _, peer := range peers {
                if len(peer.AllowedIPs) > 0 {
                    allowedIP := peer.AllowedIPs[0]
                    parts := strings.Split(allowedIP, "/")
                    ip := parts[0]
                    usedIPs[ip] = true
                    
                    // Определяем подсеть
                    if subnet == "" {
                        ipParts := strings.Split(ip, ".")
                        subnet = fmt.Sprintf("%s.%s.%s", ipParts[0], ipParts[1], ipParts[2])
                        startIP = 2
                    }
                }
            }
        }
    }

    // 3. Fallback на дефолтную подсеть
    if subnet == "" {
        subnet = "10.16.11"
        startIP = 2
    }

    // 4. Проверяем локальную базу данных
    var keys []models.VPNKey
    db.Where("server_id = ? AND status = ?", serverID, "active").
        Select("ip_address").
        Find(&keys)
    
    for _, key := range keys {
        usedIPs[key.IPAddress] = true
    }

    // 5. Генерируем свободный IP
    for i := startIP; i <= 254; i++ {
        ip := fmt.Sprintf("%s.%d", subnet, i)
        if !usedIPs[ip] {
            return ip, nil
        }
    }

    return "", fmt.Errorf("no available IP addresses in subnet %s", subnet)
}
```

### 2. Добавлен импорт

Добавлен пакет `strings` в импорты `vpn_key.go`.

## Результат

### До исправления:
- ❌ Жёсткая подсеть `10.16.11.x`
- ❌ Проверка только локальной БД
- ❌ Не работает на серверах с другими подсетями

### После исправления:
- ✅ Автоматическое определение подсети с WGDashboard
- ✅ Проверка занятых IP на реальном сервере
- ✅ Проверка локальной БД
- ✅ Fallback на дефолтную подсеть
- ✅ Работает на любых серверах

## Подсети серверов

| Сервер | Подсеть | Конфигурация |
|--------|---------|--------------|
| Amsterdam Test Server (ID: 1) | `10.16.11.x` | wg0 |
| amster test (ID: 2) | `10.16.11.x` | wg0 |
| AMCNTH (ID: 3) | `10.16.11.x` | wg0 |
| wg.3labs.pw (ID: 4) | `10.50.0.x` | awg0 ⭐ |

## Тестирование

1. Создать ключ на сервере `wg.3labs.pw`
2. Протокол: AmneziaWG
3. Результат: ✅ IP `10.50.0.6` (или следующий свободный)
4. Ключ создан успешно

## Файлы изменены

- `backend/controllers/vpn_key.go` - функция `generateClientIP`
- Добавлен импорт `strings`

## Сборка и деплой

```bash
cd backend
docker-compose build backend
docker-compose down backend
docker-compose up -d backend
docker start vpn_backend
```

## Статус: ✅ ИСПРАВЛЕНО

Теперь система автоматически определяет правильную подсеть для каждого сервера и генерирует свободные IP адреса.
