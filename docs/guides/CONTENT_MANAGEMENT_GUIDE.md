# Руководство по управлению контентом главной страницы

## Быстрый старт

### Через админку (рекомендуется)

1. Откройте http://localhost:8080/admin
2. Войдите как админ:
   - Email: `admin@3wg.ru`
   - Пароль: `admin123`
3. Перейдите на вкладку **"Контент сайта"**
4. Включите/отключите нужные блоки
5. Нажмите **"Сохранить"**
6. Обновите главную страницу http://localhost:8080/

### Через PowerShell скрипты

```powershell
# Проверить текущие настройки
.\check-blocks-visibility.ps1

# Включить все блоки
.\enable-all-blocks.ps1

# Посмотреть детальную информацию
.\test-settings.ps1
```

## Список блоков

| № | Название | Ключ | Компонент |
|---|----------|------|-----------|
| 1 | Hero секция | `hero_section` | `<HeroSection />` |
| 2 | Keenetic прошивка | `keenetic_section` | Кастомная секция |
| 3 | VPN секция | `vpn_section` | `<VPNSection />` |
| 4 | Услуги | `services_section` | `<MiniAppShowcase />` |
| 5 | Тарифы | `pricing_section` | `<PricingSection />` |
| 6 | Оборудование | `hardware_section` | `<HardwareSection />` |
| 7 | Инфраструктура | `infrastructure_section` | `<InfrastructureSection />` |
| 8 | FAQ | `faq_section` | `<FAQSection />` |
| 9 | Статьи | `articles_section` | `<ArticlesSection />` |
| 10 | Telegram | `telegram_section` | `<TelegramSection />` |
| 11 | Статус систем | `status_widget` | `<StatusWidget />` |

## API эндпоинты

### Получить настройки (публичный доступ)
```bash
GET http://localhost:3000/api/v1/settings/homepage
```

### Обновить настройки (требуется токен админа)
```bash
PUT http://localhost:3000/api/v1/admin/settings/homepage
Content-Type: application/json
Authorization: Bearer <token>

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

## Примеры использования

### Отключить все блоки кроме Hero и VPN

```powershell
$loginData = @{
    email = "admin@3wg.ru"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.token

$settings = @{
    hero_section = $true
    keenetic_section = $false
    vpn_section = $true
    services_section = $false
    pricing_section = $false
    hardware_section = $false
    infrastructure_section = $false
    faq_section = $false
    articles_section = $false
    telegram_section = $false
    status_widget = $false
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/settings/homepage" -Method PUT -Body $settings -Headers $headers -ContentType "application/json"
```

## Проверка работы

1. **Откройте админку**: http://localhost:8080/admin
2. **Войдите как админ**
3. **Перейдите на "Контент сайта"**
4. **Отключите любой блок** (например, FAQ)
5. **Нажмите "Сохранить"**
6. **Откройте главную страницу**: http://localhost:8080/
7. **Обновите страницу** (F5)
8. **Проверьте, что блок исчез**

## Текущий статус

Все 11 блоков включены и отображаются на главной странице.

Для проверки запустите:
```powershell
.\check-blocks-visibility.ps1
```

## Файлы системы

### Backend
- `backend/models/settings.go` - Модель настроек
- `backend/controllers/settings.go` - Контроллер
- `backend/routes/routes.go` - Роуты

### Frontend
- `src/pages/Index.tsx` - Главная страница с условным рендерингом
- `src/components/admin/ContentTab.tsx` - Вкладка управления
- `src/hooks/useHomePageSettings.ts` - Хук загрузки настроек
- `src/lib/api.ts` - API клиент

### Скрипты
- `check-blocks-visibility.ps1` - Проверка статуса блоков
- `enable-all-blocks.ps1` - Включить все блоки
- `test-settings.ps1` - Детальная информация

## Troubleshooting

### Блоки не исчезают после отключения
1. Проверьте, что изменения сохранены в админке
2. Обновите страницу (F5)
3. Очистите кеш браузера (Ctrl+Shift+R)
4. Проверьте консоль браузера на ошибки

### Ошибка при сохранении
1. Проверьте, что бэкенд запущен: http://localhost:3000/api/v1/settings/homepage
2. Проверьте токен авторизации в localStorage
3. Проверьте логи бэкенда

### Блоки не загружаются
1. Проверьте API: `curl http://localhost:3000/api/v1/settings/homepage`
2. Проверьте консоль браузера
3. Проверьте, что фронтенд запущен на порту 8080
