# Mobile Generator Fix - 31 января 2026

## Проблема

Пользователь сообщил, что кнопка "CREATE NEW ACCESS KEY" в мобильном дашборде ведет на веб-генератор вместо мобильного.

## Анализ

Было обнаружено несколько проблем:

### 1. Неправильная навигация в Keys.tsx
Страница `/keys` (доступная через нижнюю навигацию мобильного дашборда) содержала кнопку "CREATE NEW ACCESS KEY", которая вела на `/generator` (десктопная версия) вместо `/mobile-generator`.

### 2. Ошибки в MobileGenerator.tsx
- **Неправильный параметр API**: Компонент пытался передать `protocol` в `api.createUserKey()`, но API не принимает этот параметр
- **Неправильное поле сервера**: Использовалось `server.current_peers` вместо `server.current_users`
- **Неиспользуемый импорт**: `motion` и `AnimatePresence` из framer-motion не использовались

## Исправления

### 1. Исправлена навигация в Keys.tsx
```tsx
// Было:
<Link to="/generator">

// Стало:
<Link to="/mobile-generator">
```

### 2. Исправлен API вызов в MobileGenerator.tsx
```tsx
// Было:
const response = await api.createUserKey({
  server_id: selectedServer.id,
  name: keyName,
  protocol: protocol, // ❌ API не принимает этот параметр
});

// Стало:
const response = await api.createUserKey({
  server_id: selectedServer.id,
  name: keyName,
});
```

### 3. Исправлено поле сервера
```tsx
// Было:
{server.current_peers || 0}/{server.max_users || 100}

// Стало:
{server.current_users || 0}/{server.max_users || 100}
```

### 4. Удален неиспользуемый импорт
```tsx
// Было:
import { motion, AnimatePresence } from 'framer-motion';

// Стало:
// Импорт удален
```

## Результат

✅ Кнопка "CREATE NEW ACCESS KEY" в `/keys` теперь ведет на `/mobile-generator`
✅ MobileGenerator корректно вызывает API без лишних параметров
✅ Отображается правильное количество пользователей на сервере
✅ Нет ошибок TypeScript

## Файлы изменены

- `src/pages/MobileGenerator.tsx` - исправлены API вызов, поле сервера, импорты
- `src/pages/Keys.tsx` - исправлена навигация на мобильный генератор

## Тестирование

Для проверки:
1. Войти в систему как пользователь
2. Перейти на `/dashboard` (мобильный дашборд)
3. Нажать на вкладку "Configs" в нижней навигации
4. Нажать кнопку "CREATE NEW ACCESS KEY"
5. Должен открыться `/mobile-generator` с упрощенным интерфейсом

## Различия между генераторами

### Desktop Generator (`/generator`)
- Терминальный дизайн с ASCII артом
- Анимированная генерация с прогресс-баром
- Подробная информация о серверах
- Визуальные эффекты (flicker, scanlines)
- Подходит для больших экранов

### Mobile Generator (`/mobile-generator`)
- Упрощенный карточный дизайн
- Быстрая генерация без анимаций
- Минималистичный интерфейс
- Оптимизирован для мобильных устройств
- Меньше визуальных эффектов

## Примечания

- Оба генератора используют один и тот же API endpoint
- Протокол (WireGuard/AmneziaWG) выбирается в UI, но не передается в API (backend использует WireGuard по умолчанию)
- IP адреса назначаются автоматически backend'ом (10.16.11.2 - 10.16.11.254)
- Пиры автоматически добавляются на WGDashboard сервер при создании ключа
