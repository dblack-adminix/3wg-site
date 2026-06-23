import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface InfrastructureContent {
  section_title?: string;
  section_description?: string;
  section_quote?: string;
  
  feature_1_title?: string;
  feature_1_description?: string;
  
  feature_2_title?: string;
  feature_2_description?: string;
  
  feature_3_title?: string;
  feature_3_description?: string;
  
  feature_4_title?: string;
  feature_4_description?: string;
  
  feature_5_title?: string;
  feature_5_description?: string;
  
  feature_6_title?: string;
  feature_6_description?: string;
  
  stat_1_label?: string;
  stat_1_value?: string;
  
  stat_2_label?: string;
  stat_2_value?: string;
  
  stat_3_label?: string;
  stat_3_value?: string;
}

const defaultContent: InfrastructureContent = {
  section_title: 'Инфраструктура Tier III.',
  section_description: 'Бесперебойное питание, охрана 24/7 и каналы связи с резервированием.',
  section_quote: 'Размещайте проекты там, где о них заботятся.',
  
  feature_1_title: '2N Питание',
  feature_1_description: 'Бесперебойное электроснабжение с полным резервированием',
  
  feature_2_title: 'Охрана 24/7',
  feature_2_description: 'Биометрический контроль доступа и видеонаблюдение',
  
  feature_3_title: 'Резервные каналы',
  feature_3_description: 'Множественные магистральные каналы с автопереключением',
  
  feature_4_title: 'Климат N+1',
  feature_4_description: 'Прецизионное охлаждение с резервированием',
  
  feature_5_title: 'Физическая защита',
  feature_5_description: 'Клетки Фарадея и защита от проникновения',
  
  feature_6_title: 'DCIM мониторинг',
  feature_6_description: 'Контроль всех параметров в реальном времени',
  
  stat_1_label: 'Uptime',
  stat_1_value: '99.98%',
  
  stat_2_label: 'Температура',
  stat_2_value: '18°C',
  
  stat_3_label: 'PUE',
  stat_3_value: '1.3',
};

interface InfrastructureSectionEditorProps {
  onSave?: () => void;
}

export function InfrastructureSectionEditor({ onSave }: InfrastructureSectionEditorProps) {
  const [content, setContent] = useState<InfrastructureContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<InfrastructureContent>('/settings/blocks/infrastructure_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load infrastructure content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/infrastructure_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save infrastructure content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof InfrastructureContent, value: string) => {
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
        <Label htmlFor="section_description" className="font-mono text-sm">Описание</Label>
        <Textarea
          id="section_description"
          value={content.section_description}
          onChange={(e) => handleChange('section_description', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="section_quote" className="font-mono text-sm">Цитата (выделенный текст)</Label>
        <Textarea
          id="section_quote"
          value={content.section_quote}
          onChange={(e) => handleChange('section_quote', e.target.value)}
          className="font-mono mt-2 min-h-[60px]"
        />
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Преимущества (6 карточек)</h3>
        
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Карточка {num}</Label>
            <div>
              <Label htmlFor={`feature_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Input
                id={`feature_${num}_title`}
                value={content[`feature_${num}_title` as keyof InfrastructureContent]}
                onChange={(e) => handleChange(`feature_${num}_title` as keyof InfrastructureContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`feature_${num}_description`} className="font-mono text-sm">Описание</Label>
              <Input
                id={`feature_${num}_description`}
                value={content[`feature_${num}_description` as keyof InfrastructureContent]}
                onChange={(e) => handleChange(`feature_${num}_description` as keyof InfrastructureContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Статистика (3 показателя)</h3>
        
        {[1, 2, 3].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Показатель {num}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`stat_${num}_label`} className="font-mono text-sm">Название</Label>
                <Input
                  id={`stat_${num}_label`}
                  value={content[`stat_${num}_label` as keyof InfrastructureContent]}
                  onChange={(e) => handleChange(`stat_${num}_label` as keyof InfrastructureContent, e.target.value)}
                  className="font-mono mt-2"
                />
              </div>
              <div>
                <Label htmlFor={`stat_${num}_value`} className="font-mono text-sm">Значение</Label>
                <Input
                  id={`stat_${num}_value`}
                  value={content[`stat_${num}_value` as keyof InfrastructureContent]}
                  onChange={(e) => handleChange(`stat_${num}_value` as keyof InfrastructureContent, e.target.value)}
                  className="font-mono mt-2"
                />
              </div>
            </div>
          </div>
        ))}
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
