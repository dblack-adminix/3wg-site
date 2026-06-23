// Утилиты для блога

// Транслитерация русского текста в английский
const translitMap: { [key: string]: string } = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  ' ': '-', '_': '-', '№': 'no'
};

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9\-]/g, '') // Убираем все кроме букв, цифр и дефисов
    .replace(/\-+/g, '-') // Заменяем множественные дефисы на один
    .replace(/^-+|-+$/g, '') // Убираем дефисы в начале и конце
    .substring(0, 50); // Ограничиваем длину
}

// Сжатие изображения
export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Вычисляем новые размеры с сохранением пропорций
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Рисуем изображение на canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Конвертируем в blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Создание thumbnail для карточки
export function createThumbnail(file: File): Promise<File> {
  return compressImage(file, 400, 0.7);
}

// Сохранение изображения в папку блога
export function saveImageToFolder(file: File, slug: string): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // В реальном приложении здесь был бы запрос к серверу
        // Пока что сохраняем в localStorage как base64
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${slug}-${timestamp}.${extension}`;
        const imageKey = `blog_image_${filename}`;
        
        try {
          localStorage.setItem(imageKey, result);
          const imagePath = `/blog-images/${filename}`;
          resolve(imagePath);
        } catch (error) {
          // Если localStorage переполнен, используем data URL
          resolve(result);
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

// Получение изображения из localStorage
export function getImageFromStorage(imagePath: string): string {
  if (imagePath.startsWith('data:')) {
    return imagePath; // Уже data URL
  }
  
  if (imagePath.startsWith('/blog-images/')) {
    const filename = imagePath.replace('/blog-images/', '');
    const imageKey = `blog_image_${filename}`;
    const stored = localStorage.getItem(imageKey);
    if (stored) {
      return stored;
    }
  }
  
  return imagePath; // Возвращаем как есть если не найдено
}

// Дефолтные теги
export const defaultTags = [
  'VPN',
  'WireGuard',
  'AmneziaWG',
  'Keenetic',
  'Настройка',
  'Безопасность',
  'Приватность',
  'Роутер',
  'Протокол',
  'Шифрование',
  'Туннель',
  'Сеть',
  'Интернет',
  'Блокировка',
  'Обход',
  'DPI',
  'Маскировка',
  'Трафик',
  'Конфигурация',
  'Установка',
  'Руководство',
  'Инструкция',
  'Сравнение',
  'Обзор',
  'Тестирование',
  'Производительность',
  'Скорость',
  'Стабильность'
];

// Управление тегами в localStorage
const TAGS_STORAGE_KEY = 'blog_tags';

export function getAllTags(): string[] {
  const saved = localStorage.getItem(TAGS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultTags;
    }
  }
  
  // Сохраняем дефолтные теги при первом запуске
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(defaultTags));
  return defaultTags;
}

export function addTag(tag: string): void {
  const tags = getAllTags();
  const trimmedTag = tag.trim();
  
  if (trimmedTag && !tags.includes(trimmedTag)) {
    tags.push(trimmedTag);
    tags.sort();
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  }
}

export function removeTag(tag: string): void {
  const tags = getAllTags();
  const filteredTags = tags.filter(t => t !== tag);
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(filteredTags));
}

// Форматирование даты
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Подсчет времени чтения
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}