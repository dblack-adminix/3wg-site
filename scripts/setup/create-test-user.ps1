# Create test user for testing Generator UI
Write-Host "=== Creating Test User ===" -ForegroundColor Cyan

$body = @{
    email = "user@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "`n✅ User created successfully!" -ForegroundColor Green
    Write-Host "Email: user@test.com" -ForegroundColor White
    Write-Host "Password: password123" -ForegroundColor White
    Write-Host "Token: $($response.token.Substring(0, 20))..." -ForegroundColor Gray
    
    # Save token
    $response.token | Out-File -FilePath "user-token.txt" -Encoding UTF8
    Write-Host "`nToken saved to: user-token.txt" -ForegroundColor Green
    
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "`n⚠️  User already exists" -ForegroundColor Yellow
        Write-Host "Email: user@test.com" -ForegroundColor White
        Write-Host "Password: password123" -ForegroundColor White
        
        # Try to login
        Write-Host "`nTrying to login..." -ForegroundColor Cyan
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
                -Method POST `
                -Body $body `
                -ContentType "application/json"
            
            Write-Host "✅ Login successful!" -ForegroundColor Green
            $loginResponse.token | Out-File -FilePath "user-token.txt" -Encoding UTF8
            Write-Host "Token saved to: user-token.txt" -ForegroundColor Green
        } catch {
            Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
}
