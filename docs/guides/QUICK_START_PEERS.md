# Быстрый старт: Управление пирами WGDashboard

## 🚀 За 5 минут

### 1. Запустите бэкенд
```powershell
cd backend
.\run.ps1
```

### 2. Откройте админку
```
http://localhost:8080/admin
```
Логин: `admin@3wg.ru`  
Пароль: `admin123`

### 3. Добавьте сервер
1. Перейдите на вкладку "Серверы"
2. Нажмите "Добавить сервер"
3. Заполните:
   - **Название**: Amsterdam Server
   - **Локация**: Amsterdam, Netherlands
   - **Страна**: NL
   - **IP адрес**: 46.30.43.35
   - **URL WGDashboard**: http://46.30.43.35:10086
   - **API ключ**: DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM
   - **Конфигурация**: wg0
4. Нажмите "Создать"

### 4. Проверьте подключение
1. Откройте детали сервера
2. Нажмите "Тест подключения"
3. Должно появиться: ✅ "Подключение к WGDashboard успешно!"

### 5. Протестируйте пиры
```powershell
.\test-wgdashboard-peers.ps1
```

Скрипт автоматически:
- ✅ Авторизуется
- ✅ Получит список пиров
- ✅ Создаст тестовый ключ
- ✅ Добавит пира
- ✅ Проверит добавление
- ✅ Удалит пира
- ✅ Проверит удаление

## 📝 Использование в коде

### Backend (Go)
```go
import "github.com/3wg/vpn-backend/wgdashboard"

client := wgdashboard.NewClient(
    "http://46.30.43.35:10086",
    "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM",
    "wg0",
)

// Получить пиры
peers, err := client.GetAllPeers()

// Добавить пира
response, err := client.AddPeer(publicKey, []string{"10.16.11.100/32"}, "User")

// Удалить пира
err = client.RemovePeer(publicKey)
```

### Frontend (TypeScript)
```typescript
import { api } from '@/lib/api';

// Получить пиры
const peers = await api.getServerPeers(1);

// Добавить пира
await api.addPeerToServer(1, {
  public_key: publicKey,
  allowed_ips: ['10.16.11.100/32'],
  name: 'User VPN Key'
});

// Удалить пира
await api.removePeerFromServer(1, publicKey);
```

## 🔧 API Endpoints

```http
# Получить пиры
GET /api/v1/admin/servers/1/wg/peers
Authorization: Bearer <token>

# Добавить пира
POST /api/v1/admin/servers/1/wg/peers
Authorization: Bearer <token>
Content-Type: application/json

{
  "public_key": "...",
  "allowed_ips": ["10.16.11.100/32"],
  "name": "User VPN Key"
}

# Удалить пира
DELETE /api/v1/admin/servers/1/wg/peers/<public_key>
Authorization: Bearer <token>
```

## 📚 Документация

- **Полная документация**: `WGDASHBOARD_COMPLETE.md`
- **Руководство по пирам**: `WGDASHBOARD_PEERS_GUIDE.md`
- **API эндпоинты**: `WGDASHBOARD_API_ENDPOINTS.md`
- **Статус интеграции**: `WGDASHBOARD_FINAL_STATUS.md`

## ❓ Проблемы?

### Ошибка подключения
```
✗ Ошибка подключения к WGDashboard
```
**Решение**: Проверьте URL и API ключ в настройках сервера

### Ошибка добавления пира
```
✗ Ошибка добавления пира
```
**Решение**: Проверьте формат PublicKey и AllowedIPs

### Ошибка авторизации
```
✗ Unauthorized
```
**Решение**: Перелогиньтесь в админке

## 🎯 Что дальше?

1. Реализуйте автоматическое создание пиров при создании VPN ключей
2. Добавьте UI для просмотра пиров в админке
3. Реализуйте мониторинг статуса пиров

---

**Готово!** Интеграция работает и готова к использованию 🎉
