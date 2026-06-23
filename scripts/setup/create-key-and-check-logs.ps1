# Create a new key and immediately check logs
$token = Get-Content "user-token.txt"

Write-Host "Creating new key..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        } `
        -Body (@{
            server_id = 1
            name = "test_$timestamp"
            protocol = "wireguard"
        } | ConvertTo-Json)

    Write-Host "`n✓ Key created successfully!" -ForegroundColor Green
    Write-Host "Key ID: $($response.id)"
    Write-Host "Name: $($response.name)"
    Write-Host "Public Key: $($response.public_key)"
} catch {
    Write-Host "`n✗ Failed to create key:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`n`nChecking backend logs..." -ForegroundColor Yellow
Write-Host "==========================================`n"
docker logs vpn_backend --tail 30 | Select-String -Pattern "VPNKey"
