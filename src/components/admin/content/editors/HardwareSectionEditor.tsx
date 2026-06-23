import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface HardwareContent {
  section_title?: string;
  section_subtitle?: string;
  section_description?: string;
  
  feature_1_title?: string;
  feature_1_description?: string;
  
  feature_2_title?: string;
  feature_2_description?: string;
  
  feature_3_title?: string;
  feature_3_description?: string;
  
  feature_4_title?: string;
  feature_4_description?: string;
  
  price?: string;
  price_note?: string;
  
  button_text?: string;
  button_url?: string;
}

const defaultContent: HardwareContent = {
  section_title: '3WG NODE-1',
  section_subtitle: 'Роутер приватности с VPN из коробки',
  section_description: 'Устали объяснять бабушке, как включать VPN? Мы берём надёжный роутер, прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри дома автоматически шифруется.',
  
  feature_1_title: 'Защита всей сети',
  feature_1_description: 'all_devices_protected',
  
  feature_2_title: 'Zero Config',
  feature_2_description: 'включил → работает',
  
  feature_3_title: '4K Стриминг',
  feature_3_description: 'youtube • netflix',
  
  feature_4_title: 'Консоли',
  feature_4_description: 'ps5 • xbox • switch',
  
  price: '1500',
  price_note: '+ стоимость оборудования (или аренда)',
  
  button_text: 'Заказать NODE-1',
  button_url: '/node-1',
};

interface HardwareSectionEditorProps {
  onSave?: () => void;
}

export function HardwareSectionEditor({ onSave }: HardwareSectionEditorProps) {
  const [content, setContent] = useState<HardwareContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<HardwareContent>('/settings/blocks/hardware_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load hardware content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/hardware_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save hardware content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof HardwareContent, value: string) => {
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
        <Label htmlFor="section_title" className="font-mono text-sm">Заголовок (название продукта)</Label>
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
        <Input
          id="section_subtitle"
          value={content.section_subtitle}
          onChange={(e) => handleChange('section_subtitle', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      <div>
        <Label htmlFor="section_description" className="font-mono text-sm">Описание</Label>
        <Textarea
          id="section_description"
          value={content.section_description}
          onChange={(e) => handleChange('section_description', e.target.value)}
          className="font-mono mt-2 min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Преимущества (4 карточки)</h3>
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Карточка {num}</Label>
            <div>
              <Label htmlFor={`feature_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Input
                id={`feature_${num}_title`}
                value={content[`feature_${num}_title` as keyof HardwareContent]}
                onChange={(e) => handleChange(`feature_${num}_title` as keyof HardwareContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`feature_${num}_description`} className="font-mono text-sm">Описание (технические термины)</Label>
              <Input
                id={`feature_${num}_description`}
                value={content[`feature_${num}_description` as keyof HardwareContent]}
                onChange={(e) => handleChange(`feature_${num}_description` as keyof HardwareContent, e.target.value)}
                className="font-mono mt-2"
                placeholder="term1 • term2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Цена</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price" className="font-mono text-sm">Цена (без ₽)</Label>
            <Input
              id="price"
              value={content.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="price_note" className="font-mono text-sm">Примечание к цене</Label>
            <Input
              id="price_note"
              value={content.price_note}
              onChange={(e) => handleChange('price_note', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>
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
              placeholder="/node-1"
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
