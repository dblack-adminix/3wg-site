# Check if server has WGDashboard configured
$token = Get-Content "auth-token.txt" -ErrorAction SilentlyContinue
if (-not $token) {
    Write-Host "auth-token.txt not found, trying to get admin token..." -ForegroundColor Yellow
    $token = Get-Content "user-token.txt" -ErrorAction SilentlyContinue
}

Write-Host "Checking server 3 configuration..." -ForegroundColor Yellow
$server = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/3" `
    -Headers @{
        "Authorization" = "Bearer $token"
    }

Write-Host "`nServer details:" -ForegroundColor Green
Write-Host "Name: $($server.name)"
Write-Host "WGDashboard URL: $($server.wgdashboard_url)"
Write-Host "WGDashboard Key: $($server.wgdashboard_key)"
Write-Host "WG Config Name: $($server.wg_config_name)"

if ($server.wgdashboard_url -and $server.wgdashboard_key -and $server.wg_config_name) {
    Write-Host "`n✓ WGDashboard is configured!" -ForegroundColor Green
} else {
    Write-Host "`n✗ WGDashboard is NOT fully configured!" -ForegroundColor Red
    Write-Host "Missing fields will cause fallback to local key generation" -ForegroundColor Yellow
}
