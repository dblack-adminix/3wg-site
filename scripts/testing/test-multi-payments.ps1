# Тестирование мультипровайдерной системы платежей
# Этот скрипт тестирует работу с ЮKassa и Cryptomus

$baseUrl = "http://localhost:3000/api/v1"
$token = ""

# Функция для получения токена
function Get-AuthToken {
    Write-Host "=== ПОЛУЧЕНИЕ ТОКЕНА ===" -ForegroundColor Yellow
    
    $loginData = @{
        email = "admin@3wg.ru"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✓ Токен получен успешно" -ForegroundColor Green
        return $response.token
    }
    catch {
        Write-Host "✗ Ошибка получения токена: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Функция для создания платежа с выбором провайдера
function Create-PaymentWithProvider {
    param($token, $amount, $currency = "RUB", $provider = $null)
    
    Write-Host "`n=== СОЗДАНИЕ ПЛАТЕЖА ===" -ForegroundColor Yellow
    Write-Host "Сумма: $amount $currency" -ForegroundColor Cyan
    if ($provider) {
        Write-Host "Провайдер: $provider" -ForegroundColor Cyan
    } else {
        Write-Host "Провайдер: по умолчанию" -ForegroundColor Cyan
    }
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $paymentData = @{
        amount = $amount
        currency = $currency
    }
    
    if ($provider) {
        $paymentData.provider = $provider
    }
    
    $paymentJson = $paymentData | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/payments/create" -Method POST -Headers $headers -Body $paymentJson
        Write-Host "✓ Платеж создан успешно" -ForegroundColor Green
        Write-Host "ID платежа: $($response.payment.id)" -ForegroundColor Cyan
        Write-Host "Order ID: $($response.payment.order_id)" -ForegroundColor Cyan
        Write-Host "Статус: $($response.payment.status)" -ForegroundColor Cyan
        Write-Host "Провайдер: $($response.provider)" -ForegroundColor Cyan
        
        if ($response.payment_url) {
            Write-Host "URL для оплаты: $($response.payment_url)" -ForegroundColor Magenta
        }
        
        return $response
    }
    catch {
        Write-Host "✗ Ошибка создания платежа: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Детали ошибки: $errorBody" -ForegroundColor Red
        }
        return $null
    }
}

# Функция для получения истории платежей
function Get-PaymentHistory {
    param($token)
    
    Write-Host "`n=== ИСТОРИЯ ПЛАТЕЖЕЙ ===" -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/payments/history" -Method GET -Headers $headers
        Write-Host "✓ История платежей получена" -ForegroundColor Green
        Write-Host "Количество платежей: $($response.payments.Count)" -ForegroundColor Cyan
        
        foreach ($payment in $response.payments) {
            $provider = if ($payment.method) { $payment.method } else { "Unknown" }
            Write-Host "  ID: $($payment.id) | Сумма: $($payment.amount) $($payment.currency) | Статус: $($payment.status) | Провайдер: $provider" -ForegroundColor White
        }
        
        return $response
    }
    catch {
        Write-Host "✗ Ошибка получения истории: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Основной тест
Write-Host "🚀 ТЕСТИРОВАНИЕ МУЛЬТИПРОВАЙДЕРНОЙ СИСТЕМЫ ПЛАТЕЖЕЙ" -ForegroundColor Magenta
Write-Host "====================================================" -ForegroundColor Magenta

# 1. Получаем токен
$token = Get-AuthToken
if (-not $token) {
    Write-Host "❌ Не удалось получить токен. Завершение теста." -ForegroundColor Red
    exit 1
}

# 2. Получаем текущую историю
$history = Get-PaymentHistory -token $token

# 3. Тестируем создание платежа с ЮKassa
Write-Host "`nТестируем ЮKassa..." -ForegroundColor Yellow
$yooPayment = Create-PaymentWithProvider -token $token -amount 500 -currency "RUB" -provider "yookassa"

Start-Sleep -Seconds 2

# 4. Тестируем создание платежа с Cryptomus
Write-Host "`nТестируем Cryptomus..." -ForegroundColor Yellow
$cryptoPayment = Create-PaymentWithProvider -token $token -amount 500 -currency "RUB" -provider "cryptomus"

Start-Sleep -Seconds 2

# 5. Тестируем создание платежа без указания провайдера (по умолчанию)
Write-Host "`nТестируем провайдер по умолчанию..." -ForegroundColor Yellow
$defaultPayment = Create-PaymentWithProvider -token $token -amount 500 -currency "RUB"

Start-Sleep -Seconds 2

# 6. Получаем обновленную историю
Write-Host "`nПолучаем обновленную историю..." -ForegroundColor Yellow
Get-PaymentHistory -token $token

Write-Host "`n✅ ТЕСТ ЗАВЕРШЕН" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green

Write-Host "`n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:" -ForegroundColor Cyan
if ($yooPayment) {
    Write-Host "• ЮKassa: ✓ Работает" -ForegroundColor Green
} else {
    Write-Host "• ЮKassa: ✗ Ошибка (возможно не настроен)" -ForegroundColor Yellow
}

if ($cryptoPayment) {
    Write-Host "• Cryptomus: ✓ Работает" -ForegroundColor Green
} else {
    Write-Host "• Cryptomus: ✗ Ошибка (возможно не настроен)" -ForegroundColor Yellow
}

if ($defaultPayment) {
    Write-Host "• Провайдер по умолчанию: ✓ Работает" -ForegroundColor Green
} else {
    Write-Host "• Провайдер по умолчанию: ✗ Ошибка" -ForegroundColor Red
}

Write-Host "`n🔧 НАСТРОЙКА ПРОВАЙДЕРОВ:" -ForegroundColor Cyan
Write-Host "Для полного тестирования настройте переменные в backend/.env:" -ForegroundColor White
Write-Host "• YOOKASSA_SHOP_ID=your_shop_id" -ForegroundColor White
Write-Host "• YOOKASSA_SECRET_KEY=your_secret_key" -ForegroundColor White
Write-Host "• CRYPTOMUS_MERCHANT_ID=your_merchant_id" -ForegroundColor White
Write-Host "• CRYPTOMUS_API_KEY=your_api_key" -ForegroundColor White