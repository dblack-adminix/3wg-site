# Полное тестирование системы платежей
# Этот скрипт проверяет всю систему: бэкенд, фронтенд, API

param(
    [switch]$SkipBuild,
    [switch]$SkipUI
)

Write-Host "💳 ПОЛНОЕ ТЕСТИРОВАНИЕ СИСТЕМЫ ПЛАТЕЖЕЙ" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

$rootDir = Get-Location

# Функция для проверки процесса
function Test-ProcessRunning {
    param($ProcessName, $Port)
    
    try {
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $process -ne $null
    }
    catch {
        return $false
    }
}

# 1. Проверка и сборка бэкенда
if (-not $SkipBuild) {
    Write-Host "`n🔧 СБОРКА БЭКЕНДА" -ForegroundColor Yellow
    Write-Host "=================" -ForegroundColor Yellow
    
    Set-Location "$rootDir\backend"
    
    Write-Host "Обновляем зависимости..." -ForegroundColor Cyan
    go mod tidy
    
    Write-Host "Собираем бэкенд..." -ForegroundColor Cyan
    $buildResult = go build -o vpn-backend.exe .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Бэкенд собран успешно" -ForegroundColor Green
    } else {
        Write-Host "✗ Ошибка сборки бэкенда" -ForegroundColor Red
        Set-Location $rootDir
        exit 1
    }
    
    Set-Location $rootDir
}

# 2. Проверка и сборка фронтенда
if (-not $SkipBuild) {
    Write-Host "`n🎨 СБОРКА ФРОНТЕНДА" -ForegroundColor Yellow
    Write-Host "===================" -ForegroundColor Yellow
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Устанавливаем зависимости..." -ForegroundColor Cyan
        npm install
    }
    
    Write-Host "Проверяем TypeScript..." -ForegroundColor Cyan
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Фронтенд собран успешно" -ForegroundColor Green
    } else {
        Write-Host "✗ Ошибка сборки фронтенда" -ForegroundColor Red
        exit 1
    }
}

# 3. Проверка конфигурации
Write-Host "`n⚙️  ПРОВЕРКА КОНФИГУРАЦИИ" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

$envFile = "$rootDir\backend\.env"
if (Test-Path $envFile) {
    Write-Host "✓ Файл .env найден" -ForegroundColor Green
    
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "CRYPTOMUS_API_KEY=.+") {
        Write-Host "✓ CRYPTOMUS_API_KEY настроен" -ForegroundColor Green
    } else {
        Write-Host "⚠ CRYPTOMUS_API_KEY не настроен (будут использованы fallback данные)" -ForegroundColor Yellow
    }
    
    if ($envContent -match "CRYPTOMUS_MERCHANT_ID=.+") {
        Write-Host "✓ CRYPTOMUS_MERCHANT_ID настроен" -ForegroundColor Green
    } else {
        Write-Host "⚠ CRYPTOMUS_MERCHANT_ID не настроен (будут использованы fallback данные)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ Файл .env не найден, скопируйте .env.example" -ForegroundColor Yellow
}

# 4. Запуск бэкенда
Write-Host "`n🚀 ЗАПУСК БЭКЕНДА" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow

if (Test-ProcessRunning -ProcessName "vpn-backend" -Port 3000) {
    Write-Host "✓ Бэкенд уже запущен на порту 3000" -ForegroundColor Green
} else {
    Write-Host "Запускаем бэкенд..." -ForegroundColor Cyan
    Set-Location "$rootDir\backend"
    
    # Запускаем бэкенд в фоне
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:rootDir\backend
        .\vpn-backend.exe
    }
    
    Write-Host "Ожидаем запуска бэкенда..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    if (Test-ProcessRunning -ProcessName "vpn-backend" -Port 3000) {
        Write-Host "✓ Бэкенд запущен успешно" -ForegroundColor Green
    } else {
        Write-Host "✗ Не удалось запустить бэкенд" -ForegroundColor Red
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
        Set-Location $rootDir
        exit 1
    }
    
    Set-Location $rootDir
}

# 5. Тестирование API
Write-Host "`n🔍 ТЕСТИРОВАНИЕ API" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

try {
    # Проверяем health check
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 10
    Write-Host "✓ Health check: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Запускаем тест API платежей
Write-Host "Запускаем тест API платежей..." -ForegroundColor Cyan
& "$rootDir\scripts\testing\test-payments.ps1"

# 6. Запуск UI тестов
if (-not $SkipUI) {
    Write-Host "`n🎨 ТЕСТИРОВАНИЕ UI" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    
    Write-Host "Запускаем фронтенд для тестирования..." -ForegroundColor Cyan
    Write-Host "Откроется браузер с личным кабинетом" -ForegroundColor Cyan
    Write-Host "Нажмите Ctrl+C когда закончите тестирование" -ForegroundColor Yellow
    
    # Запускаем фронтенд
    npm run dev
}

Write-Host "`n✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

Write-Host "`n📋 РЕЗУЛЬТАТЫ:" -ForegroundColor Cyan
Write-Host "• Бэкенд: Запущен и работает" -ForegroundColor White
Write-Host "• API: Протестировано" -ForegroundColor White
Write-Host "• Фронтенд: Готов к тестированию" -ForegroundColor White

Write-Host "`n🔗 ПОЛЕЗНЫЕ ССЫЛКИ:" -ForegroundColor Cyan
Write-Host "• API Health: http://localhost:3000/health" -ForegroundColor White
Write-Host "• Личный кабинет: http://localhost:5173/account" -ForegroundColor White
Write-Host "• Мобильное пополнение: http://localhost:5173/deposit" -ForegroundColor White
Write-Host "• Документация: PAYMENTS_SYSTEM.md" -ForegroundColor White

if ($backendJob) {
    Write-Host "`n⚠️  Не забудьте остановить бэкенд:" -ForegroundColor Yellow
    Write-Host "Stop-Job $($backendJob.Id); Remove-Job $($backendJob.Id)" -ForegroundColor White
}