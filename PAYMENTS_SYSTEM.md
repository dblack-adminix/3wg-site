# Мультипровайдерная система платежей 3WG.RU

## Обзор

Система платежей поддерживает несколько провайдеров с автоматическим fallback:
- **ЮKassa** (приоритетный) - банковские карты, СБП, Сбербанк Онлайн
- **Cryptomus** (fallback) - криптовалютные платежи (USDT, TON, BTC)
- Автоматическое зачисление средств
- Webhook уведомления от всех провайдеров
- История транзакций

## Архитектура

### Провайдеры
- **PaymentProvider** - универсальный интерфейс
- **YooKassaService** - интеграция с ЮKassa API
- **CryptomusService** - интеграция с Cryptomus API
- **PaymentProviderManager** - менеджер провайдеров

### Бэкенд (Go)
- **Интерфейс**: `backend/services/payment_provider.go`
- **ЮKassa**: `backend/services/yookassa.go`
- **Cryptomus**: `backend/services/cryptomus.go`
- **Контроллер**: `backend/controllers/payment.go` (обновлен)

### Фронтенд (React/TypeScript)
- **API клиент**: `src/lib/api.ts` (обновлен)
- **Хук**: `src/hooks/usePayments.ts` (обновлен)
- **Веб-интерфейс**: `src/pages/Account.tsx` (выбор провайдера)

## API Endpoints

### Создание платежа
```bash
POST /api/v1/payments/create
{
  "amount": 500,
  "currency": "RUB",
  "provider": "yookassa" // опционально: "yookassa" или "cryptomus"
}
```

### Webhook (универсальный)
```bash
POST /api/v1/payments/webhook
# Автоматически определяет провайдера по подписи
```

## Настройка

### Переменные окружения (.env)
```bash
# ЮKassa (приоритетный провайдер)
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Cryptomus (fallback провайдер)
CRYPTOMUS_API_KEY=your_api_key
CRYPTOMUS_MERCHANT_ID=your_merchant_id

# URLs
BASE_URL=http://localhost:8080
API_URL=http://localhost:3000
```

### Логика выбора провайдера
1. Если указан `provider` в запросе - используется указанный
2. Если ЮKassa настроена - используется по умолчанию
3. Если только Cryptomus настроен - используется как fallback
4. Если ничего не настроено - ошибка

## Провайдеры

### ЮKassa
- **Методы оплаты**: Банковские карты, СБП, Сбербанк Онлайн
- **Комиссия**: 0% (включена в стоимость)
- **Зачисление**: Мгновенно
- **Валюты**: RUB
- **Webhook**: HMAC-SHA256

### Cryptomus
- **Методы оплаты**: USDT (TRC20), TON, BTC
- **Комиссия**: ~3% (сеть)
- **Зачисление**: До 30 минут
- **Валюты**: RUB, USD, EUR
- **Webhook**: MD5 подпись

## Использование

### Создание платежа (Frontend)
```typescript
import { usePayments } from '@/hooks/usePayments';

const { createPayment } = usePayments();

// ЮKassa
const payment = await createPayment(500, 'RUB', 'yookassa');

// Cryptomus
const payment = await createPayment(500, 'RUB', 'cryptomus');

// Автоматический выбор
const payment = await createPayment(500, 'RUB');
```

### Интерфейс выбора провайдера
- Модальное окно с выбором способа оплаты
- ЮKassa: карты, СБП (₽)
- Cryptomus: криптовалюты (₿)
- Динамическая информация о комиссиях

## Тестирование

### Мультипровайдерное тестирование
```bash
.\scripts\testing\test-multi-payments.ps1
```

### Тестирование UI
```bash
.\scripts\testing\test-payments-ui.ps1
```

## Статусы платежей

### Универсальные статусы
- `pending` - Ожидает оплаты
- `paid` - Оплачен успешно
- `cancelled` - Отменен
- `failed` - Ошибка оплаты
- `expired` - Истек срок действия

### Конвертация статусов
**ЮKassa → Универсальный:**
- `pending`, `waiting_for_capture` → `pending`
- `succeeded` → `paid`
- `canceled` → `cancelled`

**Cryptomus → Универсальный:**
- `pending`, `process`, `check` → `pending`
- `paid`, `success` → `paid`
- `cancel`, `cancelled` → `cancelled`
- `fail`, `failed` → `failed`

## Webhook обработка

### Универсальный webhook
1. Получает webhook от любого провайдера
2. Определяет провайдера по подписи
3. Парсит данные в универсальный формат
4. Обновляет платеж в БД
5. Начисляет баланс при успешной оплате

### Настройка webhook URL
- ЮKassa: `https://yourdomain.com/api/v1/payments/webhook`
- Cryptomus: `https://yourdomain.com/api/v1/payments/webhook`

## Мониторинг

### Логи
- `[Payment] YooKassa provider registered as default`
- `[Payment] Creating payment: provider=YooKassa`
- `[Webhook] Successfully parsed with YooKassa`

