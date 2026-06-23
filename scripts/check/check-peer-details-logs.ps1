# Скрипт для проверки логов при открытии деталей пира
# Использование: запустите этот скрипт, затем откройте детали пира в браузере

Write-Host "Waiting for peer details request..." -ForegroundColor Yellow
Write-Host "Open peer details in browser now!" -ForegroundColor Green
Write-Host ""

# Показываем последние 100 строк логов и следим за новыми
docker logs vpn_backend --tail 100 --follow
