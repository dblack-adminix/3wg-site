# 🔄 Скрипт бэкапа проекта 3WG.RU
# Создает полный архив проекта перед важными изменениями

param(
    [string]$BackupName = "backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')",
    [string]$BackupDir = "backups"
)

Write-Host "🔄 Создание бэкапа проекта 3WG.RU..." -ForegroundColor Green
Write-Host "📅 Дата: $(Get-Date)" -ForegroundColor Cyan

# Создаем папку для бэкапов если её нет
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
    Write-Host "📁 Создана папка для бэкапов: $BackupDir" -ForegroundColor Yellow
}

# Определяем что исключить из бэкапа
$ExcludePatterns = @(
    "node_modules",
    "dist",
    ".git",
    "*.log",
    "*.tmp",
    ".env",
    "backend/vpn-backend.exe",
    "*.conf",
    "*.json.bak"
)

Write-Host "📦 Создание архива..." -ForegroundColor Yellow

# Создаем временную папку для копирования
$TempDir = "temp_backup_$(Get-Date -Format 'HHmmss')"
New-Item -ItemType Directory -Path $TempDir

try {
    # Копируем все файлы кроме исключенных
    Write-Host "📋 Копирование файлов..." -ForegroundColor Cyan
    
    # Основные папки и файлы
    $ItemsToCopy = @(
        "src",
        "backend",
        "scripts",
        "docs",
        "public",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "tsconfig.app.json",
        "tsconfig.node.json",
        "vite.config.ts",
        "tailwind.config.ts",
        "postcss.config.js",
        "eslint.config.js",
        "vitest.config.ts",
        "components.json",
        "index.html",
        "README.md",
        "*.md"
    )
    
    foreach ($Item in $ItemsToCopy) {
        if (Test-Path $Item) {
            if ((Get-Item $Item).PSIsContainer) {
                # Это папка
                Write-Host "  📁 $Item" -ForegroundColor Gray
                Copy-Item -Path $Item -Destination "$TempDir\$Item" -Recurse -Force
            } else {
                # Это файл
                Write-Host "  📄 $Item" -ForegroundColor Gray
                Copy-Item -Path $Item -Destination "$TempDir\" -Force
            }
        }
    }
    
    # Копируем markdown файлы из корня
    Get-ChildItem -Path "." -Filter "*.md" | ForEach-Object {
        Write-Host "  📄 $($_.Name)" -ForegroundColor Gray
        Copy-Item -Path $_.FullName -Destination "$TempDir\" -Force
    }
    
    # Удаляем исключенные папки из копии
    foreach ($Pattern in $ExcludePatterns) {
        $ItemsToRemove = Get-ChildItem -Path $TempDir -Recurse -Force | Where-Object { $_.Name -like $Pattern }
        foreach ($Item in $ItemsToRemove) {
            Remove-Item -Path $Item.FullName -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Создаем архив
    $ArchivePath = "$BackupDir\$BackupName.zip"
    Write-Host "🗜️ Создание архива: $ArchivePath" -ForegroundColor Yellow
    
    Compress-Archive -Path "$TempDir\*" -DestinationPath $ArchivePath -Force
    
    # Получаем размер архива
    $ArchiveSize = [math]::Round((Get-Item $ArchivePath).Length / 1MB, 2)
    
    Write-Host "✅ Бэкап создан успешно!" -ForegroundColor Green
    Write-Host "📁 Путь: $ArchivePath" -ForegroundColor Cyan
    Write-Host "📊 Размер: $ArchiveSize MB" -ForegroundColor Cyan
    
    # Создаем информационный файл
    $InfoFile = "$BackupDir\$BackupName.info.txt"
    @"
🔄 Бэкап проекта 3WG.RU
========================

Дата создания: $(Get-Date)
Версия: v1.0.0-beta
Размер архива: $ArchiveSize MB
Архив: $BackupName.zip

Состояние проекта:
- ✅ Speed Test API реализован
- ✅ Multi-Provider Payments (ЮKassa + Cryptomus)
- ✅ Admin Panel с финансами
- ✅ User Dashboard
- ✅ Mobile версии
- ✅ Cyberpunk дизайн

Планируемые изменения:
- Система тем (светлая/темная)
- Push уведомления
- Улучшение мобильной версии
- Дополнительные анимации

Для восстановления:
1. Распаковать архив
2. npm install
3. Настроить .env файлы
4. npm run dev

"@ | Out-File -FilePath $InfoFile -Encoding UTF8
    
    Write-Host "📋 Создан информационный файл: $InfoFile" -ForegroundColor Cyan
    
} finally {
    # Удаляем временную папку
    if (Test-Path $TempDir) {
        Remove-Item -Path $TempDir -Recurse -Force
        Write-Host "🧹 Временные файлы очищены" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎉 Бэкап завершен!" -ForegroundColor Green
Write-Host "💡 Теперь можно безопасно вносить изменения в проект" -ForegroundColor Yellow
Write-Host ""