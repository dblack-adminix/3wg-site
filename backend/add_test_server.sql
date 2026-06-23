-- Добавление тестового сервера с WGDashboard

INSERT INTO servers (
    name,
    location,
    country,
    ip_address,
    status,
    load,
    protocols,
    max_users,
    wg_dashboard_url,
    wg_dashboard_key,
    wg_config_name,
    wg_dashboard_port,
    wg_listen_port,
    created_at,
    updated_at
) VALUES (
    'Amsterdam Test Server',
    'Amsterdam',
    'Netherlands',
    '46.30.43.35',
    'active',
    0,
    ARRAY['wireguard']::text[],
    100,
    'http://46.30.43.35:10086',
    'DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM',
    'wg0',
    10086,
    51820,
    NOW(),
    NOW()
);

-- Получить ID добавленного сервера
SELECT * FROM servers WHERE ip_address = '46.30.43.35';
