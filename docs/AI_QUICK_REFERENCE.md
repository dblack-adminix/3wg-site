# 🤖 AI Quick Reference - Быстрые ссылки для ассистента

> Этот файл содержит быстрые ссылки на важную документацию для AI ассистента

---

## 📍 Главные файлы

| Файл | Путь | Описание |
|------|------|----------|
| **Главный индекс** | [docs/INDEX.md](INDEX.md) | Навигатор по всей документации |
| **Список задач** | [../TASKS.md](../TASKS.md) | Текущие задачи и статус |
| **Roadmap** | [../ROADMAP.md](../ROADMAP.md) | План развития |
| **README** | [../README.md](../README.md) | Главная страница проекта |
| **Скрипты** | [../scripts/README.md](../scripts/README.md) | Документация по скриптам |

---

## 🎯 По задачам

### Генерация VPN ключей
- **Функция**: [features/KEY_GENERATION_FEATURE.md](features/KEY_GENERATION_FEATURE.md)
- **Тестирование**: [testing/TEST_KEY_GENERATION.md](testing/TEST_KEY_GENERATION.md)
- **Скрипт**: `scripts/testing/test-create-key.ps1`

### QR коды
- **Функция**: [features/QR_CODE_FEATURE.md](features/QR_CODE_FEATURE.md)
- **UI гайд**: [guides/QR_CODE_UI_GUIDE.md](guides/QR_CODE_UI_GUIDE.md)
- **Чеклист**: [checklists/QR_CODE_CHECKLIST.md](checklists/QR_CODE_CHECKLIST.md)
- **Двойные QR**: [completed/DUAL_QR_CODES_COMPLETE.md](completed/DUAL_QR_CODES_COMPLETE.md)

### Добавление пиров
- **Гайд**: [guides/ADD_PEER_GUIDE.md](guides/ADD_PEER_GUIDE.md)
- **Завершено**: [completed/ADD_PEER_COMPLETE.md](completed/ADD_PEER_COMPLETE.md)
- **Скрипт**: `scripts/testing/test-add-peer.ps1`

### WGDashboard интеграция
- **README**: [wgdashboard/WGDASHBOARD_README.md](wgdashboard/WGDASHBOARD_README.md)
- **API**: [wgdashboard/WGDASHBOARD_API_ENDPOINTS.md](wgdashboard/WGDASHBOARD_API_ENDPOINTS.md)
- **Quickstart**: [wgdashboard/WGDASHBOARD_QUICKSTART.md](wgdashboard/WGDASHBOARD_QUICKSTART.md)
- **Пиры**: [guides/WGDASHBOARD_PEERS_GUIDE.md](guides/WGDASHBOARD_PEERS_GUIDE.md)

### Кэширование
- **Стратегия**: [features/CACHING_STRATEGY.md](features/CACHING_STRATEGY.md)
- **Завершено**: [completed/CACHING_COMPLETE.md](completed/CACHING_COMPLETE.md)
- **Оптимизация**: [completed/CACHING_OPTIMIZATION_COMPLETE.md](completed/CACHING_OPTIMIZATION_COMPLETE.md)
- **Тестирование**: [testing/TEST_CACHING.md](testing/TEST_CACHING.md)

### Балансировка нагрузки
- **План**: [features/LOAD_BALANCING_PLAN.md](features/LOAD_BALANCING_PLAN.md)
- **Статус**: [features/LOAD_BALANCING_STATUS.md](features/LOAD_BALANCING_STATUS.md)
- **Реализация**: [completed/LOAD_BALANCING_IMPLEMENTATION.md](completed/LOAD_BALANCING_IMPLEMENTATION.md)
- **Финал**: [completed/LOAD_BALANCING_FINAL.md](completed/LOAD_BALANCING_FINAL.md)

### Геолокация
- **Статус**: [features/GEOLOCATION_STATUS.md](features/GEOLOCATION_STATUS.md)
- **Скрипт**: `scripts/testing/test-geolocation-api.ps1`

### История трафика
- **Функция**: [features/HOURLY_TRAFFIC_FEATURE.md](features/HOURLY_TRAFFIC_FEATURE.md)
- **Завершено**: [features/PEER_TRAFFIC_HISTORY_COMPLETE.md](features/PEER_TRAFFIC_HISTORY_COMPLETE.md)
- **Скрипт**: `scripts/testing/test-hourly-traffic.ps1`

---

## 🔧 По проблемам

### IP адреса
- **Исправление**: [fixes/IP_GENERATION_FIX.md](fixes/IP_GENERATION_FIX.md)

### AmneziaWG конфиги
- **Исправление**: [fixes/AMNEZIAWG_CONFIG_FIX.md](fixes/AMNEZIAWG_CONFIG_FIX.md)
- **QR коды**: [wgdashboard/AMNEZIA_QR_CODES.md](wgdashboard/AMNEZIA_QR_CODES.md)

