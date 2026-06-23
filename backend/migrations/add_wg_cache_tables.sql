-- Кэш для пиров WireGuard
CREATE TABLE IF NOT EXISTS wg_peers_cache (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    config_name VARCHAR(50) NOT NULL,
    public_key VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status VARCHAR(20), -- running, stopped
    allowed_ips TEXT[], -- массив IP адресов
    endpoint VARCHAR(255),
    dns VARCHAR(255),
    mtu INTEGER,
    keepalive INTEGER,
    total_receive DECIMAL(15,4), -- GB
    total_sent DECIMAL(15,4), -- GB
    total_data DECIMAL(15,4), -- GB
    latest_handshake VARCHAR(100),
    last_synced_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(server_id, config_name, public_key)
);

CREATE INDEX IF NOT EXISTS idx_peers_cache_server_config ON wg_peers_cache(server_id, config_name);
CREATE INDEX IF NOT EXISTS idx_peers_cache_synced ON wg_peers_cache(last_synced_at);

-- Кэш для конфигураций WireGuard
CREATE TABLE IF NOT EXISTS wg_configs_cache (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    status BOOLEAN, -- true = running, false = stopped
    public_key VARCHAR(255),
    listen_port VARCHAR(10),
    address VARCHAR(100),
    total_peers INTEGER,
    connected_peers INTEGER,
    data_receive DECIMAL(15,4), -- GB
    data_sent DECIMAL(15,4), -- GB
    data_total DECIMAL(15,4), -- GB
    last_synced_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(server_id, name)
);

CREATE INDEX IF NOT EXISTS idx_configs_cache_server ON wg_configs_cache(server_id);

-- Кэш для системного статуса (метрики)
CREATE TABLE IF NOT EXISTS system_status_cache (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL UNIQUE REFERENCES servers(id) ON DELETE CASCADE,
    cpu_percent DECIMAL(5,2),
    memory_percent DECIMAL(5,2),
    memory_total BIGINT,
    memory_used BIGINT,
    disk_percent DECIMAL(5,2),
    disk_total BIGINT,
    disk_used BIGINT,
    last_synced_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_status_server ON system_status_cache(server_id);
