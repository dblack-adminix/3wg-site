import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface Node1KeeneticContent {
  badge: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  sectionDescription: string;
  features: Array<{ title: string; desc: string }>;
  buttonText: string;
  buttonLink: string;
  supportedModels: string;
}

interface Node1KeeneticEditorProps {
  onClose: () => void;
  initialContent: Node1KeeneticContent;
}

export function Node1KeeneticEditor({ onClose, initialContent }: Node1KeeneticEditorProps) {
  const [content, setContent] = useState<Node1KeeneticContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await api.request<Node1KeeneticContent>('/settings/blocks/node1_keenetic');
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
      await api.request('/admin/settings/blocks/node1_keenetic', {
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

  const updateFeature = (index: number, field: 'title' | 'desc', value: string) => {
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent({ ...content, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-mono mb-4">Keenetic Firmware Section</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Секция с прошивкой для Keenetic
        </p>
      </div>

      <div className="space-y-4">
        {/* Badge */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Badge</label>
          <Input
            value={content.badge}
            onChange={(e) => setContent({ ...content, badge: e.target.value })}
            placeholder="KEENETIC_FIRMWARE"
            className="font-mono"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Заголовок</label>
          <Input
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Прошивка для Keenetic"
            className="font-mono"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Подзаголовок</label>
          <Input
            value={content.subtitle}
            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            placeholder="Превратите ваш роутер в защищённый узел с AmneziaWG"
            className="font-mono"
          />
        </div>

        {/* Section Title */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Заголовок правой секции</label>
          <Input
            value={content.sectionTitle}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="Полная интеграция с AmneziaWG"
            className="font-mono"
          />
        </div>

        {/* Section Description */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Описание правой секции</label>
          <Textarea
            value={content.sectionDescription}
            onChange={(e) => setContent({ ...content, sectionDescription: e.target.value })}
            placeholder="Кастомная прошивка добавляет нативную поддержку..."
            rows={3}
            className="font-mono"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Особенности (4 пункта)</label>
          <div className="space-y-3">
            {content.features.map((feature, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  placeholder={`Заголовок ${index + 1}`}
                  className="font-mono text-sm"
                />
                <Input
                  value={feature.desc}
                  onChange={(e) => updateFeature(index, 'desc', e.target.value)}
                  placeholder={`Описание ${index + 1}`}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Button Text */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Текст кнопки</label>
          <Input
            value={content.buttonText}
            onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
            placeholder="Скачать прошивку"
            className="font-mono"
          />
        </div>

        {/* Button Link */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Ссылка кнопки</label>
          <Input
            value={content.buttonLink || ''}
            onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
            placeholder="https://example.com/firmware.zip"
            className="font-mono"
          />
        </div>

        {/* Supported Models */}
        <div>
          <label className="block text-sm font-medium mb-2 font-mono">Поддерживаемые модели</label>
          <Input
            value={content.supportedModels}
            onChange={(e) => setContent({ ...content, supportedModels: e.target.value })}
            placeholder="Keenetic Giga / Ultra / Viva / Speedster"
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
    </div>
  );
}
