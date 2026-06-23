# 🛠️ Скрипты проекта 3WG VPN

> Коллекция PowerShell скриптов для тестирования, проверки и настройки

---

## 📂 Структура

```
scripts/
├── testing/          # Скрипты тестирования
├── check/            # Скрипты проверки состояния
├── setup/            # Скрипты настройки и управления
└── watch-logs.ps1    # Просмотр логов
```

---

## 🧪 Тестирование (`testing/`)

### Тестирование ключей

```powershell
# Создать один ключ
.\scripts\testing\test-create-key.ps1

# Создать несколько ключей (проверка уникальности IP)
.\scripts\testing\test-multiple-keys.ps1

# Создать новый ключ
.\scripts\testing\test-create-new-key.ps1

# Тест API ключей
.\scripts\testing\test-keys-api.ps1
```

### Тестирование пиров

```powershell
# Добавить пир
.\scripts\testing\test-add-peer.ps1

# Автоудаление пира
.\scripts\testing\test-auto-delete-peer.ps1

# Конфиг пира
.\scripts\testing\test-peer-config.ps1
```

### Тестирование WGDashboard

```powershell
# Прямой тест WGDashboard
.\scripts\testing\test-direct-wgdashboard-add.ps1

# Интеграция WGDashboard
.\scripts\testing\test-wgdashboard-integration.ps1

# Пиры WGDashboard
.\scripts\testing\test-wgdashboard-peers.ps1

# Скачивание конфига
.\scripts\testing\test-wgdashboard-download-config.ps1

# Удаление из WGDashboard
.\scripts\testing\test-wgdashboard-delete.ps1
```

### Тестирование функций

```powershell
# Геолокация
.\scripts\testing\test-geolocation-api.ps1

# Почасовой трафик
.\scripts\testing\test-hourly-traffic.ps1

# Баланс и лимиты
.\scripts\testing\test-balance-and-limits.ps1

# Платежи Cryptomus
.\scripts\testing\test-cryptomus-payment.ps1
```

---

## 🔍 Проверка (`check/`)

### Проверка серверов

```powershell
# Все серверы
.\scripts\check\check-all-servers.ps1
.\scripts\check\check-all-servers-list.ps1

# Конкретный сервер
.\scripts\check\check-3labs-server.ps1
.\scripts\check\check-server-config.ps1
.\scripts\check\check-server-configs.ps1
.\scripts\check\check-server-wg-config.ps1
```

### Проверка пиров

```powershell
# Пиры 3labs
.\scripts\check\check-3labs-peers.ps1

# Мои ключи
.\scripts\check\check-my-keys.ps1

# Детали пира
.\scripts\check\check-peer-added.ps1
.\scripts\check\check-peer-details-logs.ps1
.\scripts\check\check-peer-endpoint.ps1
.\scripts\check\check-peer-from-backend.ps1
```

### Проверка WGDashboard

```powershell
# Прямая проверка
.\scripts\check\check-wgdashboard-direct.ps1

# Проверка пира
.\scripts\check\check-wgdashboard-peer.ps1

# Проверка всех пиров
.\scripts\check\check-wgdashboard-peers.ps1
```

### Проверка контента

```powershell
# Видимость блоков
.\scripts\check\check-blocks-visibility.ps1
```

---

## ⚙️ Настройка (`setup/`)

### Начальная настройка

```powershell
# Добавить тестовый сервер
.\scripts\setup\add-test-server.ps1

# Создать тестового пользователя
.\scripts\setup\create-test-user.ps1

# Получить токен авторизации
.\scripts\setup\get-auth-token.ps1
```

### Управление серверами

```powershell
# Обновить сервер 3labs
.\scripts\setup\update-3labs-server-full.ps1

# Исправить конфиг сервера
.\scripts\setup\fix-3labs-server-config.ps1
```

### Управление контентом

```powershell
# Включить все блоки
.\scripts\setup\enable-all-blocks.ps1

# Обновить настройки с заказом
.\scripts\setup\update-settings-with-order.ps1
```

### Управление пирами

