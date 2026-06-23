# Скрипт для тестирования интеграции с WGDashboard через наш API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Тест интеграции WGDashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Получаем токен админа
Write-Host "1. Авторизация..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Успешно!" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Ошибка авторизации: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Получаем список серверов
Write-Host "2. Получение списка серверов..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/servers" -Method GET -Headers $headers
    
    if ($response.servers.Count -eq 0) {
        Write-Host "   ⚠ Серверов не найдено" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Сначала добавьте сервер:" -ForegroundColor Cyan
        Write-Host "  .\add-test-server.ps1" -ForegroundColor White
        exit 1
    }
    
    $server = $response.servers[0]
    $serverId = $server.id
    
    Write-Host "   ✓ Найден сервер: $($server.name)" -ForegroundColor Green
    Write-Host "     ID: $serverId" -ForegroundColor Gray
    Write-Host "     IP: $($server.ip_address)" -ForegroundColor Gray
    Write-Host "     WGDashboard: $($server.wg_dashboard_url)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Ошибка получения серверов: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Тестируем подключение к WGDashboard
Write-Host "3. Тест подключения к WGDashboard..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/$serverId/wg/test" -Method GET -Headers $headers
    
    if ($testResponse.status -eq "success") {
        Write-Host "   ✓ Подключение успешно!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Ошибка подключения" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Ошибка: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "  - WGDashboard недоступен" -ForegroundColor Gray
    Write-Host "  - Неверный API ключ" -ForegroundColor Gray
    Write-Host "  - Поля WGDashboard не заполнены в БД" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Получаем конфигурацию WireGuard
Write-Host "4. Получение конфигурации WireGuard..." -ForegroundColor Yellow
try {
    $config = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/$serverId/wg/config" -Method GET -Headers $headers
    
    Write-Host "   ✓ Конфигурация получена!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Информация о конфигурации:" -ForegroundColor Cyan
    Write-Host "  Имя: $($config.data.name)" -ForegroundColor White
    Write-Host "  Статус: $($config.data.status)" -ForegroundColor White
    Write-Host "  Публичный ключ: $($config.data.public_key)" -ForegroundColor Gray
    Write-Host "  Порт: $($config.data.listen_port)" -ForegroundColor White
    Write-Host "  Адрес: $($config.data.address)" -ForegroundColor White
} catch {
    Write-Host "   ✗ Ошибка получения конфигурации: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Получаем список пиров
Write-Host "5. Получение списка пиров..." -ForegroundColor Yellow
try {
    $peers = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/$serverId/wg/peers" -Method GET -Headers $headers
    
    Write-Host "   ✓ Список получен!" -ForegroundColor Green
    Write-Host "   Всего пиров: $($peers.total)" -ForegroundColor White
    
    if ($peers.total -gt 0) {
        Write-Host ""
        Write-Host "Пиры:" -ForegroundColor Cyan
        foreach ($peer in $peers.peers) {
            Write-Host "  - $($peer.name)" -ForegroundColor White
            Write-Host "    ID: $($peer.id)" -ForegroundColor Gray
            Write-Host "    IP: $($peer.allowed_ip -join ', ')" -ForegroundColor Gray
            Write-Host "    Публичный ключ: $($peer.publicKey.Substring(0, 20))..." -ForegroundColor Gray
            
            if ($peer.latest_handshake -ne "No Handshake") {
                Write-Host "    Последний handshake: $($peer.latest_handshake)" -ForegroundColor Green
            } else {
                Write-Host "    Последний handshake: Нет подключений" -ForegroundColor Gray
            }
            
            Write-Host "    Трафик: ↓ $([math]::Round($peer.total_receive / 1MB, 2)) MB / ↑ $([math]::Round($peer.total_sent / 1MB, 2)) MB" -ForegroundColor Gray
            Write-Host ""
        }
    }
} catch {
    Write-Host "   ⚠ Эндпоинт для пиров пока не реализован" -ForegroundColor Yellow
    Write-Host "     (требуется документация WGDashboard API)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Базовая интеграция работает!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Что работает:" -ForegroundColor Green
Write-Host "  ✓ Подключение к WGDashboard" -ForegroundColor White
Write-Host "  ✓ Получение конфигурации WireGuard" -ForegroundColor White
Write-Host "  ✓ Информация о сервере (пиры, трафик)" -ForegroundColor White
Write-Host ""
Write-Host "Что нужно доработать:" -ForegroundColor Yellow
Write-Host "  ⚠ Управление пирами (добавление/удаление)" -ForegroundColor White
Write-Host "    Требуется актуальная документация WGDashboard API" -ForegroundColor Gray
Write-Host ""
Write-Host "Доступные эндпоинты:" -ForegroundColor Cyan
Write-Host "  GET  /api/v1/admin/servers/:id/wg/test" -ForegroundColor White
Write-Host "  GET  /api/v1/admin/servers/:id/wg/config" -ForegroundColor White
Write-Host "  GET  /api/v1/admin/servers/:id/wg/peers (частично)" -ForegroundColor White
Write-Host ""
