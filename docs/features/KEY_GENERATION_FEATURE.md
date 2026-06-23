# Генерация VPN ключей - Реализация

## Статус: ✅ Завершено

## Что реализовано

### Backend

1. **Обновлена модель VPNKey**
   - Добавлено поле `ip_address` для хранения IP адреса клиента
   - Создан индекс для быстрого поиска по server_id и ip_address

2. **Улучшена генерация ключей**
   - Автоматическое выделение уникального IP адреса (10.0.0.2 - 10.0.0.254)
   - Проверка на конфликты IP адресов
   - Генерация WireGuard приватного/публичного ключа
   - Поддержка протоколов: WireGuard и AmneziaWG

3. **Генерация конфигурации**
   - Правильный формат конфига с уникальным IP
   - Поддержка IPv6 (AllowedIPs = 0.0.0.0/0, ::/0)
   - Настройки AmneziaWG для обхода DPI
   - DNS серверы (1.1.1.1, 8.8.8.8)

4. **API endpoints**
   - `POST /api/v1/keys` - создание ключа
   - `GET /api/v1/keys/:id/config` - получение конфига в текстовом формате
   - `GET /api/v1/keys` - список ключей пользователя
   - `DELETE /api/v1/keys/:id` - удаление ключа

### Frontend

1. **Обновлена страница Generator**
   - Загрузка реальных серверов из API
   - Выбор сервера с отображением:
     - Флага страны
     - Названия и локации
     - Текущей загрузки (пиры/макс)
     - Симулированной задержки
     - Статуса (активен/неактивен)
   - Ввод имени ключа (автогенерация по умолчанию)
   - Выбор протокола (WireGuard / AmneziaWG)

2. **Процесс генерации**
   - Анимированный терминал с шагами генерации
   - Прогресс-бар
   - Создание ключа через API
   - Получение готового конфига

3. **Действия с конфигом**
   - Копирование в буфер обмена
   - Скачивание .conf файла
   - Визуальные эффекты (flicker, glow)

## Структура конфига

### WireGuard
```
[Interface]
PrivateKey = <generated_private_key>
Address = 10.0.0.X/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = <server_public_key>
Endpoint = <server_ip>:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

### AmneziaWG
Дополнительно к WireGuard конфигу:
```
# AmneziaWG specific settings
Jc = 4
Jmin = 40
Jmax = 70
S1 = 86
S2 = 37
H1 = 1234567890
H2 = 9876543210
H3 = 5555555555
H4 = 1111111111
```

## Миграция БД

```sql
ALTER TABLE vpn_keys ADD COLUMN IF NOT EXISTS ip_address VARCHAR(15) NOT NULL DEFAULT '10.0.0.2';
CREATE INDEX IF NOT EXISTS idx_vpn_keys_server_ip ON vpn_keys(server_id, ip_address);
```

## Тестирование

### 1. Создание ключа через UI
1. Открыть `/generator`
2. Выбрать протокол (WireGuard или AmneziaWG)
3. Выбрать сервер из списка
4. Ввести имя ключа (или оставить автогенерированное)
5. Нажать "GENERATE CONFIG"
6. Дождаться завершения генерации
7. Скопировать или скачать конфиг

### 2. Проверка через API
```powershell
# Получить токен
$token = (Get-Content auth-token.txt)

# Создать ключ
$body = @{
    name = "test_key_001"
    server_id = 1
    protocol = "wireguard"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
    -Method POST `
    -Headers @{Authorization="Bearer $token"} `
    -Body $body `
    -ContentType "application/json"

# Получить конфиг
$config = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys/$($response.id)/config" `
    -Headers @{Authorization="Bearer $token"}

Write-Host $config
```

### 3. Проверка уникальности IP
```powershell
# Создать несколько ключей и проверить, что IP разные
for ($i = 1; $i -le 5; $i++) {
    $body = @{
        name = "test_key_$i"
        server_id = 1
        protocol = "wireguard"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
        -Method POST `
        -Headers @{Authorization="Bearer $token"} `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "Key $i: IP = $($response.ip_address)"
}
```

## Следующие шаги

### Задача 6: Интеграция с WGDashboard (в процессе)

1. **Автоматическое добавление пира на сервер**
   - При создании ключа автоматически добавлять пир в WGDashboard
   - Использовать API `/api/addPeer`
   - Передавать публичный ключ, allowed_ips, имя

2. **Автоматическое удаление пира**
   - При удалении ключа удалять пир из WGDashboard
   - Использовать API `/api/deletePeer`

3. **Синхронизация статуса**
   - Проверять статус пира на сервере
   - Обновлять статус ключа (active/inactive)

4. **Настоящая генерация ключей**
   - Использовать WireGuard tools для генерации ключей
   - Или использовать Go библиотеку для WireGuard

5. **Получение публичного ключа сервера**
   - Получать реальный публичный ключ сервера из WGDashboard
   - Использовать в конфиге вместо mock данных

## Файлы

### Backend
- `backend/controllers/vpn_key.go` - контроллер для работы с ключами
- `backend/models/vpn_key.go` - модель VPNKey
- `backend/routes/routes.go` - роуты для ключей
- `backend/migrations/add_ip_address_to_vpn_keys.sql` - миграция

### Frontend
- `src/pages/Generator.tsx` - страница генерации ключей
- `src/pages/Keys.tsx` - страница управления ключами
- `src/lib/api.ts` - API клиент
- `src/hooks/useUserKeys.ts` - хук для работы с ключами
- `src/hooks/useServers.ts` - хук для загрузки серверов

## Известные ограничения

1. **Mock ключи**: Сейчас генерируются случайные ключи, не настоящие WireGuard ключи
2. **Mock публичный ключ сервера**: В конфиге используется случайный публичный ключ
3. **Нет интеграции с WGDashboard**: Пиры не добавляются автоматически на сервер
4. **Лимит IP адресов**: Максимум 253 клиента на сервер (10.0.0.2 - 10.0.0.254)

## Дата завершения
31 января 2026
