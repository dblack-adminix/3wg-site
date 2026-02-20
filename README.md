# Welcome to your Lovable project

## Project info

**URL**: https://3lab.pro

## Описание

Киберпанк веб-сайт для 3LAB.PRO - провайдера VPN-серверов на базе Amnezia и WireGuard.

### Технологии

#### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Simple Maps
- Recharts

#### Backend
- Go (Golang)
- Gin Web Framework
- PostgreSQL
- GORM
- JWT Authentication
- WGDashboard Integration

### Особенности
- Интерактивная карта мира с серверами
- Личный кабинет с статистикой
- Блог с статьями
- Киберпанк дизайн с кислотно-зелёными акцентами
- **Полная интеграция с WGDashboard**
- **Управление WireGuard пирами через API**
- **Админ-панель для управления серверами**
- **💳 Система платежей через Cryptomus**
- **🔄 Автоматическое зачисление средств**
- **📊 Аналитика и статистика платежей**

## 🚀 WGDashboard Integration

Реализована полная интеграция с WGDashboard для управления WireGuard серверами:

### Возможности
- ✅ Управление серверами (создание, редактирование, удаление)
- ✅ Подключение к WGDashboard API
- ✅ Получение конфигураций WireGuard
- ✅ Управление пирами (добавление, удаление, просмотр)
- ✅ Тестирование подключения
- ✅ UI для администраторов

### Быстрый старт
```powershell
# Запуск бэкенда
cd backend
.\run.ps1

# Тестирование пиров
.\test-wgdashboard-peers.ps1
```

## 💳 Payment System

Интегрированная система платежей с поддержкой криптовалют через Cryptomus API:

### Возможности
- ✅ Платежи в рублях (RUB)
- ✅ Криптовалютные платежи (USDT TRC20, TON, BTC)
- ✅ Автоматическое зачисление средств
- ✅ Webhook уведомления
- ✅ История транзакций
- ✅ Веб и мобильный интерфейс
- ✅ Статистика и аналитика

### Быстрый старт
```powershell
# Полное тестирование системы платежей
.\scripts\testing\test-payments-full.ps1

# Только API тесты
.\scripts\testing\test-payments.ps1

# Только UI тесты
.\scripts\testing\test-payments-ui.ps1
```

### Настройка
```bash
# В backend/.env
CRYPTOMUS_API_KEY=your_api_key
CRYPTOMUS_MERCHANT_ID=your_merchant_id
BASE_URL=http://localhost:8080
API_URL=http://localhost:3000
```

### Документация
- 📚 [**Полная документация платежей**](PAYMENTS_SYSTEM.md)
- 🔧 [API эндпоинты](PAYMENTS_SYSTEM.md#api-endpoints)
- 🎨 [Интерфейсы](PAYMENTS_SYSTEM.md#интерфейсы)
- 🔍 [Troubleshooting](PAYMENTS_SYSTEM.md#troubleshooting)

### Документация
- 📚 [**Главный индекс документации**](docs/INDEX.md) - навигатор по всей документации
- 🛠️ [**Скрипты**](scripts/README.md) - коллекция PowerShell скриптов
- 📋 [Список задач](TASKS.md) - текущие задачи и прогресс
- 🗺️ [Roadmap](ROADMAP.md) - план развития проекта

#### Быстрые ссылки
- [Полная документация WGDashboard](docs/wgdashboard/WGDASHBOARD_README.md)
- [Быстрый старт с пирами](docs/guides/QUICK_START_PEERS.md)
- [Руководство по пирам](docs/guides/WGDASHBOARD_PEERS_GUIDE.md)
- [API эндпоинты](docs/wgdashboard/WGDASHBOARD_API_ENDPOINTS.md)
- [Генерация VPN ключей](docs/features/KEY_GENERATION_FEATURE.md)
- [QR коды](docs/features/QR_CODE_FEATURE.md)

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Превью продакшен сборки
npm run preview
```

## Деплой

Проект можно задеплоить на любой статический хостинг:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Домен

Основной домен: **3lab.pro**
