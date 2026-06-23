import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, Eye, EyeOff, Save, RotateCcw, GripVertical, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { HeroSectionEditor } from './editors/HeroSectionEditor';
import { KeeneticSectionEditor } from './editors/KeeneticSectionEditor';
import { VPNSectionEditor } from './editors/VPNSectionEditor';
import { PricingSectionEditor } from './editors/PricingSectionEditor';
import { ServicesSectionEditor } from './editors/ServicesSectionEditor';
import { HardwareSectionEditor } from './editors/HardwareSectionEditor';
import { InfrastructureSectionEditor } from './editors/InfrastructureSectionEditor';
import { FAQSectionEditor } from './editors/FAQSectionEditor';
import { ArticlesSectionEditor } from './editors/ArticlesSectionEditor';
import { TelegramSectionEditor } from './editors/TelegramSectionEditor';
import { StatusWidgetEditor } from './editors/StatusWidgetEditor';
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

interface HomePageSettings {
  hero_section: boolean;
  keenetic_section: boolean;
  vpn_section: boolean;
  services_section: boolean;
  pricing_section: boolean;
  hardware_section: boolean;
  infrastructure_section: boolean;
  faq_section: boolean;
  articles_section: boolean;
  telegram_section: boolean;
  status_widget: boolean;
  block_order: string[];
}

interface SectionInfo {
  key: string;
  label: string;
  description: string;
  fixed?: boolean;
}

const allSections: SectionInfo[] = [
  { key: 'hero_section', label: 'Hero секция', description: 'Главный баннер с заголовком', fixed: true },
  { key: 'keenetic_section', label: 'Keenetic прошивка', description: 'Раздел с роутером и орбитами' },
  { key: 'vpn_section', label: 'VPN секция', description: 'Информация о VPN' },
  { key: 'services_section', label: 'Услуги', description: 'Список услуг' },
  { key: 'pricing_section', label: 'Тарифы', description: 'Цены и планы' },
  { key: 'hardware_section', label: 'Оборудование', description: 'Информация об оборудовании' },
  { key: 'infrastructure_section', label: 'Инфраструктура', description: 'Наша инфраструктура' },
  { key: 'faq_section', label: 'FAQ', description: 'Часто задаваемые вопросы' },
  { key: 'articles_section', label: 'Статьи', description: 'Блог и статьи' },
  { key: 'telegram_section', label: 'Telegram', description: 'Telegram бот и канал' },
  { key: 'status_widget', label: 'Статус систем', description: 'Виджет статуса серверов' },
];

interface SortableBlockProps {
  section: SectionInfo;
  isEnabled: boolean;
  onToggle: (key: string) => void;
  onEdit: (key: string) => void;
  index: number;
}

