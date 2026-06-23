# Тест API геолокации напрямую

Write-Host "Testing geolocation API..." -ForegroundColor Yellow
Write-Host ""

# Логин для получения токена
$loginBody = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

Write-Host "1. Getting auth token..." -ForegroundColor Cyan
$authResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $authResponse.token
Write-Host "✅ Token received" -ForegroundColor Green
Write-Host ""

# Тест геолокации
$publicKey = "JJaE11Nd2IYQyUrFinBZGep1AG5iZ02ripLOPfe9xgg="
$encodedKey = [System.Web.HttpUtility]::UrlEncode($publicKey)

Write-Host "2. Testing geolocation for peer 'test-laptop'..." -ForegroundColor Cyan
Write-Host "Public Key: $publicKey" -ForegroundColor Gray
Write-Host "Encoded: $encodedKey" -ForegroundColor Gray
Write-Host ""

try {
    $geoResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/servers/1/wg/peers/geolocation?publicKey=$encodedKey" -Method Get -Headers @{
        "Authorization" = "Bearer $token"
    }
    
    Write-Host "✅ Geolocation response:" -ForegroundColor Green
    $geoResponse | ConvertTo-Json -Depth 5
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}
