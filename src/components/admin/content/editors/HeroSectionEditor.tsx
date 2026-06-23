import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface HeroContent {
  badge_text?: string;
  main_title?: string;
  main_subtitle?: string;
  manifesto_title?: string;
  manifesto_subtitle?: string;
  why_3wg_title?: string;
  pain_point_1_title?: string;
  pain_point_1_text?: string;
  pain_point_2_title?: string;
  pain_point_2_text?: string;
  pain_point_3_title?: string;
  pain_point_3_text?: string;
  pain_point_4_title?: string;
  pain_point_4_text?: string;
  cta_button_text?: string;
  cta_button_secondary?: string;
  stat_uptime?: string;
  stat_latency?: string;
  stat_encryption?: string;
}

const defaultContent: HeroContent = {
  badge_text: 'MANIFESTO_2024',
  main_title: '3WG.RU — Ваш ЦИФРОВОЙ СУВЕРЕНИТЕТ.',
  main_subtitle: 'ВАШ ТРАФИК — ВАШЕ ПРАВО.',
  manifesto_title: 'Остальное — иллюзия.',
  manifesto_subtitle: 'Пока другие обещают «анонимность», мы даем инструменты суверенитета.',
  why_3wg_title: 'Почему 3WG?',
  pain_point_1_title: 'Устали от блокировок?',
  pain_point_1_text: 'Обычные VPN определяются за секунды. Наш AmneziaWG мимикрирует под обычный веб-серфинг. Для цензоров вы просто читаете новости.',
  pain_point_2_title: 'Медленный интернет?',
  pain_point_2_text: 'Мы не перепродаем чужие сервера. Наши узлы в Нидерландах и США работают на 10Gbps каналах.',
  pain_point_3_title: 'Боитесь сливов?',
  pain_point_3_text: 'Мы не просим почту. Мы не храним логи. Ваша личность заканчивается там, где начинается наш шифр.',
  pain_point_4_title: 'Свой домен — свои правила',
  pain_point_4_text: 'Домены amzwg.ru и wire3.ru — это ваша гарантия стабильного коннекта без посредников.',
  cta_button_text: 'Получить VPN-сервер',
  cta_button_secondary: 'ИТ-аутсорсинг',
  stat_uptime: '99.9%',
  stat_latency: '5ms',
  stat_encryption: '256-bit',
};

interface HeroSectionEditorProps {
  onSave?: () => void;
}

export function HeroSectionEditor({ onSave }: HeroSectionEditorProps) {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<HeroContent>('/settings/blocks/hero_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load hero content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/hero_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save hero content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof HeroContent, value: string) => {
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
      {/* Badge */}
      <div>
        <Label htmlFor="badge_text" className="font-mono text-sm">Бейдж (вверху)</Label>
        <Input
          id="badge_text"
          value={content.badge_text}
          onChange={(e) => handleChange('badge_text', e.target.value)}
          className="font-mono mt-2"
          placeholder="MANIFESTO_2024"
        />
      </div>

      {/* Main Title */}
      <div>
        <Label htmlFor="main_title" className="font-mono text-sm">Главный заголовок</Label>
        <Textarea
          id="main_title"
          value={content.main_title}
          onChange={(e) => handleChange('main_title', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
          placeholder="3WG.RU — Ваш ЦИФРОВОЙ СУВЕРЕНИТЕТ."
        />
      </div>

      {/* Manifesto */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="main_subtitle" className="font-mono text-sm">Подзаголовок</Label>
          <Input
            id="main_subtitle"
            value={content.main_subtitle}
            onChange={(e) => handleChange('main_subtitle', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
        <div>
          <Label htmlFor="manifesto_title" className="font-mono text-sm">Манифест заголовок</Label>
          <Input
            id="manifesto_title"
            value={content.manifesto_title}
            onChange={(e) => handleChange('manifesto_title', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="manifesto_subtitle" className="font-mono text-sm">Манифест текст</Label>
        <Textarea
          id="manifesto_subtitle"
          value={content.manifesto_subtitle}
          onChange={(e) => handleChange('manifesto_subtitle', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      <div className="pt-4 border-t border-border">
        <Label htmlFor="why_3wg_title" className="font-mono text-sm">Заголовок секции "Почему 3WG?"</Label>
        <Input
          id="why_3wg_title"
          value={content.why_3wg_title}
          onChange={(e) => handleChange('why_3wg_title', e.target.value)}
          className="font-mono mt-2"
          placeholder="Почему 3WG?"
        />
      </div>

      {/* Pain Points */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Блоки "Почему 3WG?"</h3>
        
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Блок {num}</Label>
            <div>
              <Label htmlFor={`pain_point_${num}_title`} className="font-mono text-sm">Заголовок</Label>
              <Input
                id={`pain_point_${num}_title`}
                value={content[`pain_point_${num}_title` as keyof HeroContent]}
                onChange={(e) => handleChange(`pain_point_${num}_title` as keyof HeroContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`pain_point_${num}_text`} className="font-mono text-sm">Текст</Label>
              <Textarea
                id={`pain_point_${num}_text`}
                value={content[`pain_point_${num}_text` as keyof HeroContent]}
                onChange={(e) => handleChange(`pain_point_${num}_text` as keyof HeroContent, e.target.value)}
                className="font-mono mt-2 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <Label htmlFor="cta_button_text" className="font-mono text-sm">Текст кнопки 1</Label>
          <Input
            id="cta_button_text"
            value={content.cta_button_text}
            onChange={(e) => handleChange('cta_button_text', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
        <div>
          <Label htmlFor="cta_button_secondary" className="font-mono text-sm">Текст кнопки 2</Label>
          <Input
            id="cta_button_secondary"
            value={content.cta_button_secondary}
            onChange={(e) => handleChange('cta_button_secondary', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <Label htmlFor="stat_uptime" className="font-mono text-sm">Uptime</Label>
          <Input
            id="stat_uptime"
            value={content.stat_uptime}
            onChange={(e) => handleChange('stat_uptime', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
        <div>
          <Label htmlFor="stat_latency" className="font-mono text-sm">Latency</Label>
          <Input
            id="stat_latency"
            value={content.stat_latency}
            onChange={(e) => handleChange('stat_latency', e.target.value)}
            className="font-mono mt-2"
          />
        </div>
        <div>
          <Label htmlFor="stat_encryption" className="font-mono text-sm">Encryption</Label>
          <Input
            id="stat_encryption"
            value={content.stat_encryption}
            onChange={(e) => handleChange('stat_encryption', e.target.value)}
            className="font-mono mt-2"
          />
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
