# Тест интеграции с Cryptomus
# Дата: 2026-02-01

$ErrorActionPreference = "Stop"

Write-Host "=== Тест интеграции с Cryptomus ===" -ForegroundColor Cyan
Write-Host ""

# Читаем токен
if (Test-Path "auth-token.txt") {
    $token = Get-Content "auth-token.txt" -Raw
} elseif (Test-Path "user-token.txt") {
    $token = Get-Content "user-token.txt" -Raw
} else {
    Write-Host "Токен не найден! Запустите: .\scripts\setup\get-auth-token.ps1" -ForegroundColor Red
    exit 1
}
$token = $token.Trim()

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$baseUrl = "http://localhost:3000/api/v1"

# Шаг 1: Проверяем текущий баланс
Write-Host "1. Проверяем текущий баланс..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/me" -Headers $headers -Method Get
    $currentBalance = $response.balance
    Write-Host "   Текущий баланс: $currentBalance RUB" -ForegroundColor Green
} catch {
    Write-Host "   Ошибка: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Шаг 2: Создаем платеж
Write-Host "2. Создаем платеж на 100 RUB..." -ForegroundColor Yellow
$paymentData = @{
    amount = 100
    currency = "RUB"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/payments/create" -Headers $headers -Method Post -Body $paymentData
    Write-Host "   Платеж создан!" -ForegroundColor Green
    Write-Host "   ID: $($response.payment.id)" -ForegroundColor Cyan
    Write-Host "   Order ID: $($response.payment.order_id)" -ForegroundColor Cyan
    Write-Host "   Status: $($response.payment.status)" -ForegroundColor Cyan
    
    if ($response.payment_url) {
        Write-Host "   Payment URL: $($response.payment_url)" -ForegroundColor Cyan
        Write-Host "   UUID: $($response.payment.payment_uuid)" -ForegroundColor Cyan
    } else {
        Write-Host "   Cryptomus не настроен (нет CRYPTOMUS_API_KEY)" -ForegroundColor Yellow
    }
    
    $paymentId = $response.payment.id
    $cryptomusConfigured = $response.payment_url -ne $null
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 503) {
        Write-Host "   Cryptomus не настроен!" -ForegroundColor Yellow
        Write-Host "   Это нормально для локальной разработки." -ForegroundColor Yellow
        Write-Host "   Для работы с реальными платежами добавьте в backend/.env:" -ForegroundColor Cyan
        Write-Host "   CRYPTOMUS_MERCHANT_ID=your_merchant_id" -ForegroundColor White
        Write-Host "   CRYPTOMUS_API_KEY=your_api_key" -ForegroundColor White
        Write-Host ""
        Write-Host "   Пропускаем остальные тесты..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "=== Тест завершен (Cryptomus не настроен) ===" -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "   Ошибка: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Шаг 3: Проверяем статус платежа
Write-Host "3. Проверяем статус платежа..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/payments/$paymentId/status" -Headers $headers -Method Get
    Write-Host "   Status: $($response.status)" -ForegroundColor Cyan
    Write-Host "   Amount: $($response.amount) $($response.currency)" -ForegroundColor Cyan
    
    if ($response.payment_uuid) {
        Write-Host "   UUID: $($response.payment_uuid)" -ForegroundColor Cyan
    }
    if ($response.payment_amount) {
        Write-Host "   Payment Amount: $($response.payment_amount) $($response.payer_currency)" -ForegroundColor Cyan
    }
    if ($response.network) {
        Write-Host "   Network: $($response.network)" -ForegroundColor Cyan
    }
    if ($response.address) {
        Write-Host "   Address: $($response.address)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   Ошибка: $_" -ForegroundColor Red
}

Write-Host ""

# Шаг 4: Проверяем историю платежей
Write-Host "4. Проверяем историю платежей..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/payments/history" -Headers $headers -Method Get
    Write-Host "   Всего платежей: $($response.total)" -ForegroundColor Green
    
    if ($response.payments.Count -gt 0) {
        Write-Host "   Последние платежи:" -ForegroundColor Cyan
        foreach ($payment in $response.payments | Select-Object -First 5) {
            Write-Host "   - ID: $($payment.id), Amount: $($payment.amount) $($payment.currency), Status: $($payment.status), Date: $($payment.created_at)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "   Ошибка: $_" -ForegroundColor Red
}

Write-Host ""

# Шаг 5: Симулируем webhook (только для тестирования)
Write-Host "5. Симуляция webhook (для тестирования)..." -ForegroundColor Yellow
Write-Host "   ВНИМАНИЕ: В продакшене webhook приходит от Cryptomus!" -ForegroundColor Yellow
Write-Host "   Для тестирования можно вручную обновить статус в БД:" -ForegroundColor Cyan
Write-Host "   docker exec vpn_postgres psql -U postgres -d vpn_3wg -c \"UPDATE payments SET status='paid' WHERE id=$paymentId\"" -ForegroundColor White

Write-Host ""

# Информация о настройке
Write-Host "=== Настройка Cryptomus ===" -ForegroundColor Cyan
Write-Host "Для работы с реальными платежами добавьте в backend/.env:" -ForegroundColor Yellow
Write-Host "CRYPTOMUS_MERCHANT_ID=your_merchant_id" -ForegroundColor White
Write-Host "CRYPTOMUS_API_KEY=your_api_key" -ForegroundColor White
Write-Host "BASE_URL=http://localhost:8080" -ForegroundColor White
Write-Host "API_URL=http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "После добавления перезапустите backend:" -ForegroundColor Yellow
Write-Host "cd backend && docker-compose restart backend" -ForegroundColor White

Write-Host ""
Write-Host "=== Тест завершен ===" -ForegroundColor Green
