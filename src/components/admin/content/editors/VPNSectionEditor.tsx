import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface VPNContent {
  section_title?: string;
  section_subtitle?: string;
  pitch_text?: string;
  advantage_1_title?: string;
  advantage_1_description?: string;
  advantage_2_title?: string;
  advantage_2_description?: string;
  advantage_3_title?: string;
  advantage_3_description?: string;
  wireguard_tagline?: string;
  wireguard_description?: string;
  wireguard_button?: string;
  wireguard_button_url?: string;
  amnezia_tagline?: string;
  amnezia_description?: string;
  amnezia_button?: string;
  amnezia_button_url?: string;
}

const defaultContent: VPNContent = {
  section_title: 'Ваш личный сервер — интернет без границ',
  section_subtitle: 'для всей семьи.',
  pitch_text: 'Забудьте о подписках на каждого пользователя. Вы арендуете мощность личного сервера в 3WG, а сколько устройств подключить — решаете сами. Это ваш приватный цифровой дом, который невозможно вычислить.',
  advantage_1_title: 'Чистый IP',
  advantage_1_description: 'Ваш адрес не забанен в Google, Netflix или банках.',
  advantage_2_title: 'Один сервер на 10+ девайсов',
  advantage_2_description: 'ТВ, смартфоны, консоли и роутер — всё на одном тарифе.',
  advantage_3_title: 'Полная маскировка трафика',
  advantage_3_description: 'AmneziaWG — работает даже через самые жёсткие фильтры.',
  wireguard_tagline: 'Максимальная скорость',
  wireguard_description: 'Мы используем оригинальные протоколы в фирменном стиле, гарантируя надёжность на уровне ядра Linux.',
  wireguard_button: 'Подключить WireGuard',
  wireguard_button_url: '/generator',
  amnezia_tagline: 'Обход любых блокировок',
  amnezia_description: 'Модифицированный протокол, невидимый для DPI-систем. Работает в России, Китае, Иране.',
  amnezia_button: 'Подключить AmneziaWG',
  amnezia_button_url: '/generator',
};

interface VPNSectionEditorProps {
  onSave?: () => void;
}

export function VPNSectionEditor({ onSave }: VPNSectionEditorProps) {
  const [content, setContent] = useState<VPNContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<VPNContent>('/settings/blocks/vpn_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load VPN content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/vpn_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save VPN content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof VPNContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <Label htmlFor="section_title" className="font-mono text-sm">Заголовок секции</Label>
        <Textarea
          id="section_title"
          value={content.section_title}
          onChange={(e) => handleChange('section_title', e.target.value)}
          className="font-mono mt-2 min-h-[60px]"
        />
      </div>

      <div>
        <Label htmlFor="section_subtitle" className="font-mono text-sm">Подзаголовок</Label>
        <Input
          id="section_subtitle"
          value={content.section_subtitle}
          onChange={(e) => handleChange('section_subtitle', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      {/* Pitch Text */}
      <div className="pt-4 border-t border-border">
        <Label htmlFor="pitch_text" className="font-mono text-sm">Главный текст (pitch)</Label>
        <Textarea
          id="pitch_text"
          value={content.pitch_text}
          onChange={(e) => handleChange('pitch_text', e.target.value)}
          className="font-mono mt-2 min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      {/* Advantages */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Преимущества (3 блока)</h3>
        
        {[1, 2, 3].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Преимущество {num}</Label>
            <div>
              <Label htmlFor={`advantage_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Input
                id={`advantage_${num}_title`}
                value={content[`advantage_${num}_title` as keyof VPNContent]}
                onChange={(e) => handleChange(`advantage_${num}_title` as keyof VPNContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`advantage_${num}_description`} className="font-mono text-sm">Описание</Label>
              <Textarea
                id={`advantage_${num}_description`}
                value={content[`advantage_${num}_description` as keyof VPNContent]}
                onChange={(e) => handleChange(`advantage_${num}_description` as keyof VPNContent, e.target.value)}
                className="font-mono mt-2 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Cards */}
      <div className="space-y-6 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Карточки протоколов</h3>
        
        {/* WireGuard */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3 border-l-2 border-primary">
          <Label className="font-mono text-xs text-primary">WireGuard</Label>
          <div>
            <Label htmlFor="wireguard_tagline" className="font-mono text-sm">Слоган</Label>
            <Input
              id="wireguard_tagline"
              value={content.wireguard_tagline}
              onChange={(e) => handleChange('wireguard_tagline', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="wireguard_description" className="font-mono text-sm">Описание</Label>
            <Textarea
              id="wireguard_description"
              value={content.wireguard_description}
              onChange={(e) => handleChange('wireguard_description', e.target.value)}
              className="font-mono mt-2 min-h-[60px]"
            />
          </div>
          <div>
            <Label htmlFor="wireguard_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="wireguard_button"
              value={content.wireguard_button}
              onChange={(e) => handleChange('wireguard_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="wireguard_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="wireguard_button_url"
              value={content.wireguard_button_url}
              onChange={(e) => handleChange('wireguard_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>

        {/* AmneziaWG */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3 border-l-2 border-accent">
          <Label className="font-mono text-xs text-accent">AmneziaWG</Label>
          <div>
            <Label htmlFor="amnezia_tagline" className="font-mono text-sm">Слоган</Label>
            <Input
              id="amnezia_tagline"
              value={content.amnezia_tagline}
              onChange={(e) => handleChange('amnezia_tagline', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="amnezia_description" className="font-mono text-sm">Описание</Label>
            <Textarea
              id="amnezia_description"
              value={content.amnezia_description}
              onChange={(e) => handleChange('amnezia_description', e.target.value)}
              className="font-mono mt-2 min-h-[60px]"
            />
          </div>
          <div>
            <Label htmlFor="amnezia_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="amnezia_button"
              value={content.amnezia_button}
              onChange={(e) => handleChange('amnezia_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="amnezia_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="amnezia_button_url"
              value={content.amnezia_button_url}
              onChange={(e) => handleChange('amnezia_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-black hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            'Сохранить изменения'
          )}
        </Button>
      </div>
    </div>
  );
}
