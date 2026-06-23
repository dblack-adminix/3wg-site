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

interface Spec {
  id: string;
  label: string;
  value: string;
}

interface Step {
  id: string;
  step: string;
  title: string;
  description: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HardwareContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  features: Feature[];
  specs: Spec[];
  steps: Step[];
  pricing: {
    price: string;
    period: string;
    note: string;
    buttonText: string;
  };
}

interface HardwarePageEditorProps {
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
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-1 hover:bg-accent/10 rounded"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export function HardwarePageEditor({ onClose }: HardwarePageEditorProps) {
  const [content, setContent] = useState<HardwareContent>({
    hero: {
      badge: 'HARDWARE_SOLUTION',
      title: '3WG NODE-1',
      subtitle: 'Готовый роутер с VPN из коробки',
      description: 'Промышленный маршрутизатор в металлическом корпусе. Никакого пластика. Только надежность, пассивное охлаждение и встроенный Kill Switch.',
    },
    features: [
      { id: '1', title: 'Plug & Play', description: 'Включил и работает', icon: 'Package', color: 'primary' },
      { id: '2', title: 'Hardware Crypto', description: 'Аппаратное шифрование AmneziaWG/WireGuard', icon: 'Shield', color: 'accent' },
      { id: '3', title: 'Gigabit Ports', description: 'Скорость до 1000 Мбит/с', icon: 'Zap', color: 'red' },
      { id: '4', title: 'Admin Console', description: 'Управление через Telegram Mini App', icon: 'Settings', color: 'purple' },
    ],
    specs: [
      { id: '1', label: 'CPU', value: 'ARM Cortex-A53 Quad-Core 1.2GHz' },
      { id: '2', label: 'RAM', value: '512MB DDR4' },
      { id: '3', label: 'Storage', value: '128MB NAND Flash' },
      { id: '4', label: 'Crypto', value: 'Hardware AES-256 + ChaCha20' },
      { id: '5', label: 'Ports', value: '4x Gigabit Ethernet + 1x WAN' },
      { id: '6', label: 'Wi-Fi', value: '802.11ac Dual-Band (optional)' },
    ],
    steps: [
      { id: '1', step: '01', title: 'Заказываете комплект', description: 'Оформляете заказ на нашем сайте или через Telegram-бота. Выбираете способ доставки.' },
      { id: '2', step: '02', title: 'Получаете роутер', description: 'Мы привозим уже настроенный роутер с прошитыми ключами вашего персонального сервера.' },
      { id: '3', step: '03', title: 'Включаете в розетку', description: 'Подключаете роутер к интернету и электросети. Всё работает автоматически.' },
      { id: '4', step: '04', title: 'Управляете через Telegram', description: 'Используете наш Mini App для мониторинга, перезагрузки и смены локации сервера.' },
    ],
    pricing: {
      price: '1500₽',
      period: '/мес',
      note: 'В стоимость оборудования уже включен личный сервер',
      buttonText: 'Заказать комплект',
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
      const data = await api.request<HardwareContent>('/settings/pages/hardware');
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
      await api.request('/admin/settings/pages/hardware', {
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

  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      title: 'Новая функция',
      description: 'Описание функции',
      icon: 'Package',
      color: 'primary',
    };
    setContent({ ...content, features: [...content.features, newFeature] });
  };

  const removeFeature = (id: string) => {
    setContent({ ...content, features: content.features.filter(f => f.id !== id) });
  };

  const updateFeature = (id: string, field: keyof Feature, value: string) => {
    setContent({
      ...content,
      features: content.features.map(f => f.id === id ? { ...f, [field]: value } : f),
    });
  };

  const addSpec = () => {
    const newSpec: Spec = {
      id: Date.now().toString(),
      label: 'Параметр',
      value: 'Значение',
    };
    setContent({ ...content, specs: [...content.specs, newSpec] });
  };

  const removeSpec = (id: string) => {
    setContent({ ...content, specs: content.specs.filter(s => s.id !== id) });
  };

  const updateSpec = (id: string, field: keyof Spec, value: string) => {
    setContent({
      ...content,
      specs: content.specs.map(s => s.id === id ? { ...s, [field]: value } : s),
    });
  };

  const addStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      step: `0${content.steps.length + 1}`,
      title: 'Новый шаг',
      description: 'Описание шага',
    };
    setContent({ ...content, steps: [...content.steps, newStep] });
  };

  const removeStep = (id: string) => {
    setContent({ ...content, steps: content.steps.filter(s => s.id !== id) });
  };

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setContent({
      ...content,
      steps: content.steps.map(s => s.id === id ? { ...s, [field]: value } : s),
    });
  };

