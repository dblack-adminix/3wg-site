import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AnimatedSection } from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
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

const BlogPost = () => {
  const { id: slug } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPost = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && slug) {
          const posts: BlogPost[] = JSON.parse(saved);
          
          // Ищем статью по slug
          const foundPost = posts.find(p => p.slug === slug && p.published);
          
          if (foundPost) {
            // Увеличиваем счетчик просмотров
            const updatedPosts = posts.map(p => 
              p.id === foundPost.id ? { ...p, views: p.views + 1 } : p
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
            
            setPost({ ...foundPost, views: foundPost.views + 1 });
            
            // Находим похожие статьи (по тегам)
            const related = posts
              .filter(p => 
                p.id !== foundPost.id && 
                p.published && 
                p.tags.some(tag => foundPost.tags.includes(tag))
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-mono">Загрузка статьи...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/blog">
            <Button>Вернуться к блогу</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Featured Image Background */}
        {post.featured_image && (
          <div className="absolute inset-0">
            <img
              src={getImageFromStorage(post.featured_image)}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            {/* Back button */}
            <Link to="/blog">
              <Button variant="outline" className="mb-8 group bg-background/90 text-foreground border-border hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all duration-300">
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Назад к блогу
              </Button>
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="blog-hero-tag inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm shadow-lg text-sm font-medium">
                  <Tag className="h-3 w-3" />
                  <span className="font-mono text-xs tracking-widest">{tag.toUpperCase()}</span>
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold font-mono-tech mb-6 max-w-4xl text-white leading-tight" 
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)'
                }}>
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-white mb-8"
                 style={{
                   textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                 }}>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-mono text-sm">
                  {formatDate(post.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-mono text-sm">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm">{calculateReadingTime(post.content)} мин чтения</span>
              </div>
            </div>

            {/* Share button */}
            <Button variant="outline" className="group bg-background/90 text-foreground border-border hover:bg-secondary hover:text-secondary-foreground backdrop-blur-sm transition-all duration-300 shadow-lg">
              <Share2 className="mr-2 w-4 h-4" />
              Поделиться
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <AnimatedSection delay={0.2}>
              <motion.article 
                className="prose prose-invert prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className="text-foreground leading-relaxed space-y-6 blog-content text-base"
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75',
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </motion.article>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection delay={0.3}>
              <div className="mt-12 pt-8 border-t border-border w-full">
                <h3 className="text-lg font-bold font-mono-tech mb-4">Теги статьи</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono border border-primary/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection delay={0.4}>
              <motion.div 
                className="mt-16 p-8 rounded-lg border border-primary/30 bg-primary/5 w-full"
                whileHover={{ borderColor: 'hsl(73 100% 50% / 0.5)' }}
              >
                <h3 className="text-2xl font-bold font-mono-tech mb-4">
                  Попробуйте наши VPN-серверы
                </h3>
                <p className="text-muted-foreground mb-6">
                  Высокоскоростные серверы с поддержкой WireGuard и AmneziaWG. Переключайтесь между протоколами одной кнопкой.
                </p>
                <Link to="/pricing">
                  <Button size="lg" className="group">
                    Выбрать тариф
                    <ArrowLeft className="ml-2 w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 relative bg-card/20">
          <div className="container mx-auto px-4">
            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl font-bold font-mono-tech text-center mb-12">
                Читайте также
              </h2>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <AnimatedSection key={relatedPost.id} delay={0.2 + index * 0.1}>
                  <motion.article
                    className="bg-card/50 rounded-lg border border-border overflow-hidden h-full flex flex-col group"
                    whileHover={{ y: -4, borderColor: 'hsl(73 100% 50% / 0.5)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Image */}
                    <div className="relative h-32 bg-muted overflow-hidden">
                      {relatedPost.featured_image ? (
                        <img
                          src={getImageFromStorage(relatedPost.featured_image)}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full bg-primary/90 text-background text-xs font-mono font-bold">
                          {relatedPost.tags[0] || 'Статья'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <h3 className="text-base font-bold font-mono-tech mb-2 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>{formatDate(relatedPost.created_at)}</span>
                        <span>{calculateReadingTime(relatedPost.content)} мин</span>
                      </div>
                    </div>
                  </motion.article>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogPost;
