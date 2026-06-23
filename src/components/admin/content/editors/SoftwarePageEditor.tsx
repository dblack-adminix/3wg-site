import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface SoftwareApp {
  title: string;
  description: string;
  features: string[];
  platform: string;
  status: string;
  downloadLink: string;
}

interface SoftwareContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  apps: SoftwareApp[];
  features: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface SoftwarePageEditorProps {
  onClose: () => void;
}

export function SoftwarePageEditor({ onClose }: SoftwarePageEditorProps) {
  const [content, setContent] = useState<SoftwareContent>({
    hero: {
      badge: 'SOFTWARE',
      title: 'Программное обеспечение',
      subtitle: 'обеспечение',
      description: 'Клиенты для всех платформ. Управление через Telegram Mini App.',
    },
    apps: [
      {
        title: 'Telegram Mini App',
        description: 'Управление сервером прямо из Telegram',
        features: ['Мониторинг статуса', 'Смена локации', 'Управление ключами', 'Статистика трафика'],
        platform: 'iOS / Android / Web',
        status: 'Доступно',
        downloadLink: '',
      },
      {
        title: 'Desktop Client',
        description: 'Нативное приложение для компьютера',
        features: ['Автоподключение', 'Kill Switch', 'Split Tunneling', 'DNS over HTTPS'],
        platform: 'Windows / macOS / Linux',
        status: 'Доступно',
        downloadLink: '',
      },
      {
        title: 'Mobile Apps',
        description: 'Приложения для смартфонов',
        features: ['WireGuard', 'AmneziaWG', 'Автореконнект', 'Уведомления'],
        platform: 'iOS / Android',
        status: 'Доступно',
        downloadLink: '',
      },
    ],
    features: [
      { title: 'Kill Switch', description: 'Защита от утечек' },
      { title: 'Быстрое подключение', description: 'Один клик' },
      { title: 'Шифрование', description: 'AES-256 + ChaCha20' },
      { title: 'Гибкие настройки', description: 'Полный контроль' },
    ],
    cta: {
      title: 'Готовы начать?',
      description: 'Скачайте клиент для вашей платформы и подключитесь к серверу за минуту.',
      buttonText: 'Скачать клиенты',
      buttonLink: '',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<SoftwareContent>('/settings/blocks/software_page');
        console.log('Software page data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          setContent({
            hero: data.hero || content.hero,
            apps: data.apps || content.apps,
            features: data.features || content.features,
            cta: data.cta || content.cta,
          });
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
    setIsSaving(true);
    try {
      await api.request('/admin/settings/blocks/software_page', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const addApp = () => {
    setContent({
      ...content,
      apps: [
        ...content.apps,
        {
          title: 'Новое приложение',
          description: 'Описание',
          features: ['Функция 1', 'Функция 2'],
          platform: 'Platform',
          status: 'Доступно',
          downloadLink: '',
        },
      ],
    });
  };

  const removeApp = (index: number) => {
    setContent({
      ...content,
      apps: content.apps.filter((_, i) => i !== index),
    });
  };

  const updateApp = (index: number, field: keyof SoftwareApp, value: any) => {
    const newApps = [...content.apps];
    newApps[index] = { ...newApps[index], [field]: value };
    setContent({ ...content, apps: newApps });
  };

  const addFeatureToApp = (appIndex: number) => {
    const newApps = [...content.apps];
    newApps[appIndex].features.push('Новая функция');
    setContent({ ...content, apps: newApps });
  };

  const removeFeatureFromApp = (appIndex: number, featureIndex: number) => {
    const newApps = [...content.apps];
    newApps[appIndex].features = newApps[appIndex].features.filter((_, i) => i !== featureIndex);
    setContent({ ...content, apps: newApps });
  };

  const updateAppFeature = (appIndex: number, featureIndex: number, value: string) => {
    const newApps = [...content.apps];
    newApps[appIndex].features[featureIndex] = value;
    setContent({ ...content, apps: newApps });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Hero Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Hero Section</h3>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={content.hero.badge}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.hero.title}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle (highlighted)</Label>
          <Input
            value={content.hero.subtitle}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.hero.description}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
            rows={2}
          />
        </div>
      </div>

      {/* Apps */}
      <div className="space-y-4 pb-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Applications</h3>
          <Button onClick={addApp} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add App
          </Button>
        </div>
        {content.apps.map((app, appIndex) => (
          <div key={appIndex} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">App {appIndex + 1}</h4>
              <Button onClick={() => removeApp(appIndex)} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={app.title}
                onChange={(e) => updateApp(appIndex, 'title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={app.description}
                onChange={(e) => updateApp(appIndex, 'description', e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input
                  value={app.platform}
                  onChange={(e) => updateApp(appIndex, 'platform', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input
                  value={app.status}
                  onChange={(e) => updateApp(appIndex, 'status', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Download Link</Label>
              <Input
                value={app.downloadLink}
                onChange={(e) => updateApp(appIndex, 'downloadLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <Button onClick={() => addFeatureToApp(appIndex)} size="sm" variant="ghost">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              {app.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateAppFeature(appIndex, featureIndex, e.target.value)}
                  />
                  <Button
                    onClick={() => removeFeatureFromApp(appIndex, featureIndex)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">CTA Section</h3>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.cta.title}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.cta.description}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={content.cta.buttonText}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input
            value={content.cta.buttonLink}
            onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonLink: e.target.value } })}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button onClick={onClose} variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}
