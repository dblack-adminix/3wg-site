# Apply FAQ content migration
# This script inserts FAQ page content from layout into database

Write-Host "Applying FAQ content migration..." -ForegroundColor Cyan

# Load .env file
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
    Write-Host "Loaded .env file" -ForegroundColor Green
} else {
    Write-Host "Warning: .env file not found" -ForegroundColor Yellow
}

# Get database connection details
$DB_HOST = $env:DB_HOST
$DB_PORT = $env:DB_PORT
$DB_USER = $env:DB_USER
$DB_PASSWORD = $env:DB_PASSWORD
$DB_NAME = $env:DB_NAME

if (-not $DB_HOST) { $DB_HOST = "localhost" }
if (-not $DB_PORT) { $DB_PORT = "5432" }
if (-not $DB_USER) { $DB_USER = "postgres" }
if (-not $DB_NAME) { $DB_NAME = "vpn_service" }

Write-Host "Database: $DB_NAME at ${DB_HOST}:${DB_PORT}" -ForegroundColor Gray

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $DB_PASSWORD

# Apply migration
Write-Host "Inserting FAQ content..." -ForegroundColor Yellow
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "migrations/insert_faq_content.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "FAQ content inserted successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to insert FAQ content" -ForegroundColor Red
    exit 1
}

# Clear PGPASSWORD
$env:PGPASSWORD = $null

Write-Host "Done!" -ForegroundColor Cyan
