# Скрипт для применения миграции БД

param(
    [string]$MigrationFile = "migrations/add_wgdashboard_fields.sql"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Применение миграции БД" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем наличие файла миграции
if (-not (Test-Path $MigrationFile)) {
    Write-Host "✗ Файл миграции не найден: $MigrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "Файл миграции: $MigrationFile" -ForegroundColor Yellow
Write-Host ""

# Читаем переменные окружения из .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "✓ Переменные окружения загружены из .env" -ForegroundColor Green
} else {
    Write-Host "⚠ Файл .env не найден, используем значения по умолчанию" -ForegroundColor Yellow
}

# Параметры подключения к БД
$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$DB_USER = if ($env:DB_USER) { $env:DB_USER } else { "postgres" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "postgres" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "vpn_db" }

Write-Host ""
Write-Host "Параметры подключения:" -ForegroundColor Yellow
Write-Host "  Хост: $DB_HOST" -ForegroundColor Gray
Write-Host "  Порт: $DB_PORT" -ForegroundColor Gray
Write-Host "  БД: $DB_NAME" -ForegroundColor Gray
Write-Host "  Пользователь: $DB_USER" -ForegroundColor Gray
Write-Host ""

# Формируем строку подключения
$env:PGPASSWORD = $DB_PASSWORD
$connectionString = "postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

Write-Host "Применение миграции..." -ForegroundColor Yellow

try {
    # Применяем миграцию через psql
    $psqlCommand = "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $MigrationFile"
    
    # Проверяем наличие psql
    $psqlExists = Get-Command psql -ErrorAction SilentlyContinue
    
    if ($psqlExists) {
        Invoke-Expression $psqlCommand
        Write-Host ""
        Write-Host "✓ Миграция успешно применена!" -ForegroundColor Green
    } else {
        Write-Host "⚠ psql не найден, используем альтернативный метод" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Содержимое миграции:" -ForegroundColor Cyan
        Get-Content $MigrationFile | Write-Host -ForegroundColor Gray
        Write-Host ""
        Write-Host "Примените миграцию вручную через Docker:" -ForegroundColor Yellow
        Write-Host "  docker exec -i vpn-postgres psql -U $DB_USER -d $DB_NAME < $MigrationFile" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "✗ Ошибка применения миграции: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Попробуйте применить миграцию вручную:" -ForegroundColor Yellow
    Write-Host "  docker exec -i vpn-postgres psql -U $DB_USER -d $DB_NAME < $MigrationFile" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Готово!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
