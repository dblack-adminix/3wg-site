# Test key creation
$token = (Get-Content auth-token.txt -Raw).Trim()

Write-Host "=== Creating VPN Key ===" -ForegroundColor Cyan

# Create key
$body = @{
    name = "test_key_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    server_id = 1
    protocol = "wireguard"
} | ConvertTo-Json

Write-Host "`nRequest body:" -ForegroundColor Yellow
Write-Host $body

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
        -Method POST `
        -Headers @{Authorization="Bearer $token"} `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "`n=== Key Created Successfully ===" -ForegroundColor Green
    Write-Host "ID: $($response.id)"
    Write-Host "Name: $($response.name)"
    Write-Host "Protocol: $($response.protocol)"
    Write-Host "IP Address: $($response.ip_address)"
    Write-Host "Public Key: $($response.public_key)"
    Write-Host "Status: $($response.status)"
    
    # Get config
    Write-Host "`n=== Getting Config ===" -ForegroundColor Cyan
    $config = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys/$($response.id)/config" `
        -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`nConfig:" -ForegroundColor Yellow
    Write-Host $config
    
    # Save to file
    $filename = "$($response.name).conf"
    $config | Out-File -FilePath $filename -Encoding UTF8
    Write-Host "`nConfig saved to: $filename" -ForegroundColor Green
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
