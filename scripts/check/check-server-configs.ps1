# Check what configurations exist on the server

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Checking server configurations..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get server info
$server = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1" -Method Get -Headers $headers

Write-Host "Server Info:" -ForegroundColor Yellow
Write-Host "  Name: $($server.name)"
Write-Host "  WG Config Name: $($server.wg_config_name)"
Write-Host "  Protocols: $($server.protocols -join ', ')"
Write-Host ""

# Get available configs from WGDashboard
Write-Host "Getting WGDashboard configs..." -ForegroundColor Cyan
try {
    $configs = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1/wg/config" -Method Get -Headers $headers
    
    Write-Host "Available Configurations:" -ForegroundColor Green
    foreach ($config in $configs.data) {
        Write-Host "  - $($config.Name)" -ForegroundColor White
        Write-Host "    Status: $($config.Status)"
        Write-Host "    Public Key: $($config.PublicKey)"
        Write-Host ""
    }
} catch {
    Write-Host "Error getting configs: $_" -ForegroundColor Red
}
