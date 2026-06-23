-- Создание таблицы для почасовой истории трафика пиров
CREATE TABLE IF NOT EXISTS peer_traffic_hourly (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL,
    config_name VARCHAR(50) NOT NULL,
    public_key TEXT NOT NULL,
    peer_name VARCHAR(255),
    
    -- Снимок трафика (кумулятивный)
    bytes_received BIGINT NOT NULL DEFAULT 0,
    bytes_sent BIGINT NOT NULL DEFAULT 0,
    bytes_total BIGINT NOT NULL DEFAULT 0,
    
    -- Дельта за час
    delta_received BIGINT NOT NULL DEFAULT 0,
    delta_sent BIGINT NOT NULL DEFAULT 0,
    delta_total BIGINT NOT NULL DEFAULT 0,
    
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_peer_traffic_hourly_server FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_peer_traffic_hourly_peer ON peer_traffic_hourly(server_id, config_name, public_key, recorded_at);
CREATE INDEX IF NOT EXISTS idx_peer_traffic_hourly_date ON peer_traffic_hourly(recorded_at);

-- Комментарии
COMMENT ON TABLE peer_traffic_hourly IS 'Почасовая история трафика пиров';
COMMENT ON COLUMN peer_traffic_hourly.bytes_received IS 'Кумулятивный трафик получен (байты)';
COMMENT ON COLUMN peer_traffic_hourly.bytes_sent IS 'Кумулятивный трафик отправлен (байты)';
COMMENT ON COLUMN peer_traffic_hourly.delta_received IS 'Трафик получен за час (байты)';
COMMENT ON COLUMN peer_traffic_hourly.delta_sent IS 'Трафик отправлен за час (байты)';
