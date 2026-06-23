# Проверка пира через backend API

Write-Host "Checking peer 'test-laptop' from database cache..." -ForegroundColor Yellow
Write-Host ""

# Проверяем в БД
docker exec vpn_postgres psql -U postgres -d vpn_3wg -c "SELECT name, public_key, endpoint, latest_handshake, status FROM wg_peers_cache WHERE name = 'test-laptop' AND server_id = 1;"

Write-Host ""
Write-Host "If endpoint is '0.0.0.0/0' or '(none)', the peer has not connected yet." -ForegroundColor Yellow
Write-Host "WireGuard only stores endpoint while peer is connected or recently connected." -ForegroundColor Yellow
