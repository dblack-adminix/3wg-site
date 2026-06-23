# Check server WireGuard configuration
$token = (Get-Content auth-token.txt -Raw).Trim()

Write-Host "=== Getting Server 1 Config ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1/wg/config/cached" `
        -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`nStatus: $($response.status)" -ForegroundColor Yellow
    Write-Host "Cached: $($response.cached)" -ForegroundColor Gray
    
    $response.data | ForEach-Object {
        Write-Host "`n=== Config: $($_.Name) ===" -ForegroundColor Cyan
        Write-Host "Status: $($_.Status)" -ForegroundColor $(if ($_.Status) { "Green" } else { "Red" })
        Write-Host "Public Key: $($_.PublicKey)" -ForegroundColor Gray
        Write-Host "Listen Port: $($_.ListenPort)" -ForegroundColor Gray
        Write-Host "Address: $($_.Address)" -ForegroundColor Yellow
        Write-Host "Total Peers: $($_.TotalPeers)" -ForegroundColor White
        Write-Host "Connected Peers: $($_.ConnectedPeers)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
}
