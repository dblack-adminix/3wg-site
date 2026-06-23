# Статус реализации геолокации пиров

## Что было сделано

### 1. Исправлена проблема с public key в URL ✅
- Изменены роуты с path параметров на query параметры
- DELETE `/servers/:id/wg/peers?publicKey=...`
- GET `/servers/:id/wg/peers/geolocation?publicKey=...`
- GET `/servers/:id/wg/peers/traffic-history?publicKey=...`

### 2. Добавлено сохранение последнего известного endpoint ✅
- Добавлено поле `last_known_endpoint` в таблицу `wg_peers_cache`
- Sync worker сохраняет endpoint когда пир подключен
- Контроллер геолокации использует `last_known_endpoint` если текущий endpoint пустой

### 3. Backend пересобран и перезапущен ✅
- Код скомпилирован с новыми изменениями
- Backend работает на порту 3000
- Роуты зарегистрированы правильно

## Текущая проблема

**Запросы геолокации возвращают 503 с ошибкой "geolocation API returned status: fail"**

### Возможные причины:

1. **ip-api.com блокирует запросы**
   - Возможно превышен лимит запросов (45 запросов в минуту для бесплатного API)
   - Или IP сервера заблокирован

2. **Проблема с парсингом endpoint**
   - Backend не может правильно извлечь IP из endpoint

3. **Логи не показывают запросы**
   - Запросы могут кэшироваться где-то
   - Или идут на старый backend

## Что нужно проверить

### 1. Проверить что возвращает API напрямую

Выполните в консоли браузера (F12):

```javascript
fetch('http://localhost:3000/api/v1/admin/servers/1/wg/peers/geolocation?publicKey=JJaE11Nd2IYQyUrFinBZGep1AG5iZ02ripLOPfe9xgg%3D', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  }
}).then(r => r.text()).then(console.log).catch(console.error)
```

### 2. Проверить логи backend в реальном времени

```powershell
docker logs vpn_backend --follow
```

Затем откройте детали пира и посмотрите что появится в логах.

### 3. Проверить что в БД есть last_known_endpoint

```powershell
docker exec vpn_postgres psql -U postgres -d vpn_3wg -c "SELECT name, endpoint, last_known_endpoint FROM wg_peers_cache WHERE name = 'test-laptop';"
```

Должно быть: `last_known_endpoint = 95.161.223.123:54321`

### 4. Проверить что ip-api.com работает

```powershell
curl "http://ip-api.com/json/95.161.223.123"
```

Должен вернуть JSON с геолокацией (Всеволожск, Россия).

## Альтернативное решение

Если ip-api.com не работает, можно:

1. **Использовать другой сервис геолокации:**
   - ipapi.co (бесплатно 1000 запросов в день)
   - ipgeolocation.io (бесплатно 1000 запросов в день)
   - freegeoip.app

2. **Добавить кэширование геолокаций:**
   - Сохранять геолокацию в БД при первом запросе
   - Не запрашивать повторно для того же IP

3. **Подключить реальный VPN клиент:**
   - Когда клиент подключится, endpoint будет реальным
   - Геолокация будет работать для активного подключения

## Файлы изменены

- `backend/models/cache.go` - добавлено поле LastKnownEndpoint
- `backend/services/sync_worker.go` - сохранение last_known_endpoint
- `backend/controllers/wgdashboard.go` - использование last_known_endpoint
- `backend/routes/routes.go` - изменены роуты на query параметры
- `backend/migrations/add_last_known_endpoint.sql` - миграция
- `src/lib/api.ts` - методы с query параметрами

## Следующие шаги

1. Проверить что возвращает API (см. выше)
2. Если ip-api.com не работает - добавить альтернативный сервис
3. Добавить кэширование геолокаций в БД
4. Протестировать с реальным подключенным клиентом
