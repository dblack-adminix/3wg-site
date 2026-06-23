# Fix wg.3labs.pw server config name

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Updating wg.3labs.pw server config..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    name = "wg.3labs.pw"
    wg_dashboard_url = "https://wg.3labs.pw"
    wg_dashboard_key = "kvG7AGmM8RUx46DkryBxVR5E4R8LzfRpgkogfUTxEEc"
    wg_config_name = "awg0"  # Changed from wg0 to awg0
} | ConvertTo-Json

try {
    Write-Host "Sending update request..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4" -Method Put -Headers $headers -Body $body
    
    Write-Host "Server updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "New config:" -ForegroundColor Cyan
    Write-Host "  Name: $($response.name)"
    Write-Host "  WG Config Name: $($response.wg_config_name)" -ForegroundColor Yellow
    Write-Host "  Protocols: $($response.protocols -join ', ')"
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
