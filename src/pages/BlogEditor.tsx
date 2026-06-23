import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { TagSelector } from '@/components/admin/TagSelector';
import { generateSlug, formatDate, calculateReadingTime, getImageFromStorage } from '@/lib/blog-utils';
import { toast } from 'sonner';
import 'react-quill/dist/quill.snow.css';

// Ленивый импорт ReactQuill
const ReactQuill = lazy(() => import('react-quill'));

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

export const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const posts: BlogPost[] = JSON.parse(saved);
        
        if (id === 'new') {
          // Создание новой статьи
          setPost({
            id: '',
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author: 'Admin',
            tags: [],
            published: false,
            featured_image: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            views: 0
          });
          setIsCreating(true);
        } else {
          // Редактирование существующей статьи
          const foundPost = posts.find(p => p.id === id);
          if (foundPost) {
            setPost(foundPost);
            setIsCreating(false);
          } else {
            toast.error('Статья не найдена');
            navigate('/admin');
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Ошибка загрузки статьи');
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!post || !post.title || !post.content) {
      toast.error('Заполните обязательные поля: заголовок и содержание');
      return;
    }

    setIsSaving(true);

    try {
      const slug = post.slug || generateSlug(post.title);
      
      // Проверка уникальности slug
      const saved = localStorage.getItem(STORAGE_KEY);
      const posts: BlogPost[] = saved ? JSON.parse(saved) : [];
      const existingPost = posts.find(p => p.slug === slug && p.id !== post.id);
      
      if (existingPost) {
        toast.error('Статья с таким URL уже существует');
        setIsSaving(false);
        return;
      }

      const postData: BlogPost = {
        ...post,
        id: isCreating ? Date.now().toString() : post.id,
        slug: slug,
        excerpt: post.excerpt || post.content.substring(0, 200) + '...',
        updated_at: new Date().toISOString(),
      };

      let updatedPosts: BlogPost[];
      if (isCreating) {
        updatedPosts = [postData, ...posts];
        toast.success('Статья создана успешно');
      } else {
        updatedPosts = posts.map(p => p.id === postData.id ? postData : p);
        toast.success('Статья обновлена успешно');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      
      // Обновляем состояние
      setPost(postData);
      setIsCreating(false);
      
      // Обновляем URL если создавали новую статью
      if (isCreating) {
        navigate(`/admin/blog/edit/${postData.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Ошибка сохранения статьи');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = () => {
    if (!post) return;
    
    setPost({
      ...post,
      published: !post.published,
      updated_at: new Date().toISOString()
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Статья не найдена</h2>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в админку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад в админку
              </Button>
              
              <div>
                <h1 className="text-xl font-bold font-mono">
                  {isCreating ? 'Создание новой статьи' : 'Редактирование статьи'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                  {!isCreating && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {calculateReadingTime(post.content)} мин чтения
                      </span>
                    </>
                  )}
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? 'Опубликовано' : 'Черновик'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePublishToggle}
              >
                {post.published ? 'Скрыть' : 'Опубликовать'}
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90 text-black"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Edit Mode */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Заголовок *</label>
                <Input
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="Введите заголовок статьи"
                  className="text-lg"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium">URL (slug)</label>
                <Input
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  placeholder="url-статьи (автоматически из заголовка)"
                />
                <p className="text-xs text-muted-foreground">
                  Статья будет доступна по адресу: /blog/{post.slug || generateSlug(post.title || '')}
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Краткое описание</label>
                <Input
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  placeholder="Краткое описание для превью (если не указано, будет взято из начала статьи)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Изображение статьи</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={post.featured_image || ''}
                onChange={(imagePath) => setPost({ ...post, featured_image: imagePath })}
                slug={post.slug || generateSlug(post.title || 'article')}
              />
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Содержание статьи *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Suspense fallback={
                  <div className="min-h-[300px] border border-border rounded-lg flex items-center justify-center bg-background">
                    <div className="text-muted-foreground font-mono">Загрузка редактора...</div>
                  </div>
                }>
                  <ReactQuill
                    value={post.content}
                    onChange={(content) => setPost({ ...post, content })}
                    placeholder="Начните писать содержание статьи..."
                    className="min-h-[400px] bg-background"
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike',
                      'color', 'background', 'list', 'bullet', 'indent',
                      'blockquote', 'code-block', 'link', 'image'
                    ]}
                  />
                </Suspense>
                <p className="text-xs text-muted-foreground">
                  ✨ Полнофункциональный редактор с поддержкой форматирования, изображений, кода и многого другого
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                Теги статьи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TagSelector
                selectedTags={post.tags}
                onChange={(tags) => setPost({ ...post, tags })}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки публикации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={post.published}
                  onChange={handlePublishToggle}
                  className="rounded"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Опубликовать статью (будет видна на сайте)
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;