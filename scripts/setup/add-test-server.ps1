# Скрипт для добавления тестового сервера через API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Добавление тестового сервера" -ForegroundColor Cyan
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

# Данные сервера
$serverData = @{
    name = "Amsterdam Test Server"
    location = "Amsterdam, Netherlands"
    country = "NL"
    ip_address = "46.30.43.35"
    protocols = @("wireguard")
    max_users = 100
    wg_dashboard_url = "http://46.30.43.35:10086"
    wg_dashboard_key = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
    wg_config_name = "wg0"
    wg_dashboard_port = 10086
    wg_listen_port = 51820
} | ConvertTo-Json -Depth 10

Write-Host "2. Добавление сервера..." -ForegroundColor Yellow
Write-Host "   Сервер: Amsterdam Test Server" -ForegroundColor Gray
Write-Host "   IP: 46.30.43.35:10086" -ForegroundColor Gray
Write-Host "   WGDashboard: http://46.30.43.35:10086/" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers" -Method POST -Body $serverData -Headers $headers -ContentType "application/json"
    
    Write-Host "   ✓ Сервер добавлен!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Информация о сервере:" -ForegroundColor Yellow
    Write-Host "  ID: $($response.id)" -ForegroundColor White
    Write-Host "  Название: $($response.name)" -ForegroundColor White
    Write-Host "  Локация: $($response.location)" -ForegroundColor White
    Write-Host "  IP: $($response.ip_address):$($response.port)" -ForegroundColor White
    Write-Host "  Протокол: $($response.protocol)" -ForegroundColor White
    Write-Host "  Статус: $($response.status)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "   ✗ Ошибка добавления сервера: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Возможные причины:" -ForegroundColor Yellow
    Write-Host "  - Сервер уже существует" -ForegroundColor Gray
    Write-Host "  - Бэкенд не запущен" -ForegroundColor Gray
    Write-Host "  - Ошибка в данных" -ForegroundColor Gray
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Готово!" -ForegroundColor Green
Write-Host ""
Write-Host "Проверьте сервер в админке:" -ForegroundColor Cyan
Write-Host "  http://localhost:8080/admin" -ForegroundColor White
Write-Host "  Раздел: Серверы" -ForegroundColor White
Write-Host ""
Write-Host "WGDashboard панель:" -ForegroundColor Cyan
Write-Host "  http://46.30.43.35:10086/" -ForegroundColor White
Write-Host "  API Key: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
