# Check keys for current user
$token = (Get-Content user-token.txt -Raw).Trim()

Write-Host "=== Getting My Keys ===" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/keys" `
        -Headers @{Authorization="Bearer $token"}
    
    Write-Host "`nTotal keys: $($response.total)" -ForegroundColor Yellow
    
    if ($response.total -gt 0) {
        Write-Host "`nKeys:" -ForegroundColor Cyan
        $response.keys | ForEach-Object {
            Write-Host "  - $($_.name)" -ForegroundColor White
            Write-Host "    ID: $($_.id)" -ForegroundColor Gray
            Write-Host "    IP: $($_.ip_address)" -ForegroundColor Gray
            Write-Host "    Protocol: $($_.protocol)" -ForegroundColor Gray
            Write-Host "    Status: $($_.status)" -ForegroundColor $(if ($_.status -eq "active") { "Green" } else { "Red" })
            Write-Host ""
        }
    } else {
        Write-Host "`nNo keys found. Create one at http://localhost:8080/generator" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "`nError: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
