import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface Node1CtaContent {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface Node1CtaEditorProps {
  onClose: () => void;
  initialContent: Node1CtaContent;
}

export function Node1CtaEditor({ onClose, initialContent }: Node1CtaEditorProps) {
  const [content, setContent] = useState<Node1CtaContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await api.request<Node1CtaContent>('/settings/blocks/node1_cta');
        if (Object.keys(data).length > 0) {
          setContent({ ...initialContent, ...data });
        }
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving content:', content);
      await api.request('/admin/settings/blocks/node1_cta', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      console.log('Content saved successfully');
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-mono mb-4">CTA Section - NODE-1</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Призыв к действию в конце страницы
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Заголовок</label>
              <Input
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Готовы к цифровой свободе?"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Используйте ЗАГЛАВНЫЕ слова для автоматической подсветки
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Описание</label>
              <Textarea
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Доступно ограниченное количество устройств..."
                rows={3}
                className="font-mono"
              />
            </div>

            {/* Button Text */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Текст кнопки</label>
              <Input
                value={content.buttonText}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                placeholder="Заказать NODE-1"
                className="font-mono"
              />
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Ссылка кнопки</label>
              <Input
                value={content.buttonLink}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
                placeholder="/pricing"
                className="font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" disabled={isSaving}>
              Отмена
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