### Протоколы
- **Исправление**: [fixes/PROTOCOL_SUPPORT_FIX.md](fixes/PROTOCOL_SUPPORT_FIX.md)

### Серверы
- **Конфигурация**: [fixes/SERVER_CONFIGURATION_FIXED.md](fixes/SERVER_CONFIGURATION_FIXED.md)
- **Поля**: [fixes/SERVER_FIELDS_FIX.md](fixes/SERVER_FIELDS_FIX.md)

### UI
- **Улучшения**: [fixes/UI_IMPROVEMENTS_COMPLETE.md](fixes/UI_IMPROVEMENTS_COMPLETE.md)
- **Z-index**: [fixes/PEER_DETAILS_Z_INDEX_FIX.md](fixes/PEER_DETAILS_Z_INDEX_FIX.md)
- **Публичные ключи**: [fixes/PEER_DETAILS_PUBLIC_KEY_FIX.md](fixes/PEER_DETAILS_PUBLIC_KEY_FIX.md)

### Мобильный генератор
- **Исправление**: [fixes/MOBILE_GENERATOR_FIX.md](fixes/MOBILE_GENERATOR_FIX.md)

### Синхронизация пиров
- **Исправление**: [fixes/PEER_SYNC_FIXED.md](fixes/PEER_SYNC_FIXED.md)

---

## 📚 Руководства

### Для администратора
- **Админ гайд**: [guides/ADMIN_GUIDE.md](guides/ADMIN_GUIDE.md)
- **Управление контентом**: [guides/CONTENT_MANAGEMENT_GUIDE.md](guides/CONTENT_MANAGEMENT_GUIDE.md)
- **Drag & Drop**: [guides/DRAG_AND_DROP_GUIDE.md](guides/DRAG_AND_DROP_GUIDE.md)

### Для разработчика
- **Как тестировать**: [guides/HOW_TO_TEST.md](guides/HOW_TO_TEST.md)
- **Быстрый старт генератора**: [guides/QUICKSTART_GENERATOR.md](guides/QUICKSTART_GENERATOR.md)
- **Быстрый старт пиров**: [guides/QUICK_START_PEERS.md](guides/QUICK_START_PEERS.md)

### UI гайды
- **Пиры**: [guides/PEERS_UI_GUIDE.md](guides/PEERS_UI_GUIDE.md)
- **QR коды**: [guides/QR_CODE_UI_GUIDE.md](guides/QR_CODE_UI_GUIDE.md)

---

## ✅ Чеклисты

| Чеклист | Путь |
|---------|------|
| **Продакшен** | [checklists/PRODUCTION_READY_CHECKLIST.md](checklists/PRODUCTION_READY_CHECKLIST.md) |
| **Генератор** | [checklists/GENERATOR_CHECKLIST.md](checklists/GENERATOR_CHECKLIST.md) |
| **QR коды** | [checklists/QR_CODE_CHECKLIST.md](checklists/QR_CODE_CHECKLIST.md) |
| **Контент** | [checklists/CONTENT_TAB_CHECKLIST.md](checklists/CONTENT_TAB_CHECKLIST.md) |
| **WGDashboard** | [checklists/WGDASHBOARD_CHECKLIST.md](checklists/WGDASHBOARD_CHECKLIST.md) |

---

## 🧪 Тестирование

### Документация
- **Общее**: [testing/TESTING.md](testing/TESTING.md)
- **Быстрый тест**: [testing/QUICK_TEST.md](testing/QUICK_TEST.md)
- **Генератор UI**: [testing/TEST_GENERATOR_UI.md](testing/TEST_GENERATOR_UI.md)
- **Генерация ключей**: [testing/TEST_KEY_GENERATION.md](testing/TEST_KEY_GENERATION.md)
- **Детали пира**: [testing/TEST_PEER_DETAILS_UI.md](testing/TEST_PEER_DETAILS_UI.md)
- **Кэширование**: [testing/TEST_CACHING.md](testing/TEST_CACHING.md)
- **Управление контентом**: [testing/CONTENT_MANAGEMENT_TEST.md](testing/CONTENT_MANAGEMENT_TEST.md)

### Скрипты
- **Все скрипты**: [../scripts/README.md](../scripts/README.md)
- **Тестирование**: `scripts/testing/`
- **Проверка**: `scripts/check/`
- **Настройка**: `scripts/setup/`

---

## 🗂️ Управление контентом

| Документ | Путь |
|----------|------|
| **README** | [content-management/README_CONTENT_MANAGEMENT.md](content-management/README_CONTENT_MANAGEMENT.md) |
| **Quickstart** | [content-management/CONTENT_TAB_QUICKSTART.md](content-management/CONTENT_TAB_QUICKSTART.md) |
| **Реструктуризация** | [content-management/CONTENT_TAB_RESTRUCTURE.md](content-management/CONTENT_TAB_RESTRUCTURE.md) |

---

## 📊 Завершенные задачи

Все завершенные задачи в папке: [completed/](completed/)

