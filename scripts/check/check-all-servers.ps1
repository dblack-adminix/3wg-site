# Check all servers WGDashboard configuration
$token = Get-Content "auth-token.txt"

Write-Host "Checking all servers..." -ForegroundColor Yellow
Write-Host ""

$servers = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/servers" `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

foreach ($server in $servers) {
    Write-Host "Server ID: $($server.id) - $($server.name)" -ForegroundColor Cyan
    Write-Host "  WGDashboard URL: $($server.wgdashboard_url)"
    Write-Host "  WGDashboard Key: $(if($server.wgdashboard_key){'***configured***'}else{'NOT SET'})"
    Write-Host "  WG Config Name: $($server.wg_config_name)"
    
    if ($server.wgdashboard_url -and $server.wgdashboard_key -and $server.wg_config_name) {
        Write-Host "  Status: ✓ Fully configured" -ForegroundColor Green
    } else {
        Write-Host "  Status: ✗ Missing configuration" -ForegroundColor Red
    }
    Write-Host ""
}
