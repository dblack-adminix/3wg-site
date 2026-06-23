# Быстрый старт: Генератор VPN ключей

## 🚀 Запуск

### 1. Backend (уже запущен)
```powershell
cd backend
docker-compose up --build
```

### 2. Frontend (уже запущен)
```powershell
npm run dev
```

## 🧪 Тестирование

### Через UI
1. Откройте http://localhost:5173/generator
2. Выберите протокол (WireGuard или AmneziaWG)
3. Выберите сервер
4. Введите имя ключа (или оставьте автогенерированное)
5. Нажмите "GENERATE CONFIG"
6. Скопируйте или скачайте конфиг

### Через API
```powershell
# Создать ключ
./test-create-key.ps1

# Создать несколько ключей
./test-multiple-keys.ps1
```

## 📝 Что проверить

- ✅ Выбор протокола меняет цвет (красный/оранжевый)
- ✅ Серверы загружаются из БД
- ✅ Отображается загрузка сервера (пиры/макс)
- ✅ Анимация терминала при генерации
- ✅ Конфиг создается с уникальным IP
- ✅ Копирование в буфер обмена работает
- ✅ Скачивание .conf файла работает
- ✅ Ключи отображаются на странице /keys

## 🔗 Ссылки

- **Generator:** http://localhost:5173/generator
- **Keys:** http://localhost:5173/keys
- **Admin:** http://localhost:5173/admin
- **API:** http://localhost:3000

## 📚 Документация

- `KEY_GENERATION_FEATURE.md` - полная документация
- `TEST_KEY_GENERATION.md` - инструкция по тестированию
- `GENERATOR_CHECKLIST.md` - чеклист
- `SESSION_SUMMARY.md` - сводка сессии

## 🎯 Следующие шаги

1. Протестировать UI
2. Установить WireGuard tools
3. Интегрировать с WGDashboard
4. Автоматически добавлять пиры на сервер

---

**Готово к тестированию!** 🎉
