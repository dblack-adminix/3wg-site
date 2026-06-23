import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface FAQContent {
  section_title?: string;
  section_subtitle?: string;
  support_text?: string;
  
  faq_1_question?: string;
  faq_1_answer?: string;
  
  faq_2_question?: string;
  faq_2_answer?: string;
  
  faq_3_question?: string;
  faq_3_answer?: string;
  
  faq_4_question?: string;
  faq_4_answer?: string;
  
  faq_5_question?: string;
  faq_5_answer?: string;
  
  faq_6_question?: string;
  faq_6_answer?: string;
}

const defaultContent: FAQContent = {
  section_title: 'Частые вопросы',
  section_subtitle: 'Техническая документация для любопытных',
  support_text: 'Не нашли ответ? // support@3wg.ru',
  
  faq_1_question: 'Чем AmneziaWG отличается от обычного VPN?',
  faq_1_answer: 'Обычные VPN используют стандартные протоколы, которые легко распознаются системами Deep Packet Inspection (DPI).\n\nAmneziaWG — это модифицированный WireGuard, который маскирует VPN-трафик под обычный HTTPS. Для систем фильтрации ваш трафик выглядит как обычный веб-сёрфинг.',
  
  faq_2_question: 'Какая скорость у WireGuard сервера?',
  faq_2_answer: 'WireGuard — самый быстрый VPN-протокол на сегодняшний день. Наши серверы обеспечивают:\n\n• Скорость: до 1 Гбит/с\n• Пинг: от 5ms до Европы\n• Шифрование: ChaCha20-Poly1305',
  
  faq_3_question: 'Работает ли в Китае, Иране, Туркменистане?',
  faq_3_answer: 'Да, но с нюансами. Для стран с агрессивной цензурой мы рекомендуем AmneziaWG с обфускацией.',
  
  faq_4_question: 'Как настроить VPN на телефоне/компьютере?',
  faq_4_answer: 'Мы предоставляем готовые конфигурационные файлы. Весь процесс занимает около 2 минут.',
  
  faq_5_question: 'Вы храните логи подключений?',
  faq_5_answer: 'Нет. Наши серверы настроены так, что технически не могут записывать IP-адреса, временные метки или посещённые сайты.',
  
  faq_6_question: 'Что значит "личный сервер"?',
  faq_6_answer: 'В отличие от массовых VPN-сервисов, в 3WG вы получаете выделенный IP, изолированные ресурсы и полный контроль.',
};

interface FAQSectionEditorProps {
  onSave?: () => void;
}

export function FAQSectionEditor({ onSave }: FAQSectionEditorProps) {
  const [content, setContent] = useState<FAQContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<FAQContent>('/settings/blocks/faq_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load FAQ content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/faq_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save FAQ content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof FAQContent, value: string) => {
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
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
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

      <div>
        <Label htmlFor="support_text" className="font-mono text-sm">Текст поддержки (внизу)</Label>
        <Input
          id="support_text"
          value={content.support_text}
          onChange={(e) => handleChange('support_text', e.target.value)}
          className="font-mono mt-2"
        />
      </div>

      {/* FAQ Items */}
      <div className="space-y-6 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Вопросы и ответы (6 пунктов)</h3>
        
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3 border-l-2 border-primary">
            <Label className="font-mono text-xs text-muted-foreground">FAQ #{num}</Label>
            <div>
              <Label htmlFor={`faq_${num}_question`} className="font-mono text-sm">Вопрос</Label>
              <Input
                id={`faq_${num}_question`}
                value={content[`faq_${num}_question` as keyof FAQContent]}
                onChange={(e) => handleChange(`faq_${num}_question` as keyof FAQContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`faq_${num}_answer`} className="font-mono text-sm">Ответ</Label>
              <Textarea
                id={`faq_${num}_answer`}
                value={content[`faq_${num}_answer` as keyof FAQContent]}
                onChange={(e) => handleChange(`faq_${num}_answer` as keyof FAQContent, e.target.value)}
                className="font-mono mt-2 min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Используйте \n для переноса строки. Слова в ВЕРХНЕМ РЕГИСТРЕ будут выделены цветом.
              </p>
            </div>
          </div>
        ))}
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
