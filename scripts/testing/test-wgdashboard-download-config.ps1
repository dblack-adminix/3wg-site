# Test WGDashboard download config API

$publicKey = "YFm7q8B7X7TiFHMfjy5dyWwZLvaNRSWgU/73AXHk7EM="
$apiKey = "kvG7AGmM8RUx46DkryBxVR5E4R8LzfRpgkogfUTxEEc"

Write-Host "Testing WGDashboard download config API..." -ForegroundColor Cyan
Write-Host "Public Key: $publicKey" -ForegroundColor Yellow
Write-Host ""

$headers = @{
    "wg-dashboard-apikey" = $apiKey
}

# Try different endpoints
$endpoints = @(
    "https://wg.3labs.pw/api/downloadPeer/awg0",
    "https://wg.3labs.pw/api/downloadAllPeers/awg0",
    "https://wg.3labs.pw/api/getPeerConfig/awg0"
)

foreach ($endpoint in $endpoints) {
    Write-Host "Trying: $endpoint" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Get -Headers $headers
        Write-Host "Success!" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5
        Write-Host ""
    } catch {
        Write-Host "Failed: $_" -ForegroundColor Red
        Write-Host ""
    }
}

# Try with public key parameter
Write-Host "Trying with publicKey parameter..." -ForegroundColor Yellow
try {
    $url = "https://wg.3labs.pw/api/downloadPeer/awg0?publicKey=$([System.Web.HttpUtility]::UrlEncode($publicKey))"
    Write-Host "URL: $url" -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri $url -Method Get -Headers $headers
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Content:" -ForegroundColor Cyan
    Write-Host $response.Content
} catch {
    Write-Host "Failed: $_" -ForegroundColor Red
}
