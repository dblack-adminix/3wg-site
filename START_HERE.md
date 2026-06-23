# 🚀 НАЧНИ ЗДЕСЬ - Навигация по проекту 3WG VPN

> Этот файл поможет тебе быстро ориентироваться в проекте

---

## 📍 Ты здесь впервые?

### 1️⃣ Прочитай основное
- [README.md](README.md) - что это за проект
- [TASKS.md](TASKS.md) - что уже сделано (54% готово)
- [ROADMAP.md](ROADMAP.md) - что планируется

### 2️⃣ Изучи структуру
- [PROJECT_REORGANIZATION.md](PROJECT_REORGANIZATION.md) - как организован проект
- [QUICK_LINKS.md](QUICK_LINKS.md) - быстрые ссылки

### 3️⃣ Найди нужное
- [docs/INDEX.md](docs/INDEX.md) - вся документация
- [scripts/README.md](scripts/README.md) - все скрипты

---

## 🎯 Что ты хочешь сделать?

### 📖 Изучить функции
→ [docs/features/](docs/features/)
- Генерация VPN ключей
- QR коды
- Геолокация
- Кэширование
- Балансировка нагрузки

### 📚 Прочитать руководство
→ [docs/guides/](docs/guides/)
- Админ гайд
- Как добавить пир
- Как тестировать
- Управление контентом

### 🔧 Исправить проблему
→ [docs/fixes/](docs/fixes/)
- Исправления IP
- Исправления AmneziaWG
- Исправления UI
- Исправления протоколов

### 🧪 Запустить тесты
→ [scripts/testing/](scripts/testing/)
```powershell
.\scripts\testing\test-create-key.ps1
.\scripts\testing\test-add-peer.ps1
```

### 🔍 Проверить состояние
→ [scripts/check/](scripts/check/)
```powershell
.\scripts\check\check-all-servers.ps1
.\scripts\check\check-my-keys.ps1
```

### ⚙️ Настроить проект
→ [scripts/setup/](scripts/setup/)
```powershell
.\scripts\setup\get-auth-token.ps1
.\scripts\setup\create-test-user.ps1
```

---

## 🤖 Ты AI ассистент?

### Используй эти файлы:
1. [docs/AI_QUICK_REFERENCE.md](docs/AI_QUICK_REFERENCE.md) - быстрые ссылки
2. [docs/INDEX.md](docs/INDEX.md) - полный индекс
3. [TASKS.md](TASKS.md) - текущие задачи

### Структура для AI:
```
docs/
├── AI_QUICK_REFERENCE.md       ← НАЧНИ ЗДЕСЬ!
├── INDEX.md                    ← Полный индекс
├── features/                   ← Что реализовано
├── guides/                     ← Как использовать
├── fixes/                      ← Что исправлено
├── testing/                    ← Как тестировать
├── checklists/                 ← Что проверить
├── completed/                  ← Что завершено
├── wgdashboard/               ← WGDashboard интеграция
└── content-management/        ← Управление контентом
```

---

## 📂 Структура проекта

```
3wg-vpn/
│
├── 📄 START_HERE.md            ← ТЫ ЗДЕСЬ!
├── 📄 QUICK_LINKS.md           ← Быстрые ссылки
├── 📄 README.md                ← Главная страница
├── 📄 TASKS.md                 ← Список задач
├── 📄 ROADMAP.md               ← План развития
├── 📄 PROJECT_REORGANIZATION.md ← Описание структуры
│
├── 📚 docs/                    ← ВСЯ ДОКУМЕНТАЦИЯ
│   ├── INDEX.md                ← Главный индекс
│   ├── AI_QUICK_REFERENCE.md   ← Для AI
│   ├── features/               ← Функции
│   ├── guides/                 ← Руководства
│   ├── fixes/                  ← Исправления
│   ├── testing/                ← Тестирование
│   ├── checklists/             ← Чеклисты
│   ├── completed/              ← Завершенные задачи
│   ├── wgdashboard/           ← WGDashboard
│   └── content-management/    ← Управление контентом
│
├── 🛠️ scripts/                 ← ВСЕ СКРИПТЫ
│   ├── README.md               ← Документация скриптов
│   ├── testing/                ← Тестирование
│   ├── check/                  ← Проверка
│   ├── setup/                  ← Настройка
│   └── watch-logs.ps1         ← Логи
│
├── 🔧 backend/                 ← Backend (Go)
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── wgdashboard/
│   └── ...
│
└── ⚛️ src/                     ← Frontend (React)
    ├── components/
    ├── pages/
    ├── hooks/
    └── ...
```

---

## 🔗 Быстрые ссылки

