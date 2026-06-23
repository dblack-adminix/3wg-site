import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PricingContent {
  section_title?: string;
  section_subtitle?: string;
  
  // SOLO Plan
  solo_name?: string;
  solo_subtitle?: string;
  solo_price?: string;
  solo_description?: string;
  solo_feature_1?: string;
  solo_feature_2?: string;
  solo_feature_3?: string;
  solo_feature_4?: string;
  solo_feature_5?: string;
  solo_button?: string;
  solo_button_url?: string;
  
  // FAMILY Plan
  family_name?: string;
  family_subtitle?: string;
  family_price?: string;
  family_description?: string;
  family_feature_1?: string;
  family_feature_2?: string;
  family_feature_3?: string;
  family_feature_4?: string;
  family_feature_5?: string;
  family_button?: string;
  family_button_url?: string;
  
  // COMMUNITY Plan
  community_name?: string;
  community_subtitle?: string;
  community_price?: string;
  community_description?: string;
  community_feature_1?: string;
  community_feature_2?: string;
  community_feature_3?: string;
  community_feature_4?: string;
  community_feature_5?: string;
  community_button?: string;
  community_button_url?: string;
  
  // HARDWARE Plan
  hardware_name?: string;
  hardware_subtitle?: string;
  hardware_price?: string;
  hardware_price_note?: string;
  hardware_description?: string;
  hardware_feature_1?: string;
  hardware_feature_2?: string;
  hardware_feature_3?: string;
  hardware_feature_4?: string;
  hardware_button?: string;
  hardware_button_url?: string;
  
  // Router Article Block
  router_article_title?: string;
  router_article_text?: string;
  
  // Why Better Block
  why_better_title?: string;
  why_better_text?: string;
}

const defaultContent: PricingContent = {
  section_title: 'Тарифная сетка 3WG',
  section_subtitle: 'Личный виртуальный сервер — вы владеете ресурсами, а не делите их с тысячами пользователей.',
  
  solo_name: 'SOLO',
  solo_subtitle: 'Личный сервер',
  solo_price: '300',
  solo_description: 'Для тех, кому нужна приватность в кармане.',
  solo_feature_1: 'до 3-х устройств',
  solo_feature_2: 'WireGuard',
  solo_feature_3: 'Выделенный IP',
  solo_feature_4: 'Работа с зарубежными банками',
  solo_feature_5: 'Базовая поддержка (тикеты)',
  solo_button: 'Купить',
  solo_button_url: '/generator',
  
  family_name: 'FAMILY',
  family_subtitle: 'Семейный сервер',
  family_price: '650',
  family_description: 'Один сервер на весь дом. Никакой платы за каждого члена семьи.',
  family_feature_1: 'до 10 устройств + Smart TV',
  family_feature_2: 'AmneziaWG + WireGuard',
  family_feature_3: 'Обход блокировок DPI',
  family_feature_4: 'Настройка на роутер',
  family_feature_5: 'Приоритетная поддержка',
  family_button: 'Купить',
  family_button_url: '/generator',
  
  community_name: 'COMMUNITY',
  community_subtitle: 'Для своих',
  community_price: '1200',
  community_description: 'Свой узел связи для компании друзей или малого офиса.',
  community_feature_1: 'до 25 устройств',
  community_feature_2: 'Amnezia + WireGuard + SS',
  community_feature_3: 'Усиленный CPU',
  community_feature_4: '4K стриминг, игры без лагов',
  community_feature_5: 'Персональный инженер',
  community_button: 'Купить',
  community_button_url: '/generator',
  
  hardware_name: 'HARDWARE',
  hardware_subtitle: 'Готовый роутер',
  hardware_price: '1500',
  hardware_price_note: '+ оборудование',
  hardware_description: 'VPN на уровне всей домашней сети. Просто включите роутер в розетку.',
  hardware_feature_1: 'VPN на уровне Wi-Fi сети',
  hardware_feature_2: 'Plug & Play: Включил и работает',
  hardware_feature_3: 'Поддержка 4K стриминга на ТВ',
  hardware_feature_4: 'Обход блокировок для PS5/Xbox',
  hardware_button: 'Заказать комплект',
  hardware_button_url: '/generator',
  
  router_article_title: 'Забудьте про настройку VPN на каждом устройстве',
  router_article_text: 'Устали объяснять бабушке, как включать VPN на планшете, или воевать с телевизором, который не открывает YouTube? Тариф 3WG HARDWARE решает это раз и навсегда. Мы берём надёжный роутер, прошиваем его нашими алгоритмами и привозим вам. Весь трафик внутри вашего дома автоматически шифруется и проходит через ваш личный сервер в нашем дата-центре. Это максимально безопасный и удобный способ вернуть привычный интернет в каждую комнату.',
  
  why_better_title: 'Почему наши тарифы выгоднее?',
  why_better_text: 'В обычном VPN вы платите за каждый аккаунт отдельно. В 3WG вы арендуете мощность сервера. Это как аренда квартиры: сколько людей там будет жить — решать вам. Мы не ограничиваем количество девайсов технически, мы подбираем мощность сервера так, чтобы всем было комфортно.',
};

