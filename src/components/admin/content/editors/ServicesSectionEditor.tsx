import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ServicesContent {
  section_title?: string;
  section_subtitle?: string;
  
  feature_1_title?: string;
  feature_1_description?: string;
  
  feature_2_title?: string;
  feature_2_description?: string;
  
  feature_3_title?: string;
  feature_3_description?: string;
  
  button_text?: string;
  button_url?: string;
}

const defaultContent: ServicesContent = {
  section_title: 'Управляйте сервером прямо из Telegram',
  section_subtitle: 'Наше мини-приложение превращает мессенджер в полноценную админ-панель. Мониторинг нагрузки, управление устройствами, смена протокола — всё в одном клике.',
  
  feature_1_title: 'Мониторинг в реальном времени',
  feature_1_description: 'cpu_load • bandwidth • latency',
  
  feature_2_title: 'Управление устройствами',
  feature_2_description: 'add_device • revoke_access • qr_invite',
  
  feature_3_title: 'Настройка протоколов',
  feature_3_description: 'wireguard • amnezia • shadowsocks',
  
  button_text: 'Открыть Mini App',
  button_url: 'https://t.me/your_bot',
};

interface ServicesSectionEditorProps {
  onSave?: () => void;
}

export function ServicesSectionEditor({ onSave }: ServicesSectionEditorProps) {
  const [content, setContent] = useState<ServicesContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<ServicesContent>('/settings/blocks/services_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load services content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/services_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save services content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof ServicesContent, value: string) => {
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
        <Textarea
          id="section_title"
          value={content.section_title}
          onChange={(e) => handleChange('section_title', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      <div>
        <Label htmlFor="section_subtitle" className="font-mono text-sm">Описание</Label>
        <Textarea
          id="section_subtitle"
          value={content.section_subtitle}
          onChange={(e) => handleChange('section_subtitle', e.target.value)}
          className="font-mono mt-2 min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Преимущества (3 блока)</h3>
        
        {[1, 2, 3].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Преимущество {num}</Label>
            <div>
              <Label htmlFor={`feature_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Input
                id={`feature_${num}_title`}
                value={content[`feature_${num}_title` as keyof ServicesContent]}
                onChange={(e) => handleChange(`feature_${num}_title` as keyof ServicesContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`feature_${num}_description`} className="font-mono text-sm">Описание (технические термины)</Label>
              <Input
                id={`feature_${num}_description`}
                value={content[`feature_${num}_description` as keyof ServicesContent]}
                onChange={(e) => handleChange(`feature_${num}_description` as keyof ServicesContent, e.target.value)}
                className="font-mono mt-2"
                placeholder="term1 • term2 • term3"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Кнопка</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="button_text" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="button_text"
              value={content.button_text}
              onChange={(e) => handleChange('button_text', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="button_url"
              value={content.button_url}
              onChange={(e) => handleChange('button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="https://t.me/your_bot"
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
