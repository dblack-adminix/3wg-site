# Delete duplicate peer from WGDashboard
# Removing peer with key JJaE11Nd2IYQyUrFinBZGep1AG5iZ02ripLOPfe9xgg=

$serverId = 1
$publicKey = "JJaE11Nd2IYQyUrFinBZGep1AG5iZ02ripLOPfe9xgg="
$baseUrl = "http://localhost:8080"

Write-Host "=== Deleting duplicate peer from WGDashboard ===" -ForegroundColor Cyan
Write-Host ""

# URL-encode the public key (manual encoding for = sign)
$encodedKey = $publicKey.Replace("=", "%3D")

Write-Host "Server ID: $serverId" -ForegroundColor Yellow
Write-Host "Public Key: $publicKey" -ForegroundColor Yellow
Write-Host "Encoded Key: $encodedKey" -ForegroundColor Yellow
Write-Host ""

# Delete peer via API
$url = "$baseUrl/api/v1/admin/servers/$serverId/wg/peers/$encodedKey"
Write-Host "DELETE $url" -ForegroundColor Magenta

try {
    $response = Invoke-RestMethod -Uri $url -Method Delete -ContentType "application/json"
    Write-Host ""
    Write-Host "SUCCESS: Peer deleted from WGDashboard!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    Write-Host ""
    Write-Host "Now wait 5 minutes for next full sync or restart backend" -ForegroundColor Yellow
} catch {
    Write-Host ""
    Write-Host "ERROR deleting peer:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Red
        Write-Host $responseBody -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Checking peers in cache ===" -ForegroundColor Cyan
Write-Host ""

# Check peers in cache
$cacheUrl = "$baseUrl/api/v1/admin/servers/$serverId/wg/peers/cached?config=wg1"
Write-Host "GET $cacheUrl" -ForegroundColor Magenta

try {
    $cacheResponse = Invoke-RestMethod -Uri $cacheUrl -Method Get
    Write-Host ""
    Write-Host "Peers in cache:" -ForegroundColor Cyan
    Write-Host "Total: $($cacheResponse.total)" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($peer in $cacheResponse.peers) {
        $peerKey = $peer.publicKey
        $peerName = $peer.name
        $peerEndpoint = $peer.endpoint
        
        if ($peerKey -eq $publicKey) {
            Write-Host "  - $peerName ($peerKey) - endpoint: $peerEndpoint" -ForegroundColor Red
            Write-Host "    ^ This peer is still in cache! Wait for sync." -ForegroundColor Red
        } else {
            Write-Host "  - $peerName ($peerKey) - endpoint: $peerEndpoint" -ForegroundColor Green
        }
    }
} catch {
    Write-Host ""
    Write-Host "ERROR getting cache:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
