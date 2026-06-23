# Тестирование системы платежей
# Этот скрипт тестирует создание платежей и получение истории

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
            Write-Host "  ID: $($payment.id) | Сумма: $($payment.amount) $($payment.currency) | Статус: $($payment.status)" -ForegroundColor White
        }
        
        return $response
    }
    catch {
        Write-Host "✗ Ошибка получения истории: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Функция для создания платежа
function Create-Payment {
    param($token, $amount, $currency = "RUB")
    
    Write-Host "`n=== СОЗДАНИЕ ПЛАТЕЖА ===" -ForegroundColor Yellow
    Write-Host "Сумма: $amount $currency" -ForegroundColor Cyan
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $paymentData = @{
        amount = $amount
        currency = $currency
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/payments/create" -Method POST -Headers $headers -Body $paymentData
        Write-Host "✓ Платеж создан успешно" -ForegroundColor Green
        Write-Host "ID платежа: $($response.payment.id)" -ForegroundColor Cyan
        Write-Host "Order ID: $($response.payment.order_id)" -ForegroundColor Cyan
        Write-Host "Статус: $($response.payment.status)" -ForegroundColor Cyan
        
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

# Функция для проверки статуса платежа
function Get-PaymentStatus {
    param($token, $paymentId)
    
    Write-Host "`n=== СТАТУС ПЛАТЕЖА ===" -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/payments/$paymentId/status" -Method GET -Headers $headers
        Write-Host "✓ Статус получен" -ForegroundColor Green
        Write-Host "ID: $($response.id)" -ForegroundColor Cyan
        Write-Host "Сумма: $($response.amount) $($response.currency)" -ForegroundColor Cyan
        Write-Host "Статус: $($response.status)" -ForegroundColor Cyan
        Write-Host "Метод: $($response.method)" -ForegroundColor Cyan
        
        if ($response.payment_url) {
            Write-Host "URL: $($response.payment_url)" -ForegroundColor Magenta
        }
        
        return $response
    }
    catch {
        Write-Host "✗ Ошибка получения статуса: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Основной тест
Write-Host "🚀 ТЕСТИРОВАНИЕ СИСТЕМЫ ПЛАТЕЖЕЙ" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta

# 1. Получаем токен
$token = Get-AuthToken
if (-not $token) {
    Write-Host "❌ Не удалось получить токен. Завершение теста." -ForegroundColor Red
    exit 1
}

# 2. Получаем текущую историю
$history = Get-PaymentHistory -token $token

# 3. Создаем тестовый платеж
Write-Host "`nСоздаем тестовый платеж на 500 рублей..." -ForegroundColor Yellow
$payment = Create-Payment -token $token -amount 500 -currency "RUB"

if ($payment) {
    # 4. Проверяем статус созданного платежа
    Start-Sleep -Seconds 2
    Get-PaymentStatus -token $token -paymentId $payment.payment.id
    
    # 5. Получаем обновленную историю
    Write-Host "`nПолучаем обновленную историю..." -ForegroundColor Yellow
    Get-PaymentHistory -token $token
}

Write-Host "`n✅ ТЕСТ ЗАВЕРШЕН" -ForegroundColor Green
Write-Host "Проверьте логи бэкенда для дополнительной информации" -ForegroundColor Cyan