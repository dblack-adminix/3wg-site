import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface Feature {
  title: string;
  description: string;
}

interface Node1FeaturesContent {
  title: string;
  features: Feature[];
}

interface Node1FeaturesEditorProps {
  onClose: () => void;
  initialContent: Node1FeaturesContent;
}

export function Node1FeaturesEditor({ onClose, initialContent }: Node1FeaturesEditorProps) {
  const [content, setContent] = useState<Node1FeaturesContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load current content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await api.request<Node1FeaturesContent>('/settings/blocks/node1_features');
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
      await api.request('/admin/settings/blocks/node1_features', {
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

  const updateFeature = (index: number, field: 'title' | 'description', value: string) => {
    const newFeatures = [...content.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent({ ...content, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-mono mb-4">Firmware Features Section - NODE-1</h3>
        <p className="text-sm text-muted-foreground font-mono">
          Особенности прошивки (4 карточки)
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
              <label className="block text-sm font-medium mb-2 font-mono">Заголовок секции</label>
              <Input
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Возможности прошивки"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Используйте ЗАГЛАВНЫЕ слова для автоматической подсветки
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <label className="block text-sm font-medium font-mono">Особенности (4 карточки)</label>
              {content.features.map((feature, index) => (
                <div key={index} className="p-4 border border-border rounded-lg space-y-3 bg-card/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">Карточка {index + 1}</span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 font-mono">Заголовок</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder={`Особенность ${index + 1}`}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium mb-1 font-mono">Описание</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      placeholder="Описание особенности"
                      rows={2}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              Иконки для карточек: 1) ToggleRight, 2) Shield, 3) Activity, 4) Lock
            </p>
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