Основные:
- [ADD_PEER_COMPLETE.md](completed/ADD_PEER_COMPLETE.md)
- [CACHING_COMPLETE.md](completed/CACHING_COMPLETE.md)
- [DUAL_QR_CODES_COMPLETE.md](completed/DUAL_QR_CODES_COMPLETE.md)
- [INTEGRATION_COMPLETE.md](completed/INTEGRATION_COMPLETE.md)
- [LOAD_BALANCING_FINAL.md](completed/LOAD_BALANCING_FINAL.md)
- [PEER_DETAILS_COMPLETE.md](completed/PEER_DETAILS_COMPLETE.md)
- [WGDASHBOARD_COMPLETE.md](completed/WGDASHBOARD_COMPLETE.md)

---

## 🔍 Быстрый поиск по ключевым словам

### Backend
- **Go код**: `backend/`
- **Контроллеры**: `backend/controllers/`
- **Модели**: `backend/models/`
- **Сервисы**: `backend/services/`
- **WGDashboard клиент**: `backend/wgdashboard/client.go`
- **Миграции**: `backend/migrations/`

### Frontend
- **React компоненты**: `src/components/`
- **Страницы**: `src/pages/`
- **API клиент**: `src/lib/api.ts`
- **Хуки**: `src/hooks/`
- **Админка**: `src/components/admin/`

### Ключевые файлы
- **KeyDetails**: `src/pages/KeyDetails.tsx` - детали ключа с QR кодами
- **MobileGenerator**: `src/pages/MobileGenerator.tsx` - мобильный генератор
- **ServersTab**: `src/components/admin/ServersTab.tsx` - управление серверами
- **VPN Key Controller**: `backend/controllers/vpn_key.go` - генерация ключей
- **WGDashboard Controller**: `backend/controllers/wgdashboard.go` - интеграция

---

## 🎯 Частые задачи

### Создать новую функцию
1. Документация → `docs/features/NEW_FEATURE.md`
2. Код → `backend/` и `src/`
3. Тесты → `docs/testing/TEST_NEW_FEATURE.md`
4. Скрипт → `scripts/testing/test-new-feature.ps1`

### Исправить баг
1. Документация → `docs/fixes/BUG_FIX.md`
2. Код → исправить в `backend/` или `src/`
3. Тест → `scripts/testing/test-bug-fix.ps1`

### Добавить тест
1. Документация → `docs/testing/TEST_FEATURE.md`
2. Скрипт → `scripts/testing/test-feature.ps1`
3. Обновить → `scripts/README.md`

---

## 📝 Шаблоны

### Новая функция
```markdown
# Название функции

## Дата: YYYY-MM-DD

## Описание
Что делает функция

## Реализация
Как реализовано

## API
Endpoints

## UI
Компоненты

## Тестирование
Как тестировать

## Статус: ✅/🔄/❌
```

### Исправление
```markdown
# Исправление: Название проблемы

## Дата: YYYY-MM-DD

## Проблема
Что было не так

## Решение
Как исправили

## Файлы
Что изменили

## Тестирование
Как проверить

## Статус: ✅ ИСПРАВЛЕНО
```

---

## 🚀 Команды

### Backend
```powershell
cd backend
docker-compose up --build
docker-compose down
docker logs vpn_backend
```

### Frontend
```powershell
npm run dev          # http://localhost:8080
npm run build
npm run preview
```

### Тестирование
```powershell
.\scripts\testing\test-create-key.ps1
.\scripts\check\check-all-servers.ps1
.\scripts\setup\get-auth-token.ps1
```

---

## 📍 Важные URL

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Admin**: http://localhost:8080/admin
- **Generator**: http://localhost:8080/generator
- **Keys**: http://localhost:8080/keys
- **WGDashboard**: http://45.151.183.218:10086

---

## 🔐 Авторизация

### Админ
- Email: `admin@3wg.ru`
- Password: `admin123`

### Тестовый пользователь
- Email: `test@example.com`
- Password: `password123`

### Токены
- Админ токен: `auth-token.txt`
- Пользовательский токен: `user-token.txt`

---

## 📊 Статистика проекта

- **Документов**: 80+
- **Скриптов**: 50+
- **Функций**: 10+
- **Исправлений**: 10+
- **Руководств**: 10+
- **Тестов**: 30+

---

## 🎓 Обучение

### Новый разработчик
1. Прочитать [README.md](../README.md)
2. Прочитать [TASKS.md](../TASKS.md)
3. Изучить [docs/INDEX.md](INDEX.md)
4. Запустить [guides/HOW_TO_TEST.md](guides/HOW_TO_TEST.md)

### Новый AI ассистент
1. Прочитать этот файл
2. Изучить [docs/INDEX.md](INDEX.md)
3. Проверить [TASKS.md](../TASKS.md)
4. Использовать быстрые ссылки выше

---

**Последнее обновление**: 1 февраля 2026  
**Версия**: 1.0

---

💡 **Совет для AI**: Добавь этот файл в контекст при каждом новом запросе для быстрого доступа к документации!
