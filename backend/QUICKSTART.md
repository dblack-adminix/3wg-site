# 3wg VPN Backend - Quick Start Guide

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- PowerShell (Windows) or Bash (Linux/Mac)

## Quick Start (5 minutes)

### 1. Start All Services

```powershell
cd backend
.\manage.ps1 start
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3000)

### 2. Create Admin User

```powershell
.\manage.ps1 create-admin
```

Default credentials:
- Email: `admin@3wg.ru`
- Password: `admin123`

⚠️ **Change the password after first login!**

### 3. Test API

```powershell
.\manage.ps1 test
```

This will test:
- Login endpoint
- User profile endpoint
- Admin dashboard endpoint

## Management Commands

```powershell
.\manage.ps1 start        # Start all services
.\manage.ps1 stop         # Stop all services
.\manage.ps1 restart      # Restart all services
.\manage.ps1 logs         # Show backend logs
.\manage.ps1 status       # Show service status
.\manage.ps1 create-admin # Create admin user
.\manage.ps1 test         # Test API endpoints
.\manage.ps1 help         # Show help
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token

### User
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/me/stats` - Get user statistics

### Servers
- `GET /api/v1/servers` - List all servers
- `GET /api/v1/servers/:id` - Get server details

### VPN Keys
- `GET /api/v1/keys` - List user's keys
- `POST /api/v1/keys` - Create new key
- `GET /api/v1/keys/:id` - Get key details
- `DELETE /api/v1/keys/:id` - Delete key

### Payments
- `GET /api/v1/payments/history` - Payment history
- `POST /api/v1/payments/create` - Create payment

### Admin (requires admin role)
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/analytics` - Analytics data
- `POST /api/v1/admin/servers` - Create server
- `PUT /api/v1/admin/servers/:id` - Update server
- `DELETE /api/v1/admin/servers/:id` - Delete server

## Testing with curl

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@3wg.ru","password":"admin123"}'
```

### Get User Profile (with token)
```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Services not starting
```powershell
# Check Docker is running
docker ps

# Check logs
.\manage.ps1 logs

# Restart services
.\manage.ps1 restart
```

### Database connection issues
```powershell
# Check PostgreSQL is running
docker ps --filter "name=vpn_postgres"

# Check PostgreSQL logs
docker logs vpn_postgres
```

### Port already in use
If ports 3000, 5432, or 6379 are already in use, you can change them in `docker-compose.yml`.

## Development

### Running locally (without Docker)

1. Install PostgreSQL and Redis locally
2. Update `.env` file with local connection details
3. Run migrations:
```powershell
go run main.go
```

### Building
```powershell
go build -o vpn-backend.exe
```

## Production Deployment

1. Update `.env` with production values
2. Change JWT_SECRET to a strong random string
3. Update CORS settings in `main.go`
4. Use proper SSL certificates
5. Set up reverse proxy (nginx/caddy)
6. Enable firewall rules

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT` - Backend port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - JWT signing secret
- `REDIS_HOST` - Redis host

## Next Steps

1. Connect frontend to backend API
2. Implement payment integration (Cryptomus)
3. Add Telegram bot integration
4. Set up WireGuard/AmneziaWG key generation
5. Configure monitoring and logging
