# Тестирование системы управления контентом

## Статус: ✅ Реализовано

Система управления контентом главной страницы полностью функциональна.

## Архитектура

### Backend
- **Модель**: `backend/models/settings.go` - `HomePageSettings` с 11 полями
- **Контроллер**: `backend/controllers/settings.go` - GET/PUT эндпоинты
- **Роуты**: 
  - `GET /api/v1/settings/homepage` - публичный доступ
  - `GET /api/v1/admin/settings/homepage` - админ доступ
  - `PUT /api/v1/admin/settings/homepage` - обновление (только админ)

### Frontend
- **Хук**: `src/hooks/useHomePageSettings.ts` - загрузка настроек
- **Админка**: `src/components/admin/ContentTab.tsx` - управление блоками
- **Главная**: `src/pages/Index.tsx` - условный рендеринг блоков

## Список блоков (11 штук)

1. **Hero секция** (`hero_section`) → `<HeroSection />`
2. **Keenetic прошивка** (`keenetic_section`) → Кастомная секция с кнопкой
3. **VPN секция** (`vpn_section`) → `<VPNSection />`
4. **Услуги** (`services_section`) → `<MiniAppShowcase />`
5. **Тарифы** (`pricing_section`) → `<PricingSection />`
6. **Оборудование** (`hardware_section`) → `<HardwareSection />`
7. **Инфраструктура** (`infrastructure_section`) → `<InfrastructureSection />`
8. **FAQ** (`faq_section`) → `<FAQSection />`
9. **Статьи** (`articles_section`) → `<ArticlesSection />`
10. **Telegram** (`telegram_section`) → `<TelegramSection />`
11. **Статус систем** (`status_widget`) → `<StatusWidget />`

## Как проверить

### 1. Проверка через API

```powershell
# Получить текущие настройки
curl http://localhost:3000/api/v1/settings/homepage

# Включить все блоки (требуется токен админа)
.\enable-all-blocks.ps1

# Проверить статус блоков
.\test-settings.ps1
```

### 2. Проверка через админку

1. Открыть http://localhost:8080/admin
2. Войти как админ (admin@3wg.ru / admin123)
3. Перейти на вкладку "Контент сайта"
4. Включить/отключить любой блок
5. Нажать "Сохранить"
6. Открыть главную страницу http://localhost:8080/
7. Проверить, что блок появился/исчез

### 3. Проверка на главной странице

Открыть http://localhost:8080/ и проверить наличие следующих секций:

- ✅ Hero баннер с заголовком "3WG.RU"
- ✅ Keenetic секция с кнопкой "Подробнее"
- ✅ VPN секция с картами протоколов
- ✅ Услуги (MiniApp Showcase)
- ✅ Тарифы с ценами
- ✅ Оборудование
- ✅ Инфраструктура
- ✅ FAQ (аккордеон с вопросами)
- ✅ Статьи (карточки статей)
- ✅ Telegram (информация о боте)
- ✅ Статус систем (виджет внизу страницы)

## Текущее состояние

```json
{
  "hero_section": true,
  "keenetic_section": true,
  "vpn_section": true,
  "services_section": true,
  "pricing_section": true,
  "hardware_section": true,
  "infrastructure_section": true,
  "faq_section": true,
  "articles_section": true,
  "telegram_section": true,
  "status_widget": true
}
```

Все 11 блоков включены и отображаются на главной странице.

## Особенности реализации

1. **Дефолтные значения**: Если настройки не найдены в БД, возвращаются дефолтные (все включено)
2. **Публичный доступ**: Настройки доступны без авторизации через `/api/v1/settings/homepage`
3. **Админ доступ**: Изменение настроек только через `/api/v1/admin/settings/homepage` с JWT токеном
4. **Реактивность**: Изменения вступают в силу сразу после сохранения (требуется обновление страницы)
5. **Условный рендеринг**: Каждый блок обернут в условие `{settings.block_name && <Component />}`

## Скрипты для тестирования

- `test-settings.ps1` - Показывает текущие настройки
- `enable-all-blocks.ps1` - Включает все блоки
- Можно создать `disable-all-blocks.ps1` для отключения всех блоков

## Что дальше?

- [ ] Добавить автоматическое обновление настроек без перезагрузки страницы (WebSocket или polling)
- [ ] Добавить предпросмотр изменений в админке
- [ ] Добавить возможность менять порядок блоков
- [ ] Добавить настройки для других страниц (FAQ, Pricing, etc.)
