# Тестирование работы с пирами WGDashboard
# Использует API нашего бэкенда для управления пирами

$baseUrl = "http://localhost:3000/api/v1"
$serverId = 1

Write-Host "=== Тестирование работы с пирами WGDashboard ===" -ForegroundColor Cyan
Write-Host ""

# Логин
Write-Host "1. Авторизация..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "✓ Токен получен" -ForegroundColor Green
Write-Host ""

# Заголовки с токеном
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Получение списка пиров
Write-Host "2. Получение списка пиров..." -ForegroundColor Yellow
try {
    $peersResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$serverId/wg/peers" -Method GET -Headers $headers
    Write-Host "✓ Список пиров получен" -ForegroundColor Green
    Write-Host "Всего пиров: $($peersResponse.total)" -ForegroundColor Cyan
    
    if ($peersResponse.peers.Count -gt 0) {
        Write-Host "`nПиры:" -ForegroundColor Cyan
        foreach ($peer in $peersResponse.peers) {
            Write-Host "  - PublicKey: $($peer.publicKey)" -ForegroundColor White
            Write-Host "    AllowedIPs: $($peer.allowed_ip -join ', ')" -ForegroundColor Gray
        }
    } else {
        Write-Host "Пиров пока нет" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Ошибка получения пиров: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Генерация тестового ключа
Write-Host "3. Генерация тестового ключа..." -ForegroundColor Yellow
$privateKey = & wg genkey
$publicKey = $privateKey | & wg pubkey
Write-Host "✓ Ключи сгенерированы" -ForegroundColor Green
Write-Host "PublicKey: $publicKey" -ForegroundColor Cyan
Write-Host ""

# Добавление пира
Write-Host "4. Добавление тестового пира..." -ForegroundColor Yellow
try {
    $addPeerBody = @{
        public_key = $publicKey
        allowed_ips = @("10.16.11.100/32")
        name = "Test Peer $(Get-Date -Format 'HHmmss')"
    } | ConvertTo-Json

    $addResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$serverId/wg/peers" -Method POST -Headers $headers -Body $addPeerBody
    Write-Host "✓ Пир добавлен" -ForegroundColor Green
    Write-Host "Статус: $($addResponse.status)" -ForegroundColor Cyan
    Write-Host "Сообщение: $($addResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Ошибка добавления пира: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Проверка добавления
Write-Host "5. Проверка добавления пира..." -ForegroundColor Yellow
try {
    $peersResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$serverId/wg/peers" -Method GET -Headers $headers
    $addedPeer = $peersResponse.peers | Where-Object { $_.publicKey -eq $publicKey }
    
    if ($addedPeer) {
        Write-Host "✓ Пир найден в списке" -ForegroundColor Green
        Write-Host "PublicKey: $($addedPeer.publicKey)" -ForegroundColor Cyan
        Write-Host "AllowedIPs: $($addedPeer.allowed_ip -join ', ')" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Пир не найден в списке" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Ошибка проверки: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Удаление пира
Write-Host "6. Удаление тестового пира..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$serverId/wg/peers/$publicKey" -Method DELETE -Headers $headers
    Write-Host "✓ Пир удален" -ForegroundColor Green
    Write-Host "Статус: $($deleteResponse.status)" -ForegroundColor Cyan
    Write-Host "Сообщение: $($deleteResponse.message)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Ошибка удаления пира: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Проверка удаления
Write-Host "7. Проверка удаления пира..." -ForegroundColor Yellow
try {
    $peersResponse = Invoke-RestMethod -Uri "$baseUrl/admin/servers/$serverId/wg/peers" -Method GET -Headers $headers
    $deletedPeer = $peersResponse.peers | Where-Object { $_.publicKey -eq $publicKey }
    
    if ($deletedPeer) {
        Write-Host "✗ Пир все еще в списке" -ForegroundColor Red
    } else {
        Write-Host "✓ Пир успешно удален" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Ошибка проверки: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Тестирование завершено ===" -ForegroundColor Cyan
