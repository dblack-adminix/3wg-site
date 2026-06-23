# Test creating a new key and check logs
$token = Get-Content "user-token.txt"

Write-Host "Creating new key..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body (@{
        server_id = 3
        name = "test_key_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        protocol = "wireguard"
    } | ConvertTo-Json)

Write-Host "`nKey created:" -ForegroundColor Green
$response | ConvertTo-Json -Depth 10

Write-Host "`n`nChecking backend logs..." -ForegroundColor Yellow
docker logs vpn_backend --tail 30 | Select-String -Pattern "VPNKey"
