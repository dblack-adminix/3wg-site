import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ArticlesContent {
  section_title?: string;
  section_subtitle?: string;
  
  article_1_category?: string;
  article_1_title?: string;
  article_1_excerpt?: string;
  article_1_point_1?: string;
  article_1_point_2?: string;
  article_1_point_3?: string;
  article_1_slogan?: string;
  article_1_button_url?: string;
  
  article_2_category?: string;
  article_2_title?: string;
  article_2_excerpt?: string;
  article_2_point_1?: string;
  article_2_point_2?: string;
  article_2_point_3?: string;
  article_2_slogan?: string;
  article_2_button_url?: string;
}

const defaultContent: ArticlesContent = {
  section_title: 'Экспертные материалы',
  section_subtitle: 'Разбираем технологии и решения для вашей цифровой свободы',
  
  article_1_category: 'Безопасность',
  article_1_title: 'Почему обычные VPN больше не работают?',
  article_1_excerpt: 'РКН использует DPI (Deep Packet Inspection) для анализа структуры трафика. Узнайте, как AmneziaWG меняет «почерк» пакетов.',
  article_1_point_1: 'DPI распознает VPN-трафик по характерным сигнатурам',
  article_1_point_2: 'AmneziaWG маскирует пакеты под обычный HTTPS',
  article_1_point_3: 'Личный сервер = никаких соседей и чистый IP',
  article_1_slogan: '',
  article_1_button_url: '/blog',
  
  article_2_category: 'Бизнес',
  article_2_title: 'ИТ-аутсорсинг нового поколения',
  article_2_excerpt: 'Пока ваш VPN работает, мы следим за вашим бизнесом. Настройка сетей, защита от атак, удаленная поддержка.',
  article_2_point_1: 'Защита от DDoS и кибератак',
  article_2_point_2: 'Настройка и мониторинг инфраструктуры',
  article_2_point_3: 'Поддержка 24/7 без выходных и отпусков',
  article_2_slogan: '«Мы — ваш ИТ-отдел на аутсорсе, который никогда не уходит в отпуск»',
  article_2_button_url: '/blog',
};

interface ArticlesSectionEditorProps {
  onSave?: () => void;
}

export function ArticlesSectionEditor({ onSave }: ArticlesSectionEditorProps) {
  const [content, setContent] = useState<ArticlesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<ArticlesContent>('/settings/blocks/articles_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load articles content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/articles_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save articles content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ArticlesContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <Label htmlFor="section_title" className="font-mono text-sm">Заголовок секции</Label>
        <Input
          id="section_title"
          value={content.section_title}
          onChange={(e) => handleChange('section_title', e.target.value)}
          className="font-mono mt-2"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      <div>
        <Label htmlFor="section_subtitle" className="font-mono text-sm">Подзаголовок</Label>
        <Textarea
          id="section_subtitle"
          value={content.section_subtitle}
          onChange={(e) => handleChange('section_subtitle', e.target.value)}
          className="font-mono mt-2 min-h-[60px]"
        />
      </div>

      {/* Articles */}
      {[1, 2].map((num) => (
        <div key={num} className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-mono text-sm font-bold text-primary">Статья {num}</h3>
          
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div>
              <Label htmlFor={`article_${num}_category`} className="font-mono text-sm">Категория</Label>
              <Input
                id={`article_${num}_category`}
                value={content[`article_${num}_category` as keyof ArticlesContent]}
                onChange={(e) => handleChange(`article_${num}_category` as keyof ArticlesContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>

            <div>
              <Label htmlFor={`article_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Textarea
                id={`article_${num}_title`}
                value={content[`article_${num}_title` as keyof ArticlesContent]}
                onChange={(e) => handleChange(`article_${num}_title` as keyof ArticlesContent, e.target.value)}
                className="font-mono mt-2 min-h-[60px]"
              />
            </div>

            <div>
              <Label htmlFor={`article_${num}_excerpt`} className="font-mono text-sm">Краткое описание</Label>
              <Textarea
                id={`article_${num}_excerpt`}
                value={content[`article_${num}_excerpt` as keyof ArticlesContent]}
                onChange={(e) => handleChange(`article_${num}_excerpt` as keyof ArticlesContent, e.target.value)}
                className="font-mono mt-2 min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
              </p>
            </div>

            <div>
              <Label className="font-mono text-sm mb-2 block">Ключевые пункты (3 шт)</Label>
              {[1, 2, 3].map((pointNum) => (
                <Input
                  key={pointNum}
                  value={content[`article_${num}_point_${pointNum}` as keyof ArticlesContent]}
                  onChange={(e) => handleChange(`article_${num}_point_${pointNum}` as keyof ArticlesContent, e.target.value)}
                  className="font-mono mt-2"
                  placeholder={`Пункт ${pointNum}`}
                />
              ))}
            </div>

            <div>
              <Label htmlFor={`article_${num}_slogan`} className="font-mono text-sm">Слоган (опционально)</Label>
              <Textarea
                id={`article_${num}_slogan`}
                value={content[`article_${num}_slogan` as keyof ArticlesContent]}
                onChange={(e) => handleChange(`article_${num}_slogan` as keyof ArticlesContent, e.target.value)}
                className="font-mono mt-2 min-h-[60px]"
                placeholder="Оставьте пустым, если не нужен"
              />
            </div>

            <div>
              <Label htmlFor={`article_${num}_button_url`} className="font-mono text-sm">Ссылка кнопки</Label>
              <Input
                id={`article_${num}_button_url`}
                value={content[`article_${num}_button_url` as keyof ArticlesContent]}
                onChange={(e) => handleChange(`article_${num}_button_url` as keyof ArticlesContent, e.target.value)}
                className="font-mono mt-2"
                placeholder="/blog"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-black hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </div>
    </div>
  );
}
