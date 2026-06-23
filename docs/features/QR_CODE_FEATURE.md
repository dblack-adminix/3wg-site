# QR Code Feature - Документация

## Обзор

Реализована функция генерации QR кодов для быстрого подключения к WireGuard серверу. Пользователи могут отсканировать QR код мобильным приложением WireGuard или скачать .conf файл для импорта на десктопе.

## Что реализовано

### Backend

#### 1. API Endpoint: `GET /admin/servers/:id/wg/peers/config`

**Параметры:**
- `id` (path) - ID сервера
- `publicKey` (query) - Public key пира (URL encoded)

**Ответ:**
```json
{
  "status": "success",
  "config": "[Interface]\nPrivateKey = ...\n...",
  "peer_name": "Dimitriy_PC"
}
```

**Логика:**
1. Получает пир из кэша БД по `server_id` и `public_key`
2. Получает конфигурацию сервера из кэша по `server_id` и `config_name`
3. Запрашивает приватный ключ напрямую из WGDashboard (безопасность!)
4. Генерирует WireGuard конфиг в формате:
   ```
   [Interface]
   PrivateKey = <private_key>
   Address = <allowed_ip>
   DNS = 1.1.1.1, 8.8.8.8

   [Peer]
   PublicKey = <server_public_key>
   Endpoint = <server_ip>:<listen_port>
   AllowedIPs = 0.0.0.0/0, ::/0
   PersistentKeepalive = 25
   ```

**Файлы:**
- `backend/controllers/wgdashboard.go` - функция `GetPeerConfig()`
- `backend/routes/routes.go` - роут `/admin/servers/:id/wg/peers/config`

#### 2. Исправление бага с config_name

**Проблема:** В запросе использовалось `config_name` вместо `name` для поиска конфигурации.

**Решение:** Изменен запрос с:
```go
wc.db.Where("server_id = ? AND config_name = ?", id, peer.ConfigName)
```
на:
```go
wc.db.Where("server_id = ? AND name = ?", id, peer.ConfigName)
```

### Frontend

#### 1. API функция `getPeerConfig()`

**Файл:** `src/lib/api.ts`

```typescript
async getPeerConfig(serverId: number, publicKey: string): Promise<{
  status: string;
  config: string;
  peer_name: string;
}> {
  return this.request(`/admin/servers/${serverId}/wg/peers/config?publicKey=${encodeURIComponent(publicKey)}`);
}
```

#### 2. UI компонент QR кода

**Файл:** `src/components/admin/ServersTab.tsx`

**Состояния:**
- `peerConfig` - текст конфига
- `isLoadingConfig` - загрузка конфига
- `showQR` - показать/скрыть QR код

**Загрузка конфига:**
```typescript
useEffect(() => {
  if (isPeerDetailsDialogOpen && viewingPeer && selectedServerId) {
    const publicKey = viewingPeer.publicKey || viewingPeer.public_key;
    if (publicKey) {
      setIsLoadingConfig(true);
      api.getPeerConfig(selectedServerId, publicKey)
        .then(response => {
          if (response.status === 'success' && response.config) {
            setPeerConfig(response.config);
          }
        })
        .finally(() => setIsLoadingConfig(false));
    }
  }
}, [isPeerDetailsDialogOpen, viewingPeer, selectedServerId]);
```

**UI блок "Подключение":**
- Левая колонка: QR код
  - Кнопка "Показать QR" / "Скрыть QR"
  - QR код генерируется библиотекой `qrcode.react`
  - Размер: 192x192px
  - Уровень коррекции ошибок: M
- Правая колонка: Скачивание
  - Кнопка "Скачать .conf"
  - Инструкции для мобильных и десктопа

**Скачивание конфига:**
```typescript
onClick={() => {
  if (peerConfig) {
    const blob = new Blob([peerConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewingPeer?.name || 'peer'}.conf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Конфиг скачан');
  }
}}
```

#### 3. Библиотека qrcode.react

**Установка:**
```bash
npm install qrcode.react
```

**Использование:**
```tsx
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG 
  value={peerConfig} 
  size={192}
  level="M"
  includeMargin={true}
/>
```

## Тестирование

### 1. Тестовый скрипт API

**Файл:** `test-peer-config.ps1`

