# Тест API endpoint для почасовой статистики трафика

$serverId = 1
$publicKey = "JJaE11Nd2IYQyUrFinBZGep1AG5iZ02ripLOPfe9xgg="  # test-laptop

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Тест почасовой статистики трафика" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Server ID: $serverId" -ForegroundColor Yellow
Write-Host "Public Key: $publicKey" -ForegroundColor Yellow
Write-Host ""

# Получаем токен (нужно залогиниться)
Write-Host "Логин..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"admin@3wg.ru","password":"admin123"}'

$token = $loginResponse.token
Write-Host "✓ Токен получен" -ForegroundColor Green
Write-Host ""

# Запрос почасовой статистики
Write-Host "Запрос почасовой статистики (последние 24 часа)..." -ForegroundColor Yellow
$encodedKey = [System.Web.HttpUtility]::UrlEncode($publicKey)
$url = "http://localhost:3000/api/v1/admin/servers/$serverId/wg/peers/traffic-hourly?publicKey=$encodedKey&hours=24"

Write-Host "URL: $url" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $token"
        }
    
    Write-Host "✓ Ответ получен!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "Count: $($response.count)" -ForegroundColor Cyan
    Write-Host ""
    
    if ($response.count -gt 0) {
        Write-Host "Данные:" -ForegroundColor Yellow
        $response.data | ForEach-Object {
            Write-Host "  $($_.hour): ↓ $([math]::Round($_.gb_received, 3)) GB, ↑ $([math]::Round($_.gb_sent, 3)) GB" -ForegroundColor White
        }
    } else {
        Write-Host "⚠ Нет данных за последние 24 часа" -ForegroundColor Yellow
        Write-Host "Данные начнут собираться автоматически каждый час" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "✗ Ошибка: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
