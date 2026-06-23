# Два QR кода для AmneziaWG - Реализовано

## Дата: 2026-01-31

## Задача

Для AmneziaWG ключей нужно показывать **два разных QR кода**, как на WGDashboard:
1. **AmneziaWG формат** - текстовый конфиг с параметрами обфускации
2. **AmneziaVPN формат** - JSON с параметрами контейнера

## Реализация

### 1. Бэкенд - WGDashboard клиент

**Файл**: `backend/wgdashboard/client.go`

Добавлен метод для получения AmneziaVPN JSON:

```go
// GetPeerAmneziaJSON получает AmneziaVPN JSON конфиг пира по приватному ключу
func (c *Client) GetPeerAmneziaJSON(privateKey string) (string, error) {
    response, err := c.DownloadAllPeers()
    if err != nil {
        return "", err
    }

    // Ищем пира по приватному ключу
    for _, peer := range response.Data {
        if contains(peer.File, privateKey) {
            return peer.AmneziaVPN, nil // Возвращаем JSON
        }
    }

    return "", fmt.Errorf("peer amnezia config not found")
}
```

### 2. Бэкенд - VPNKey контроллер

**Файл**: `backend/controllers/vpn_key.go`

Добавлен новый endpoint:

```go
func (kc *VPNKeyController) GetAmneziaJSON(c *gin.Context) {
    // ... получение ключа и сервера
    
    // Проверка что это AmneziaWG ключ
    if !strings.Contains(strings.ToLower(key.Protocol), "amnezia") {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Only for AmneziaWG keys"})
        return
    }

    // Получаем AmneziaVPN JSON с сервера
    client := wgdashboard.NewClient(...)
    amneziaJSON, err := client.GetPeerAmneziaJSON(key.PrivateKey)
    
    c.String(http.StatusOK, amneziaJSON)
}
```

### 3. Бэкенд - Роуты

**Файл**: `backend/routes/routes.go`

```go
keys.GET("/:id/config", keyController.GetConfig)
keys.GET("/:id/amnezia-json", keyController.GetAmneziaJSON) // Новый endpoint
```

### 4. Фронтенд - API клиент

**Файл**: `src/lib/api.ts`

```typescript
async downloadAmneziaJSON(id: number): Promise<string> {
    const url = `${this.baseUrl}/keys/${id}/amnezia-json`;
    // ... запрос к API
    return await response.text(); // Возвращаем JSON строку
}
```

### 5. Фронтенд - KeyDetails

**Файл**: `src/pages/KeyDetails.tsx`

#### Состояние:
```typescript
const [qrConfig, setQrConfig] = useState<string>('');
const [qrAmneziaJSON, setQrAmneziaJSON] = useState<string>('');
```

#### Загрузка конфигов:
```typescript
const handleShowQR = async () => {
    const config = await api.downloadKeyConfig(key.id);
    setQrConfig(config);
    
    // Если AmneziaWG, загружаем также JSON
    if (key.protocol.toLowerCase().includes('amnezia')) {
        const amneziaJSON = await api.downloadAmneziaJSON(key.id);
        setQrAmneziaJSON(amneziaJSON);
    }
    
    setShowQR(true);
};
```

#### UI - Два QR кода:
```tsx
{/* Первый QR - AmneziaWG формат */}
<div>
    <p>Scan with AmneziaWG App</p>
    <QRCodeSVG value={qrConfig} size={280} />
    <Button>СОХРАНИТЬ QR-КОД</Button>
</div>

{/* Второй QR - AmneziaVPN формат (только для AmneziaWG) */}
{qrAmneziaJSON && key?.protocol.includes('amnezia') && (
    <div className="border-t border-gray-700 pt-6">
        <p>Scan with AmneziaVPN App</p>
        <QRCodeSVG value={qrAmneziaJSON} size={280} />
        <Button>СОХРАНИТЬ AMNEZIAVPN QR</Button>
    </div>
)}
```

## Форматы QR кодов

### 1. AmneziaWG формат (текстовый)
```ini
[Interface]
PrivateKey = ...
Address = 10.50.0.6/32
MTU = 1420
DNS = 1.1.1.1
Jc = 120
Jmin = 50
Jmax = 1000
S1 = 86
S2 = 14
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = ...
AllowedIPs = 0.0.0.0/0
Endpoint = 45.151.183.218:443
PersistentKeepalive = 21
```

### 2. AmneziaVPN формат (JSON)
```json
{
  "containers": [{
    "awg": {
      "isThirdPartyConfig": true,
      "last_config": "[Interface]\\nPrivateKey = ...\\n...",
      "port": "443",
      "transport_proto": "udp"
    },
    "container": "amnezia-awg"
  }],
  "defaultContainer": "amnezia-awg",
  "description": "Amsterdam_AWG_PY31",
  "hostName": "45.151.183.218"
}
```

## Использование

### Для WireGuard ключей:
- Показывается **один QR код** с текстовым конфигом
- Подпись: "Scan with WireGuard App"

### Для AmneziaWG ключей:
- Показывается **два QR кода**
- Первый: "Scan with AmneziaWG App" (текстовый конфиг)
- Второй: "Scan with AmneziaVPN App" (JSON формат)
- Каждый QR код можно скачать отдельно

## API Endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/v1/keys/:id/config` | GET | Текстовый конфиг (WireGuard/AmneziaWG) |
| `/api/v1/keys/:id/amnezia-json` | GET | AmneziaVPN JSON (только для AmneziaWG) |

## Преимущества

✅ **Полная совместимость** с WGDashboard
✅ **Два формата** для разных приложений
✅ **Раздельное скачивание** QR кодов
✅ **Автоматическое определение** протокола
✅ **Fallback** - если JSON недоступен, показывается только текстовый QR

## Тестирование

1. Создать AmneziaWG ключ на сервере wg.3labs.pw
2. Открыть детали ключа
3. Нажать кнопку "QR"
4. Результат: ✅ Показываются два QR кода
5. Скачать оба QR кода отдельно

## Статус: ✅ РЕАЛИЗОВАНО

Теперь пользователи могут выбрать какой QR код сканировать в зависимости от используемого приложения!
