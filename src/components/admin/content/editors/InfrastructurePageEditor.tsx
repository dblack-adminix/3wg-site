import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface InfrastructureContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  tierSection: {
    badge: string;
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  hardwareLink: {
    title: string;
    description: string;
    buttonText: string;
  };
}

interface InfrastructurePageEditorProps {
  onClose: () => void;
}

export function InfrastructurePageEditor({ onClose }: InfrastructurePageEditorProps) {
  const [content, setContent] = useState<InfrastructureContent>({
    hero: {
      badge: 'NETWORK_MONITORING',
      title: 'Инфраструктура',
      subtitle: '3WG',
      description: 'Глобальная сеть высокопроизводительных узлов с круглосуточным мониторингом',
    },
    tierSection: {
      badge: 'Дата-центр',
      title: 'Инфраструктура',
      subtitle: 'Tier III.',
      description1: 'Бесперебойное питание, охрана 24/7 и каналы связи с резервированием.',
      description2: 'Размещайте проекты там, где о них заботятся.',
    },
    stats: [
      { label: 'UPTIME SLA', value: '99.98%' },
      { label: 'ACTIVE NODES', value: '6' },
      { label: 'AVG LATENCY', value: '52ms' },
      { label: 'BANDWIDTH', value: '100Gbps' },
    ],
    hardwareLink: {
      title: 'Кастомное железо NODE-1',
      description: 'Все узлы работают на идентичной архитектуре — ARM64/x86 гибрид с аппаратным шифрованием',
      buttonText: 'Подробнее о NODE-1',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<InfrastructureContent>('/settings/blocks/infrastructure_page');
        console.log('Infrastructure page data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          setContent({
            hero: data.hero || content.hero,
            tierSection: data.tierSection || content.tierSection,
            stats: data.stats || content.stats,
            hardwareLink: data.hardwareLink || content.hardwareLink,
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
      await api.request('/admin/settings/blocks/infrastructure_page', {
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

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
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

      {/* Tier III Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Tier III Section</h3>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={content.tierSection.badge}
            onChange={(e) => setContent({ ...content, tierSection: { ...content.tierSection, badge: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.tierSection.title}
            onChange={(e) => setContent({ ...content, tierSection: { ...content.tierSection, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle (highlighted)</Label>
          <Input
            value={content.tierSection.subtitle}
            onChange={(e) => setContent({ ...content, tierSection: { ...content.tierSection, subtitle: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description 1</Label>
          <Textarea
            value={content.tierSection.description1}
            onChange={(e) => setContent({ ...content, tierSection: { ...content.tierSection, description1: e.target.value } })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Description 2 (highlighted)</Label>
          <Textarea
            value={content.tierSection.description2}
            onChange={(e) => setContent({ ...content, tierSection: { ...content.tierSection, description2: e.target.value } })}
            rows={2}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Statistics (4 items)</h3>
        {content.stats.map((stat, index) => (
          <div key={index} className="grid grid-cols-2 gap-2 p-3 border rounded">
            <div className="space-y-2">
              <Label>Label {index + 1}</Label>
              <Input
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="UPTIME SLA"
              />
            </div>
            <div className="space-y-2">
              <Label>Value {index + 1}</Label>
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                placeholder="99.98%"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Link Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Hardware Link Section</h3>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.hardwareLink.title}
            onChange={(e) => setContent({ ...content, hardwareLink: { ...content.hardwareLink, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.hardwareLink.description}
            onChange={(e) => setContent({ ...content, hardwareLink: { ...content.hardwareLink, description: e.target.value } })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={content.hardwareLink.buttonText}
            onChange={(e) => setContent({ ...content, hardwareLink: { ...content.hardwareLink, buttonText: e.target.value } })}
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