### Метрики по провайдерам
- Количество платежей по каждому провайдеру
- Процент успешных платежей
- Среднее время обработки

## Roadmap

- [ ] Поддержка Stripe для международных платежей
- [ ] Поддержка QIWI и WebMoney
- [ ] Автоматическое переключение при недоступности провайдера
- [ ] A/B тестирование провайдеров
- [ ] Детальная аналитика по провайдерам

## Архитектура

### Бэкенд (Go)
- **Модель**: `backend/models/payment.go`
- **Контроллер**: `backend/controllers/payment.go`
- **Сервис**: `backend/services/cryptomus.go`
- **Роуты**: `backend/routes/routes.go`

### Фронтенд (React/TypeScript)
- **API клиент**: `src/lib/api.ts`
- **Хук**: `src/hooks/usePayments.ts`
- **Веб-интерфейс**: `src/pages/Account.tsx` (вкладка Платежи)
- **Мобильный интерфейс**: `src/pages/Deposit.tsx`

## API Endpoints

### Защищенные (требуют авторизации)
- `GET /api/v1/payments/history` - История платежей
- `POST /api/v1/payments/create` - Создание платежа
- `GET /api/v1/payments/:id/status` - Статус платежа

### Публичные
- `POST /api/v1/payments/webhook` - Webhook от Cryptomus

## Настройка

### Переменные окружения (.env)
```bash
# Cryptomus API
CRYPTOMUS_API_KEY=your_api_key
CRYPTOMUS_MERCHANT_ID=your_merchant_id

# URLs
BASE_URL=http://localhost:8080
API_URL=http://localhost:3000
```

### Минимальные требования
- Минимальная сумма: 100₽
- Поддерживаемые валюты: RUB, USD, EUR
- Поддерживаемые криптовалюты: USDT (TRC20), TON, BTC

## Использование

### Создание платежа (API)
```bash
curl -X POST http://localhost:3000/api/v1/payments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "currency": "RUB"}'
```

### Создание платежа (Frontend)
```typescript
import { usePayments } from '@/hooks/usePayments';

const { createPayment } = usePayments();

// Создать платеж на 500 рублей
const payment = await createPayment(500, 'RUB');

// Перенаправить на страницу оплаты
if (payment.payment_url) {
  window.open(payment.payment_url, '_blank');
}
```

## Интерфейсы

### Веб-версия (Личный кабинет)
- Модальное окно создания платежа
- Быстрый выбор сумм: 500₽, 1000₽, 2500₽, 5000₽
- История транзакций с фильтрацией
- Статистика по методам оплаты
- Графики расходов по месяцам

### Мобильная версия
- Пошаговый процесс пополнения
- QR-код для оплаты
- Выбор криптовалюты
- Быстрые суммы: 100₽, 500₽, 1000₽, 2500₽

## Статусы платежей

- `pending` - Ожидает оплаты
- `paid` / `completed` - Оплачен успешно
- `failed` - Ошибка оплаты
- `cancelled` - Отменен
- `expired` - Истек срок действия

## Тестирование

### Запуск тестов API
```bash
# Из корневой директории
./scripts/testing/test-payments.ps1
```

### Запуск тестов UI
```bash
# Из корневой директории
./scripts/testing/test-payments-ui.ps1
```

## Безопасность

- Все платежные API требуют JWT авторизации
- Webhook подписи проверяются через MD5
- Sensitive данные не логируются
- HTTPS обязателен в продакшене

## Мониторинг

### Логи
- Создание платежей: `[Payment] Creating payment`
- Webhook события: `[Webhook] Received`
- Зачисление баланса: `[Payment] Balance credited`

### Метрики
- Количество платежей
- Общая сумма транзакций
- Процент успешных платежей
- Популярные методы оплаты

## Troubleshooting

### Частые проблемы

1. **"Payment service is not configured"**
   - Проверьте переменные CRYPTOMUS_API_KEY и CRYPTOMUS_MERCHANT_ID

2. **"Failed to create invoice"**
   - Проверьте подключение к Cryptomus API
   - Убедитесь что API ключ действителен

3. **"Webhook signature invalid"**
   - Проверьте настройки webhook в Cryptomus
   - URL должен быть: `https://yourdomain.com/api/v1/payments/webhook`

4. **Платеж не зачисляется**
   - Проверьте логи webhook
   - Убедитесь что статус `paid` или `completed`

### Отладка
```bash
# Включить подробные логи
export GIN_MODE=debug

# Проверить webhook
curl -X POST http://localhost:3000/api/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -H "sign: test_signature" \
  -d '{"order_id": "test", "payment_status": "paid"}'
```

## Roadmap

- [ ] Поддержка банковских карт
- [ ] Автоматические возвраты
- [ ] Подписки и рекуррентные платежи
- [ ] Детальная аналитика платежей
- [ ] Экспорт истории в CSV/PDF
- [ ] Уведомления в Telegram