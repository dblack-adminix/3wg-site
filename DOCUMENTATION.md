# Документация проекта NODE-1 VPN

## Обзор проекта

Это веб-приложение для презентации VPN-решения NODE-1 от 3WG.RU. Проект построен на современном стеке технологий и предоставляет интерактивный интерфейс для демонстрации возможностей VPN-оборудования и услуг.

## Технологический стек

### Основные технологии
- **React 18.3.1** - библиотека для построения пользовательского интерфейса
- **TypeScript 5.8.3** - типизированный JavaScript
- **Vite 5.4.19** - сборщик и dev-сервер
- **React Router DOM 6.30.1** - маршрутизация
- **Tailwind CSS 3.4.17** - utility-first CSS фреймворк

### UI библиотеки
- **shadcn/ui** - коллекция переиспользуемых компонентов на базе Radix UI
- **Framer Motion 12.29.0** - анимации и переходы
- **Lucide React 0.462.0** - иконки

### Дополнительные библиотеки
- **TanStack Query 5.83.0** - управление серверным состоянием
- **React Hook Form 7.61.1** - работа с формами
- **Zod 3.25.76** - валидация схем
- **Recharts 2.15.4** - графики и диаграммы
- **Sonner 1.7.4** - уведомления

## Структура проекта

```
src/
├── assets/              # Изображения и SVG
│   ├── amnezia-symbol.svg
│   ├── amneziawg-logo.webp
│   ├── node1-internal.jpg
│   ├── node1-router.png
│   ├── wireguard-dark.svg
│   ├── wireguard-logo.svg
│   └── world-map.svg
├── components/          # React компоненты
│   ├── ui/             # UI компоненты shadcn/ui
│   ├── AnimatedSection.tsx
│   ├── ArticlesSection.tsx
│   ├── FAQSection.tsx
│   ├── Footer.tsx
│   ├── HardwareSection.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── InfrastructureSection.tsx
│   ├── Layout.tsx
│   ├── MiniAppShowcase.tsx
│   ├── MobileDashboard.tsx
│   ├── NavLink.tsx
│   ├── OrderForm.tsx
│   ├── PageTransition.tsx
│   ├── PricingSection.tsx
│   ├── ServicesSection.tsx
│   ├── StatusWidget.tsx
│   ├── TelegramSection.tsx
│   └── VPNSection.tsx
├── hooks/              # Пользовательские хуки
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Утилиты
│   └── utils.ts
├── pages/              # Страницы приложения
│   ├── AmneziaWG.tsx
│   ├── Dashboard.tsx
│   ├── FAQ.tsx
│   ├── Generator.tsx
│   ├── Hardware.tsx
│   ├── Index.tsx
│   ├── Infrastructure.tsx
│   ├── Node1.tsx
│   ├── NotFound.tsx
│   └── Pricing.tsx
├── test/               # Тесты
│   ├── example.test.ts
│   └── setup.ts
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## Маршруты приложения

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | Index | Главная страница |
| `/pricing` | Pricing | Тарифы и цены |
| `/node-1` | Node1 | Информация о NODE-1 |
| `/hardware` | Hardware | Описание оборудования |
| `/infrastructure` | Infrastructure | Инфраструктура |
| `/faq` | FAQ | Часто задаваемые вопросы |
| `/amnezia-tech` | AmneziaWG | Технология AmneziaWG |
| `/dashboard` | Dashboard | Панель управления |
| `/generator` | Generator | Генератор конфигураций |
| `*` | NotFound | 404 страница |

## Основные компоненты

### Layout
Базовый макет с Header и Footer, используется на всех страницах.

### AnimatedSection
Обертка для анимации появления секций при скролле с использованием Framer Motion.

### HeroSection
Главный баннер на главной странице с призывом к действию.

### VPNSection
Секция с описанием VPN-технологий (WireGuard, AmneziaWG).

### PricingSection
Отображение тарифных планов.

### HardwareSection
Информация о железе NODE-1.

### InfrastructureSection
Описание инфраструктуры и серверов.

### MobileDashboard
Мобильная панель управления VPN-подключениями.

### StatusWidget
Виджет статуса сервисов.

## Конфигурация

### Vite (vite.config.ts)
- Порт разработки: 8080
- Host: `::`
- Плагины: React SWC, Lovable Tagger (dev)
- Алиас: `@` → `./src`

### TypeScript (tsconfig.json)
- Базовый путь: `.`
- Алиас: `@/*` → `./src/*`
- Отключены строгие проверки для упрощения разработки

### Tailwind CSS (tailwind.config.ts)
- Кастомные цвета и темы
- Анимации
- Типографика

## Скрипты

```bash
# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Сборка для development
npm run build:dev

# Линтинг
npm run lint

# Превью production сборки
npm run preview

# Запуск тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch
```

## Установка и запуск

### Требования
- Node.js (рекомендуется LTS версия)
- npm или yarn

### Установка зависимостей
```bash
npm install
```

### Запуск dev-сервера
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:8080`

### Сборка для production
```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## Особенности реализации

### Анимации и эффекты
Проект активно использует Framer Motion и CSS анимации для создания киберпанк эстетики:

**Визуальные эффекты:**
- **FloatingParticles** - плавающие частицы с соединениями (Canvas API)
- **HolographicEffect** - голографические сканирующие линии и хроматическая аберрация
- **DataStream** - Matrix-стиль падающие символы
- **GlitchText** - глитч эффект для текста с RGB разделением
- **Card3D** - 3D карточки с tilt эффектом и свечением
- **AnimatedIcon** - анимированные иконки (pulse, spin, bounce, float, glow)

**Анимации страниц:**
- Переходы между страницами (AnimatePresence)
- Анимации появления секций при скролле
- Интерактивные элементы с hover эффектами
- 3D трансформации с параллакс эффектом
- Пульсирующие индикаторы и свечения

**Специальные эффекты:**
- Электрические импульсы по сетке
- Сканирующие линии
- Голографические шиммеры
- Неоновые границы с вращением цвета
- Энергетические пульсации
- Киберпанк кнопки с clip-path

### Адаптивность
- Mobile-first подход
- Breakpoints: sm, md, lg, xl
- Адаптивная навигация
- Мобильная панель управления

### Темизация
- Поддержка светлой/темной темы через next-themes
- CSS переменные для цветов
- Кастомные цвета бренда (primary, cyan, green)

### Формы
- React Hook Form для управления состоянием
- Zod для валидации
- Интеграция с shadcn/ui компонентами

### Тестирование
- Vitest для unit-тестов
- Testing Library для компонентов
- JSDOM для эмуляции DOM

## Стилизация

### Цветовая палитра
- **Primary**: Lime/Yellow-Green (#CCFF00)
- **Accent**: Cyan (#00B4D8)
- **Background**: Dark theme
- **Foreground**: Light text

### Шрифты
- Основной: System fonts
- Моноширинный: JetBrains Mono (для технических элементов)

### Кастомные классы
- `.cyber-grid` - киберпанк сетка
- `.text-gradient-primary` - градиентный текст
- `.font-mono-tech` - технический моноширинный шрифт

## API и интеграции

Проект использует TanStack Query для управления асинхронными запросами. В текущей версии API endpoints не определены, но структура готова для интеграции.

## Развертывание

Проект создан на платформе Lovable и может быть развернут через:
- Lovable Platform (автоматическое развертывание)
- Vercel
- Netlify
- GitHub Pages
- Любой статический хостинг

## Поддержка браузеров

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

## Лицензия

Проект является частной разработкой 3WG.RU.

## Контакты

Для вопросов и предложений обращайтесь к команде 3WG.RU.
