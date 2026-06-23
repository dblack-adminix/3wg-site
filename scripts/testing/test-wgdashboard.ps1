# Скрипт для тестирования подключения к WGDashboard

$WGDASHBOARD_URL = "http://46.30.43.35:10086"
$API_KEY = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Тестирование WGDashboard API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL: $WGDASHBOARD_URL" -ForegroundColor Gray
Write-Host "API Key: $API_KEY" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "wg-dashboard-apikey" = $API_KEY
}

# Тест 1: Получить список конфигураций
Write-Host "Тест 1: Получение списка конфигураций..." -ForegroundColor Yellow
try {
    $configs = Invoke-RestMethod -Uri "$WGDASHBOARD_URL/api/getWireguardConfigurations" -Headers $headers -Method GET
    Write-Host "  ✓ Успешно!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Найдено конфигураций: $($configs.data.Count)" -ForegroundColor White
    
    foreach ($config in $configs.data) {
        Write-Host "  - $($config.Name)" -ForegroundColor Cyan
        Write-Host "    Статус: $($config.Status)" -ForegroundColor Gray
        Write-Host "    Порт: $($config.ListenPort)" -ForegroundColor Gray
        Write-Host "    Пиров: $($config.PeersCount)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "  ✗ Ошибка: $_" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Тест 2: Получить список пиров для первой конфигурации
if ($configs.data.Count -gt 0) {
    $configName = $configs.data[0].Name
    Write-Host "Тест 2: Получение списка пиров для '$configName'..." -ForegroundColor Yellow
    
    try {
        $peers = Invoke-RestMethod -Uri "$WGDASHBOARD_URL/api/getWireguardConfigurationPeers/$configName" -Headers $headers -Method GET
        Write-Host "  ✓ Успешно!" -ForegroundColor Green
        Write-Host ""
        Write-Host "  Найдено пиров: $($peers.data.Count)" -ForegroundColor White
        
        if ($peers.data.Count -gt 0) {
            foreach ($peer in $peers.data) {
                Write-Host "  - $($peer.name)" -ForegroundColor Cyan
                Write-Host "    ID: $($peer.id)" -ForegroundColor Gray
                Write-Host "    IP: $($peer.allowedIPs)" -ForegroundColor Gray
                Write-Host "    Последний handshake: $($peer.latestHandshake)" -ForegroundColor Gray
            }
        } else {
            Write-Host "  (Нет пиров)" -ForegroundColor Gray
        }
        Write-Host ""
    } catch {
        Write-Host "  ✗ Ошибка: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# Тест 3: Получить статистику сервера
Write-Host "Тест 3: Получение статистики сервера..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$WGDASHBOARD_URL/api/getServerStatistics" -Headers $headers -Method GET
    Write-Host "  ✓ Успешно!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Статистика сервера:" -ForegroundColor White
    $stats | ConvertTo-Json -Depth 3
    Write-Host ""
} catch {
    Write-Host "  ⚠ Эндпоинт недоступен (возможно не поддерживается)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Тестирование завершено!" -ForegroundColor Green
Write-Host ""
Write-Host "Результаты:" -ForegroundColor Yellow
Write-Host "  - Подключение к WGDashboard: ✓" -ForegroundColor Green
Write-Host "  - API Key валиден: ✓" -ForegroundColor Green
Write-Host "  - Конфигурации доступны: ✓" -ForegroundColor Green
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Cyan
Write-Host "  1. Добавить сервер в базу данных" -ForegroundColor White
Write-Host "     .\add-test-server.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Реализовать интеграцию в бэкенде" -ForegroundColor White
Write-Host "     См. WGDASHBOARD_INTEGRATION.md" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Создать ключи через WGDashboard API" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
