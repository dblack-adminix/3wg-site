import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Feature {
  title: string;
  subtitle: string;
  description: string;
}

interface NodeAdvantage {
  title: string;
  description: string;
}

interface ComparisonRow {
  feature: string;
  wireguard: string;
  amnezia: string;
}

interface AmneziaWGContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    subtitleHighlight: string;
    description: string;
  };
  problem: {
    badge: string;
    title: string;
    description: string;
    solution: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    description: string;
    features: Feature[];
  };
  nodeAdvantages: {
    title: string;
    titleHighlight: string;
    description: string;
    advantages: NodeAdvantage[];
  };
  comparison: {
    title: string;
    rows: ComparisonRow[];
  };
  cta: {
    title: string;
    subtitle: string;
    subtitleHighlight: string;
    button1Text: string;
    button2Text: string;
  };
}

interface AmneziaWGPageEditorProps {
  onClose: () => void;
}

export function AmneziaWGPageEditor({ onClose }: AmneziaWGPageEditorProps) {
  const [content, setContent] = useState<AmneziaWGContent>({
    hero: {
      badge: 'STEALTH_PROTOCOL',
      title: 'Amnezia',
      titleHighlight: 'WG',
      subtitle: 'Невидимый щит',
      subtitleHighlight: '3WG.RU',
      description: 'Протокол, который невозможно заблокировать',
    },
    problem: {
      badge: 'ПРОБЛЕМА',
      title: 'Почему стандартные VPN больше не работают?',
      description: 'Обычные протоколы (WireGuard, OpenVPN) имеют характерный "цифровой почерк". Современные системы анализа трафика (DPI) легко распознают их и блокируют за миллисекунды.',
      solution: 'AmneziaWG — это эволюция WireGuard, созданная для того, чтобы ваш трафик выглядел как обычный шум или безобидный веб-серфинг.',
    },
    howItWorks: {
      badge: 'amzwg.ru',
      title: 'Как это работает в 3WG?',
      description: 'Технология AmneziaWG модифицирует заголовки пакетов WireGuard, лишая их узнаваемых признаков. В нашей инфраструктуре мы довели эту технологию до абсолюта.',
      features: [
        {
          title: 'Маскировка параметров',
          subtitle: 'Junk Data',
          description: 'Мы добавляем случайные байты в начало пакетов (Init Packet). Для цензора это выглядит как хаотичный набор данных, который невозможно классифицировать.',
        },
        {
          title: 'Изменение размеров',
          subtitle: 'Packet Resizing',
          description: 'Стандартные пакеты VPN имеют фиксированный размер. AmneziaWG динамически меняет их длину, имитируя передачу обычного HTTPS-трафика.',
        },
        {
          title: 'Бесшумное рукопожатие',
          subtitle: 'Silent Handshake',
          description: 'Процесс "рукопожатия" происходит бесшумно и не вызывает подозрений у систем мониторинга провайдера.',
        },
      ],
    },
    nodeAdvantages: {
      title: 'Преимущества для пользователя',
      titleHighlight: 'NODE-1',
      description: 'Использование AmneziaWG на нашем роутере 3WG NODE-1',
      advantages: [
        {
          title: 'Работа в "белых списках"',
          description: 'Даже если в вашей сети разрешен только ограниченный список сайтов, AmneziaWG найдет лазейку.',
        },
        {
          title: 'Минимальный пинг',
          description: 'В отличие от тяжелых протоколов маскировки, AmneziaWG работает на уровне ядра (Kernel-space), сохраняя скорость.',
        },
        {
          title: 'Автоматизация',
          description: 'Вам не нужно знать порты и ключи. Прошивка сама выбирает оптимальные параметры маскировки.',
        },
      ],
    },
    comparison: {
      title: 'Сравнение протоколов',
      rows: [
        { feature: 'Скорость', wireguard: 'До 1 Гбит/с', amnezia: 'До 800 Мбит/с' },
        { feature: 'Маскировка', wireguard: 'Базовая', amnezia: 'Ультра (Anti-DPI)' },
        { feature: 'Назначение', wireguard: 'Игры, 4K, Стриминг', amnezia: 'Обход жестких блокировок' },
        { feature: 'Расход батареи', wireguard: 'Минимальный', amnezia: 'Минимальный' },
      ],
    },
    cta: {
      title: 'Попробуйте AmneziaWG в действии',
      subtitle: 'с роутером',
      subtitleHighlight: 'NODE-1',
      button1Text: 'Купить Hardware',
      button2Text: 'Смотреть тарифы',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<AmneziaWGContent>('/settings/blocks/amneziawg_page');
        console.log('AmneziaWG page data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          setContent({
            hero: data.hero || content.hero,
            problem: data.problem || content.problem,
            howItWorks: data.howItWorks || content.howItWorks,
            nodeAdvantages: data.nodeAdvantages || content.nodeAdvantages,
            comparison: data.comparison || content.comparison,
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
      await api.request('/admin/settings/blocks/amneziawg_page', {
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
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Title Highlight (orange)</Label>
            <Input
              value={content.hero.titleHighlight}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleHighlight: e.target.value } })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle Highlight (yellow)</Label>
            <Input
              value={content.hero.subtitleHighlight}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitleHighlight: e.target.value } })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={content.hero.description}
            onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
          />
        </div>
      </div>

      {/* Problem Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Problem Section</h3>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={content.problem.badge}
            onChange={(e) => setContent({ ...content, problem: { ...content.problem, badge: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.problem.title}
            onChange={(e) => setContent({ ...content, problem: { ...content.problem, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.problem.description}
            onChange={(e) => setContent({ ...content, problem: { ...content.problem, description: e.target.value } })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Solution</Label>
          <Textarea
            value={content.problem.solution}
            onChange={(e) => setContent({ ...content, problem: { ...content.problem, solution: e.target.value } })}
            rows={2}
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">How It Works</h3>
        <div className="space-y-2">
          <Label>Badge</Label>
          <Input
            value={content.howItWorks.badge}
            onChange={(e) => setContent({ ...content, howItWorks: { ...content.howItWorks, badge: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.howItWorks.title}
            onChange={(e) => setContent({ ...content, howItWorks: { ...content.howItWorks, title: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.howItWorks.description}
            onChange={(e) => setContent({ ...content, howItWorks: { ...content.howItWorks, description: e.target.value } })}
            rows={3}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Features (3)</Label>
          {content.howItWorks.features.map((feature, index) => (
            <div key={index} className="p-3 border rounded bg-muted/30 space-y-2">
              <Label className="text-xs">Feature {index + 1}</Label>
              <Input
                placeholder="Title"
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...content.howItWorks.features];
                  newFeatures[index].title = e.target.value;
                  setContent({ ...content, howItWorks: { ...content.howItWorks, features: newFeatures } });
                }}
              />
              <Input
                placeholder="Subtitle"
                value={feature.subtitle}
                onChange={(e) => {
                  const newFeatures = [...content.howItWorks.features];
                  newFeatures[index].subtitle = e.target.value;
                  setContent({ ...content, howItWorks: { ...content.howItWorks, features: newFeatures } });
                }}
              />
              <Textarea
                placeholder="Description"
                value={feature.description}
                onChange={(e) => {
                  const newFeatures = [...content.howItWorks.features];
                  newFeatures[index].description = e.target.value;
                  setContent({ ...content, howItWorks: { ...content.howItWorks, features: newFeatures } });
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* NODE Advantages */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">NODE-1 Advantages</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.nodeAdvantages.title}
              onChange={(e) => setContent({ ...content, nodeAdvantages: { ...content.nodeAdvantages, title: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Title Highlight (yellow)</Label>
            <Input
              value={content.nodeAdvantages.titleHighlight}
              onChange={(e) => setContent({ ...content, nodeAdvantages: { ...content.nodeAdvantages, titleHighlight: e.target.value } })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={content.nodeAdvantages.description}
            onChange={(e) => setContent({ ...content, nodeAdvantages: { ...content.nodeAdvantages, description: e.target.value } })}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Advantages (3)</Label>
          {content.nodeAdvantages.advantages.map((adv, index) => (
            <div key={index} className="p-3 border rounded bg-muted/30 space-y-2">
              <Label className="text-xs">Advantage {index + 1}</Label>
              <Input
                placeholder="Title"
                value={adv.title}
                onChange={(e) => {
                  const newAdvantages = [...content.nodeAdvantages.advantages];
                  newAdvantages[index].title = e.target.value;
                  setContent({ ...content, nodeAdvantages: { ...content.nodeAdvantages, advantages: newAdvantages } });
                }}
              />
              <Textarea
                placeholder="Description"
                value={adv.description}
                onChange={(e) => {
                  const newAdvantages = [...content.nodeAdvantages.advantages];
                  newAdvantages[index].description = e.target.value;
                  setContent({ ...content, nodeAdvantages: { ...content.nodeAdvantages, advantages: newAdvantages } });
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Comparison Table</h3>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.comparison.title}
            onChange={(e) => setContent({ ...content, comparison: { ...content.comparison, title: e.target.value } })}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Rows (4)</Label>
          {content.comparison.rows.map((row, index) => (
            <div key={index} className="p-3 border rounded bg-muted/30 space-y-2">
              <Label className="text-xs">Row {index + 1}</Label>
              <Input
                placeholder="Feature"
                value={row.feature}
                onChange={(e) => {
                  const newRows = [...content.comparison.rows];
                  newRows[index].feature = e.target.value;
                  setContent({ ...content, comparison: { ...content.comparison, rows: newRows } });
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="WireGuard"
                  value={row.wireguard}
                  onChange={(e) => {
                    const newRows = [...content.comparison.rows];
                    newRows[index].wireguard = e.target.value;
                    setContent({ ...content, comparison: { ...content.comparison, rows: newRows } });
                  }}
                />
                <Input
                  placeholder="AmneziaWG"
                  value={row.amnezia}
                  onChange={(e) => {
                    const newRows = [...content.comparison.rows];
                    newRows[index].amnezia = e.target.value;
                    setContent({ ...content, comparison: { ...content.comparison, rows: newRows } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
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
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.cta.subtitle}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, subtitle: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle Highlight (yellow)</Label>
            <Input
              value={content.cta.subtitleHighlight}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, subtitleHighlight: e.target.value } })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Button 1 Text</Label>
            <Input
              value={content.cta.button1Text}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, button1Text: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Button 2 Text</Label>
            <Input
              value={content.cta.button2Text}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, button2Text: e.target.value } })}
            />
          </div>
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
