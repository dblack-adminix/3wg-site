-- Фикс регистрации: уникальный индекс telegram_id блокировал второго пользователя
-- с пустым telegram_id (''). Делаем индекс частичным — уникальность только для
-- реально заданных Telegram ID.

DROP INDEX IF EXISTS idx_users_telegram_id;

UPDATE users SET telegram_id = NULL WHERE telegram_id = '';

CREATE UNIQUE INDEX idx_users_telegram_id
    ON users(telegram_id)
    WHERE telegram_id IS NOT NULL AND telegram_id <> '';
