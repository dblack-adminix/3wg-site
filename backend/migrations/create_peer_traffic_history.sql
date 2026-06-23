-- Таблица для хранения истории трафика пиров
CREATE TABLE IF NOT EXISTS peer_traffic_history (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    config_name VARCHAR(50) NOT NULL,
    public_key TEXT NOT NULL,
    peer_name VARCHAR(255),
    
    -- Снимок трафика на момент записи
    bytes_received BIGINT NOT NULL DEFAULT 0,
    bytes_sent BIGINT NOT NULL DEFAULT 0,
    bytes_total BIGINT NOT NULL DEFAULT 0,
    
    -- Дельта за период (разница с предыдущим снимком)
    delta_received BIGINT NOT NULL DEFAULT 0,
    delta_sent BIGINT NOT NULL DEFAULT 0,
    delta_total BIGINT NOT NULL DEFAULT 0,
    
    -- Временная метка (округляется до начала дня)
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Индексы для быстрого поиска
    CONSTRAINT unique_peer_day UNIQUE (server_id, config_name, public_key, recorded_at)
);

-- Индекс для быстрого получения истории конкретного пира
CREATE INDEX idx_peer_traffic_history_peer ON peer_traffic_history(server_id, config_name, public_key, recorded_at DESC);

-- Индекс для быстрого получения истории за период
CREATE INDEX idx_peer_traffic_history_date ON peer_traffic_history(recorded_at DESC);

-- Комментарии
COMMENT ON TABLE peer_traffic_history IS 'История трафика пиров (снимки раз в день)';
COMMENT ON COLUMN peer_traffic_history.bytes_received IS 'Общий полученный трафик на момент снимка (кумулятивный)';
COMMENT ON COLUMN peer_traffic_history.bytes_sent IS 'Общий отправленный трафик на момент снимка (кумулятивный)';
COMMENT ON COLUMN peer_traffic_history.delta_received IS 'Трафик получен за этот день (дельта)';
COMMENT ON COLUMN peer_traffic_history.delta_sent IS 'Трафик отправлен за этот день (дельта)';
COMMENT ON COLUMN peer_traffic_history.recorded_at IS 'Дата снимка (округлено до начала дня UTC)';
