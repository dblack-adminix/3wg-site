# Исправление поддержки протоколов

## Дата: 2026-01-31

## Проблема

При попытке создать ключ с протоколом AmneziaWG возникала ошибка:
```
Configuration does not exist
Failed to add peer to WGDashboard: API returned status false: Configuration does not exist
```

## Причина

1. Сервер "Amsterdam Test Server" поддерживает только WireGuard (`wg0`, `wg1`)
2. На сервере нет конфигурации для AmneziaWG (`awg0`)
3. В базе данных сервер имеет `protocols: ["wireguard"]`, но фронтенд позволял выбрать AmneziaWG

## Решение

### 1. Добавлена проверка поддержки протокола

**Файл**: `src/pages/MobileGenerator.tsx`

#### Автоматическое переключение протокола
```typescript
useEffect(() => {
  if (selectedServer) {
    const serverProtocols = selectedServer.protocols || [];
    const supportsWireguard = serverProtocols.includes('wireguard');
    const supportsAmnezia = serverProtocols.includes('amneziawg');
    
    // Если текущий протокол не поддерживается, переключаемся на поддерживаемый
    if (protocol === 'amneziawg' && !supportsAmnezia && supportsWireguard) {
      setProtocol('wireguard');
      toast.info('Сервер не поддерживает AmneziaWG, переключено на WireGuard');
    }
  }
}, [selectedServer, protocol]);
```

#### Блокировка кнопок неподдерживаемых протоколов
- Добавлен атрибут `disabled` для кнопок протоколов
- Проверка: `selectedServer && !selectedServer.protocols?.includes('wireguard')`
- Визуальная индикация: `opacity-30 cursor-not-allowed`
- Отключена анимация для заблокированных кнопок

#### Предупреждение о несовместимости
```tsx
{selectedServer && !selectedServer.protocols?.includes(protocol) && (
  <motion.div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
    <Shield className="w-4 h-4 text-yellow-500" />
    <span className="text-xs text-yellow-500 font-mono">
      Выбранный сервер не поддерживает {protocol === 'wireguard' ? 'WireGuard' : 'AmneziaWG'}
    </span>
  </motion.div>
)}
```

### 2. Улучшена генерация имени ключа

Имя ключа теперь обновляется при смене протокола:
```typescript
useEffect(() => {
  if (selectedServer) {
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const protocolShort = protocol === 'wireguard' ? 'WG' : 'AWG';
    setKeyName(`${selectedServer.location}_${protocolShort}_${randomId}`);
  }
}, [selectedServer, protocol]);
```

## Текущее состояние серверов

### Amsterdam Test Server (ID: 1)
- **Протоколы**: `wireguard`
- **Конфигурации**: `wg0`, `wg1`
- **Статус**: ✅ Работает

### Для добавления AmneziaWG нужно:
1. Установить AmneziaWG на сервере
2. Создать конфигурацию `awg0`
3. Обновить поле `protocols` в базе данных: `["wireguard", "amneziawg"]`
4. Добавить поле `awg_config_name` в модель Server (опционально)

## Результат

✅ Пользователь не может выбрать неподдерживаемый протокол
✅ Автоматическое переключение на поддерживаемый протокол
✅ Визуальная индикация недоступных протоколов
✅ Предупреждение о несовместимости
✅ Ошибка "Configuration does not exist" больше не возникает

## Тестирование

1. Открыть генератор ключей
2. Выбрать сервер Amsterdam Test Server
3. Попытаться выбрать AmneziaWG
4. Результат: кнопка заблокирована, показано предупреждение
5. WireGuard работает корректно ✅