function SortableBlock({ section, isEnabled, onToggle, onEdit, index }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-6 rounded-lg border transition-all ${
        isEnabled
          ? 'bg-card border-primary/30 hover:border-primary/50'
          : 'bg-background border-border hover:border-border/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle */}
          {!section.fixed && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-primary/10 rounded transition-colors"
              title="Перетащите для изменения порядка"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          
          {section.fixed && (
            <div className="p-2 opacity-30" title="Этот блок нельзя перемещать">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
              <h3 className="font-bold font-mono">{section.label}</h3>
              {section.fixed && (
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                  Фиксированный
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-mono">{section.description}</p>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(section.key)}
            className="p-2 rounded transition-colors bg-accent/10 text-accent hover:bg-accent/20"
            title="Редактировать содержимое"
          >
            <Edit className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onToggle(section.key)}
            className={`p-2 rounded transition-colors ${
              isEnabled
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
            title={isEnabled ? 'Отключить блок' : 'Включить блок'}
          >
            {isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-500'}`} />
        <span className={isEnabled ? 'text-green-500' : 'text-muted-foreground'}>
          {isEnabled ? 'Отображается на сайте' : 'Скрыт на сайте'}
        </span>
      </div>
    </div>
  );
}

export function HomePageContentTab() {
  const [settings, setSettings] = useState<HomePageSettings | null>(null);
  const [originalSettings, setOriginalSettings] = useState<HomePageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [orderedSections, setOrderedSections] = useState<SectionInfo[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      updateOrderedSections();
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getHomePageSettings();
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Ошибка загрузки настроек');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderedSections = () => {
    if (!settings) return;

    // Hero всегда первый
    const hero = allSections.find(s => s.key === 'hero_section')!;
    
    // Остальные блоки в порядке из block_order
    const otherSections = allSections.filter(s => s.key !== 'hero_section');
    
    if (settings.block_order && settings.block_order.length > 0) {
      // Сортируем по block_order
      const ordered = settings.block_order
        .map(key => otherSections.find(s => s.key === key))
        .filter(Boolean) as SectionInfo[];
      
      // Добавляем блоки, которых нет в block_order (новые блоки)
      const missing = otherSections.filter(s => !settings.block_order.includes(s.key));
      
      setOrderedSections([hero, ...ordered, ...missing]);
    } else {
      // Дефолтный порядок
      setOrderedSections([hero, ...otherSections]);
    }
  };

  const handleToggle = (key: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [key]: !settings[key as keyof HomePageSettings],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSections.findIndex(s => s.key === active.id);
    const newIndex = orderedSections.findIndex(s => s.key === over.id);

    // Не даем перемещать Hero секцию
    if (orderedSections[oldIndex].fixed || orderedSections[newIndex].fixed) {
      toast.error('Hero секцию нельзя перемещать');
      return;
    }

    const newOrder = arrayMove(orderedSections, oldIndex, newIndex);
    setOrderedSections(newOrder);

    // Обновляем block_order в settings (без Hero)
    const blockOrder = newOrder
      .filter(s => s.key !== 'hero_section')
      .map(s => s.key);
    
    setSettings({
      ...settings!,
      block_order: blockOrder,
    });
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      await api.updateHomePageSettings(settings);
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
      toast.success('Настройки сохранены');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(JSON.parse(JSON.stringify(originalSettings)));
      toast.info('Изменения отменены');
    }
  };

  const handleEdit = (key: string) => {
    setEditingSection(key);
  };

  const handleCloseEditor = () => {
    setEditingSection(null);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Layout className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold font-mono mb-2">Ошибка загрузки</h3>
          <p className="text-muted-foreground font-mono text-sm mb-4">
            Не удалось загрузить настройки
          </p>
          <Button onClick={loadSettings}>Попробовать снова</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Управление блоками главной страницы</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Включайте/отключайте блоки и меняйте их порядок
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Отменить
            </Button>
          )}
          
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-primary hover:bg-primary/90 text-black gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start gap-3">
          <Layout className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm font-mono">
            <p className="text-primary font-bold mb-1">Как использовать:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Нажмите на иконку 👁 чтобы включить/отключить блок</li>
              <li>• Перетащите блок за иконку ⋮⋮ чтобы изменить порядок</li>
              <li>• Hero секция всегда остается первой</li>
              <li>• Не забудьте нажать "Сохранить"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.map(s => s.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {orderedSections.map((section, index) => (
              <SortableBlock
                key={section.key}
                section={section}
                isEnabled={settings[section.key as keyof HomePageSettings] as boolean}
                onToggle={handleToggle}
                onEdit={handleEdit}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#111] rounded-lg border border-border">
          <div className="text-2xl font-bold font-mono mb-1">
            {Object.values(settings).filter(v => v === true).length - 1}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Активных блоков</div>
        </div>

        <div className="p-4 bg-[#111] rounded-lg border border-border">
          <div className="text-2xl font-bold font-mono mb-1">
            {allSections.length}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Всего блоков</div>
        </div>

        <div className="p-4 bg-[#111] rounded-lg border border-border">
          <div className="text-2xl font-bold font-mono mb-1">
            {hasChanges ? 'Есть' : 'Нет'}
          </div>
          <div className="text-sm text-muted-foreground font-mono">Несохраненных изменений</div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-primary/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-mono">
                  Редактирование: {allSections.find(s => s.key === editingSection)?.label}
                </h3>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  {allSections.find(s => s.key === editingSection)?.description}
                </p>
              </div>
              <button
                onClick={handleCloseEditor}
                className="p-2 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {editingSection === 'hero_section' && (
                <HeroSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'keenetic_section' && (
                <KeeneticSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'vpn_section' && (
                <VPNSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'pricing_section' && (
                <PricingSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'services_section' && (
                <ServicesSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'hardware_section' && (
                <HardwareSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'infrastructure_section' && (
                <InfrastructureSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'faq_section' && (
                <FAQSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'articles_section' && (
                <ArticlesSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'telegram_section' && (
                <TelegramSectionEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection === 'status_widget' && (
                <StatusWidgetEditor onSave={handleCloseEditor} />
              )}
              
              {editingSection !== 'hero_section' && editingSection !== 'keenetic_section' && editingSection !== 'vpn_section' && editingSection !== 'pricing_section' && editingSection !== 'services_section' && editingSection !== 'hardware_section' && editingSection !== 'infrastructure_section' && editingSection !== 'faq_section' && editingSection !== 'articles_section' && editingSection !== 'telegram_section' && editingSection !== 'status_widget' && (
                <div className="p-8 bg-muted/30 rounded-lg border border-border text-center">
                  <Edit className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-bold font-mono mb-2">Редактор в разработке</h4>
                  <p className="text-muted-foreground font-mono text-sm mb-4">
                    Функционал редактирования этого блока будет добавлен в следующих версиях
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Блок: <span className="text-primary">{editingSection}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
