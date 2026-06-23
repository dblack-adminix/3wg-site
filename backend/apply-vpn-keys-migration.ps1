# Apply VPN Keys migration
$env:PGPASSWORD = "postgres"
Get-Content "migrations/add_ip_address_to_vpn_keys.sql" | psql -h localhost -U postgres -d vpn_db

Write-Host "Migration applied successfully!" -ForegroundColor Green
