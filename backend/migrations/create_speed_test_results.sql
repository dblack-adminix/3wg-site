-- Миграция для создания таблицы speed_test_results
-- Дата: 2026-02-01
-- Feature: VPN Speed Test

CREATE TABLE IF NOT EXISTS speed_test_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    
    -- Метрики скорости (Mbps)
    download_speed DECIMAL(10, 2) NOT NULL,
    upload_speed DECIMAL(10, 2) NOT NULL,
    
    -- Метрики задержки (ms)
    latency_avg DECIMAL(10, 2) NOT NULL,
    latency_min DECIMAL(10, 2) NOT NULL,
    latency_max DECIMAL(10, 2) NOT NULL,
    jitter DECIMAL(10, 2),
    
    -- Метаданные
    test_duration INTEGER NOT NULL,
    data_transferred BIGINT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Добавляем CHECK constraints отдельно для совместимости
ALTER TABLE speed_test_results 
    DROP CONSTRAINT IF EXISTS check_download_speed,
    DROP CONSTRAINT IF EXISTS check_upload_speed,
    DROP CONSTRAINT IF EXISTS check_latency_avg,
    DROP CONSTRAINT IF EXISTS check_latency_min,
    DROP CONSTRAINT IF EXISTS check_latency_max,
    DROP CONSTRAINT IF EXISTS check_jitter,
    DROP CONSTRAINT IF EXISTS check_test_duration,
    DROP CONSTRAINT IF EXISTS check_data_transferred;

ALTER TABLE speed_test_results 
    ADD CONSTRAINT check_download_speed CHECK (download_speed >= 0),
    ADD CONSTRAINT check_upload_speed CHECK (upload_speed >= 0),
    ADD CONSTRAINT check_latency_avg CHECK (latency_avg >= 0),
    ADD CONSTRAINT check_latency_min CHECK (latency_min >= 0),
    ADD CONSTRAINT check_latency_max CHECK (latency_max >= 0),
    ADD CONSTRAINT check_jitter CHECK (jitter >= 0 OR jitter IS NULL),
    ADD CONSTRAINT check_test_duration CHECK (test_duration > 0),
    ADD CONSTRAINT check_data_transferred CHECK (data_transferred > 0);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_speed_test_user ON speed_test_results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speed_test_server ON speed_test_results(server_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_speed_test_created_at ON speed_test_results(created_at DESC);

-- Комментарии
COMMENT ON TABLE speed_test_results IS 'Результаты тестов скорости VPN соединения';
COMMENT ON COLUMN speed_test_results.download_speed IS 'Скорость загрузки в Mbps';
COMMENT ON COLUMN speed_test_results.upload_speed IS 'Скорость выгрузки в Mbps';
COMMENT ON COLUMN speed_test_results.latency_avg IS 'Средняя задержка в миллисекундах';
COMMENT ON COLUMN speed_test_results.latency_min IS 'Минимальная задержка в миллисекундах';
COMMENT ON COLUMN speed_test_results.latency_max IS 'Максимальная задержка в миллисекундах';
COMMENT ON COLUMN speed_test_results.jitter IS 'Джиттер (вариация задержки) в миллисекундах';
COMMENT ON COLUMN speed_test_results.test_duration IS 'Длительность теста в секундах';
COMMENT ON COLUMN speed_test_results.data_transferred IS 'Объем переданных данных в байтах';
