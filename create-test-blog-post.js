// Скрипт для создания тестовой статьи в localStorage
// Откройте консоль браузера (F12) на странице http://localhost:8080 и вставьте этот код

const testPost = {
  id: Date.now().toString(),
  title: "Тестовая статья блога",
  slug: "test-article",
  excerpt: "Это тестовая статья для проверки работы блога",
  content: "<h1>Заголовок статьи</h1><p>Это тестовая статья с HTML контентом.</p><p>Здесь может быть любой текст.</p>",
  author: "Администратор",
  tags: ["Тест", "VPN", "Новости"],
  published: true,
  featured_image: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  views: 0
};

// Получаем существующие статьи или создаем новый массив
const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');

// Добавляем тестовую статью
existingPosts.push(testPost);

// Сохраняем обратно в localStorage
localStorage.setItem('blog_posts', JSON.stringify(existingPosts));

console.log('Тестовая статья создана!');
console.log('Всего статей:', existingPosts.length);
console.log('Статьи:', existingPosts);
