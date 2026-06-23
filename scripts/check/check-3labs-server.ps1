# Check wg.3labs.pw server details

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Checking wg.3labs.pw server (ID: 4)..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $server = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4" -Method Get -Headers $headers
    
    Write-Host "Server Details:" -ForegroundColor Green
    $server | ConvertTo-Json -Depth 5
    
    Write-Host ""
    Write-Host "Testing WGDashboard connection..." -ForegroundColor Yellow
    
    try {
        $test = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4/wg/test" -Method Get -Headers $headers
        Write-Host "WGDashboard Test: $($test.status)" -ForegroundColor Green
        if ($test.message) {
            Write-Host "Message: $($test.message)"
        }
    } catch {
        Write-Host "WGDashboard Test Failed: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Getting available configs..." -ForegroundColor Yellow
    
    try {
        $configs = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4/wg/config" -Method Get -Headers $headers
        Write-Host "Available Configurations:" -ForegroundColor Green
        foreach ($config in $configs.data) {
            Write-Host "  - $($config.Name)" -ForegroundColor White
        }
    } catch {
        Write-Host "Failed to get configs: $_" -ForegroundColor Red
    }
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
