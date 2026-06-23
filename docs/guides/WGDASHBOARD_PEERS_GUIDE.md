# Управление пирами WGDashboard

## Обзор

Реализовано полное управление пирами WireGuard через WGDashboard API с использованием raw конфигурации.

## Почему raw конфигурация?

Официальная документация WGDashboard API не содержит эндпоинтов для работы с пирами. Поэтому используется обходное решение:
1. Получаем raw конфигурацию через `/api/getWireguardConfigurationRawFile`
2. Парсим/модифицируем INI формат
3. Обновляем через `/api/updateWireguardConfigurationRawFile`

## API Endpoints

### 1. Получить список всех пиров
```http
GET /api/v1/admin/servers/:id/wg/peers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "peers": [
    {
      "publicKey": "...",
      "allowed_ip": ["10.16.11.2/32"],
      "preshared_key": "...",
      "endpoint": ""
    }
  ],
  "total": 1
}
```

### 2. Добавить пира
```http
POST /api/v1/admin/servers/:id/wg/peers
Authorization: Bearer <token>
Content-Type: application/json

{
  "public_key": "...",
  "allowed_ips": ["10.16.11.100/32"],
  "name": "User VPN Key"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Peer added successfully",
  "data": {
    "publicKey": "..."
  }
}
```

### 3. Удалить пира
```http
DELETE /api/v1/admin/servers/:id/wg/peers/:public_key
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "message": "Peer removed successfully"
}
```

## Использование в коде

### Backend (Go)

```go
import "github.com/3wg/vpn-backend/wgdashboard"

// Создание клиента
client := wgdashboard.NewClient(
    "http://46.30.43.35:10086",
    "DypsOounxjEnFk5TPuVdTlE7nGDs2dn5rPxKG3XGSTM",
    "wg0",
)

// Получение всех пиров
peers, err := client.GetAllPeers()
if err != nil {
    log.Fatal(err)
}

// Добавление пира
response, err := client.AddPeer(
    publicKey,
    []string{"10.16.11.100/32"},
    "Test User",
)

// Удаление пира
err = client.RemovePeer(publicKey)
```

### Frontend (TypeScript)

```typescript
import { api } from '@/lib/api';

// Получение пиров
const peers = await api.getServerPeers(serverId);

// Добавление пира
await api.addPeerToServer(serverId, {
  public_key: publicKey,
  allowed_ips: ['10.16.11.100/32'],
  name: 'User VPN Key'
});

// Удаление пира
await api.removePeerFromServer(serverId, publicKey);
```

## Тестирование

### Автоматический тест
```powershell
.\test-wgdashboard-peers.ps1
```

Скрипт выполняет:
1. Авторизацию
2. Получение списка пиров
3. Генерацию тестового ключа
4. Добавление пира
5. Проверку добавления
6. Удаление пира
7. Проверку удаления

### Ручное тестирование

#### 1. Генерация ключей
```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

#### 2. Добавление пира через curl
```bash
curl -X POST http://localhost:3000/api/v1/admin/servers/1/wg/peers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "public_key": "...",
    "allowed_ips": ["10.16.11.100/32"],
    "name": "Test User"
  }'
```

#### 3. Проверка в WGDashboard
Откройте http://46.30.43.35:10086/ и проверьте, что пир появился в конфигурации wg0.

## Формат raw конфигурации

```ini
[Interface]
PrivateKey = ...
Address = 10.16.11.1/24
ListenPort = 51820

[Peer]
# User 1
PublicKey = ...
AllowedIPs = 10.16.11.2/32
PresharedKey = ...

[Peer]
# User 2
PublicKey = ...
AllowedIPs = 10.16.11.3/32
```

## Парсинг конфигурации

Реализованы вспомогательные функции:
- `splitLines()` - разбивка на строки
- `joinLines()` - объединение строк
- `trimSpace()` - удаление пробелов
- `splitKeyValue()` - разбивка по `=`

## Ограничения

1. **Производительность**: При большом количестве пиров (>1000) парсинг может быть медленным
2. **Конкурентность**: Одновременное изменение конфигурации может привести к конфликтам
3. **Валидация**: Минимальная валидация данных (проверяйте на клиенте)
4. **Комментарии**: Комментарии в конфигурации могут быть потеряны

## Рекомендации

1. **Кэширование**: Кэшируйте список пиров на фронтенде
2. **Батчинг**: Группируйте операции добавления/удаления
3. **Валидация**: Проверяйте PublicKey и AllowedIPs перед отправкой
4. **Мониторинг**: Логируйте все операции с пирами
5. **Бэкапы**: Делайте бэкапы конфигурации перед изменениями

## Следующие шаги

1. ✅ Реализовать UI для управления пирами в админке
2. ✅ Автоматическое создание пиров при создании VPN ключей
3. ✅ Синхронизация пиров между БД и WGDashboard
4. ⏳ Мониторинг статуса пиров (handshake, traffic)
5. ⏳ Автоматическое удаление неактивных пиров

## Полезные ссылки

- [WGDashboard API Docs](https://docs.wgdashboard.dev/api/)
- [WireGuard Documentation](https://www.wireguard.com/)
- [Тестовый сервер](http://46.30.43.35:10086/)

---

**Обновлено**: 29 января 2026  
**Статус**: ✅ Полностью реализовано
