# Скрипт для добавления тестовых данных истории трафика за последние 7 дней

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Добавление тестовых данных истории трафика" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# SQL для добавления тестовых данных
$sql = @"
-- Удаляем существующие данные (если есть)
DELETE FROM peer_traffic_history;

-- Получаем всех пиров из кэша
DO `$`$
DECLARE
    peer_record RECORD;
    day_offset INT;
    test_date DATE;
    prev_received BIGINT;
    prev_sent BIGINT;
    curr_received BIGINT;
    curr_sent BIGINT;
    delta_received BIGINT;
    delta_sent BIGINT;
BEGIN
    -- Для каждого пира
    FOR peer_record IN 
        SELECT DISTINCT server_id, config_name, public_key, name, total_receive, total_sent
        FROM wg_peers_cache
    LOOP
        -- Создаем снимки за последние 7 дней
        FOR day_offset IN 0..6 LOOP
            test_date := CURRENT_DATE - day_offset;
            
            -- Вычисляем трафик для этого дня (симулируем рост)
            -- Текущий трафик уменьшается по мере удаления в прошлое
            curr_received := (peer_record.total_receive * 1024 * 1024 * 1024)::BIGINT * (7 - day_offset) / 7;
            curr_sent := (peer_record.total_sent * 1024 * 1024 * 1024)::BIGINT * (7 - day_offset) / 7;
            
            -- Для первого дня (самый старый) дельта = текущий трафик
            IF day_offset = 6 THEN
                delta_received := curr_received;
                delta_sent := curr_sent;
            ELSE
                -- Для остальных дней дельта = разница с предыдущим днем
                prev_received := (peer_record.total_receive * 1024 * 1024 * 1024)::BIGINT * (6 - day_offset) / 7;
                prev_sent := (peer_record.total_sent * 1024 * 1024 * 1024)::BIGINT * (6 - day_offset) / 7;
                delta_received := curr_received - prev_received;
                delta_sent := curr_sent - prev_sent;
            END IF;
            
            -- Добавляем случайную вариацию (±20%)
            delta_received := delta_received + (delta_received * (RANDOM() * 0.4 - 0.2))::BIGINT;
            delta_sent := delta_sent + (delta_sent * (RANDOM() * 0.4 - 0.2))::BIGINT;
            
            -- Убеждаемся что дельта не отрицательная
            IF delta_received < 0 THEN delta_received := 0; END IF;
            IF delta_sent < 0 THEN delta_sent := 0; END IF;
            
            -- Вставляем снимок
            INSERT INTO peer_traffic_history (
                server_id, config_name, public_key, peer_name,
                bytes_received, bytes_sent, bytes_total,
                delta_received, delta_sent, delta_total,
                recorded_at
            ) VALUES (
                peer_record.server_id,
                peer_record.config_name,
                peer_record.public_key,
                peer_record.name,
                curr_received,
                curr_sent,
                curr_received + curr_sent,
                delta_received,
                delta_sent,
                delta_received + delta_sent,
                test_date
            )
            ON CONFLICT (server_id, config_name, public_key, recorded_at) DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Тестовые данные добавлены успешно!';
END `$`$;

-- Проверяем результат
SELECT 
    COUNT(*) as total_snapshots,
    COUNT(DISTINCT recorded_at) as days,
    COUNT(DISTINCT public_key) as peers,
    MIN(recorded_at) as first_date,
    MAX(recorded_at) as last_date
FROM peer_traffic_history;

-- Показываем пример данных для одного пира
SELECT 
    peer_name,
    recorded_at,
    ROUND(delta_received::NUMERIC / 1024 / 1024 / 1024, 4) as gb_received,
    ROUND(delta_sent::NUMERIC / 1024 / 1024 / 1024, 4) as gb_sent
FROM peer_traffic_history
WHERE peer_name IS NOT NULL
ORDER BY peer_name, recorded_at
LIMIT 14;
"@

# Сохраняем SQL во временный файл
$tempFile = "temp_traffic_history.sql"
$sql | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Применение SQL скрипта..." -ForegroundColor Yellow
Write-Host ""

# Применяем через Docker
Get-Content $tempFile | docker exec -i vpn_postgres psql -U postgres -d vpn_3wg

# Удаляем временный файл
Remove-Item $tempFile

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Готово!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Теперь откройте детали любого пира в админке," -ForegroundColor Yellow
Write-Host "и вы увидите график трафика за последние 7 дней!" -ForegroundColor Yellow
