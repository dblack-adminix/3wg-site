# Get Auth Token
$baseUrl = "http://localhost:3000/api/v1"

$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "Token: $($response.token)" -ForegroundColor Green
    Write-Host "`nUser: $($response.user.email)" -ForegroundColor Cyan
    
    # Сохраняем токен в файл для использования в других скриптах
    $response.token | Out-File -FilePath "auth-token.txt" -Encoding UTF8 -NoNewline
    Write-Host "`n✓ Token saved to auth-token.txt" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
}
