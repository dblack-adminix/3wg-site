-- Добавление полей для интеграции с WGDashboard
ALTER TABLE servers ADD COLUMN IF NOT EXISTS wg_dashboard_url VARCHAR(255);
ALTER TABLE servers ADD COLUMN IF NOT EXISTS wg_dashboard_key VARCHAR(255);
ALTER TABLE servers ADD COLUMN IF NOT EXISTS wg_config_name VARCHAR(50);
ALTER TABLE servers ADD COLUMN IF NOT EXISTS wg_dashboard_port INTEGER;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS wg_listen_port INTEGER DEFAULT 51820;

-- Комментарии для полей
COMMENT ON COLUMN servers.wg_dashboard_url IS 'URL панели WGDashboard (например: http://46.30.43.35:10086)';
COMMENT ON COLUMN servers.wg_dashboard_key IS 'API ключ для доступа к WGDashboard';
COMMENT ON COLUMN servers.wg_config_name IS 'Имя конфигурации WireGuard (wg0, wg1, etc.)';
COMMENT ON COLUMN servers.wg_dashboard_port IS 'Порт панели WGDashboard';
COMMENT ON COLUMN servers.wg_listen_port IS 'Порт на котором слушает WireGuard';
