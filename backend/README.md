# 3WG VPN Backend

Backend API для VPN сервиса на Go + Gin + PostgreSQL

## Технологии

- **Go 1.21+**
- **Gin** - HTTP фреймворк
- **GORM** - ORM для работы с БД
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и сессии
- **JWT** - авторизация

## Установка

### Для Windows

#### 1. Установите зависимости

```powershell
go mod tidy
```

#### 2. Настройте базу данных

**Вариант A: Используя Docker Desktop**

1. Запустите Docker Desktop
2. Запустите контейнеры:
```powershell
docker-compose up -d
```

**Вариант B: Локальный PostgreSQL**

1. Установите PostgreSQL с официального сайта
2. Создайте базу данных:
```sql
CREATE DATABASE vpn_3wg;
```

#### 3. Настройте переменные окружения

Файл `.env` уже создан из `.env.example`. Отредактируйте его:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=vpn_3wg
```

#### 4. Создайте админа

```powershell
.\create-admin.ps1
```

Или напрямую:
```powershell
go run scripts/create_admin.go
```

#### 5. Запустите сервер

```powershell
.\run.ps1
```

Или напрямую:
```powershell
go run main.go
```

Сервер запустится на `http://localhost:8080`

### Для Linux/Mac

```bash
# 1. Установить зависимости
go mod download

# 2. Запустить БД через Docker
make docker-up

# 3. Создать .env файл
cp .env.example .env

# 4. Создать админа
go run scripts/create_admin.go

# 5. Запустить сервер
make run
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/refresh` - Обновление токена

### Users
- `GET /api/v1/users/me` - Получить профиль
- `PUT /api/v1/users/me` - Обновить профиль
- `GET /api/v1/users/me/stats` - Статистика пользователя

### Servers
- `GET /api/v1/servers` - Список серверов
- `GET /api/v1/servers/:id` - Информация о сервере

### VPN Keys
- `GET /api/v1/keys` - Мои ключи
- `POST /api/v1/keys` - Создать ключ
- `GET /api/v1/keys/:id` - Получить ключ
- `DELETE /api/v1/keys/:id` - Удалить ключ

### Payments
- `GET /api/v1/payments/history` - История платежей
- `POST /api/v1/payments/create` - Создать платёж

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard статистика
- `GET /api/v1/admin/users` - Список пользователей
- `GET /api/v1/admin/analytics` - Аналитика
- `POST /api/v1/admin/servers` - Создать сервер
- `PUT /api/v1/admin/servers/:id` - Обновить сервер
- `DELETE /api/v1/admin/servers/:id` - Удалить сервер

## Структура проекта

```
backend/
├── config/          # Конфигурация
├── controllers/     # Контроллеры (handlers)
├── database/        # Подключение к БД и миграции
├── middleware/      # Middleware (auth, cors, etc)
├── models/          # Модели данных
├── routes/          # Роуты API
├── utils/           # Утилиты
├── main.go          # Точка входа
├── go.mod           # Зависимости
└── .env             # Переменные окружения
```

## Разработка

### Запуск в dev режиме

```bash
go run main.go
```

### Сборка

```bash
go build -o bin/server main.go
```

### Запуск продакшен

```bash
./bin/server
```

## Docker

```bash
docker build -t 3wg-backend .
docker run -p 8080:8080 3wg-backend
```
