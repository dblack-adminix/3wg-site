# Проверка endpoint пира test-laptop

$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$wgUrl = "http://46.30.43.35:10086"
$configName = "wg0"

Write-Host "Checking peer 'test-laptop' endpoint..." -ForegroundColor Yellow
Write-Host ""

# Получаем информацию о конфигурации
$body = "configName=$configName"
$response = Invoke-RestMethod -Uri "$wgUrl/api/getWireguardConfigurationInfo" -Method Post -Headers @{
    "wg-dashboard-apikey" = $apiKey
    "Content-Type" = "application/x-www-form-urlencoded"
} -Body $body

# Ищем пир test-laptop
$peer = $response.data.peers | Where-Object { $_.name -eq "test-laptop" }

if ($peer) {
    Write-Host "Found peer: $($peer.name)" -ForegroundColor Green
    Write-Host "Public Key: $($peer.publicKey)" -ForegroundColor Cyan
    Write-Host "Endpoint: $($peer.endpoint)" -ForegroundColor Yellow
    Write-Host "Latest Handshake: $($peer.latest_handshake)" -ForegroundColor Yellow
    Write-Host "Status: $($peer.status)" -ForegroundColor Yellow
    Write-Host ""
    
    if ($peer.endpoint -eq "0.0.0.0/0" -or $peer.endpoint -eq "(none)") {
        Write-Host "⚠️  Endpoint is not set - peer has not connected yet or connection expired" -ForegroundColor Red
        Write-Host "Geolocation cannot be determined without a real IP address" -ForegroundColor Red
    } else {
        Write-Host "✅ Endpoint is set - geolocation should work" -ForegroundColor Green
        
        # Извлекаем IP из endpoint
        $ip = $peer.endpoint -replace ":.*", ""
        Write-Host "IP address: $ip" -ForegroundColor Cyan
        
        # Проверяем геолокацию через ip-api.com
        Write-Host ""
        Write-Host "Checking geolocation for IP: $ip" -ForegroundColor Yellow
        $geo = Invoke-RestMethod -Uri "http://ip-api.com/json/$ip"
        
        if ($geo.status -eq "success") {
            Write-Host "✅ Geolocation found:" -ForegroundColor Green
            Write-Host "  Country: $($geo.country) ($($geo.countryCode))" -ForegroundColor Cyan
            Write-Host "  City: $($geo.city)" -ForegroundColor Cyan
            Write-Host "  Region: $($geo.regionName)" -ForegroundColor Cyan
            Write-Host "  ISP: $($geo.isp)" -ForegroundColor Cyan
            Write-Host "  Coordinates: $($geo.lat), $($geo.lon)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to get geolocation" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Peer 'test-laptop' not found" -ForegroundColor Red
}
