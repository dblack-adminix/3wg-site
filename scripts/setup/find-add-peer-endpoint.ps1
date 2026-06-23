# Поиск правильного эндпоинта для добавления пира в WGDashboard

$baseUrl = "http://46.30.43.35:10086"
$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$config = "wg1"

$headers = @{
    "wg-dashboard-apikey" = $apiKey
    "Content-Type" = "application/json"
}

Write-Host "=== Поиск эндпоинта для добавления пира ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "ИНСТРУКЦИЯ:" -ForegroundColor Yellow
Write-Host "1. Откройте http://46.30.43.35:10086/ в браузере" -ForegroundColor White
Write-Host "2. Откройте DevTools (F12)" -ForegroundColor White
Write-Host "3. Перейдите на вкладку Network" -ForegroundColor White
Write-Host "4. Добавьте пир через UI" -ForegroundColor White
Write-Host "5. Найдите POST запрос в Network tab" -ForegroundColor White
Write-Host "6. Скопируйте URL и тело запроса" -ForegroundColor White
Write-Host ""

Write-Host "Возможные эндпоинты для тестирования:" -ForegroundColor Cyan
Write-Host ""

# Список возможных эндпоинтов на основе анализа WGDashboard
$possibleEndpoints = @(
    "/api/savePeerConfig",
    "/api/addPeer", 
    "/api/updatePeerConfig",
    "/api/wireguard/peer/save",
    "/api/peer/save",
    "/api/configuration/peer/add",
    "/api/addWireguardPeer",
    "/api/savePeerSettings"
)

foreach ($endpoint in $possibleEndpoints) {
    Write-Host "  - POST $endpoint" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Пример тела запроса (предполагаемый):" -ForegroundColor Cyan
$exampleBody = @{
    configurationName = "wg1"
    name = "test-peer"
    publicKey = "YourPublicKeyHere="
    allowedIPs = "10.16.11.100/32"
    privateKey = ""
    DNS = "1.1.1.1"
    endpoint_allowed_ip = "0.0.0.0/0"
    mtu = 1420
    keepalive = 21
    preshared_key = ""
} | ConvertTo-Json -Depth 5

Write-Host $exampleBody -ForegroundColor Gray
Write-Host ""

Write-Host "Попробуем самые вероятные эндпоинты..." -ForegroundColor Yellow
Write-Host ""

# Генерируем тестовый публичный ключ (случайный base64)
$randomBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($randomBytes)
$testPublicKey = [Convert]::ToBase64String($randomBytes)

$testBody = @{
    configurationName = $config
    name = "api-test-peer"
    publicKey = $testPublicKey
    allowedIPs = "10.16.11.200/32"
    DNS = "1.1.1.1"
    endpoint_allowed_ip = "0.0.0.0/0"
    mtu = 1420
    keepalive = 21
}

foreach ($endpoint in $possibleEndpoints) {
    Write-Host "Тестируем: POST $endpoint" -ForegroundColor Yellow
    
    try {
        $body = $testBody | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method POST -Headers $headers -Body $body -ErrorAction Stop
        
        Write-Host "  ✓ НАЙДЕН! Эндпоинт работает!" -ForegroundColor Green
        Write-Host "  Ответ:" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor Gray
        Write-Host ""
        
        # Сохраняем найденный эндпоинт
        Write-Host "=== УСПЕХ ===" -ForegroundColor Green
        Write-Host "Правильный эндпоинт: POST $endpoint" -ForegroundColor Green
        Write-Host ""
        break
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404) {
            Write-Host "  ✗ 404 Not Found" -ForegroundColor Red
        } elseif ($statusCode -eq 400) {
            Write-Host "  ⚠ 400 Bad Request (эндпоинт существует, но неправильные параметры)" -ForegroundColor Yellow
            try {
                $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
                Write-Host "  Ошибка: $($errorBody.message)" -ForegroundColor Gray
            } catch {
                Write-Host "  Ошибка: $($_.Exception.Message)" -ForegroundColor Gray
            }
        } elseif ($statusCode) {
            Write-Host "  ✗ Ошибка $statusCode" -ForegroundColor Red
        } else {
            Write-Host "  ✗ $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "=== Рекомендация ===" -ForegroundColor Cyan
Write-Host "Если ни один эндпоинт не найден автоматически:" -ForegroundColor Yellow
Write-Host "1. Откройте браузер и добавьте пир через UI" -ForegroundColor White
Write-Host "2. В Network tab найдите POST запрос" -ForegroundColor White
Write-Host "3. Скопируйте URL и параметры" -ForegroundColor White
Write-Host "4. Обновите код бэкенда с правильным эндпоинтом" -ForegroundColor White