```powershell
# Получает токен из auth-token.txt
# Получает список серверов
# Получает список пиров
# Генерирует конфиг для первого пира
# Сохраняет конфиг в файл test-peer-<name>.conf
```

**Запуск:**
```powershell
.\get-auth-token.ps1  # Получить токен
.\test-peer-config.ps1  # Протестировать API
```

### 2. Тестирование в браузере

1. Открыть http://localhost:8080/admin
2. Войти как admin@3wg.ru / admin123
3. Перейти в раздел "Серверы"
4. Выбрать сервер
5. Нажать на кнопку "👁" у любого пира
6. В модалке деталей пира прокрутить вниз до блока "Подключение"
7. Нажать "Показать QR" - должен появиться QR код
8. Нажать "Скачать .conf" - должен скачаться файл

### 3. Тестирование QR кода

**Мобильное приложение WireGuard:**
1. Установить WireGuard на Android/iOS
2. Открыть приложение
3. Нажать "+" → "Сканировать QR код"
4. Отсканировать QR код из админки
5. Подключение должно быть добавлено автоматически

**Проверка конфига:**
```bash
# Проверить синтаксис
wg-quick up test-peer-Dimitriy_PC.conf

# Или импортировать в WireGuard GUI
```

## Структура конфига

```
[Interface]
PrivateKey = <приватный ключ клиента>
Address = <внутренний IP клиента>
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = <публичный ключ сервера>
Endpoint = <IP сервера>:<порт>
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

**Параметры:**
- `PrivateKey` - получается из WGDashboard (безопасно!)
- `Address` - берется из `allowed_ips` пира
- `DNS` - фиксированные DNS серверы (Cloudflare + Google)
- `PublicKey` - публичный ключ сервера из кэша
- `Endpoint` - IP сервера + порт из конфигурации
- `AllowedIPs` - весь трафик через VPN (0.0.0.0/0, ::/0)
- `PersistentKeepalive` - 25 секунд (для NAT traversal)

## Безопасность

1. **Приватный ключ не хранится в БД** - запрашивается напрямую из WGDashboard при генерации конфига
2. **Авторизация** - endpoint требует Bearer токен админа
3. **URL encoding** - public key корректно кодируется в URL
4. **HTTPS** - в продакшене использовать HTTPS для защиты конфига при передаче

## Известные проблемы

1. **IP сервера должен быть заполнен** - если `ip_address` пустой, Endpoint будет `:port`
   - Решение: Обновить сервер через UI или SQL:
     ```sql
     UPDATE servers SET ip_address = '46.30.43.35' WHERE id = 1;
     ```

2. **Приватный ключ запрашивается каждый раз** - может быть медленно для большого количества пиров
   - Оптимизация: Кэшировать приватные ключи в БД (но это снижает безопасность)

## Следующие шаги (опционально)

1. **Автоматизация:**
   - Автоудаление истекших ключей (cron job)
   - Уведомления за 3 дня до истечения
   - Связь пиров с пользователями в таблице `vpn_keys`

2. **Улучшения UI:**
   - Копирование конфига в буфер обмена
   - Предпросмотр конфига перед скачиванием
   - Выбор DNS серверов
   - Настройка AllowedIPs (split tunneling)

3. **Дополнительные форматы:**
   - AmneziaWG конфиг
   - OpenVPN конфиг
   - Shadowsocks конфиг

## Файлы

**Backend:**
- `backend/controllers/wgdashboard.go` - GetPeerConfig()
- `backend/routes/routes.go` - роут
- `backend/models/cache.go` - модели WGPeerCache, WGConfigCache

**Frontend:**
- `src/lib/api.ts` - getPeerConfig()
- `src/components/admin/ServersTab.tsx` - UI QR кода
- `package.json` - зависимость qrcode.react

**Тесты:**
- `test-peer-config.ps1` - тест API
- `get-auth-token.ps1` - получение токена
- `test-peer-Dimitriy_PC.conf` - пример сгенерированного конфига

## Статус

✅ Backend API реализован
✅ Frontend UI реализован
✅ QR код работает
✅ Скачивание конфига работает
✅ Тестирование пройдено
✅ Документация написана

**Готово к использованию!** 🎉
