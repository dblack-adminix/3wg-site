#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Обновление геолокации всех серверов" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Получаем токен админа (нужно залогиниться)
Write-Host "Введите email админа:" -ForegroundColor Yellow
$email = Read-Host
Write-Host "Введите пароль:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Логинимся
Write-Host "`nЛогинимся..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body (@{
    email = $email
    password = $passwordPlain
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "✓ Успешно залогинились" -ForegroundColor Green

# Получаем список серверов
Write-Host "`nПолучаем список серверов..." -ForegroundColor Yellow
$serversResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/servers" -Method GET -Headers @{
    Authorization = "Bearer $token"
}

$servers = $serversResponse.servers
Write-Host "✓ Найдено серверов: $($servers.Count)" -ForegroundColor Green

# Обновляем геолокацию для каждого сервера
Write-Host "`nОбновляем геолокацию..." -ForegroundColor Yellow
foreach ($server in $servers) {
    Write-Host "`n  Сервер #$($server.id): $($server.name)" -ForegroundColor Cyan
    Write-Host "    IP: $($server.ip_address)" -ForegroundColor Gray
    Write-Host "    Текущая локация: $($server.location)" -ForegroundColor Gray
    Write-Host "    Текущая страна: $($server.country)" -ForegroundColor Gray
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/$($server.id)/update-geolocation" -Method POST -Headers @{
            Authorization = "Bearer $token"
        }
        
        Write-Host "    ✓ Обновлено:" -ForegroundColor Green
        Write-Host "      Локация: $($updateResponse.server.location)" -ForegroundColor Green
        Write-Host "      Страна: $($updateResponse.server.country)" -ForegroundColor Green
    } catch {
        Write-Host "    ✗ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✓ Готово!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
