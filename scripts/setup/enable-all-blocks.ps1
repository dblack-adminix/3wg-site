# Скрипт для включения всех блоков на главной странице

# Получаем токен админа
$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.token

Write-Host "✓ Авторизация успешна" -ForegroundColor Green

# Включаем все блоки
$allEnabled = @{
    hero_section = $true
    keenetic_section = $true
    vpn_section = $true
    services_section = $true
    pricing_section = $true
    hardware_section = $true
    infrastructure_section = $true
    faq_section = $true
    articles_section = $true
    telegram_section = $true
    status_widget = $true
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Включаем все блоки..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/settings/homepage" -Method PUT -Body $allEnabled -Headers $headers -ContentType "application/json"

Write-Host "✓ Все блоки включены!" -ForegroundColor Green
$response | ConvertTo-Json

Write-Host ""
Write-Host "Проверяем результат..." -ForegroundColor Cyan
$currentSettings = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/settings/homepage" -Method GET
$enabledCount = ($currentSettings.PSObject.Properties | Where-Object { $_.Value -eq $true }).Count
Write-Host "✓ Включено блоков: $enabledCount из 11" -ForegroundColor Green