```powershell
# Удалить дубликат пира
.\scripts\setup\delete-duplicate-peer.ps1

# Установить тестовый endpoint
.\scripts\setup\set-test-endpoint.ps1

# Найти endpoint добавления пира
.\scripts\setup\find-add-peer-endpoint.ps1
```

### Демо и тесты

```powershell
# Демо drag and drop
.\scripts\setup\demo-drag-and-drop.ps1

# Создать ключ и проверить логи
.\scripts\setup\create-key-and-check-logs.ps1
```

---

## 📊 Утилиты

### Просмотр логов

```powershell
# Смотреть логи в реальном времени
.\scripts\watch-logs.ps1
```

---

## 🚀 Быстрый старт

### 1. Первый запуск

```powershell
# 1. Создать тестового пользователя
.\scripts\setup\create-test-user.ps1

# 2. Получить токен
.\scripts\setup\get-auth-token.ps1

# 3. Добавить тестовый сервер
.\scripts\setup\add-test-server.ps1

# 4. Проверить серверы
.\scripts\check\check-all-servers-list.ps1
```

### 2. Тестирование генерации ключей

```powershell
# 1. Создать ключ
.\scripts\testing\test-create-key.ps1

# 2. Проверить что ключ создан
.\scripts\check\check-my-keys.ps1

# 3. Проверить что пир добавлен на сервер
.\scripts\check\check-wgdashboard-peers.ps1
```

### 3. Тестирование WGDashboard

```powershell
# 1. Прямой тест
.\scripts\testing\test-wgdashboard-integration.ps1

# 2. Проверить пиры
.\scripts\check\check-3labs-peers.ps1

# 3. Скачать конфиг
.\scripts\testing\test-wgdashboard-download-config.ps1
```

---

## 📝 Переменные окружения

Некоторые скрипты используют переменные окружения:

```powershell
# API URL
$env:API_URL = "http://localhost:3000"

# Токен авторизации (сохраняется в auth-token.txt)
$token = Get-Content "auth-token.txt"
```

---

## ⚠️ Важные замечания

### Токены авторизации

Большинство скриптов требуют токен авторизации:

1. Получите токен: `.\scripts\setup\get-auth-token.ps1`
2. Токен сохраняется в `auth-token.txt` и `user-token.txt`
3. Скрипты автоматически читают токен из этих файлов

### Порты

- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3000
- **WGDashboard**: http://45.151.183.218:10086

### Docker контейнеры

Убедитесь что контейнеры запущены:

```powershell
docker ps
# Должны быть: vpn_backend, vpn_postgres, vpn_redis
```

---

## 🐛 Отладка

### Если скрипт не работает

1. **Проверьте токен**:
   ```powershell
   Get-Content auth-token.txt
   ```

2. **Проверьте backend**:
   ```powershell
   curl http://localhost:3000/api/v1/health
   ```

3. **Проверьте логи**:
   ```powershell
   .\scripts\watch-logs.ps1
   ```

4. **Проверьте Docker**:
   ```powershell
   docker ps
   docker logs vpn_backend
   ```

---

## 📚 Документация

Полная документация доступна в папке `docs/`:

- [Главный индекс](../docs/INDEX.md)
- [Руководства](../docs/guides/)
- [Тестирование](../docs/testing/)

---

## 🤝 Как добавить новый скрипт

1. **Определите категорию**:
   - `testing/` - для тестирования функционала
   - `check/` - для проверки состояния
   - `setup/` - для настройки и управления

2. **Создайте файл**:
   ```powershell
   New-Item -Path "scripts/testing/test-my-feature.ps1"
   ```

3. **Добавьте описание** в этот README

4. **Используйте шаблон**:
   ```powershell
   # Описание скрипта
   # Автор: Ваше имя
   # Дата: 2026-02-01
   
   $ErrorActionPreference = "Stop"
   
   # Ваш код здесь
   
   Write-Host "✅ Готово!" -ForegroundColor Green
   ```

---

## 📊 Статистика

- **Всего скриптов**: 50+
- **Тестирование**: 20+
- **Проверка**: 20+
- **Настройка**: 10+

---

**Последнее обновление**: 1 февраля 2026
