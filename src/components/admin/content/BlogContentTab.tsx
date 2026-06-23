import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar,
  Tag,
  FileText,
  Save,
  X,
  Image as ImageIcon,
  ExternalLink,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { TagSelector } from '@/components/admin/TagSelector';
import { generateSlug, formatDate, calculateReadingTime, getImageFromStorage } from '@/lib/blog-utils';
import { toast } from 'sonner';

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

export const BlogContentTab = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Загрузка постов из localStorage
  useEffect(() => {
    const loadPosts = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const posts = JSON.parse(saved);
          // Очищаем старые blob URL'ы
          const cleanedPosts = posts.map((post: BlogPost) => ({
            ...post,
            featured_image: post.featured_image?.startsWith('blob:') ? '' : post.featured_image
          }));
          
          // Сохраняем только если были изменения
          const hasChanges = posts.some((post: BlogPost, index: number) => 
            post.featured_image !== cleanedPosts[index].featured_image
          );
          if (hasChanges) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedPosts));
          }
          
          setPosts(cleanedPosts);
        } catch (error) {
          console.error('Error loading posts:', error);
          setPosts([]);
        }
      } else {
        // Если localStorage пустой, показываем пустой список
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  // Сохранение постов в localStorage
  const savePosts = (postsToSave: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postsToSave));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePost = () => {
    navigate('/admin/blog/edit/new');
  };

  const handleEditPost = (post: BlogPost) => {
    navigate(`/admin/blog/edit/${post.id}`);
  };

  const generateSlugFromTitle = (title: string): string => {
    return generateSlug(title);
  };

  const handleDeletePost = (postId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
      return;
    }
    
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    toast.success('Статья удалена');
  };

  const togglePublished = (postId: string) => {
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, published: !p.published, updated_at: new Date().toISOString() } : p
    );
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    
    const post = updatedPosts.find(p => p.id === postId);
    toast.success(post?.published ? 'Статья опубликована' : 'Статья скрыта');
  };

  const handleViewPost = (post: BlogPost) => {
    // Увеличиваем счетчик просмотров
    const updatedPosts = posts.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    );
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    
    // Показываем превью статьи в модальном окне
    setSelectedPost(post);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-mono">Управление блогом</h3>
          <p className="text-muted-foreground font-mono text-sm">
            Создание и редактирование статей блога • Всего статей: {posts.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('ПОЛНОСТЬЮ ОЧИСТИТЬ localStorage и перезагрузить страницу?')) {
                localStorage.removeItem(STORAGE_KEY);
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('blog_image_')) {
                    localStorage.removeItem(key);
                  }
                });
                window.location.reload();
              }
            }}
            className="text-destructive hover:text-destructive gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Полная очистка
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              savePosts(posts);
              toast.success(`Пересохранено ${posts.length} статей`);
            }}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Пересохранить
          </Button>
          <Button onClick={handleCreatePost} className="gap-2">
            <Plus className="w-4 h-4" />
            Новая статья
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Всего статей</p>
                <p className="text-xl font-bold">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Опубликовано</p>
                <p className="text-xl font-bold">{posts.filter(p => p.published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Черновики</p>
                <p className="text-xl font-bold">{posts.filter(p => !p.published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Просмотры</p>
                <p className="text-xl font-bold">{posts.reduce((sum, p) => sum + p.views, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по заголовку, тегам, содержанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          Найдено: {filteredPosts.length} из {posts.length}
        </div>
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'Статьи не найдены' : 'Нет статей'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Попробуйте изменить поисковый запрос' 
                  : 'Создайте первую статью для блога'
                }
              </p>
              {!searchTerm && (
                <Button onClick={handleCreatePost}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать статью
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                {/* Изображение статьи */}
                {post.featured_image && (
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={getImageFromStorage(post.featured_image)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Скрываем изображение если не удалось загрузить
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <CardContent className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? 'Опубликовано' : 'Черновик'}
                        </Badge>
                        {post.featured_image && (
                          <Badge variant="outline" className="text-xs">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Изображение
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} просмотров
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {calculateReadingTime(post.content)} мин чтения
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.tags.length} тегов
                        </span>
                        <span className="text-xs">
                          /blog/{post.slug}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPost(post)}
                        title="Просмотреть статью"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(post.id)}
                      >
                        {post.published ? 'Скрыть' : 'Опубликовать'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Предварительный просмотр статьи</DialogTitle>
            <DialogDescription>
              Просмотр статьи в том виде, как она будет отображаться на сайте
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="p-6">
              <div className="flex items-center justify-end mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPost(null);
                      handleEditPost(selectedPost);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                </div>
              </div>
              
              {/* Blog Post Preview */}
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-[300px] bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                  {selectedPost.featured_image && (
                    <img
                      src={getImageFromStorage(selectedPost.featured_image)}
                      alt={selectedPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedPost.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{selectedPost.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span>{selectedPost.author}</span>
                      <span>{formatDate(selectedPost.created_at)}</span>
                      <span>{calculateReadingTime(selectedPost.content)} мин чтения</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                      className="leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};