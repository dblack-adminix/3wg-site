# Демонстрация Drag & Drop - Перемещение блоков

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Демонстрация Drag & Drop" -ForegroundColor Cyan
Write-Host "  Перемещение блоков на главной странице" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Получаем токен админа
Write-Host "1. Авторизация..." -ForegroundColor Yellow
$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.token
Write-Host "   ✓ Успешно!" -ForegroundColor Green
Write-Host ""

# Показываем текущий порядок
Write-Host "2. Текущий порядок блоков:" -ForegroundColor Yellow
$currentSettings = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/settings/homepage" -Method GET

$defaultOrder = @(
    "keenetic_section",
    "vpn_section",
    "pricing_section",
    "services_section",
    "hardware_section",
    "infrastructure_section",
    "faq_section",
    "articles_section",
    "telegram_section",
    "status_widget"
)

$blockNames = @{
    "keenetic_section" = "Keenetic прошивка"
    "vpn_section" = "VPN секция"
    "pricing_section" = "Тарифы"
    "services_section" = "Услуги"
    "hardware_section" = "Оборудование"
    "infrastructure_section" = "Инфраструктура"
    "faq_section" = "FAQ"
    "articles_section" = "Статьи"
    "telegram_section" = "Telegram"
    "status_widget" = "Статус систем"
}

$order = if ($currentSettings.block_order) { $currentSettings.block_order } else { $defaultOrder }

Write-Host "   #1 Hero секция (фиксированная)" -ForegroundColor White
$i = 2
foreach ($key in $order) {
    $name = $blockNames[$key]
    Write-Host "   #$i $name" -ForegroundColor White
    $i++
}
Write-Host ""

# Создаем новый порядок: Тарифы на второе место
Write-Host "3. Перемещаем 'Тарифы' на второе место..." -ForegroundColor Yellow

$newOrder = @(
    "pricing_section",      # Тарифы теперь #2
    "keenetic_section",     # Keenetic теперь #3
    "vpn_section",          # VPN теперь #4
    "services_section",
    "hardware_section",
    "infrastructure_section",
    "faq_section",
    "articles_section",
    "telegram_section",
    "status_widget"
)

$newSettings = @{
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
    block_order = $newOrder
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/settings/homepage" -Method PUT -Body $newSettings -Headers $headers -ContentType "application/json"
Write-Host "   ✓ Порядок изменен!" -ForegroundColor Green
Write-Host ""

# Показываем новый порядок
Write-Host "4. Новый порядок блоков:" -ForegroundColor Yellow
Write-Host "   #1 Hero секция (фиксированная)" -ForegroundColor White
$i = 2
foreach ($key in $newOrder) {
    $name = $blockNames[$key]
    if ($key -eq "pricing_section") {
        Write-Host "   #$i $name" -ForegroundColor Green -NoNewline
        Write-Host " ← Переместили сюда!" -ForegroundColor Yellow
    } else {
        Write-Host "   #$i $name" -ForegroundColor White
    }
    $i++
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Демонстрация завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "Откройте главную страницу и обновите:" -ForegroundColor Cyan
Write-Host "  http://localhost:8080/" -ForegroundColor White
Write-Host ""
Write-Host "Теперь блок 'Тарифы' будет вторым!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
