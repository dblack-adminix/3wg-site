-- Миграция для обновления таблицы payments под Cryptomus
-- Дата: 2026-02-01

-- Добавляем новые поля
ALTER TABLE payments ADD COLUMN IF NOT EXISTS order_id VARCHAR(128) UNIQUE NOT NULL DEFAULT '';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_uuid VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_url TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_amount VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payer_currency VARCHAR(10);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS network VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS expired_at TIMESTAMP;

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_uuid ON payments(payment_uuid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Обновляем существующие записи (если есть)
UPDATE payments SET order_id = CONCAT('order_', id) WHERE order_id = '';

-- Комментарии
COMMENT ON COLUMN payments.order_id IS 'Уникальный ID заказа для Cryptomus';
COMMENT ON COLUMN payments.payment_uuid IS 'UUID платежа от Cryptomus';
COMMENT ON COLUMN payments.payment_url IS 'URL для оплаты';
COMMENT ON COLUMN payments.payment_amount IS 'Сумма в криптовалюте';
COMMENT ON COLUMN payments.payer_currency IS 'Валюта оплаты (BTC, USDT, etc)';
COMMENT ON COLUMN payments.network IS 'Сеть блокчейна (TRC20, ERC20, etc)';
COMMENT ON COLUMN payments.address IS 'Адрес кошелька для оплаты';
COMMENT ON COLUMN payments.expired_at IS 'Время истечения платежа';
