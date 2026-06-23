import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface StatusWidgetContent {
  widget_title?: string;
  status_text?: string;
  uptime_label?: string;
  uptime_value?: string;
}

const defaultContent: StatusWidgetContent = {
  widget_title: 'Статус систем',
  status_text: 'РАБОТАЕТ ШТАТНО',
  uptime_label: 'Uptime за 30 дней',
  uptime_value: '99.98%',
};

interface StatusWidgetEditorProps {
  onSave?: () => void;
}

export function StatusWidgetEditor({ onSave }: StatusWidgetEditorProps) {
  const [content, setContent] = useState<StatusWidgetContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<StatusWidgetContent>('/settings/blocks/status_widget');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load status widget content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/status_widget', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save status widget content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof StatusWidgetContent, value: string) => {
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
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-sm font-mono text-muted-foreground">
          Виджет статуса показывает текущее состояние систем. Список систем (Серверы, База данных, Сеть, API) 
          и их статусы управляются автоматически и не редактируются через этот интерфейс.
        </p>
      </div>

      {/* Widget Settings */}
      <div>
        <Label htmlFor="widget_title" className="font-mono text-sm">Заголовок виджета</Label>
        <Input
          id="widget_title"
          value={content.widget_title}
          onChange={(e) => handleChange('widget_title', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      <div>
        <Label htmlFor="status_text" className="font-mono text-sm">Текст статуса</Label>
        <Input
          id="status_text"
          value={content.status_text}
          onChange={(e) => handleChange('status_text', e.target.value)}
          className="font-mono mt-2"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Uptime</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="uptime_label" className="font-mono text-sm">Название</Label>
            <Input
              id="uptime_label"
              value={content.uptime_label}
              onChange={(e) => handleChange('uptime_label', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="uptime_value" className="font-mono text-sm">Значение</Label>
            <Input
              id="uptime_value"
              value={content.uptime_value}
              onChange={(e) => handleChange('uptime_value', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>
      </div>

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
