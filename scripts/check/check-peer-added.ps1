# Check if peer was added to WGDashboard
$token = (Get-Content auth-token.txt -Raw).Trim()

Write-Host "=== Checking Peers on Server 1 ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1/wg/peers/cached" `
        -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`nTotal peers: $($response.total)" -ForegroundColor Yellow
    Write-Host "Cached: $($response.cached)" -ForegroundColor Gray
    Write-Host "Last sync: $($response.last_sync)" -ForegroundColor Gray
    
    Write-Host "`nPeers:" -ForegroundColor Cyan
    $response.peers | ForEach-Object {
        Write-Host "  - $($_.name)" -ForegroundColor White
        Write-Host "    Public Key: $($_.id.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "    Allowed IP: $($_.allowed_ip)" -ForegroundColor Gray
        Write-Host "    Status: $($_.status)" -ForegroundColor $(if ($_.status -eq "running") { "Green" } else { "Red" })
        Write-Host ""
    }
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
}
