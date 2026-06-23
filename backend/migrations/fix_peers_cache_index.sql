-- Исправление индекса для wg_peers_cache
-- Проблема: индекс был только на public_key, нужен составной на (server_id, config_name, public_key)

-- Удаляем старый неправильный индекс
DROP INDEX IF EXISTS idx_peers_unique;

-- Создаем правильный составной уникальный индекс
CREATE UNIQUE INDEX IF NOT EXISTS idx_peers_unique ON wg_peers_cache(server_id, config_name, public_key);

-- Очищаем таблицу чтобы избежать конфликтов при следующей синхронизации
TRUNCATE TABLE wg_peers_cache;

-- Проверка
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'wg_peers_cache';
