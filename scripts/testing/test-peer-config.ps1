# Test Peer Config API
# Тестирует генерацию WireGuard конфига для пира

$baseUrl = "http://localhost:3000/api/v1"
$token = Get-Content -Path "auth-token.txt" -Raw

Write-Host "`n=== Test Peer Config API ===" -ForegroundColor Cyan

# 1. Получаем список серверов
Write-Host "`n1. Getting servers..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $serversResponse = Invoke-RestMethod -Uri "$baseUrl/servers" -Method Get -Headers $headers
    $servers = $serversResponse.servers
    
    if ($servers.Count -eq 0) {
        Write-Host "No servers found!" -ForegroundColor Red
        exit 1
    }
    
    $server = $servers[0]
    Write-Host "Found server: $($server.name) (ID: $($server.id))" -ForegroundColor Green
    
    # 2. Получаем пиры сервера
    Write-Host "`n2. Getting peers..." -ForegroundColor Yellow
    $peersResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$($server.id)/wg/peers/cached" -Method Get -Headers $headers
    
    if ($peersResponse.peers.Count -eq 0) {
        Write-Host "No peers found!" -ForegroundColor Red
        exit 1
    }
    
    $peer = $peersResponse.peers[0]
    Write-Host "Found peer: $($peer.name) (PublicKey: $($peer.publicKey.Substring(0, 20))...)" -ForegroundColor Green
    
    # 3. Получаем конфиг пира
    Write-Host "`n3. Getting peer config..." -ForegroundColor Yellow
    $encodedPublicKey = [System.Web.HttpUtility]::UrlEncode($peer.publicKey)
    $configUrl = "$baseUrl/admin/servers/$($server.id)/wg/peers/config?publicKey=$encodedPublicKey"
    
    Write-Host "URL: $configUrl" -ForegroundColor Gray
    
    $configResponse = Invoke-RestMethod -Uri $configUrl -Method Get -Headers $headers
    
    if ($configResponse.status -eq "success") {
        Write-Host "`n✓ Config generated successfully!" -ForegroundColor Green
        Write-Host "`nPeer Name: $($configResponse.peer_name)" -ForegroundColor Cyan
        Write-Host "`nConfig:" -ForegroundColor Cyan
        Write-Host $configResponse.config -ForegroundColor White
        
        # Сохраняем конфиг в файл
        $configFile = "test-peer-$($peer.name).conf"
        $configResponse.config | Out-File -FilePath $configFile -Encoding UTF8
        Write-Host "`n✓ Config saved to: $configFile" -ForegroundColor Green
    } else {
        Write-Host "Failed to get config!" -ForegroundColor Red
        Write-Host ($configResponse | ConvertTo-Json -Depth 10) -ForegroundColor Red
    }
    
} catch {
    Write-Host "`nError: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
