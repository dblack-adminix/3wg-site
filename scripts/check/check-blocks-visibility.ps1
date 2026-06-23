# Скрипт для проверки видимости блоков на главной странице

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Проверка блоков главной страницы" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Получаем настройки
$settings = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/settings/homepage" -Method GET

# Список всех блоков с описанием
$blocks = @(
    @{ key = "hero_section"; name = "Hero секция"; component = "HeroSection" }
    @{ key = "keenetic_section"; name = "Keenetic прошивка"; component = "Keenetic секция" }
    @{ key = "vpn_section"; name = "VPN секция"; component = "VPNSection" }
    @{ key = "services_section"; name = "Услуги"; component = "MiniAppShowcase" }
    @{ key = "pricing_section"; name = "Тарифы"; component = "PricingSection" }
    @{ key = "hardware_section"; name = "Оборудование"; component = "HardwareSection" }
    @{ key = "infrastructure_section"; name = "Инфраструктура"; component = "InfrastructureSection" }
    @{ key = "faq_section"; name = "FAQ"; component = "FAQSection" }
    @{ key = "articles_section"; name = "Статьи"; component = "ArticlesSection" }
    @{ key = "telegram_section"; name = "Telegram"; component = "TelegramSection" }
    @{ key = "status_widget"; name = "Статус систем"; component = "StatusWidget" }
)

$enabledCount = 0
$disabledCount = 0

Write-Host "Статус блоков:" -ForegroundColor Yellow
Write-Host ""

foreach ($block in $blocks) {
    $isEnabled = $settings.($block.key)
    
    if ($isEnabled) {
        Write-Host "  ✓" -ForegroundColor Green -NoNewline
        Write-Host " $($block.name)" -ForegroundColor White -NoNewline
        Write-Host " ($($block.component))" -ForegroundColor Gray
        $enabledCount++
    } else {
        Write-Host "  ✗" -ForegroundColor Red -NoNewline
        Write-Host " $($block.name)" -ForegroundColor DarkGray -NoNewline
        Write-Host " ($($block.component))" -ForegroundColor DarkGray
        $disabledCount++
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Итого:" -ForegroundColor Yellow
Write-Host "  Включено: $enabledCount" -ForegroundColor Green
Write-Host "  Отключено: $disabledCount" -ForegroundColor Red
Write-Host "  Всего: $($blocks.Count)" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($enabledCount -eq $blocks.Count) {
    Write-Host "✓ Все блоки включены!" -ForegroundColor Green
} elseif ($disabledCount -eq $blocks.Count) {
    Write-Host "⚠ Все блоки отключены!" -ForegroundColor Yellow
} else {
    Write-Host "ℹ Некоторые блоки отключены" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Откройте http://localhost:8080/ для проверки" -ForegroundColor Cyan
