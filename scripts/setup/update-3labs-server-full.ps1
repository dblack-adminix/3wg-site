# Update wg.3labs.pw server with all fields

$token = Get-Content -Path "auth-token.txt" -Raw
$token = $token.Trim()

Write-Host "Updating wg.3labs.pw server with full data..." -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Need to update via SQL because API doesn't support all fields
Write-Host "Connecting to database..." -ForegroundColor Yellow

$query = @"
UPDATE servers 
SET 
    location = 'Amsterdam',
    country = 'NL',
    ip_address = 'wg.3labs.pw',
    protocols = ARRAY['wireguard', 'amneziawg']::text[],
    wg_config_name = 'awg0',
    updated_at = NOW()
WHERE id = 4;
"@

Write-Host "SQL Query:" -ForegroundColor Gray
Write-Host $query
Write-Host ""

# Execute via docker
docker exec vpn_postgres psql -U postgres -d vpn_3wg -c $query

Write-Host ""
Write-Host "Checking updated server..." -ForegroundColor Cyan

Start-Sleep -Seconds 1

$server = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/4" -Method Get -Headers $headers

Write-Host "Updated Server:" -ForegroundColor Green
Write-Host "  Name: $($server.name)"
Write-Host "  Location: $($server.location)"
Write-Host "  Country: $($server.country)"
Write-Host "  IP: $($server.ip_address)"
Write-Host "  Protocols: $($server.protocols -join ', ')" -ForegroundColor Yellow
Write-Host "  WG Config: $($server.wg_config_name)" -ForegroundColor Yellow