interface PricingSectionEditorProps {
  onSave?: () => void;
}

export function PricingSectionEditor({ onSave }: PricingSectionEditorProps) {
  const [content, setContent] = useState<PricingContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<PricingContent>('/settings/blocks/pricing_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load pricing content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/pricing_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save pricing content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof PricingContent, value: string) => {
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
        <Input
          id="section_title"
          value={content.section_title}
          onChange={(e) => handleChange('section_title', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      <div>
        <Label htmlFor="section_subtitle" className="font-mono text-sm">Подзаголовок</Label>
        <Textarea
          id="section_subtitle"
          value={content.section_subtitle}
          onChange={(e) => handleChange('section_subtitle', e.target.value)}
          className="font-mono mt-2 min-h-[60px]"
        />
      </div>

      {/* SOLO Plan */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-[#FF3333]">Тариф SOLO</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="solo_name" className="font-mono text-sm">Название</Label>
            <Input
              id="solo_name"
              value={content.solo_name}
              onChange={(e) => handleChange('solo_name', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="solo_subtitle" className="font-mono text-sm">Подзаголовок</Label>
            <Input
              id="solo_subtitle"
              value={content.solo_subtitle}
              onChange={(e) => handleChange('solo_subtitle', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="solo_price" className="font-mono text-sm">Цена (без ₽)</Label>
            <Input
              id="solo_price"
              value={content.solo_price}
              onChange={(e) => handleChange('solo_price', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="solo_description" className="font-mono text-sm">Описание</Label>
            <Input
              id="solo_description"
              value={content.solo_description}
              onChange={(e) => handleChange('solo_description', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div>
          <Label className="font-mono text-sm mb-2 block">Преимущества (5 пунктов)</Label>
          {[1, 2, 3, 4, 5].map((num) => (
            <Input
              key={num}
              value={content[`solo_feature_${num}` as keyof PricingContent]}
              onChange={(e) => handleChange(`solo_feature_${num}` as keyof PricingContent, e.target.value)}
              className="font-mono mt-2"
              placeholder={`Преимущество ${num}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="solo_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="solo_button"
              value={content.solo_button}
              onChange={(e) => handleChange('solo_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="solo_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="solo_button_url"
              value={content.solo_button_url}
              onChange={(e) => handleChange('solo_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>
      </div>

      {/* FAMILY Plan */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Тариф FAMILY (ХИТ)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="family_name" className="font-mono text-sm">Название</Label>
            <Input
              id="family_name"
              value={content.family_name}
              onChange={(e) => handleChange('family_name', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="family_subtitle" className="font-mono text-sm">Подзаголовок</Label>
            <Input
              id="family_subtitle"
              value={content.family_subtitle}
              onChange={(e) => handleChange('family_subtitle', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="family_price" className="font-mono text-sm">Цена (без ₽)</Label>
            <Input
              id="family_price"
              value={content.family_price}
              onChange={(e) => handleChange('family_price', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="family_description" className="font-mono text-sm">Описание</Label>
            <Input
              id="family_description"
              value={content.family_description}
              onChange={(e) => handleChange('family_description', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div>
          <Label className="font-mono text-sm mb-2 block">Преимущества (5 пунктов)</Label>
          {[1, 2, 3, 4, 5].map((num) => (
            <Input
              key={num}
              value={content[`family_feature_${num}` as keyof PricingContent]}
              onChange={(e) => handleChange(`family_feature_${num}` as keyof PricingContent, e.target.value)}
              className="font-mono mt-2"
              placeholder={`Преимущество ${num}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="family_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="family_button"
              value={content.family_button}
              onChange={(e) => handleChange('family_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="family_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="family_button_url"
              value={content.family_button_url}
              onChange={(e) => handleChange('family_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>
      </div>

      {/* COMMUNITY Plan */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-accent">Тариф COMMUNITY</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="community_name" className="font-mono text-sm">Название</Label>
            <Input
              id="community_name"
              value={content.community_name}
              onChange={(e) => handleChange('community_name', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="community_subtitle" className="font-mono text-sm">Подзаголовок</Label>
            <Input
              id="community_subtitle"
              value={content.community_subtitle}
              onChange={(e) => handleChange('community_subtitle', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="community_price" className="font-mono text-sm">Цена (без ₽)</Label>
            <Input
              id="community_price"
              value={content.community_price}
              onChange={(e) => handleChange('community_price', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="community_description" className="font-mono text-sm">Описание</Label>
            <Input
              id="community_description"
              value={content.community_description}
              onChange={(e) => handleChange('community_description', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div>
          <Label className="font-mono text-sm mb-2 block">Преимущества (5 пунктов)</Label>
          {[1, 2, 3, 4, 5].map((num) => (
            <Input
              key={num}
              value={content[`community_feature_${num}` as keyof PricingContent]}
              onChange={(e) => handleChange(`community_feature_${num}` as keyof PricingContent, e.target.value)}
              className="font-mono mt-2"
              placeholder={`Преимущество ${num}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="community_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="community_button"
              value={content.community_button}
              onChange={(e) => handleChange('community_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="community_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="community_button_url"
              value={content.community_button_url}
              onChange={(e) => handleChange('community_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>
      </div>

      {/* HARDWARE Plan */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-gray-300">Тариф HARDWARE (PREMIUM)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hardware_name" className="font-mono text-sm">Название</Label>
            <Input
              id="hardware_name"
              value={content.hardware_name}
              onChange={(e) => handleChange('hardware_name', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hardware_subtitle" className="font-mono text-sm">Подзаголовок</Label>
            <Input
              id="hardware_subtitle"
              value={content.hardware_subtitle}
              onChange={(e) => handleChange('hardware_subtitle', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="hardware_price" className="font-mono text-sm">Цена (без ₽)</Label>
            <Input
              id="hardware_price"
              value={content.hardware_price}
              onChange={(e) => handleChange('hardware_price', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hardware_price_note" className="font-mono text-sm">Примечание к цене</Label>
            <Input
              id="hardware_price_note"
              value={content.hardware_price_note}
              onChange={(e) => handleChange('hardware_price_note', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hardware_description" className="font-mono text-sm">Описание</Label>
            <Input
              id="hardware_description"
              value={content.hardware_description}
              onChange={(e) => handleChange('hardware_description', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
        </div>

        <div>
          <Label className="font-mono text-sm mb-2 block">Преимущества (4 пункта)</Label>
          {[1, 2, 3, 4].map((num) => (
            <Input
              key={num}
              value={content[`hardware_feature_${num}` as keyof PricingContent]}
              onChange={(e) => handleChange(`hardware_feature_${num}` as keyof PricingContent, e.target.value)}
              className="font-mono mt-2"
              placeholder={`Преимущество ${num}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hardware_button" className="font-mono text-sm">Текст кнопки</Label>
            <Input
              id="hardware_button"
              value={content.hardware_button}
              onChange={(e) => handleChange('hardware_button', e.target.value)}
              className="font-mono mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hardware_button_url" className="font-mono text-sm">Ссылка кнопки</Label>
            <Input
              id="hardware_button_url"
              value={content.hardware_button_url}
              onChange={(e) => handleChange('hardware_button_url', e.target.value)}
              className="font-mono mt-2"
              placeholder="/generator"
            />
          </div>
        </div>
      </div>

      {/* Router Article Block */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Блок про роутер</h3>
        
        <div>
          <Label htmlFor="router_article_title" className="font-mono text-sm">Заголовок</Label>
          <Textarea
            id="router_article_title"
            value={content.router_article_title}
            onChange={(e) => handleChange('router_article_title', e.target.value)}
            className="font-mono mt-2 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="router_article_text" className="font-mono text-sm">Текст</Label>
          <Textarea
            id="router_article_text"
            value={content.router_article_text}
            onChange={(e) => handleChange('router_article_text', e.target.value)}
            className="font-mono mt-2 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
          </p>
        </div>
      </div>

      {/* Why Better Block */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Блок "Почему выгоднее"</h3>
        
        <div>
          <Label htmlFor="why_better_title" className="font-mono text-sm">Заголовок</Label>
          <Textarea
            id="why_better_title"
            value={content.why_better_title}
            onChange={(e) => handleChange('why_better_title', e.target.value)}
            className="font-mono mt-2 min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="why_better_text" className="font-mono text-sm">Текст</Label>
          <Textarea
            id="why_better_text"
            value={content.why_better_text}
            onChange={(e) => handleChange('why_better_text', e.target.value)}
            className="font-mono mt-2 min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
          </p>
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
