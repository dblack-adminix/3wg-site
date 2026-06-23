# Watch backend logs in real-time
Write-Host "Watching backend logs... Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""
docker logs vpn_backend -f --tail 20
