# Тест поиска правильного API для добавления пира в WGDashboard

$baseUrl = "http://46.30.43.35:10086"
$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$config = "wg1"

$headers = @{
    "wg-dashboard-apikey" = $apiKey
    "Content-Type" = "application/json"
}

Write-Host "=== Поиск API для добавления пира ===" -ForegroundColor Cyan

# Попробуем разные возможные эндпоинты
$endpoints = @(
    @{ Method = "POST"; Path = "/api/addPeer"; Body = @{ configurationName = $config; publicKey = "test"; allowedIPs = "10.16.11.100/32"; name = "test-peer" } }
    @{ Method = "POST"; Path = "/api/addWireguardPeer"; Body = @{ configurationName = $config; publicKey = "test"; allowedIPs = "10.16.11.100/32"; name = "test-peer" } }
    @{ Method = "POST"; Path = "/api/wireguard/peer/add"; Body = @{ configurationName = $config; publicKey = "test"; allowedIPs = "10.16.11.100/32"; name = "test-peer" } }
    @{ Method = "POST"; Path = "/api/peer/add"; Body = @{ configurationName = $config; publicKey = "test"; allowedIPs = "10.16.11.100/32"; name = "test-peer" } }
    @{ Method = "POST"; Path = "/api/savePeerConfig"; Body = @{ configurationName = $config; publicKey = "test"; allowedIPs = "10.16.11.100/32"; name = "test-peer" } }
)

foreach ($endpoint in $endpoints) {
    Write-Host "`nПробуем: $($endpoint.Method) $($endpoint.Path)" -ForegroundColor Yellow
    
    try {
        $body = $endpoint.Body | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl$($endpoint.Path)" -Method $endpoint.Method -Headers $headers -Body $body -ErrorAction Stop
        
        Write-Host "✓ Успех!" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor Gray
        break
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode) {
            Write-Host "✗ Ошибка $statusCode" -ForegroundColor Red
        } else {
            Write-Host "✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Проверка существующих эндпоинтов ===" -ForegroundColor Cyan

# Получим список всех доступных эндпоинтов через handshake или другие методы
Write-Host "`nПопытка получить список API эндпоинтов..." -ForegroundColor Yellow

try {
    $handshake = Invoke-RestMethod -Uri "$baseUrl/api/handshake" -Method GET -Headers $headers
    Write-Host "Handshake:" -ForegroundColor Gray
    Write-Host ($handshake | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "Handshake недоступен" -ForegroundColor Red
}

Write-Host "`n💡 Рекомендация:" -ForegroundColor Cyan
Write-Host "Проверьте Network tab в браузере при добавлении пира через UI WGDashboard" -ForegroundColor Yellow
Write-Host "URL: http://46.30.43.35:10086/" -ForegroundColor Yellow
