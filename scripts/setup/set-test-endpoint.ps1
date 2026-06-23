# Устанавливаем тестовый endpoint для пира test-laptop
# Это позволит протестировать геолокацию без реального подключения

Write-Host "Setting test endpoint for peer 'test-laptop'..." -ForegroundColor Yellow
Write-Host ""

# Используем реальный IP адрес для теста (например, Google DNS)
$testIP = "8.8.8.8:51820"

docker exec vpn_postgres psql -U postgres -d vpn_3wg -c "UPDATE wg_peers_cache SET last_known_endpoint = '$testIP' WHERE name = 'test-laptop' AND server_id = 1;"

Write-Host ""
Write-Host "✅ Test endpoint set to: $testIP" -ForegroundColor Green
Write-Host ""
Write-Host "Now try to open peer details in browser - geolocation should show Mountain View, California (Google)" -ForegroundColor Cyan
Write-Host ""
Write-Host "To test with your real IP, connect VPN client and the endpoint will be saved automatically" -ForegroundColor Yellow
