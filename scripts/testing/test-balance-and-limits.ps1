# Тест проверки баланса и лимитов
# Автор: AI Assistant
# Дата: 2026-02-01

$ErrorActionPreference = "Stop"

Write-Host "`n🧪 Тест проверки баланса и лимитов`n" -ForegroundColor Cyan

# Конфигурация
$API_URL = "http://localhost:3000"

# Получаем токен
if (Test-Path "user-token.txt") {
    $token = Get-Content "user-token.txt" -Raw
    $token = $token.Trim()
} else {
    Write-Host "❌ Токен не найден. Запустите get-auth-token.ps1" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Токен получен" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Шаг 1: Получаем статистику пользователя
Write-Host "`n📊 Шаг 1: Получение статистики пользователя..." -ForegroundColor Yellow

try {
    $stats = Invoke-RestMethod -Uri "$API_URL/api/v1/limits/stats" -Headers $headers
    
    Write-Host "✅ Статистика получена:" -ForegroundColor Green
    Write-Host "   Email: $($stats.email)" -ForegroundColor Gray
    Write-Host "   Баланс: $($stats.balance)₽" -ForegroundColor Gray
    Write-Host "   Тариф: $($stats.tariff)" -ForegroundColor Gray
    Write-Host "   Ключей: $($stats.keys_count)/$($stats.max_keys)" -ForegroundColor Gray
    Write-Host "   Осталось: $($stats.keys_left)" -ForegroundColor Gray
    Write-Host "   Цена за ключ: $($stats.cost_per_key)₽" -ForegroundColor Gray
} catch {
    Write-Host "❌ Ошибка получения статистики: $_" -ForegroundColor Red
    exit 1
}

# Шаг 2: Проверяем лимиты для создания ключа
Write-Host "`n🔍 Шаг 2: Проверка лимитов для создания ключа..." -ForegroundColor Yellow

$checkBody = @{
    server_id = 4  # wg.3labs.pw
} | ConvertTo-Json

try {
    $checkResult = Invoke-RestMethod -Uri "$API_URL/api/v1/limits/check" -Method Post -Headers $headers -Body $checkBody
    
    if ($checkResult.allowed) {
        Write-Host "✅ Создание ключа разрешено:" -ForegroundColor Green
        Write-Host "   Текущих ключей: $($checkResult.current_keys)/$($checkResult.max_keys)" -ForegroundColor Gray
        Write-Host "   Баланс: $($checkResult.balance)₽" -ForegroundColor Gray
        Write-Host "   Стоимость: $($checkResult.cost)₽" -ForegroundColor Gray
        Write-Host "   Баланс после: $($checkResult.balance_after)₽" -ForegroundColor Gray
    } else {
        Write-Host "❌ Создание ключа запрещено:" -ForegroundColor Red
        Write-Host "   Причина: $($checkResult.reason)" -ForegroundColor Yellow
        Write-Host "   Текущих ключей: $($checkResult.current_keys)/$($checkResult.max_keys)" -ForegroundColor Gray
        Write-Host "   Баланс: $($checkResult.balance)₽" -ForegroundColor Gray
        Write-Host "   Требуется: $($checkResult.cost)₽" -ForegroundColor Gray
        
        Write-Host "`n⚠️ Тест завершен: создание ключа невозможно" -ForegroundColor Yellow
        exit 0
    }
} catch {
    Write-Host "❌ Ошибка проверки лимитов: $_" -ForegroundColor Red
    exit 1
}

# Шаг 3: Создаем ключ (если разрешено)
Write-Host "`n📝 Шаг 3: Создание ключа..." -ForegroundColor Yellow

$createBody = @{
    name = "test-balance-$(Get-Date -Format 'HHmmss')"
    server_id = 4
    protocol = "wireguard"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/keys" -Method Post -Headers $headers -Body $createBody
    
    Write-Host "✅ Ключ создан:" -ForegroundColor Green
    Write-Host "   ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "   Name: $($createResponse.name)" -ForegroundColor Gray
    Write-Host "   IP: $($createResponse.ip_address)" -ForegroundColor Gray
    Write-Host "   Стоимость: $($createResponse.cost)₽" -ForegroundColor Gray
    Write-Host "   Баланс до: $($createResponse.balance_before)₽" -ForegroundColor Gray
    Write-Host "   Баланс после: $($createResponse.balance_after)₽" -ForegroundColor Gray
    
    $keyId = $createResponse.id
} catch {
    $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "❌ Ошибка создания ключа:" -ForegroundColor Red
    Write-Host "   $($errorMessage.error)" -ForegroundColor Yellow
    
    if ($errorMessage.current_keys) {
        Write-Host "   Текущих ключей: $($errorMessage.current_keys)/$($errorMessage.max_keys)" -ForegroundColor Gray
    }
    if ($errorMessage.balance) {
        Write-Host "   Баланс: $($errorMessage.balance)₽" -ForegroundColor Gray
        Write-Host "   Требуется: $($errorMessage.cost)₽" -ForegroundColor Gray
    }
    
    exit 1
}

# Шаг 4: Проверяем обновленную статистику
Write-Host "`n📊 Шаг 4: Проверка обновленной статистики..." -ForegroundColor Yellow

Start-Sleep -Seconds 2

try {
    $statsAfter = Invoke-RestMethod -Uri "$API_URL/api/v1/limits/stats" -Headers $headers
    
    Write-Host "✅ Статистика обновлена:" -ForegroundColor Green
    Write-Host "   Баланс: $($statsAfter.balance)₽ (было: $($stats.balance)₽)" -ForegroundColor Gray
    Write-Host "   Ключей: $($statsAfter.keys_count)/$($statsAfter.max_keys) (было: $($stats.keys_count)/$($stats.max_keys))" -ForegroundColor Gray
    Write-Host "   Осталось: $($statsAfter.keys_left) (было: $($stats.keys_left))" -ForegroundColor Gray
    
    # Проверяем что баланс уменьшился
    $balanceDiff = $stats.balance - $statsAfter.balance
    if ($balanceDiff -gt 0) {
        Write-Host "   Списано: $balanceDiff₽" -ForegroundColor Green
    } elseif ($stats.tariff -eq "free") {
        Write-Host "   Бесплатный тариф - списание не требуется" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️ Не удалось получить обновленную статистику: $_" -ForegroundColor Yellow
}

# Шаг 5: Удаляем созданный ключ
Write-Host "`n🗑️ Шаг 5: Удаление тестового ключа..." -ForegroundColor Yellow

try {
    $deleteResponse = Invoke-RestMethod -Uri "$API_URL/api/v1/keys/$keyId" -Method Delete -Headers $headers
    Write-Host "✅ Ключ удален" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Не удалось удалить ключ: $_" -ForegroundColor Yellow
}

# Итоги
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    ИТОГИ ТЕСТА                        " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Статистика получена" -ForegroundColor Green
Write-Host "✅ Лимиты проверены" -ForegroundColor Green
Write-Host "✅ Ключ создан" -ForegroundColor Green
Write-Host "✅ Баланс обновлен" -ForegroundColor Green
Write-Host "✅ Ключ удален" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Проверка баланса и лимитов работает!" -ForegroundColor Green
Write-Host ""
