# 🚀 Быстрый старт интеграции WGDashboard

## Шаг 1: Применить миграцию БД

Добавляем новые поля в таблицу `servers`:

```powershell
cd backend
.\apply-migration.ps1
```

Или вручную через Docker:

```powershell
docker exec -i vpn-postgres psql -U postgres -d vpn_db < migrations/add_wgdashboard_fields.sql
```

## Шаг 2: Пересобрать и запустить бэкенд

```powershell
cd backend
docker-compose down
docker-compose up --build -d
```

Или через PowerShell скрипт:

```powershell
cd backend
.\manage.ps1 restart
```

## Шаг 3: Добавить тестовый сервер

```powershell
.\add-test-server.ps1
```

Этот скрипт:
- Авторизуется как админ
- Добавляет сервер Amsterdam с данными WGDashboard
- Выводит информацию о созданном сервере

## Шаг 4: Протестировать интеграцию

```powershell
.\test-wgdashboard-integration.ps1
```

Этот скрипт проверит:
- ✅ Подключение к WGDashboard
- ✅ Получение конфигурации WireGuard
- ✅ Получение списка пиров
- ✅ Статистику трафика

## Ожидаемый результат

```
========================================
  Тест интеграции WGDashboard
========================================

1. Авторизация...
   ✓ Успешно!

2. Получение списка серверов...
   ✓ Найден сервер: Amsterdam Test Server
     ID: 1
     IP: 46.30.43.35
     WGDashboard: http://46.30.43.35:10086/

3. Тест подключения к WGDashboard...
   ✓ Подключение успешно!

4. Получение конфигурации WireGuard...
   ✓ Конфигурация получена!

Информация о конфигурации:
  Имя: wg0
  Статус: running
  Публичный ключ: ...
  Порт: 51820
  Адрес: 10.0.0.1/24

5. Получение списка пиров...
   ✓ Список получен!
   Всего пиров: 2

========================================
✓ Все тесты пройдены успешно!
========================================
```

## Проверка в админке

1. Откройте админку: http://localhost:8080/admin
2. Войдите как админ (admin@3wg.ru / admin123)
3. Перейдите на вкладку "Серверы"
4. Вы должны увидеть сервер "Amsterdam Test Server"

## Доступные API эндпоинты

### Тест подключения
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/admin/servers/1/wg/test
```

### Получить конфигурацию
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/admin/servers/1/wg/config
```

### Получить список пиров
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/admin/servers/1/wg/peers
```

### Добавить пира
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "public_key": "YOUR_PUBLIC_KEY",
    "allowed_ips": ["10.0.0.5/32"],
    "name": "Test Client"
  }' \
  http://localhost:3000/api/v1/admin/servers/1/wg/peers
```

## Устранение проблем

### Ошибка: "WGDashboard not configured for this server"

Убедитесь, что сервер добавлен с полями WGDashboard:
- `wg_dashboard_url`
- `wg_dashboard_key`
- `wg_config_name`

### Ошибка: "Connection refused"

Проверьте доступность WGDashboard:
```powershell
.\test-wgdashboard.ps1
```

### Ошибка: "Unauthorized"

Проверьте API ключ в БД:
```sql
SELECT id, name, wg_dashboard_key FROM servers;
```

## Следующие шаги

1. ✅ Интеграция работает
2. 🔄 Реализовать автоматическое создание пиров при создании VPN ключей
3. ⏳ Добавить UI для управления серверами с WGDashboard
4. ⏳ Реализовать мониторинг статуса серверов

---

**Дата**: 29 января 2026
**Версия**: 1.0