  const handleDragEnd = (event: DragEndEvent, type: 'features' | 'specs' | 'steps') => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const items = content[type];
    const oldIndex = items.findIndex((item: any) => item.id === active.id);
    const newIndex = items.findIndex((item: any) => item.id === over.id);

    setContent({
      ...content,
      [type]: arrayMove(items, oldIndex, newIndex),
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
              placeholder="HARDWARE_SOLUTION"
            />
          </div>

          <div>
            <Label>Заголовок</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              placeholder="3WG NODE-1"
            />
          </div>

          <div>
            <Label>Подзаголовок</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              placeholder="Готовый роутер с VPN из коробки"
            />
          </div>

          <div>
            <Label>Описание</Label>
            <Textarea
              value={content.hero.description}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono">Функции</h3>
          <Button onClick={addFeature} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, 'features')}
        >
          <SortableContext
            items={content.features.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {content.features.map((feature) => (
                <SortableItem key={feature.id} id={feature.id}>
                  <div className="p-4 pl-10 rounded-lg border border-border bg-card space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Заголовок</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Иконка</Label>
                        <Input
                          value={feature.icon}
                          onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                          placeholder="Package"
                          size="sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Описание</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Цвет:</Label>
                        <select
                          value={feature.color}
                          onChange={(e) => updateFeature(feature.id, 'color', e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-border bg-background"
                        >
                          <option value="primary">Primary</option>
                          <option value="accent">Accent</option>
                          <option value="red">Red</option>
                          <option value="purple">Purple</option>
                        </select>
                      </div>
                      <Button
                        onClick={() => removeFeature(feature.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Specs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono">Характеристики</h3>
          <Button onClick={addSpec} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, 'specs')}
        >
          <SortableContext
            items={content.specs.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {content.specs.map((spec) => (
                <SortableItem key={spec.id} id={spec.id}>
                  <div className="flex items-center gap-3 p-3 pl-10 rounded-lg border border-border bg-card">
                    <Input
                      value={spec.label}
                      onChange={(e) => updateSpec(spec.id, 'label', e.target.value)}
                      placeholder="Параметр"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpec(spec.id, 'value', e.target.value)}
                      placeholder="Значение"
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeSpec(spec.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-mono">Как это работает</h3>
          <Button onClick={addStep} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, 'steps')}
        >
          <SortableContext
            items={content.steps.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {content.steps.map((step) => (
                <SortableItem key={step.id} id={step.id}>
                  <div className="p-4 pl-10 rounded-lg border border-border bg-card space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Номер</Label>
                        <Input
                          value={step.step}
                          onChange={(e) => updateStep(step.id, 'step', e.target.value)}
                          placeholder="01"
                          size="sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Заголовок</Label>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Описание</Label>
                      <Textarea
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeStep(step.id)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-mono">Цена</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Цена</Label>
              <Input
                value={content.pricing.price}
                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, price: e.target.value } })}
                placeholder="1500₽"
              />
            </div>
            <div>
              <Label>Период</Label>
              <Input
                value={content.pricing.period}
                onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, period: e.target.value } })}
                placeholder="/мес"
              />
            </div>
          </div>

          <div>
            <Label>Примечание</Label>
            <Input
              value={content.pricing.note}
              onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, note: e.target.value } })}
            />
          </div>

          <div>
            <Label>Текст кнопки</Label>
            <Input
              value={content.pricing.buttonText}
              onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, buttonText: e.target.value } })}
              placeholder="Заказать комплект"
            />
          </div>
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
