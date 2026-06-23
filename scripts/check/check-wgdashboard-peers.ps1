# Check peers directly in WGDashboard

$serverId = 1
$baseUrl = "http://localhost:3000"

Write-Host "=== Checking WGDashboard peers ===" -ForegroundColor Cyan
Write-Host ""

# Get peers from WGDashboard (not cache)
$url = "$baseUrl/api/v1/admin/servers/$serverId/wg/peers?config=wg1"
Write-Host "GET $url" -ForegroundColor Magenta

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host ""
    Write-Host "Peers in WGDashboard:" -ForegroundColor Cyan
    Write-Host "Total: $($response.total)" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($peer in $response.peers) {
        $peerKey = $peer.publicKey
        $peerName = $peer.name
        $peerEndpoint = $peer.endpoint
        $peerStatus = $peer.status
        
        Write-Host "  - Name: $peerName" -ForegroundColor Green
        Write-Host "    PublicKey: $peerKey" -ForegroundColor Yellow
        Write-Host "    Endpoint: $peerEndpoint" -ForegroundColor Cyan
        Write-Host "    Status: $peerStatus" -ForegroundColor Magenta
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "ERROR getting peers:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Checking cache ===" -ForegroundColor Cyan
Write-Host ""

# Get peers from cache
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
        $peerStatus = $peer.status
        
        Write-Host "  - Name: $peerName" -ForegroundColor Green
        Write-Host "    PublicKey: $peerKey" -ForegroundColor Yellow
        Write-Host "    Endpoint: $peerEndpoint" -ForegroundColor Cyan
        Write-Host "    Status: $peerStatus" -ForegroundColor Magenta
        Write-Host ""
    }
} catch {
    Write-Host ""
    Write-Host "ERROR getting cache:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
