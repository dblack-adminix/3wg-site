# Check all servers in database

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Getting all servers from database..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/servers" -Method Get -Headers $headers
    
    Write-Host "Total Servers: $($response.total)" -ForegroundColor Green
    Write-Host ""
    
    foreach ($server in $response.servers) {
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "Server ID: $($server.id)" -ForegroundColor Cyan
        Write-Host "  Name: $($server.name)" -ForegroundColor White
        Write-Host "  Location: $($server.location)"
        Write-Host "  Country: $($server.country)"
        Write-Host "  IP: $($server.ip_address)"
        Write-Host "  Status: $($server.status)"
        Write-Host "  Protocols: $($server.protocols -join ', ')" -ForegroundColor Yellow
        Write-Host "  WG Config: $($server.wg_config_name)"
        Write-Host "  WG Dashboard: $($server.wg_dashboard_url)"
        Write-Host ""
    }
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
