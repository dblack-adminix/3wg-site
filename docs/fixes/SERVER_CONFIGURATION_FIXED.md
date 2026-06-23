# Исправление конфигурации сервера wg.3labs.pw

## Дата: 2026-01-31

## Проблема

При попытке создать ключ AmneziaWG возникала ошибка:
```
Configuration does not exist
```

## Причина

Сервер `wg.3labs.pw` (ID: 4) был неправильно настроен:
- В базе: `wg_config_name = "wg0"`
- На сервере: только конфигурация `awg0`
- Протоколы были `null` после обновления

## Решение

### 1. Проверка доступных конфигураций
```bash
GET /api/v1/admin/servers/4/wg/config
```
Результат: `awg0` (только AmneziaWG)

### 2. Обновление через SQL
```sql
UPDATE servers 
SET 
    location = 'Amsterdam',
    country = 'NL',
    ip_address = 'wg.3labs.pw',
    protocols = ARRAY['wireguard', 'amneziawg']::text[],
    wg_config_name = 'awg0',
    updated_at = NOW()
WHERE id = 4;
```

## Текущая конфигурация серверов

### Server ID: 1 - Amsterdam Test Server
- **IP**: 46.30.43.35
- **Протоколы**: `wireguard`
- **Config**: `wg0`
- **Dashboard**: http://46.30.43.35:10086
- **Статус**: ✅ Работает

### Server ID: 2 - amster test
- **IP**: 5.180.97.201
- **Протоколы**: `wireguard`
- **Config**: `wg0`
- **Dashboard**: http://5.180.97.201:10086
- **Статус**: ✅ Работает

### Server ID: 3 - AMCNTH
- **IP**: 62.109.12.27
- **Location**: Khimki, Moscow Oblast
- **Протоколы**: `wireguard`
- **Config**: `wg0`
- **Dashboard**: http://62.109.12.27:10086
- **Статус**: ⚠️ Не используется

### Server ID: 4 - wg.3labs.pw ⭐
- **IP**: wg.3labs.pw
- **Location**: Amsterdam
- **Country**: NL
- **Протоколы**: `wireguard, amneziawg` ✅
- **Config**: `awg0` ✅
- **Dashboard**: https://wg.3labs.pw
- **Статус**: ✅ Работает (AmneziaWG)

## Результат

✅ Сервер `wg.3labs.pw` теперь правильно настроен
✅ Поддерживает оба протокола: WireGuard и AmneziaWG
✅ Использует правильную конфигурацию `awg0`
✅ Фронтенд автоматически определяет поддерживаемые протоколы
✅ Создание ключей AmneziaWG теперь работает

## Тестирование

1. Открыть генератор ключей: http://localhost:8080/mobile-generator
2. Выбрать сервер `wg.3labs.pw`
3. Выбрать протокол AmneziaWG (кнопка активна)
4. Создать ключ
5. Результат: ✅ Ключ создан успешно

## Скрипты для проверки

- `check-all-servers-list.ps1` - список всех серверов
- `check-3labs-server.ps1` - детали сервера wg.3labs.pw
- `update-3labs-server-full.ps1` - обновление сервера через SQL
