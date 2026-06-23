# 💰 Проверка баланса и лимиты - Документация

## Дата: 1 февраля 2026

---

## 📋 Описание

Система проверки баланса и лимитов защищает от злоупотреблений и контролирует создание VPN ключей.

---

## 🎯 Функционал

### 1. Проверка лимитов

- **Лимит ключей на пользователя**
  - Free тариф: 2 ключа
  - Платные тарифы: 10 ключей

- **Лимит ключей на сервер**
  - По умолчанию: 100 ключей
  - Настраивается для каждого сервера

- **Проверка баланса**
  - Минимальный баланс: 10₽
  - Стоимость ключа: 10₽
  - Free тариф: бесплатно

### 2. Списание средств

- Автоматическое списание при создании ключа
- Только для платных тарифов
- Транзакционная безопасность

### 3. Статистика

- Текущий баланс
- Количество ключей
- Доступные слоты
- Стоимость создания

---

## 🔧 Реализация

### Backend

#### Модели

**`backend/models/pricing.go`**:
```go
type PricingSettings struct {
    KeyCreationCost       float64 // 10₽
    MaxKeysPerUser        int     // 10
    MaxKeysPerServer      int     // 100
    MinBalanceForCreation float64 // 10₽
    FreeUserMaxKeys       int     // 2
}
```

#### Сервис

**`backend/services/limits.go`**:
```go
type LimitsService struct {
    db       *gorm.DB
    settings PricingSettings
}

// Проверка возможности создания ключа
func (s *LimitsService) CanCreateKey(userID, serverID uint) (*CheckResult, error)

// Списание средств
func (s *LimitsService) ChargeForKey(userID uint) error

// Статистика пользователя
func (s *LimitsService) GetUserStats(userID uint) (map[string]interface{}, error)
```

#### Контроллер

**`backend/controllers/limits.go`**:
```go
// POST /api/v1/limits/check
func (lc *LimitsController) CheckLimits(c *gin.Context)

// GET /api/v1/limits/stats
func (lc *LimitsController) GetUserStats(c *gin.Context)
```

#### Интеграция

**`backend/controllers/vpn_key.go`**:
```go
func (kc *VPNKeyController) Create(c *gin.Context) {
    // 1. Проверка лимитов
    checkResult, err := kc.limitsService.CanCreateKey(userID, serverID)
    if !checkResult.Allowed {
        return error
    }
    
    // 2. Создание ключа
    // ...
    
    // 3. Списание средств
    kc.limitsService.ChargeForKey(userID)
}
```

---

## 📊 API Endpoints

### 1. Проверка лимитов

**POST /api/v1/limits/check**

**Request**:
```json
{
  "server_id": 4
}
```

**Response (разрешено)**:
```json
{
  "allowed": true,
  "current_keys": 1,
  "max_keys": 10,
  "balance": 100.0,
  "cost": 10.0,
  "balance_after": 90.0
}
```

**Response (запрещено - лимит)**:
```json
{
  "allowed": false,
  "reason": "Достигнут лимит ключей (10/10). Удалите старые ключи или обновите тариф.",
  "current_keys": 10,
  "max_keys": 10,
  "balance": 100.0,
  "cost": 10.0
}
```

**Response (запрещено - баланс)**:
```json
{
  "allowed": false,
  "reason": "Недостаточно средств. Требуется: 10.00₽, Баланс: 5.00₽",
  "current_keys": 5,
  "max_keys": 10,
  "balance": 5.0,
  "cost": 10.0,
  "balance_after": -5.0
}
```

### 2. Статистика пользователя

**GET /api/v1/limits/stats**

**Response**:
```json
{
  "user_id": 2,
  "email": "user@example.com",
  "balance": 100.0,
  "tariff": "premium",
  "keys_count": 3,
  "max_keys": 10,
  "keys_left": 7,
  "cost_per_key": 10.0
}
```

### 3. Создание ключа (обновлено)

**POST /api/v1/keys**

**Response (успех)**:
```json
{
  "id": 123,
  "name": "my-key",
  "protocol": "wireguard",
  "ip_address": "10.50.0.10",
  "cost": 10.0,
  "balance_before": 100.0,
  "balance_after": 90.0,
  ...
}
```

**Response (ошибка - лимит)**:
```json
{
  "error": "Достигнут лимит ключей (10/10). Удалите старые ключи или обновите тариф.",
  "current_keys": 10,
  "max_keys": 10,
  "balance": 100.0,
  "cost": 10.0
}
```

---

## 🔒 Проверки

### Последовательность проверок:

1. **Лимит ключей пользователя**
   - Free: 2 ключа
   - Premium: 10 ключей

2. **Лимит ключей сервера**
   - По умолчанию: 100
   - Или `server.max_users`

3. **Баланс пользователя**
   - Только для платных тарифов
   - Минимум: стоимость ключа

### Логика:

```
Запрос создания ключа
        ↓
Проверка лимита пользователя
        ↓ (OK)
Проверка лимита сервера
        ↓ (OK)
Проверка баланса
        ↓ (OK)
Создание ключа
        ↓
Списание средств
        ↓
Возврат результата
```

