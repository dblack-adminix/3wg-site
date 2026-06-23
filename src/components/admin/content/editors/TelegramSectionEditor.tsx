import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface TelegramContent {
  section_title?: string;
  section_description?: string;
  
  welcome_message?: string;
  
  feature_1_command?: string;
  feature_1_title?: string;
  feature_1_description?: string;
  
  feature_2_command?: string;
  feature_2_title?: string;
  feature_2_description?: string;
  
  feature_3_command?: string;
  feature_3_title?: string;
  feature_3_description?: string;
  
  button_text?: string;
  button_url?: string;
  button_note?: string;
}

const defaultContent: TelegramContent = {
  section_title: 'Telegram-бот 3WG',
  section_description: 'Управляйте VPN-серверами прямо из Telegram. Мониторинг, конфиги, поддержка — всё в одном месте.',
  
  welcome_message: 'Добро пожаловать в систему мониторинга 3WG. Выберите действие:',
  
  feature_1_command: '/status',
  feature_1_title: 'Статус моих VPN',
  feature_1_description: 'Бот проверяет статус сервера (Online/Offline) и выводит текущую нагрузку.',
  
  feature_2_command: '/config',
  feature_2_title: 'Получить конфиг',
  feature_2_description: 'Бот выдает файл .conf для WireGuard или ссылку для Amnezia прямо в мессенджер.',
  
  feature_3_command: '/support',
  feature_3_title: 'Поддержка',
  feature_3_description: 'Прямой чат с инженером 3WG. Ответ в течение 15 минут.',
  
  button_text: 'Подключить Telegram-бота',
  button_url: 'https://t.me/your_bot',
  button_note: 'После заказа VPN вы получите ссылку на бота автоматически',
};

interface TelegramSectionEditorProps {
  onSave?: () => void;
}

export function TelegramSectionEditor({ onSave }: TelegramSectionEditorProps) {
  const [content, setContent] = useState<TelegramContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<TelegramContent>('/settings/blocks/telegram_section');
      if (Object.keys(data).length > 0) {
        setContent({ ...defaultContent, ...data });
      }
    } catch (error) {
      console.error('Failed to load telegram content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/blocks/telegram_section', {
        method: 'PUT',
        body: JSON.stringify(content),
      });
      toast.success('Контент сохранен!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save telegram content:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof TelegramContent, value: string) => {
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
        <Label htmlFor="section_description" className="font-mono text-sm">Описание</Label>
        <Textarea
          id="section_description"
          value={content.section_description}
          onChange={(e) => handleChange('section_description', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      <div>
        <Label htmlFor="welcome_message" className="font-mono text-sm">Приветственное сообщение бота</Label>
        <Textarea
          id="welcome_message"
          value={content.welcome_message}
          onChange={(e) => handleChange('welcome_message', e.target.value)}
          className="font-mono mt-2 min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Слова в ВЕРХНЕМ РЕГИСТРЕ будут автоматически выделены цветом
        </p>
      </div>

      {/* Bot Features */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Команды бота (3 шт)</h3>
        
        {[1, 2, 3].map((num) => (
          <div key={num} className="p-4 bg-muted/30 rounded-lg space-y-3">
            <Label className="font-mono text-xs text-muted-foreground">Команда {num}</Label>
            <div>
              <Label htmlFor={`feature_${num}_command`} className="font-mono text-sm">Команда (например /status)</Label>
              <Input
                id={`feature_${num}_command`}
                value={content[`feature_${num}_command` as keyof TelegramContent]}
                onChange={(e) => handleChange(`feature_${num}_command` as keyof TelegramContent, e.target.value)}
                className="font-mono mt-2"
                placeholder="/command"
              />
            </div>
            <div>
              <Label htmlFor={`feature_${num}_title`} className="font-mono text-sm">Название</Label>
              <Input
                id={`feature_${num}_title`}
                value={content[`feature_${num}_title` as keyof TelegramContent]}
                onChange={(e) => handleChange(`feature_${num}_title` as keyof TelegramContent, e.target.value)}
                className="font-mono mt-2"
              />
            </div>
            <div>
              <Label htmlFor={`feature_${num}_description`} className="font-mono text-sm">Описание</Label>
              <Textarea
                id={`feature_${num}_description`}
                value={content[`feature_${num}_description` as keyof TelegramContent]}
                onChange={(e) => handleChange(`feature_${num}_description` as keyof TelegramContent, e.target.value)}
                className="font-mono mt-2 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-mono text-sm font-bold text-primary">Кнопка</h3>
        
        <div>
          <Label htmlFor="button_text" className="font-mono text-sm">Текст кнопки</Label>
          <Input
            id="button_text"
            value={content.button_text}
            onChange={(e) => handleChange('button_text', e.target.value)}
            className="font-mono mt-2"
          />
        </div>

        <div>
          <Label htmlFor="button_url" className="font-mono text-sm">Ссылка кнопки</Label>
          <Input
            id="button_url"
            value={content.button_url}
            onChange={(e) => handleChange('button_url', e.target.value)}
            className="font-mono mt-2"
            placeholder="https://t.me/your_bot"
          />
        </div>

        <div>
          <Label htmlFor="button_note" className="font-mono text-sm">Примечание под кнопкой</Label>
          <Input
            id="button_note"
            value={content.button_note}
            onChange={(e) => handleChange('button_note', e.target.value)}
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
