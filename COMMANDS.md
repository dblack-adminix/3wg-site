# Полезные команды

## Backend

### Запуск
```powershell
cd backend
.\run.ps1
```

### Сборка
```powershell
cd backend
go build -o vpn-backend.exe .
```

### Применение миграций
```powershell
cd backend
.\apply-migration.ps1
```

### Создание админа
```powershell
cd backend
.\create-admin.ps1
```

## Frontend

### Запуск dev сервера
```powershell
npm run dev
```

### Сборка
```powershell
npm run build
```

## Тестирование WGDashboard

### Добавить тестовый сервер
```powershell
.\add-test-server.ps1
```

### Прямое тестирование WGDashboard
```powershell
.\test-wgdashboard.ps1
```

### Тестирование через API
```powershell
.\test-wgdashboard-integration.ps1
```

### Тестирование пиров
```powershell
.\test-wgdashboard-peers.ps1
```

## API Endpoints

### Авторизация
```bash
# Логин
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@3wg.ru","password":"admin123"}'
```

### Серверы
```bash
# Получить список серверов
curl http://localhost:3000/api/v1/servers

# Создать сервер
curl -X POST http://localhost:3000/api/v1/admin/servers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amsterdam Server",
    "location": "Amsterdam, Netherlands",
    "country": "NL",
    "ip_address": "46.30.43.35",
    "protocols": ["wireguard"],
    "max_users": 100,
    "wg_dashboard_url": "http://46.30.43.35:10086",
    "wg_dashboard_key": "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM",
    "wg_config_name": "wg0",
    "wg_dashboard_port": 10086,
    "wg_listen_port": 51820
  }'

# Тест подключения
curl http://localhost:3000/api/v1/admin/servers/1/wg/test \
  -H "Authorization: Bearer <token>"
```

### Пиры
```bash
# Получить список пиров
curl http://localhost:3000/api/v1/admin/servers/1/wg/peers \
  -H "Authorization: Bearer <token>"

# Добавить пира
curl -X POST http://localhost:3000/api/v1/admin/servers/1/wg/peers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "public_key": "YOUR_PUBLIC_KEY",
    "allowed_ips": ["10.16.11.100/32"],
    "name": "User VPN Key"
  }'

# Удалить пира
curl -X DELETE http://localhost:3000/api/v1/admin/servers/1/wg/peers/PUBLIC_KEY \
  -H "Authorization: Bearer <token>"
```

## WireGuard

### Генерация ключей
```bash
# Приватный ключ
wg genkey > privatekey

# Публичный ключ
wg pubkey < privatekey > publickey

# Или одной командой
wg genkey | tee privatekey | wg pubkey > publickey
```

### Просмотр конфигурации
```bash
wg show wg0
```

## PostgreSQL

### Подключение
```bash
psql -U postgres -d vpn_db
```

### Полезные запросы
```sql
-- Список серверов
SELECT * FROM servers;

-- Список пользователей
SELECT * FROM users;

-- Список ключей
SELECT * FROM vpn_keys;

-- Статистика
SELECT COUNT(*) FROM servers;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM vpn_keys;
```

## Git

### Коммит изменений
```bash
git add .
git commit -m "feat: WGDashboard integration complete"
git push
```

### Создание ветки
```bash
git checkout -b feature/wgdashboard-integration
```

## Docker (если используется)

### Запуск PostgreSQL
```bash
docker-compose up -d postgres
```

### Просмотр логов
```bash
docker-compose logs -f
```

### Остановка
```bash
docker-compose down
```

## Полезные алиасы (добавьте в PowerShell profile)

```powershell
# Быстрый запуск бэкенда
function Start-Backend { cd backend; .\run.ps1 }
Set-Alias -Name backend -Value Start-Backend

# Быстрый запуск фронтенда
function Start-Frontend { npm run dev }
Set-Alias -Name frontend -Value Start-Frontend

# Тест пиров
function Test-Peers { .\test-wgdashboard-peers.ps1 }
Set-Alias -Name test-peers -Value Test-Peers
```

## Быстрые ссылки

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:8080/admin
- **WGDashboard**: http://46.30.43.35:10086

## Учетные данные

### Админ
- Email: `admin@3wg.ru`
- Password: `admin123`

### WGDashboard
- URL: `http://46.30.43.35:10086`
- API Key: `DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM`

---

**Совет**: Добавьте этот файл в закладки для быстрого доступа к командам!
