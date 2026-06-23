# AmneziaWG - Два QR кода

## Проблема

Для AmneziaWG ключей WGDashboard генерирует **два разных QR кода**:

1. **WireGuard формат** - обычный текстовый конфиг
2. **AmneziaVPN формат** - JSON с параметрами контейнера

## Решение

### Вариант 1: Показывать оба QR кода (как на WGDashboard)

Для этого нужно:
1. Получать JSON конфиг с поля `amneziaVPN` из API
2. Показывать два QR кода в модальном окне
3. Подписи: "Scan with AmneziaWG App" и "Scan with AmneziaVPN App"

### Вариант 2: Показывать только AmneziaVPN QR (рекомендуется)

Показывать только второй QR код (AmneziaVPN JSON), так как:
- Он содержит все параметры обфускации
- Работает в официальном AmneziaVPN приложении
- Более удобен для пользователей

## Текущее состояние

Сейчас показывается только текстовый конфиг в QR коде.

## Что нужно сделать

1. Добавить API endpoint для получения AmneziaVPN JSON
2. Обновить KeyDetails для показа двух QR кодов
3. Добавить переключатель между форматами

## Формат AmneziaVPN JSON

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

## Статус

⏸️ **Отложено** - работает базовый QR код с текстовым конфигом.

Для полной поддержки нужно добавить получение JSON конфига с сервера.
