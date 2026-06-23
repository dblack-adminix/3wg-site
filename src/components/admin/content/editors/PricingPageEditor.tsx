import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  icon: string;
  color: string;
  badge?: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  highlighted?: boolean;
}

interface CryptoPayment {
  id: string;
  name: string;
  symbol: string;
  color: string;
}

interface PricingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  tiers: PricingTier[];
  crypto: {
    title: string;
    subtitle: string;
    badge: string;
    payments: CryptoPayment[];
  };
  footer: {
    note: string;
  };
}

interface PricingPageEditorProps {
  onClose: () => void;
}

function SortableItem({ 
  id, 
  children 
}: { 
  id: string; 
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 hover:bg-accent/10 rounded z-10"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export function PricingPageEditor({ onClose }: PricingPageEditorProps) {
  const [content, setContent] = useState<PricingContent>({
    hero: {
      badge: 'ACCESS_CONTROL',
      title: 'ВЫБЕРИТЕ УРОВЕНЬ СУВЕРЕНИТЕТА',
      subtitle: 'Доступ к узлам 3WG.RU. Никаких логов. Никаких следов.',
    },
    tiers: [
      {
        id: '1',
        name: 'LITE',
        description: 'Базовый доступ',
        price: '9$',
        period: '/ mo',
        icon: 'Shield',
        color: 'muted',
        features: ['WireGuard Protocol', 'Standard Speed', '1 Device', 'Location: Netherlands'],
        buttonText: 'SELECT_TIER',
        highlighted: false,
      },
      {
        id: '2',
        name: 'PRO',
        description: 'Оптимальный выбор',
        price: '19$',
        period: '/ mo',
        icon: 'Zap',
        color: 'primary',
        badge: 'OPTIMAL_CHOICE',
        features: ['WireGuard + AmneziaWG', 'High Speed (1Gbps)', '5 Devices', 'All Locations', 'Priority Support'],
        buttonText: 'SELECT_TIER',
        highlighted: true,
      },
      {
        id: '3',
        name: 'SOVEREIGN',
        description: 'Железо + Сеть',
        price: '99$',
        period: '+ Shipping',
        icon: 'Server',
        color: 'accent',
        badge: 'HARDWARE_BUNDLE',
        features: ['NODE-1 Hardware Included', 'Lifetime Firmware Updates', 'Personal Node Setup', 'Private Domain Access'],
        buttonText: 'CONFIGURE_NODE',
        buttonLink: '/hardware',
        highlighted: false,
      },
    ],
    crypto: {
      title: 'Anonymous Settlement',
      subtitle: 'PAYMENT_METHOD: CRYPTO_ONLY',
      badge: 'PAYMENT_METHOD: CRYPTO_ONLY',
      payments: [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', color: '#F7931A' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
        { id: '3', name: 'USDT', symbol: 'USDT', color: '#26A17B' },
        { id: '4', name: 'Monero', symbol: 'XMR', color: '#FF6600' },
        { id: '5', name: 'Litecoin', symbol: 'LTC', color: '#BFBBBB' },
      ],
    },
    footer: {
      note: '*Мы не запрашиваем вашу почту или имя. Только хэш транзакции. Только приватность.',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<PricingContent>('/settings/pages/pricing');
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/pages/pricing', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен');
      onClose();
    } catch (error) {
      console.error('Failed to save content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTier = (id: string, field: keyof PricingTier, value: any) => {
    setContent({
      ...content,
      tiers: content.tiers.map(t => t.id === id ? { ...t, [field]: value } : t),
    });
  };

  const addFeature = (tierId: string) => {
    setContent({
      ...content,
      tiers: content.tiers.map(t => 
        t.id === tierId ? { ...t, features: [...t.features, 'Новая функция'] } : t
      ),
    });
  };

  const removeFeature = (tierId: string, index: number) => {
    setContent({
      ...content,
      tiers: content.tiers.map(t => 
        t.id === tierId ? { ...t, features: t.features.filter((_, i) => i !== index) } : t
      ),
    });
  };

  const updateFeature = (tierId: string, index: number, value: string) => {
    setContent({
      ...content,
      tiers: content.tiers.map(t => 
        t.id === tierId ? { 
          ...t, 
          features: t.features.map((f, i) => i === index ? value : f) 
        } : t
      ),
    });
  };

  const addCrypto = () => {
    const newCrypto: CryptoPayment = {
      id: Date.now().toString(),
      name: 'New Crypto',
      symbol: 'XXX',
      color: '#FFFFFF',
    };
    setContent({
      ...content,
      crypto: {
        ...content.crypto,
        payments: [...content.crypto.payments, newCrypto],
      },
    });
  };

  const removeCrypto = (id: string) => {
    setContent({
      ...content,
      crypto: {
        ...content.crypto,
        payments: content.crypto.payments.filter(c => c.id !== id),
      },
    });
  };

  const updateCrypto = (id: string, field: keyof CryptoPayment, value: string) => {
    setContent({
      ...content,
      crypto: {
        ...content.crypto,
        payments: content.crypto.payments.map(c => c.id === id ? { ...c, [field]: value } : c),
      },
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = content.tiers.findIndex(t => t.id === active.id);
    const newIndex = content.tiers.findIndex(t => t.id === over.id);

    setContent({
      ...content,
      tiers: arrayMove(content.tiers, oldIndex, newIndex),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono">Hero секция</h3>
        
        <div className="space-y-3">
          <div>
            <Label>Badge</Label>
            <Input
              value={content.hero.badge}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
            />
          </div>

          <div>
            <Label>Заголовок</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
            />
          </div>

          <div>
            <Label>Подзаголовок</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
            />
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono">Тарифы</h3>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={content.tiers.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {content.tiers.map((tier) => (
                <SortableItem key={tier.id} id={tier.id}>
                  <div className="p-4 pl-10 rounded-lg border border-border bg-card space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Название</Label>
                        <Input
                          value={tier.name}
                          onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Описание</Label>
                        <Input
                          value={tier.description}
                          onChange={(e) => updateTier(tier.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Цена</Label>
                        <Input
                          value={tier.price}
                          onChange={(e) => updateTier(tier.id, 'price', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Период</Label>
                        <Input
                          value={tier.period}
                          onChange={(e) => updateTier(tier.id, 'period', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Иконка</Label>
                        <Input
                          value={tier.icon}
                          onChange={(e) => updateTier(tier.id, 'icon', e.target.value)}
                          placeholder="Shield"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Badge (опционально)</Label>
                        <Input
                          value={tier.badge || ''}
                          onChange={(e) => updateTier(tier.id, 'badge', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Цвет</Label>
                        <select
                          value={tier.color}
                          onChange={(e) => updateTier(tier.id, 'color', e.target.value)}
                          className="w-full px-3 py-2 rounded border border-border bg-background"
                        >
                          <option value="muted">Muted (серый)</option>
                          <option value="primary">Primary (зеленый)</option>
                          <option value="accent">Accent (оранжевый)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">Функции</Label>
                        <Button
                          onClick={() => addFeature(tier.id)}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Добавить
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(tier.id, idx, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={() => removeFeature(tier.id, idx)}
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Текст кнопки</Label>
                        <Input
                          value={tier.buttonText}
                          onChange={(e) => updateTier(tier.id, 'buttonText', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ссылка (опционально)</Label>
                        <Input
                          value={tier.buttonLink || ''}
                          onChange={(e) => updateTier(tier.id, 'buttonLink', e.target.value)}
                          placeholder="/hardware"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tier.highlighted || false}
                        onChange={(e) => updateTier(tier.id, 'highlighted', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label className="text-xs">Выделить (рекомендуемый)</Label>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Crypto Payments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono">Криптовалюты</h3>
          <Button onClick={addCrypto} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <Label>Заголовок</Label>
            <Input
              value={content.crypto.title}
              onChange={(e) => setContent({ ...content, crypto: { ...content.crypto, title: e.target.value } })}
            />
          </div>

          <div>
            <Label>Badge</Label>
            <Input
              value={content.crypto.badge}
              onChange={(e) => setContent({ ...content, crypto: { ...content.crypto, badge: e.target.value } })}
            />
          </div>
        </div>

        <div className="space-y-2">
          {content.crypto.payments.map((crypto) => (
            <div key={crypto.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
              <Input
                value={crypto.name}
                onChange={(e) => updateCrypto(crypto.id, 'name', e.target.value)}
                placeholder="Bitcoin"
                className="flex-1"
              />
              <Input
                value={crypto.symbol}
                onChange={(e) => updateCrypto(crypto.id, 'symbol', e.target.value)}
                placeholder="BTC"
                className="w-24"
              />
              <Input
                type="color"
                value={crypto.color}
                onChange={(e) => updateCrypto(crypto.id, 'color', e.target.value)}
                className="w-16 h-10"
              />
              <Button
                onClick={() => removeCrypto(crypto.id)}
                size="sm"
                variant="ghost"
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono">Footer</h3>
        
        <div>
          <Label>Примечание</Label>
          <Textarea
            value={content.footer.note}
            onChange={(e) => setContent({ ...content, footer: { note: e.target.value } })}
            rows={2}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button onClick={onClose} variant="outline">
          Отмена
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
}
