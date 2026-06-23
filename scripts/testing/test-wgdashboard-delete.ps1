# Test WGDashboard delete peer API

$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$baseUrl = "http://46.30.43.35:10086"
$config = "wg1"
$peerKey = "geR9JLxeZbVTEF9LhNMqRovN2Oy5RQiAQzIArQUFIw8="

Write-Host "=== Testing WGDashboard delete peer API ===" -ForegroundColor Cyan
Write-Host ""

# Try different endpoints and formats
Write-Host "Test 1: POST /api/deletePeers/$config with peers array" -ForegroundColor Yellow
$body1 = @{
    peers = @($peerKey)
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/deletePeers/$config" -Method Post -Headers @{"wg-dashboard-apikey" = $apiKey; "Content-Type" = "application/json"} -Body $body1
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Test 2: POST /api/deletePeers/$config with peer_id" -ForegroundColor Yellow
$body2 = @{
    peer_id = $peerKey
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/deletePeers/$config" -Method Post -Headers @{"wg-dashboard-apikey" = $apiKey; "Content-Type" = "application/json"} -Body $body2
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Test 3: POST /api/removePeers/$config" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/removePeers/$config" -Method Post -Headers @{"wg-dashboard-apikey" = $apiKey; "Content-Type" = "application/json"} -Body $body1
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Test 4: DELETE /api/peer/$config/$peerKey" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/peer/$config/$peerKey" -Method Delete -Headers @{"wg-dashboard-apikey" = $apiKey}
    Write-Host "SUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Current method (raw config edit) ===" -ForegroundColor Cyan
Write-Host "Our backend uses GetRawConfig + edit + UpdateRawConfig" -ForegroundColor Yellow
Write-Host "This is complex and error-prone" -ForegroundColor Yellow
Write-Host ""
