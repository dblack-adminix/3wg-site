# Прямой тест добавления пира в WGDashboard API

$baseUrl = "http://46.30.43.35:10086"
$apiKey = "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM"
$config = "wg1"

$headers = @{
    "wg-dashboard-apikey" = $apiKey
    "Content-Type" = "application/json"
}

Write-Host "=== Тест добавления пира напрямую в WGDashboard ===" -ForegroundColor Cyan
Write-Host ""

# Генерируем тестовый публичный ключ
$randomBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($randomBytes)
$testPublicKey = [Convert]::ToBase64String($randomBytes)

Write-Host "Тестовые данные:" -ForegroundColor Yellow
Write-Host "  Имя: api-test-peer-$(Get-Date -Format 'HHmmss')" -ForegroundColor Gray
Write-Host "  PublicKey: $testPublicKey" -ForegroundColor Gray
Write-Host "  AllowedIPs: 10.16.11.200/32" -ForegroundColor Gray
Write-Host ""

# Попробуем разные варианты тела запроса
$testCases = @(
    @{
        Name = "Вариант 1: bulkAdd=no, bulkAddAmount=1"
        Body = @{
            bulkAdd = "no"
            bulkAddAmount = "1"
            name = "test-peer-1"
            private_key = ""
            public_key = $testPublicKey
            allowed_ips = "10.16.11.200/32"
            endpoint_allowed_ip = "0.0.0.0/0"
            DNS = "1.1.1.1"
            mtu = 1420
            keepalive = 21
            preshared_key = ""
        }
    },
    @{
        Name = "Вариант 2: bulkAdd=no, bulkAddAmount=пустая строка"
        Body = @{
            bulkAdd = "no"
            bulkAddAmount = ""
            name = "test-peer-2"
            private_key = ""
            public_key = $testPublicKey
            allowed_ips = "10.16.11.201/32"
            endpoint_allowed_ip = "0.0.0.0/0"
            DNS = "1.1.1.1"
            mtu = 1420
            keepalive = 21
            preshared_key = ""
        }
    },
    @{
        Name = "Вариант 3: без bulkAdd и bulkAddAmount"
        Body = @{
            name = "test-peer-3"
            private_key = ""
            public_key = $testPublicKey
            allowed_ips = "10.16.11.202/32"
            endpoint_allowed_ip = "0.0.0.0/0"
            DNS = "1.1.1.1"
            mtu = 1420
            keepalive = 21
            preshared_key = ""
        }
    },
    @{
        Name = "Вариант 4: bulkAdd=no, bulkAddAmount=число 1"
        Body = @{
            bulkAdd = "no"
            bulkAddAmount = 1
            name = "test-peer-4"
            private_key = ""
            public_key = $testPublicKey
            allowed_ips = "10.16.11.203/32"
            endpoint_allowed_ip = "0.0.0.0/0"
            DNS = "1.1.1.1"
            mtu = 1420
            keepalive = 21
            preshared_key = ""
        }
    }
)

foreach ($testCase in $testCases) {
    Write-Host "Тестируем: $($testCase.Name)" -ForegroundColor Yellow
    
    try {
        $body = $testCase.Body | ConvertTo-Json
        Write-Host "Тело запроса:" -ForegroundColor Gray
        Write-Host $body -ForegroundColor DarkGray
        Write-Host ""
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/addPeers/$config" -Method POST -Headers $headers -Body $body -ErrorAction Stop
        
        Write-Host "  ✓ УСПЕХ!" -ForegroundColor Green
        Write-Host "  Ответ:" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor DarkGray
        Write-Host ""
        
        Write-Host "=== НАЙДЕН РАБОЧИЙ ВАРИАНТ ===" -ForegroundColor Green
        Write-Host $testCase.Name -ForegroundColor Green
        break
    } catch {
        Write-Host "  ✗ Ошибка" -ForegroundColor Red
        if ($_.ErrorDetails) {
            try {
                $errorBody = $_.ErrorDetails.Message | ConvertFrom-Json
                Write-Host "  Сообщение: $($errorBody.message)" -ForegroundColor Red
            } catch {
                Write-Host "  Сообщение: $($_.ErrorDetails.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "  Сообщение: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "=== Завершено ===" -ForegroundColor Cyan
