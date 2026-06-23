# Скрипт для обновления настроек с порядком блоков

# Получаем токен админа
$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.token

Write-Host "✓ Авторизация успешна" -ForegroundColor Green

# Обновляем настройки с порядком блоков
$settings = @{
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
    block_order = @(
        "pricing_section",
        "keenetic_section",
        "vpn_section",
        "services_section",
        "hardware_section",
        "infrastructure_section",
        "faq_section",
        "articles_section",
        "telegram_section",
        "status_widget"
    )
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Обновляем настройки с порядком блоков..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/settings/homepage" -Method PUT -Body $settings -Headers $headers -ContentType "application/json"

Write-Host "✓ Настройки обновлены!" -ForegroundColor Green
Write-Host ""
Write-Host "Новый порядок блоков:" -ForegroundColor Yellow
Write-Host "  1. Hero секция (фиксированная)" -ForegroundColor White
$response.block_order | ForEach-Object -Begin { $i = 2 } -Process {
    Write-Host "  $i. $_" -ForegroundColor White
    $i++
}

Write-Host ""
Write-Host "Теперь Тарифы (pricing_section) будут выше VPN секции!" -ForegroundColor Green
