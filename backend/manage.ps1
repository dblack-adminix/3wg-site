#!/usr/bin/env pwsh
# Backend Management Script for 3wg VPN

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "logs", "status", "create-admin", "test", "help")]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "3wg VPN Backend Management" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\manage.ps1 <command>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start        - Start all services (PostgreSQL, Redis, Backend)"
    Write-Host "  stop         - Stop all services"
    Write-Host "  restart      - Restart all services"
    Write-Host "  logs         - Show backend logs"
    Write-Host "  status       - Show status of all services"
    Write-Host "  create-admin - Create admin user"
    Write-Host "  test         - Test API endpoints"
    Write-Host "  help         - Show this help message"
    Write-Host ""
}

function Start-Services {
    Write-Host "Starting services..." -ForegroundColor Cyan
    docker-compose up -d
    Start-Sleep -Seconds 3
    Write-Host "Services started!" -ForegroundColor Green
    Show-Status
}

function Stop-Services {
    Write-Host "Stopping services..." -ForegroundColor Cyan
    docker-compose down
    Write-Host "Services stopped!" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "Restarting services..." -ForegroundColor Cyan
    docker-compose restart
    Start-Sleep -Seconds 3
    Write-Host "Services restarted!" -ForegroundColor Green
    Show-Status
}

function Show-Logs {
    Write-Host "Backend logs (press Ctrl+C to exit):" -ForegroundColor Cyan
    docker logs -f vpn_backend
}

function Show-Status {
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    Write-Host ""
    docker ps --filter "name=vpn_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host ""
}

function Create-Admin {
    Write-Host "Creating admin user..." -ForegroundColor Cyan
    
    # Check if PostgreSQL is running
    $pgStatus = docker ps --filter "name=vpn_postgres" --format "{{.Status}}"
    if (-not $pgStatus) {
        Write-Host "Error: PostgreSQL is not running. Start services first with: .\manage.ps1 start" -ForegroundColor Red
        return
    }
    
    # Copy SQL file and execute
    docker cp create_admin.sql vpn_postgres:/tmp/create_admin.sql
    docker exec vpn_postgres psql -U postgres -d vpn_3wg -f /tmp/create_admin.sql
    
    Write-Host ""
    Write-Host "Admin user created successfully!" -ForegroundColor Green
    Write-Host "Email: admin@3wg.ru" -ForegroundColor Yellow
    Write-Host "Password: admin123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  Please change the password after first login!" -ForegroundColor Red
    Write-Host ""
}

function Test-API {
    Write-Host "Testing API endpoints..." -ForegroundColor Cyan
    Write-Host ""
    
    # Test health
    Write-Host "1. Testing login..." -ForegroundColor Yellow
    $body = @{
        email = "admin@3wg.ru"
        password = "admin123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing
        
        $data = $response.Content | ConvertFrom-Json
        $token = $data.token
        
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
        Write-Host ""
        
        # Test authenticated endpoint
        Write-Host "2. Testing /api/v1/users/me..." -ForegroundColor Yellow
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/users/me" `
            -Headers $headers `
            -UseBasicParsing
        
        Write-Host "✅ User endpoint working!" -ForegroundColor Green
        Write-Host $response.Content -ForegroundColor Gray
        Write-Host ""
        
        # Test admin endpoint
        Write-Host "3. Testing /api/v1/admin/dashboard..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/admin/dashboard" `
            -Headers $headers `
            -UseBasicParsing
        
        Write-Host "✅ Admin endpoint working!" -ForegroundColor Green
        Write-Host $response.Content -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "All tests passed! 🎉" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main script logic
switch ($Command) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "create-admin" { Create-Admin }
    "test" { Test-API }
    "help" { Show-Help }
    default { Show-Help }
}
