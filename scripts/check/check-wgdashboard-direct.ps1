# Check peers directly from WGDashboard (no cache)
$token = (Get-Content auth-token.txt -Raw).Trim()

Write-Host "=== Checking Peers Directly from WGDashboard ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1/wg/peers" `
        -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`nTotal peers: $($response.total)" -ForegroundColor Yellow
    Write-Host "Config: $($response.config)" -ForegroundColor Gray
    
    Write-Host "`nPeers:" -ForegroundColor Cyan
    $response.peers | ForEach-Object {
        Write-Host "  - $($_.name)" -ForegroundColor White
        Write-Host "    Allowed IP: $($_.allowed_ip)" -ForegroundColor Gray
        Write-Host "    Status: $($_.status)" -ForegroundColor $(if ($_.status -eq "running") { "Green" } else { "Red" })
        Write-Host ""
    }
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
