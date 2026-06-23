# Check peers on wg.3labs.pw server

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Checking peers on wg.3labs.pw (awg0)..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4/wg/peers?config=awg0" -Method Get -Headers $headers
    
    Write-Host "Total Peers: $($response.total)" -ForegroundColor Green
    Write-Host "Config: $($response.config)" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Used IP Addresses:" -ForegroundColor Cyan
    foreach ($peer in $response.peers) {
        Write-Host "  - $($peer.allowed_ip) : $($peer.name)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Checking keys in local database for server 4..." -ForegroundColor Yellow
    
    $keys = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" -Method Get -Headers $headers
    $server4Keys = $keys.keys | Where-Object { $_.server_id -eq 4 }
    
    Write-Host "Keys in database for server 4: $($server4Keys.Count)" -ForegroundColor Green
    foreach ($key in $server4Keys) {
        Write-Host "  - $($key.ip_address) : $($key.name)" -ForegroundColor White
    }
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
