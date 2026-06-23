# Test Keys API - Check if server info is included

$token = Get-Content -Path "user-token.txt" -Raw
$token = $token.Trim()

Write-Host "Testing Keys API..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" -Method Get -Headers $headers
    
    Write-Host "Keys Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "Checking server info in keys..." -ForegroundColor Yellow
    
    foreach ($key in $response.keys) {
        Write-Host ""
        Write-Host "Key ID: $($key.id)" -ForegroundColor Cyan
        Write-Host "  Name: $($key.name)"
        Write-Host "  Protocol: $($key.protocol)"
        Write-Host "  IP: $($key.ip_address)"
        
        if ($key.server) {
            Write-Host "  Server Info: PRESENT" -ForegroundColor Green
            Write-Host "    - Name: $($key.server.name)"
            Write-Host "    - Location: $($key.server.location)"
            Write-Host "    - Country: $($key.server.country)"
            Write-Host "    - IP: $($key.server.ip_address)"
        } else {
            Write-Host "  Server Info: MISSING" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
