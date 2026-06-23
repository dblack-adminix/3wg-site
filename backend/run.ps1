# PowerShell script to run the backend

Write-Host "🚀 Starting 3WG Backend..." -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please edit it with your database credentials." -ForegroundColor Green
}

# Check if Docker is running
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Docker is not running. Please start Docker Desktop or use local PostgreSQL." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "1. Start Docker Desktop and run: docker-compose up -d" -ForegroundColor White
    Write-Host "2. Or install PostgreSQL locally and update .env file" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Run the server
Write-Host ""
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

go run main.go
