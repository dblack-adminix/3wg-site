import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface Node1HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

interface Node1HeroEditorProps {
  onClose: () => void;
  initialContent: Node1HeroContent;
}

export function Node1HeroEditor({ onClose, initialContent }: Node1HeroEditorProps) {
  const [content, setContent] = useState<Node1HeroContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await api.request<Node1HeroContent>('/settings/blocks/node1_hero');
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
      await api.request('/admin/settings/blocks/node1_hero', {
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

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...content.features];
    newFeatures[index] = value;
    setContent({ ...content, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-mono mb-4">Hero Section - NODE-1</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Главный экран страницы NODE-1
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Badge */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Badge</label>
              <Input
                value={content.badge}
                onChange={(e) => setContent({ ...content, badge: e.target.value })}
                placeholder="Production Ready"
                className="font-mono"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Заголовок (первая строка)</label>
              <Input
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="NODE-1:"
                className="font-mono"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Заголовок (вторая строка)</label>
              <Input
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Железо, которое не сдается."
                className="font-mono"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Описание</label>
              <Textarea
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="Ваш личный шлюз в цифровую свободу..."
                rows={3}
                className="font-mono"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-2 font-mono">Особенности (3 пункта)</label>
              <div className="space-y-2">
                {content.features.map((feature, index) => (
                  <Textarea
                    key={index}
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Особенность ${index + 1}`}
                    rows={2}
                    className="font-mono text-sm"
                  />
                ))}
              </div>
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
