DELETE FROM users WHERE email = 'admin@3wg.ru';

INSERT INTO users (email, password_hash, balance, tariff, is_admin, is_active, created_at, updated_at) 
VALUES (
  'admin@3wg.ru', 
  '$2a$10$R4EXSQ2A/UA50SX2e4x1..8pNWt36ygP9nNH92BG0F6TU.SVBweF6',
  0,
  'admin',
  true,
  true,
  NOW(),
  NOW()
);
