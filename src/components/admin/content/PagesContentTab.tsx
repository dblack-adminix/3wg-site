import { useState, useEffect } from 'react';
import { FileText, ChevronRight, Edit, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Node1HeroEditor } from './editors/Node1HeroEditor';
import { Node1KeeneticEditor } from './editors/Node1KeeneticEditor';
import { Node1CtaEditor } from './editors/Node1CtaEditor';
import { Node1FeaturesEditor } from './editors/Node1FeaturesEditor';
import { Node1PerformanceEditor } from './editors/Node1PerformanceEditor';
import { Node1CommandEditor } from './editors/Node1CommandEditor';
import { SoftwarePageEditor } from './editors/SoftwarePageEditor';
import { InfrastructurePageEditor } from './editors/InfrastructurePageEditor';
import { FAQPageEditor } from './editors/FAQPageEditor';
import { AmneziaWGPageEditor } from './editors/AmneziaWGPageEditor';
import { HardwarePageEditor } from './editors/HardwarePageEditor';
import { PricingPageEditor } from './editors/PricingPageEditor';
import { api } from '@/lib/api';
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

interface PageInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  status: 'ready' | 'in-progress' | 'planned';
}

interface BlockInfo {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  editorAvailable: boolean;
}

const pages: PageInfo[] = [
  {
    id: 'node1',
    name: 'NODE-1',
    path: '/node-1',
    description: 'Страница продукта NODE-1 (роутер с VPN)',
    status: 'in-progress',
  },
  {
    id: 'pricing',
    name: 'Тарифы',
    path: '/pricing',
    description: 'Страница с тарифными планами',
    status: 'planned',
  },
  {
    id: 'hardware',
    name: 'Оборудование',
    path: '/hardware',
    description: 'Страница с информацией об оборудовании',
    status: 'planned',
  },
  {
    id: 'infrastructure',
    name: 'Инфраструктура',
    path: '/infrastructure',
    description: 'Страница о дата-центре',
    status: 'in-progress',
  },
  {
    id: 'software',
    name: 'Софт',
    path: '/software',
    description: 'Страница с программным обеспечением',
    status: 'in-progress',
  },
  {
    id: 'faq',
    name: 'FAQ',
    path: '/faq',
    description: 'Страница с часто задаваемыми вопросами',
    status: 'ready',
  },
  {
    id: 'amneziawg',
    name: 'AmneziaWG',
    path: '/amneziawg',
    description: 'Страница о протоколе AmneziaWG',
    status: 'in-progress',
  },
];

const node1Blocks: BlockInfo[] = [
  {
    id: 'node1-hero',
    name: 'Hero Section',
    description: 'Главный экран с заголовком и описанием',
    visible: true,
    editorAvailable: true,
  },
  {
    id: 'node1-keenetic',
    name: 'Keenetic Firmware Section',
    description: 'Секция с прошивкой для Keenetic',
    visible: true,
    editorAvailable: true,
  },
  {
    id: 'node1-performance',
    name: 'Performance Section',
    description: 'Секция с производительностью (чип)',
    visible: true,
    editorAvailable: true,
  },
  {
    id: 'node1-command',
    name: 'Command Center Section',
    description: 'Командный центр с визуализацией',
    visible: true,
    editorAvailable: true,
  },
  {
    id: 'node1-features',
    name: 'Firmware Features Section',
    description: 'Особенности прошивки',
    visible: true,
    editorAvailable: true,
  },
  {
    id: 'node1-cta',
    name: 'CTA Section',
    description: 'Призыв к действию',
    visible: true,
    editorAvailable: true,
  },
];

interface SortableBlockItemProps {
  block: BlockInfo;
  onToggleVisibility: (id: string) => void;
  onEdit: (id: string) => void;
}

