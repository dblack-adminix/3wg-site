import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDate, calculateReadingTime, getImageFromStorage } from '@/lib/blog-utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

const STORAGE_KEY = 'blog_posts';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка статей из localStorage
  useEffect(() => {
    const loadPosts = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const allPosts: BlogPost[] = JSON.parse(saved);
          // Показываем только опубликованные статьи
          const publishedPosts = allPosts.filter(post => post.published);
          // Сортируем по дате создания (новые сначала)
          publishedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setPosts(publishedPosts);
        } else {
          // Если нет статей, показываем пустой массив
          setPosts([]);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Получаем уникальные категории из тегов статей
  const categories = ['Все', ...Array.from(new Set(posts.flatMap(post => post.tags)))];

  // Фильтрация по категории
  const filteredPosts = selectedCategory === 'Все' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedCategory));

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-mono">Загрузка статей...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-widest">BLOG</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold font-mono-tech mb-6">
                Блог <span className="text-gradient-primary">3WG.RU</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Статьи о VPN, безопасности, технологиях и инфраструктуре.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-background'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4">
                {posts.length === 0 ? 'Пока нет статей' : 'Статьи не найдены'}
              </h3>
              <p className="text-muted-foreground mb-8">
                {posts.length === 0 
                  ? 'Скоро здесь появятся интересные статьи о VPN, безопасности и технологиях.'
                  : `В категории "${selectedCategory}" пока нет статей.`
                }
              </p>
              {selectedCategory !== 'Все' && (
                <Button onClick={() => setSelectedCategory('Все')}>
                  Показать все статьи
                </Button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <AnimatedSection key={post.id} delay={0.1 + index * 0.1}>
                  <motion.article
                    className="bg-card/50 rounded-lg border border-border overflow-hidden h-full flex flex-col group"
                    whileHover={{ y: -8, borderColor: 'hsl(73 100% 50% / 0.5)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={getImageFromStorage(post.featured_image)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to gradient if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-primary/90 text-background text-xs font-mono font-bold">
                          {post.tags[0] || 'Статья'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <Link to={`/blog/${post.slug}`}>
                        <h3 className="text-lg font-bold font-mono-tech mb-3 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground font-mono">
                          {calculateReadingTime(post.content)} мин чтения
                        </span>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="group/btn">
                            Читать
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Load More - показываем только если есть статьи */}
          {filteredPosts.length > 0 && filteredPosts.length >= 9 && (
            <AnimatedSection delay={0.8}>
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="group">
                  Загрузить ещё
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 relative overflow-hidden bg-card/20">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-4">
                Подписка на <span className="text-gradient-primary">новости</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Получайте новые статьи и обновления прямо в Telegram
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none font-mono text-sm"
                />
                <Button className="group">
                  Подписаться
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
