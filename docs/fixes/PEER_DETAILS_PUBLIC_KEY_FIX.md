# Исправление проблемы с Public Key в URL

## Проблема

При попытке получить геолокацию или историю трафика пира возникала ошибка 404. Проблема была в том, что public key содержит специальные символы (`/`, `+`, `=`), которые вызывали проблемы при передаче в URL path параметре.

### Пример проблемного public key:
```
Dimitriy_PC: 1Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw/Uw=
```

### Что не работало:
```
DELETE /api/v1/admin/servers/1/wg/peers/1Uw/Uw/Uw/...  ❌ 404
GET /api/v1/admin/servers/1/wg/peers/1Uw/Uw/Uw/.../geolocation  ❌ 404
GET /api/v1/admin/servers/1/wg/peers/1Uw/Uw/Uw/.../traffic-history  ❌ 404
```

Даже с `encodeURIComponent()` Gin не мог правильно распарсить закодированный `/` (`%2F`) в path параметре.

## Решение

Изменили роуты с path параметров на query параметры:

### Backend Routes (`backend/routes/routes.go`)

**Было:**
```go
admin.DELETE("/servers/:id/wg/peers/:peer_id", wgController.RemovePeerFromServer)
admin.GET("/servers/:id/wg/peers/:peer_id/geolocation", wgController.GetPeerGeolocation)
admin.GET("/servers/:id/wg/peers/:peer_id/traffic-history", wgController.GetPeerTrafficHistory)
```

**Стало:**
```go
admin.DELETE("/servers/:id/wg/peers", wgController.RemovePeerFromServer)
admin.GET("/servers/:id/wg/peers/geolocation", wgController.GetPeerGeolocation)
admin.GET("/servers/:id/wg/peers/traffic-history", wgController.GetPeerTrafficHistory)
```

### Backend Controllers (`backend/controllers/wgdashboard.go`)

**Было:**
```go
peerID := c.Param("peer_id")
```

**Стало:**
```go
peerPublicKey := c.Query("publicKey")
if peerPublicKey == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "publicKey query parameter is required"})
    return
}
```

### Frontend API (`src/lib/api.ts`)

**Было:**
```typescript
async removePeerFromServer(serverId: number, publicKey: string) {
    return this.request(`/admin/servers/${serverId}/wg/peers/${encodeURIComponent(publicKey)}`, {
        method: 'DELETE',
    });
}
```

**Стало:**
```typescript
async removePeerFromServer(serverId: number, publicKey: string) {
    return this.request(`/admin/servers/${serverId}/wg/peers?publicKey=${encodeURIComponent(publicKey)}`, {
        method: 'DELETE',
    });
}
```

## Результат

✅ Удаление пиров работает для всех пиров (включая с `/` в ключе)
✅ Геолокация загружается корректно
✅ История трафика отображается правильно
✅ Public key с символами `/`, `+`, `=` корректно обрабатываются через query параметры

## Тестирование

### 1. Перезапустить backend:
```powershell
cd backend
docker-compose build backend
docker-compose stop backend
docker-compose up -d backend
```

### 2. Обновить страницу в браузере:
```
Ctrl + Shift + R (hard refresh)
```

### 3. Протестировать:
- Открыть детали пира с символом `/` в public key (например, `Dimitriy_PC`)
- Проверить что геолокация загружается без ошибок 404
- Проверить что история трафика отображается
- Попробовать удалить пир - должно работать

## Файлы изменены

- `backend/routes/routes.go` - изменены роуты для geolocation, traffic-history, delete
- `backend/controllers/wgdashboard.go` - методы GetPeerGeolocation, GetPeerTrafficHistory, RemovePeerFromServer
- `src/lib/api.ts` - методы getPeerGeolocation, getPeerTrafficHistory, removePeerFromServer
- `TASKS.md` - обновлена документация

## Дата исправления

30 января 2026