function SortableBlockItem({ block, onToggleVisibility, onEdit }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-2 rounded hover:bg-accent/10 transition-colors cursor-grab active:cursor-grabbing"
        title="Перетащить для изменения порядка"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggleVisibility(block.id)}
        className="p-2 rounded hover:bg-accent/10 transition-colors"
        title={block.visible ? 'Скрыть блок' : 'Показать блок'}
      >
        {block.visible ? (
          <Eye className="w-4 h-4 text-primary" />
        ) : (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Block Info */}
      <div className="flex-1">
        <h4 className="font-semibold font-mono text-sm mb-1">
          {block.name}
        </h4>
        <p className="text-xs text-muted-foreground">
          {block.description}
        </p>
      </div>

      {/* Edit Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(block.id)}
        disabled={!block.editorAvailable}
        className="gap-2"
      >
        <Edit className="w-4 h-4" />
        {block.editorAvailable ? 'Редактировать' : 'Скоро'}
      </Button>
    </div>
  );
}

export function PagesContentTab() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BlockInfo[]>(node1Blocks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load block visibility settings
  useEffect(() => {
    const loadVisibility = async () => {
      try {
        const visibility = await api.request<Record<string, boolean>>('/settings/blocks/node1_visibility');
        
        // Load order
        let order: string[] = [];
        try {
          const orderData = await api.request<{ order: string[] }>('/settings/blocks/node1_order');
          order = orderData.order || [];
        } catch (e) {
          // Order not set yet, use default
        }

        // Apply visibility and order
        let updatedBlocks = blocks.map(block => ({
          ...block,
          visible: visibility[block.id] !== undefined ? visibility[block.id] : block.visible,
        }));

        // Sort by order if available
        if (order.length > 0) {
          updatedBlocks = updatedBlocks.sort((a, b) => {
            const indexA = order.indexOf(a.id);
            const indexB = order.indexOf(b.id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
        }

        setBlocks(updatedBlocks);
      } catch (error) {
        console.error('Failed to load block visibility:', error);
      }
    };
    loadVisibility();
  }, []);

  const openEditor = (editorId: string) => {
    setCurrentEditor(editorId);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setCurrentEditor(null);
  };

  const toggleBlockVisibility = async (blockId: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, visible: !block.visible } : block
    );
    setBlocks(updatedBlocks);

    // Save to backend
    try {
      const blockVisibility = updatedBlocks.reduce((acc, block) => {
        acc[block.id] = block.visible;
        return acc;
      }, {} as Record<string, boolean>);

      await api.request('/admin/settings/blocks/node1_visibility', {
        method: 'PUT',
        body: JSON.stringify(blockVisibility),
      });
    } catch (error) {
      console.error('Failed to save block visibility:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);

      // Save order to backend
      try {
        const blockOrder = newBlocks.map(block => block.id);
        await api.request('/admin/settings/blocks/node1_order', {
          method: 'PUT',
          body: JSON.stringify({ order: blockOrder }),
        });
      } catch (error) {
        console.error('Failed to save block order:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-mono">Управление страницами</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Редактирование контента отдельных страниц сайта
        </p>
      </div>

      {/* Pages List */}
      <div className="grid md:grid-cols-2 gap-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`p-6 rounded-lg border transition-all cursor-pointer ${
              selectedPage === page.id
                ? 'bg-card border-primary/50'
                : 'bg-background border-border hover:border-border/50'
            }`}
            onClick={() => setSelectedPage(page.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold font-mono text-lg mb-1">{page.name}</h3>
                <p className="text-sm text-muted-foreground font-mono mb-2">
                  {page.path}
                </p>
                <p className="text-sm text-muted-foreground">
                  {page.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mt-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  page.status === 'ready'
                    ? 'bg-green-500'
                    : page.status === 'in-progress'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
              />
              <span className="text-xs font-mono text-muted-foreground">
                {page.status === 'ready'
                  ? 'Готово'
                  : page.status === 'in-progress'
                  ? 'В разработке'
                  : 'Запланировано'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Blocks for Selected Page */}
      {selectedPage === 'node1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-mono">Блоки страницы NODE-1</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {blocks.filter(b => b.visible).length} из {blocks.length} видимых
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    onToggleVisibility={toggleBlockVisibility}
                    onEdit={openEditor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {selectedPage && selectedPage !== 'node1' && selectedPage !== 'software' && selectedPage !== 'infrastructure' && selectedPage !== 'faq' && selectedPage !== 'amneziawg' && selectedPage !== 'hardware' && selectedPage !== 'pricing' && (
        <div className="p-6 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-bold font-mono mb-2">
            {pages.find((p) => p.id === selectedPage)?.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Редактор для этой страницы будет добавлен в следующих версиях.
          </p>
          <Button variant="outline" disabled>
            Редактировать страницу
          </Button>
        </div>
      )}

      {selectedPage === 'software' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница Software</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление контентом страницы с программным обеспечением
                </p>
              </div>
              <Button onClick={() => openEditor('software-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'infrastructure' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница Infrastructure</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление контентом страницы инфраструктуры
                </p>
              </div>
              <Button onClick={() => openEditor('infrastructure-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'faq' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница FAQ</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление вопросами и ответами
                </p>
              </div>
              <Button onClick={() => openEditor('faq-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'hardware' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница Оборудование</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление контентом страницы с оборудованием NODE-1
                </p>
              </div>
              <Button onClick={() => openEditor('hardware-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'amneziawg' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница AmneziaWG</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление контентом страницы протокола AmneziaWG
                </p>
              </div>
              <Button onClick={() => openEditor('amneziawg-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'pricing' && (
        <div className="space-y-4">
          <div className="p-6 bg-card rounded-lg border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-mono mb-2">Страница Тарифы</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Управление тарифными планами и ценами
                </p>
              </div>
              <Button onClick={() => openEditor('pricing-page')} className="gap-2">
                <Edit className="w-4 h-4" />
                Редактировать контент
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono">Редактор контента</DialogTitle>
            <DialogDescription className="font-mono text-sm">
              Редактирование контента блока страницы
            </DialogDescription>
          </DialogHeader>
          
          {currentEditor === 'node1-hero' && (
            <Node1HeroEditor
              onClose={closeEditor}
              initialContent={{
                badge: 'Production Ready',
                title: 'NODE-1:',
                subtitle: 'Железо, которое не сдается.',
                description: 'Ваш личный шлюз в цифровую свободу. Производство 3WG.RU.',
                features: [
                  'OEM-платформа: Проверенная база, доработанная 3WG.',
                  'Кастомная прошивка: Управление каждым пакетом на уровне ядра.',
                  'Интегрированный AmneziaWG: Маскировка трафика по умолчанию.',
                ],
              }}
            />
          )}

          {currentEditor === 'node1-keenetic' && (
            <Node1KeeneticEditor
              onClose={closeEditor}
              initialContent={{
                badge: 'KEENETIC_FIRMWARE',
                title: 'Прошивка для Keenetic',
                subtitle: 'Превратите ваш роутер в защищённый узел с AmneziaWG',
                sectionTitle: 'Полная интеграция с AmneziaWG',
                sectionDescription: 'Кастомная прошивка добавляет нативную поддержку AmneziaWG с возможностью переключения протоколов на лету.',
                features: [
                  { title: 'Простая установка', desc: 'Один клик — роутер готов' },
                  { title: 'Встроенная защита', desc: 'Kill Switch из коробки' },
                  { title: 'Производительность', desc: 'Оптимизация под ARM' },
                  { title: 'Web-интерфейс', desc: 'Управление через браузер' },
                ],
                buttonText: 'Скачать прошивку',
                buttonLink: '',
                supportedModels: 'Keenetic Giga / Ultra / Viva / Speedster',
              }}
            />
          )}

          {currentEditor === 'node1-cta' && (
            <Node1CtaEditor
              onClose={closeEditor}
              initialContent={{
                title: 'Готовы к цифровой свободе?',
                description: 'Доступно ограниченное количество устройств. Обеспечьте свой суверенитет сегодня.',
                buttonText: 'Заказать NODE-1',
                buttonLink: '/pricing',
              }}
            />
          )}

          {currentEditor === 'node1-features' && (
            <Node1FeaturesEditor
              onClose={closeEditor}
              initialContent={{
                title: 'Возможности прошивки',
                features: [
                  { title: 'Мгновенное переключение', description: 'WireGuard для скорости, AmneziaWG для маскировки.' },
                  { title: 'Kill Switch', description: 'Защита от утечек при обрыве соединения.' },
                  { title: 'Мониторинг трафика', description: 'Всегда знайте, что происходит в вашей сети.' },
                  { title: 'Автоматические обновления', description: 'Мы позаботились о защите.' },
                ],
              }}
            />
          )}

          {currentEditor === 'node1-performance' && (
            <Node1PerformanceEditor onClose={closeEditor} />
          )}

          {currentEditor === 'node1-command' && (
            <Node1CommandEditor onClose={closeEditor} />
          )}

          {currentEditor === 'software-page' && (
            <SoftwarePageEditor onClose={closeEditor} />
          )}

          {currentEditor === 'infrastructure-page' && (
            <InfrastructurePageEditor onClose={closeEditor} />
          )}

          {currentEditor === 'faq-page' && (
            <FAQPageEditor onClose={closeEditor} />
          )}

          {currentEditor === 'hardware-page' && (
            <HardwarePageEditor onClose={closeEditor} />
          )}

          {currentEditor === 'amneziawg-page' && (
            <AmneziaWGPageEditor onClose={closeEditor} />
          )}

          {currentEditor === 'pricing-page' && (
            <PricingPageEditor onClose={closeEditor} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
