import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface KeeneticContent {
  title?: string;
  description?: string;
  button_text?: string;
}

const defaultContent: KeeneticContent = {
  title: 'Прошивка для Keenetic',
  description: 'Специальная прошивка для роутеров Keenetic с поддержкой VPN',
  button_text: 'Подробнее →',
};

interface KeeneticSectionEditorProps {
  onSave?: () => void;
}

export function KeeneticSectionEditor({ onSave }: KeeneticSectionEditorProps) {
  const [content, setContent] = useState<KeeneticContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<KeeneticContent>('/settings/blocks/keenetic_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load keenetic content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/keenetic_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save keenetic content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof KeeneticContent, value: string) => {
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
      <div>
        <Label htmlFor="title" className="font-mono text-sm">Заголовок</Label>
        <Input
          id="title"
          value={content.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="font-mono mt-2"
          placeholder="Прошивка для Keenetic"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слово "Keenetic" будет выделено зеленым цветом
        </p>
      </div>

      <div>
        <Label htmlFor="description" className="font-mono text-sm">Описание</Label>
        <Textarea
          id="description"
          value={content.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
          placeholder="Специальная прошивка для роутеров Keenetic с поддержкой VPN"
        />
      </div>

      <div>
        <Label htmlFor="button_text" className="font-mono text-sm">Текст кнопки</Label>
        <Input
          id="button_text"
          value={content.button_text}
          onChange={(e) => handleChange('button_text', e.target.value)}
          className="font-mono mt-2"
          placeholder="Подробнее →"
        />
      </div>

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
