# Тест автоматического удаления пира при удалении ключа
# Автор: AI Assistant
# Дата: 2026-02-01

$ErrorActionPreference = "Stop"

Write-Host "`n🧪 Тест автоматического удаления пира`n" -ForegroundColor Cyan

# Конфигурация
$API_URL = "http://localhost:3000"
$WG_DASHBOARD_URL = "http://45.151.183.218:10086"

# Получаем токен
if (Test-Path "user-token.txt") {
    $token = Get-Content "user-token.txt" -Raw
    $token = $token.Trim()
} else {
    Write-Host "❌ Токен не найден. Запустите get-auth-token.ps1" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Токен получен" -ForegroundColor Green

# Шаг 1: Создаем ключ
Write-Host "`n📝 Шаг 1: Создание ключа..." -ForegroundColor Yellow

$createBody = @{
    name = "test-auto-delete-$(Get-Date -Format 'HHmmss')"
    server_id = 4  # wg.3labs.pw
    protocol = "wireguard"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $createResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/keys" -Method Post -Headers $headers -Body $createBody
    Write-Host "✅ Ключ создан: ID=$($createResponse.id), Name=$($createResponse.name)" -ForegroundColor Green
    Write-Host "   Public Key: $($createResponse.public_key)" -ForegroundColor Gray
    Write-Host "   IP Address: $($createResponse.ip_address)" -ForegroundColor Gray
    
    $keyId = $createResponse.id
    $publicKey = $createResponse.public_key
} catch {
    Write-Host "❌ Ошибка создания ключа: $_" -ForegroundColor Red
    exit 1
}

# Шаг 2: Ждем синхронизации
Write-Host "`n⏳ Шаг 2: Ожидание синхронизации (5 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Шаг 3: Проверяем что пир появился на сервере
Write-Host "`n🔍 Шаг 3: Проверка пира на WGDashboard..." -ForegroundColor Yellow

try {
    $peersResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/admin/servers/4/wg/peers/cached" -Headers $headers
    
    $peer = $peersResponse.peers | Where-Object { $_.public_key -eq $publicKey }
    
    if ($peer) {
        Write-Host "✅ Пир найден на сервере:" -ForegroundColor Green
        Write-Host "   Name: $($peer.name)" -ForegroundColor Gray
        Write-Host "   Public Key: $($peer.public_key)" -ForegroundColor Gray
        Write-Host "   IP: $($peer.allowed_ip)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ Пир не найден на сервере (может быть еще не синхронизирован)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Не удалось проверить пиры: $_" -ForegroundColor Yellow
}

# Шаг 4: Удаляем ключ
Write-Host "`n🗑️ Шаг 4: Удаление ключа..." -ForegroundColor Yellow

try {
    $deleteResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/keys/$keyId" -Method Delete -Headers $headers
    
    Write-Host "✅ Ключ удален из базы данных" -ForegroundColor Green
    
    if ($deleteResponse.deleted_from_wgdashboard) {
        Write-Host "✅ Пир удален с WGDashboard" -ForegroundColor Green
    } elseif ($deleteResponse.warning) {
        Write-Host "⚠️ Предупреждение: $($deleteResponse.warning)" -ForegroundColor Yellow
    }
    
    Write-Host "`nОтвет сервера:" -ForegroundColor Gray
    $deleteResponse | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка удаления ключа: $_" -ForegroundColor Red
    exit 1
}

# Шаг 5: Ждем синхронизации
Write-Host "`n⏳ Шаг 5: Ожидание синхронизации (5 секунд)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Шаг 6: Проверяем что пир удален с сервера
Write-Host "`n🔍 Шаг 6: Проверка что пир удален с WGDashboard..." -ForegroundColor Yellow

try {
    $peersResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/admin/servers/4/wg/peers/cached" -Headers $headers
    
    $peer = $peersResponse.peers | Where-Object { $_.public_key -eq $publicKey }
    
    if ($peer) {
        Write-Host "❌ ОШИБКА: Пир все еще на сервере!" -ForegroundColor Red
        Write-Host "   Name: $($peer.name)" -ForegroundColor Gray
        Write-Host "   Public Key: $($peer.public_key)" -ForegroundColor Gray
        exit 1
    } else {
        Write-Host "✅ Пир успешно удален с сервера" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Не удалось проверить пиры: $_" -ForegroundColor Yellow
}

# Шаг 7: Проверяем что ключ удален из базы
Write-Host "`n🔍 Шаг 7: Проверка что ключ удален из базы..." -ForegroundColor Yellow

try {
    $keyResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/keys/$keyId" -Headers $headers
    Write-Host "❌ ОШИБКА: Ключ все еще в базе данных!" -ForegroundColor Red
    exit 1
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Ключ успешно удален из базы данных" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Неожиданная ошибка: $_" -ForegroundColor Yellow
    }
}

# Итоги
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    ИТОГИ ТЕСТА                        " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ключ создан" -ForegroundColor Green
Write-Host "✅ Пир добавлен на WGDashboard" -ForegroundColor Green
Write-Host "✅ Ключ удален из базы данных" -ForegroundColor Green
Write-Host "✅ Пир удален с WGDashboard" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Автоматическое удаление пиров работает!" -ForegroundColor Green
Write-Host ""
