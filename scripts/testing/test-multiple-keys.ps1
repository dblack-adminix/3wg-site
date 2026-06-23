# Test multiple key creation to verify unique IPs
$token = (Get-Content auth-token.txt -Raw).Trim()

Write-Host "=== Creating Multiple Keys ===" -ForegroundColor Cyan

for ($i = 1; $i -le 5; $i++) {
    $body = @{
        name = "test_key_$i"
        server_id = 1
        protocol = "wireguard"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
            -Method POST `
            -Headers @{Authorization="Bearer $token"} `
            -Body $body `
            -ContentType "application/json"
        
        Write-Host "Key $i - ID: $($response.id), IP: $($response.ip_address)" -ForegroundColor Green
    } catch {
        Write-Host "Key $i - Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host "`n=== Getting All Keys ===" -ForegroundColor Cyan
$keys = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
    -Headers @{Authorization="Bearer $token"}

Write-Host "Total keys: $($keys.total)" -ForegroundColor Yellow
$keys.keys | ForEach-Object {
    Write-Host "  - $($_.name): $($_.ip_address)" -ForegroundColor White
}
