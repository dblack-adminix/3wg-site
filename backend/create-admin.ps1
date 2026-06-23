# PowerShell script to create admin user

Write-Host "👤 Creating admin user..." -ForegroundColor Green

go run scripts/create_admin.go

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Admin user created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login credentials:" -ForegroundColor Cyan
    Write-Host "Email: admin@3wg.ru" -ForegroundColor White
    Write-Host "Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Please change the password after first login!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to create admin user" -ForegroundColor Red
    Write-Host "Make sure the database is running and .env is configured correctly" -ForegroundColor Yellow
}
