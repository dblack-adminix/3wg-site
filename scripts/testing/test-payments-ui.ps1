# Тестирование UI платежей
# Этот скрипт запускает фронтенд и открывает страницы для тестирования

Write-Host "🎨 ТЕСТИРОВАНИЕ UI ПЛАТЕЖЕЙ" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Magenta

# Проверяем что мы в корневой директории проекта
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Запустите скрипт из корневой директории проекта" -ForegroundColor Red
    exit 1
}

# Проверяем что node_modules установлены
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
    npm install
}

Write-Host "🚀 Запускаем фронтенд..." -ForegroundColor Green
Write-Host "Фронтенд будет доступен по адресу: http://localhost:5173" -ForegroundColor Cyan

# Ждем немного и открываем браузер
Start-Process "cmd" -ArgumentList "/c timeout /t 5 >nul && start http://localhost:5173/account" -WindowStyle Hidden

Write-Host "`n📋 СТРАНИЦЫ ДЛЯ ТЕСТИРОВАНИЯ:" -ForegroundColor Yellow
Write-Host "• Личный кабинет (платежи): http://localhost:5173/account" -ForegroundColor White
Write-Host "• Мобильное пополнение: http://localhost:5173/deposit" -ForegroundColor White
Write-Host "• Мобильный дашборд: http://localhost:5173/dashboard" -ForegroundColor White

Write-Host "`n🔧 ЧТО ТЕСТИРОВАТЬ:" -ForegroundColor Yellow
Write-Host "1. Откройте личный кабинет и перейдите на вкладку 'Платежи'" -ForegroundColor White
Write-Host "2. Нажмите 'Пополнить баланс' - должно открыться модальное окно" -ForegroundColor White
Write-Host "3. Введите сумму (минимум 100₽) и нажмите 'Создать платеж'" -ForegroundColor White
Write-Host "4. Проверьте что платеж появился в истории" -ForegroundColor White
Write-Host "5. Откройте мобильную версию пополнения (/deposit)" -ForegroundColor White
Write-Host "6. Проверьте что суммы отображаются в рублях" -ForegroundColor White

Write-Host "`n⚠️  ВАЖНО:" -ForegroundColor Red
Write-Host "• Убедитесь что бэкенд запущен (npm run dev в папке backend)" -ForegroundColor White
Write-Host "• Для реальных платежей нужны настройки Cryptomus в .env" -ForegroundColor White
Write-Host "• Без настроек Cryptomus будут показаны fallback данные" -ForegroundColor White

Write-Host "`n🎯 Нажмите Ctrl+C для остановки фронтенда" -ForegroundColor Cyan

# Запускаем фронтенд
npm run dev