---

## 💡 Примеры использования

### Проверка перед созданием

```typescript
// Frontend
const checkLimits = async (serverId: number) => {
  const result = await api.checkLimits(serverId);
  
  if (!result.allowed) {
    alert(result.reason);
    return false;
  }
  
  console.log(`Баланс после: ${result.balance_after}₽`);
  return true;
};
```

### Отображение статистики

```typescript
const stats = await api.getUserStats();

console.log(`Ключей: ${stats.keys_count}/${stats.max_keys}`);
console.log(`Баланс: ${stats.balance}₽`);
console.log(`Осталось слотов: ${stats.keys_left}`);
```

---

## 🧪 Тестирование

### Запуск теста:

```powershell
.\scripts\testing\test-balance-and-limits.ps1
```

### Ожидаемый результат:

```
✅ Статистика получена
✅ Лимиты проверены
✅ Ключ создан
✅ Баланс обновлен
✅ Ключ удален

🎉 Проверка баланса и лимитов работает!
```

### Тестовые сценарии:

1. **Создание с достаточным балансом**
   - Баланс: 100₽
   - Стоимость: 10₽
   - Результат: ✅ Создано

2. **Создание с недостаточным балансом**
   - Баланс: 5₽
   - Стоимость: 10₽
   - Результат: ❌ Отказано

3. **Создание при достижении лимита**
   - Ключей: 10/10
   - Результат: ❌ Отказано

4. **Создание на переполненном сервере**
   - Ключей на сервере: 100/100
   - Результат: ❌ Отказано

5. **Создание на free тарифе**
   - Тариф: free
   - Ключей: 0/2
   - Стоимость: 0₽
   - Результат: ✅ Создано

---

## 📈 Настройки

### Изменение лимитов:

**`backend/models/pricing.go`**:
```go
func DefaultPricingSettings() PricingSettings {
    return PricingSettings{
        KeyCreationCost:       10.0,  // Изменить цену
        MaxKeysPerUser:        10,    // Изменить лимит
        MaxKeysPerServer:      100,   // Изменить лимит сервера
        MinBalanceForCreation: 10.0,  // Изменить минимум
        FreeUserMaxKeys:       2,     // Изменить для free
    }
}
```

### Изменение для конкретного сервера:

```sql
UPDATE servers SET max_users = 200 WHERE id = 4;
```

---

## 🔄 Интеграция с другими функциями

### Связь с созданием ключей:

```
Проверка лимитов → Создание ключа → Списание средств
```

### Связь с балансировкой:

- Проверка загрузки сервера
- Автоматический выбор сервера с местом

### Связь с платежами:

- Пополнение баланса
- История транзакций
- Автоматическое продление

---

## 📝 Логирование

### Примеры логов:

**Успешное создание**:
```
[VPNKey] Create request: user_id=2, server_id=4, name=my-key
[VPNKey] Limits check passed: keys=3/10, balance=100.00, cost=10.00
[VPNKey] Key created in database: id=123
[VPNKey] Balance charged successfully: cost=10.00
```

**Отказ по лимиту**:
```
[VPNKey] Create request: user_id=2, server_id=4, name=my-key
[VPNKey] Creation not allowed: Достигнут лимит ключей (10/10)
```

**Отказ по балансу**:
```
[VPNKey] Create request: user_id=2, server_id=4, name=my-key
[VPNKey] Creation not allowed: Недостаточно средств. Требуется: 10.00₽, Баланс: 5.00₽
```

---

## ✅ Преимущества

### Для пользователей:

- 🎯 Понятные лимиты
- 💰 Прозрачное списание
- 📊 Видимая статистика
- ⚡ Быстрая проверка

### Для системы:

- 🛡️ Защита от злоупотреблений
- 💸 Контроль расходов
- 📈 Управление нагрузкой
- 🔒 Безопасность

### Для бизнеса:

- 💵 Монетизация
- 📊 Аналитика использования
- 🎁 Бесплатный тариф для привлечения
- 💎 Премиум функции

---

## 🎯 Следующие шаги

### Возможные улучшения:

1. **Гибкие тарифы**
   - Разные лимиты для разных тарифов
   - Временные подписки
   - Промокоды

2. **История транзакций**
   - Логирование всех списаний
   - Отчеты по расходам
   - Возвраты

3. **Уведомления**
   - Email при низком балансе
   - Telegram при достижении лимита
   - Push уведомления

4. **Автоматическое пополнение**
   - Привязка карты
   - Автоплатеж при низком балансе
   - Подписки

---

## 📚 Связанные документы

- [Генерация ключей](KEY_GENERATION_FEATURE.md)
- [Балансировка нагрузки](LOAD_BALANCING_PLAN.md)
- [Production checklist](../checklists/PRODUCTION_READY_CHECKLIST.md)

---

## 📊 Статус

**Версия**: 1.0  
**Дата**: 1 февраля 2026  
**Статус**: ✅ Реализовано

---

**Готово к продакшену!** 🚀