### Документация
| Что | Где |
|-----|-----|
| Все документы | [docs/INDEX.md](docs/INDEX.md) |
| Для AI | [docs/AI_QUICK_REFERENCE.md](docs/AI_QUICK_REFERENCE.md) |
| Функции | [docs/features/](docs/features/) |
| Руководства | [docs/guides/](docs/guides/) |
| Исправления | [docs/fixes/](docs/fixes/) |

### Скрипты
| Что | Где |
|-----|-----|
| Все скрипты | [scripts/README.md](scripts/README.md) |
| Тестирование | [scripts/testing/](scripts/testing/) |
| Проверка | [scripts/check/](scripts/check/) |
| Настройка | [scripts/setup/](scripts/setup/) |

### Задачи
| Что | Где |
|-----|-----|
| Список задач | [TASKS.md](TASKS.md) |
| План развития | [ROADMAP.md](ROADMAP.md) |
| Продакшен чеклист | [docs/checklists/PRODUCTION_READY_CHECKLIST.md](docs/checklists/PRODUCTION_READY_CHECKLIST.md) |

---

## 🚀 Быстрый старт

### Для разработчика

1. **Запусти проект**
   ```powershell
   # Backend
   cd backend
   docker-compose up --build
   
   # Frontend
   npm run dev
   ```

2. **Получи токен**
   ```powershell
   .\scripts\setup\get-auth-token.ps1
   ```

3. **Создай тестовый ключ**
   ```powershell
   .\scripts\testing\test-create-key.ps1
   ```

4. **Проверь результат**
   ```powershell
   .\scripts\check\check-my-keys.ps1
   ```

### Для AI ассистента

1. **Прочитай**: [docs/AI_QUICK_REFERENCE.md](docs/AI_QUICK_REFERENCE.md)
2. **Изучи**: [docs/INDEX.md](docs/INDEX.md)
3. **Проверь**: [TASKS.md](TASKS.md)
4. **Используй**: Быстрые ссылки из AI_QUICK_REFERENCE.md

---

## 🌐 URL проекта

| Что | URL |
|-----|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:3000 |
| Admin панель | http://localhost:8080/admin |
| Генератор | http://localhost:8080/generator |
| Ключи | http://localhost:8080/keys |

---

## 🔐 Авторизация

### Админ
- Email: `admin@3wg.ru`
- Password: `admin123`

### Тестовый пользователь
- Email: `test@example.com`
- Password: `password123`

---

## 📊 Статус проекта

- ✅ **Завершено**: 6 из 13 задач (54%)
- 🔄 **В работе**: Генерация VPN ключей
- 📋 **Следующее**: Автоматическое удаление пиров

### Что работает:
- ✅ Генерация VPN ключей (WireGuard + AmneziaWG)
- ✅ Двойные QR коды для AmneziaWG
- ✅ Автоматическое добавление пиров
- ✅ Динамическая генерация IP
- ✅ Конфиги с обфускацией
- ✅ Валидация протоколов

### Что нужно доделать:
- ⏳ Автоматическое удаление пиров
- ⏳ Проверка баланса
- ⏳ Лимиты и ограничения
- ⏳ Статистика использования

---

## 💡 Советы

### Для новичков
1. Начни с [README.md](README.md)
2. Изучи [TASKS.md](TASKS.md)
3. Прочитай [docs/guides/HOW_TO_TEST.md](docs/guides/HOW_TO_TEST.md)

### Для опытных
1. Используй [QUICK_LINKS.md](QUICK_LINKS.md)
2. Проверь [docs/checklists/](docs/checklists/)
3. Запускай скрипты из [scripts/](scripts/)

### Для AI
1. Добавь [docs/AI_QUICK_REFERENCE.md](docs/AI_QUICK_REFERENCE.md) в контекст
2. Используй быстрые ссылки
3. Проверяй [TASKS.md](TASKS.md) перед началом работы

---

## 🆘 Нужна помощь?

### Документация не помогла?
1. Проверь [docs/INDEX.md](docs/INDEX.md) - может быть там есть ответ
2. Посмотри [docs/guides/](docs/guides/) - руководства по всем функциям
3. Изучи [docs/fixes/](docs/fixes/) - может быть проблема уже решена

### Скрипт не работает?
1. Проверь [scripts/README.md](scripts/README.md)
2. Убедись что backend запущен
3. Проверь токен авторизации

### Что-то сломалось?
1. Проверь логи: `.\scripts\watch-logs.ps1`
2. Проверь Docker: `docker ps`
3. Перезапусти backend: `cd backend; docker-compose restart`

---

## 🎉 Готово!

Теперь ты знаешь как ориентироваться в проекте!

**Следующий шаг**: Выбери что хочешь сделать из списка выше ⬆️

---

**Последнее обновление**: 1 февраля 2026  
**Версия**: 1.0  
**Статус**: ✅ Актуально

---

💡 **Совет**: Добавь этот файл в закладки для быстрого доступа! 🔖
