# Быстрый тест генератора ключей

## 🚀 Запуск

1. **Backend уже запущен** ✅
2. **Frontend уже запущен** ✅

## 🧪 Тестирование

### 1. Откройте браузер
```
http://localhost:8080/generator
```

### 2. Войдите как тестовый пользователь
- Email: `user@test.com`
- Password: `password123`

Или создайте нового:
```powershell
./create-test-user.ps1
```

### 3. Создайте ключ

1. Выберите протокол (WireGuard или AmneziaWG)
2. Выберите сервер (например, "Amsterdam Test Server")
3. Имя заполнится автоматически (можете изменить)
4. Нажмите "GENERATE CONFIG"
5. Дождитесь завершения (~3 секунды)
6. Скачайте или скопируйте конфиг

### 4. Проверьте результат

**В браузере:**
- Конфиг должен отобразиться
- Кнопки "Copy" и "Download" должны работать

**В личном кабинете:**
```
http://localhost:8080/keys
```
- Ключ должен появиться в списке
- IP адрес: 10.16.11.X
- Статус: active

**На сервере (опционально):**
```powershell
./check-wgdashboard-direct.ps1
```
- Пир должен появиться в списке

## ✅ Ожидаемый результат

Конфиг должен выглядеть так:
```
[Interface]
PrivateKey = <base64_key>
Address = 10.16.11.X/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = <base64_key>
Endpoint = 46.30.43.35:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

## 🐛 Если что-то не работает

**Ошибка "Unauthorized":**
```powershell
./create-test-user.ps1
```

**Ошибка "No servers available":**
- Проверьте что есть серверы в БД
- Откройте админку: http://localhost:8080/admin

**Ошибка при создании ключа:**
```powershell
docker logs vpn_backend --tail 50
```

## 📝 Исправлено

- ✅ Ошибка парсинга JSON (конфиг возвращается как текст)
- ✅ API метод `downloadKeyConfig` теперь работает корректно

---

**Готово к тестированию!** 🎉
