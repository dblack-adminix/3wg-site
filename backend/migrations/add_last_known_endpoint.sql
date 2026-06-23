-- Добавляем поле для хранения последнего известного endpoint
-- Это позволит показывать геолокацию даже после отключения пира

ALTER TABLE wg_peers_cache 
ADD COLUMN IF NOT EXISTS last_known_endpoint VARCHAR(255);

-- Обновляем существующие записи где endpoint != 0.0.0.0/0
UPDATE wg_peers_cache 
SET last_known_endpoint = endpoint 
WHERE endpoint != '0.0.0.0/0' 
  AND endpoint != '(none)' 
  AND endpoint != '';
