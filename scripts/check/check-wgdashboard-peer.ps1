# Проверка пира через WGDashboard API

$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$wgUrl = "http://46.30.43.35:10086"
$configName = "wg0"

Write-Host "Checking WGDashboard for peer 'test-laptop'..." -ForegroundColor Yellow
Write-Host ""

# Получаем информацию о конфигурации
$body = "configName=$configName"
$response = Invoke-RestMethod -Uri "$wgUrl/api/getWireguardConfigurationInfo" -Method Get -Headers @{
    "wg-dashboard-apikey" = $apiKey
} -Body $body

# Ищем пир test-laptop
$peer = $response.data.peers | Where-Object { $_.name -eq "test-laptop" }

if ($peer) {
    Write-Host "✅ Found peer: $($peer.name)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Public Key: $($peer.publicKey)" -ForegroundColor Cyan
    Write-Host "Endpoint: $($peer.endpoint)" -ForegroundColor Yellow
    Write-Host "Latest Handshake: $($peer.latest_handshake)" -ForegroundColor Yellow
    Write-Host "Status: $($peer.status)" -ForegroundColor Yellow
    Write-Host "Allowed IPs: $($peer.allowed_ip -join ', ')" -ForegroundColor Gray
    Write-Host ""
    
    if ($peer.endpoint -eq "0.0.0.0/0" -or $peer.endpoint -eq "(none)") {
        Write-Host "⚠️  Endpoint is '0.0.0.0/0' - peer is currently disconnected" -ForegroundColor Red
        Write-Host "WireGuard only shows endpoint while peer is actively connected" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To see geolocation:" -ForegroundColor Cyan
        Write-Host "1. Connect VPN client using the config" -ForegroundColor White
        Write-Host "2. While connected, open peer details in browser" -ForegroundColor White
        Write-Host "3. Map will show your current location" -ForegroundColor White
    } else {
        Write-Host "✅ Endpoint is set - peer is connected!" -ForegroundColor Green
        
        # Извлекаем IP из endpoint
        $ip = $peer.endpoint -replace ":.*", ""
        Write-Host "Client IP: $ip" -ForegroundColor Cyan
        
        # Проверяем геолокацию
        Write-Host ""
        Write-Host "Checking geolocation for IP: $ip" -ForegroundColor Yellow
        $geo = Invoke-RestMethod -Uri "http://ip-api.com/json/$ip"
        
        if ($geo.status -eq "success") {
            Write-Host "✅ Geolocation:" -ForegroundColor Green
            Write-Host "  Country: $($geo.country) ($($geo.countryCode))" -ForegroundColor Cyan
            Write-Host "  City: $($geo.city)" -ForegroundColor Cyan
            Write-Host "  Region: $($geo.regionName)" -ForegroundColor Cyan
            Write-Host "  ISP: $($geo.isp)" -ForegroundColor Cyan
            Write-Host "  Coordinates: $($geo.lat), $($geo.lon)" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to get geolocation: $($geo.message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Peer 'test-laptop' not found" -ForegroundColor Red
}
