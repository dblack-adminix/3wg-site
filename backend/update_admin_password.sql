-- Update admin password to 'admin123'
UPDATE users 
SET password_hash = '$2a$10$gboqfS2A31sU0KSKpFuV7.rHw7GCFCsykeB5/RbYEwR6fE08O3XNi' 
WHERE email = 'admin@3wg.ru';

-- Verify the update
SELECT id, email, is_admin, length(password_hash) as hash_length 
FROM users 
WHERE email = 'admin@3wg.ru';
