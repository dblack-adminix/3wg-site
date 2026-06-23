import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/lib/api';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

interface FAQContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
  };
  categories: FAQCategory[];
  footer: {
    text: string;
    email: string;
  };
}

interface FAQPageEditorProps {
  onClose: () => void;
}

export function FAQPageEditor({ onClose }: FAQPageEditorProps) {
  const [content, setContent] = useState<FAQContent>({
    hero: {
      badge: 'FAQ_DATABASE',
      title: 'Частые',
      subtitle: 'вопросы',
      description: 'Техническая документация для любопытных',
    },
    categories: [
      {
        id: 'security',
        title: 'Безопасность',
        items: [
          {
            question: 'Чем AmneziaWG отличается от обычного VPN?',
            answer: 'Обычные VPN используют стандартные протоколы...',
          },
        ],
      },
    ],
    footer: {
      text: 'Не нашли ответ?',
      email: 'support@3wg.ru',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<FAQContent>('/settings/blocks/faq_page');
        console.log('FAQ page data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          setContent({
            hero: data.hero || content.hero,
            categories: data.categories || content.categories,
            footer: data.footer || content.footer,
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
      await api.request('/admin/settings/blocks/faq_page', {
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

  const addCategory = () => {
    setContent({
      ...content,
      categories: [
        ...content.categories,
        {
          id: `category-${Date.now()}`,
          title: 'Новая категория',
          items: [],
        },
      ],
    });
  };

  const removeCategory = (index: number) => {
    setContent({
      ...content,
      categories: content.categories.filter((_, i) => i !== index),
    });
  };

  const updateCategory = (index: number, field: keyof FAQCategory, value: any) => {
    const newCategories = [...content.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setContent({ ...content, categories: newCategories });
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...content.categories];
    newCategories[categoryIndex].items.push({
      question: 'Новый вопрос',
      answer: 'Ответ на вопрос',
    });
    setContent({ ...content, categories: newCategories });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...content.categories];
    newCategories[categoryIndex].items = newCategories[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setContent({ ...content, categories: newCategories });
  };

  const updateItem = (categoryIndex: number, itemIndex: number, field: keyof FAQItem, value: string) => {
    const newCategories = [...content.categories];
    newCategories[categoryIndex].items[itemIndex] = {
      ...newCategories[categoryIndex].items[itemIndex],
      [field]: value,
    };
    setContent({ ...content, categories: newCategories });
  };

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
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
            <Label>Subtitle (highlighted)</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
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

      {/* Categories */}
      <div className="space-y-4 pb-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">FAQ Categories</h3>
          <Button onClick={addCategory} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {content.categories.map((category, catIndex) => (
          <div key={catIndex} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  onClick={() => toggleCategory(catIndex)}
                  size="sm"
                  variant="ghost"
                  className="p-1"
                >
                  {expandedCategories.has(catIndex) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                <h4 className="font-medium">Category {catIndex + 1}: {category.title}</h4>
              </div>
              <Button onClick={() => removeCategory(catIndex)} size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {expandedCategories.has(catIndex) && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Category ID</Label>
                    <Input
                      value={category.id}
                      onChange={(e) => updateCategory(catIndex, 'id', e.target.value)}
                      placeholder="security"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category Title</Label>
                    <Input
                      value={category.title}
                      onChange={(e) => updateCategory(catIndex, 'title', e.target.value)}
                      placeholder="Безопасность"
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 pl-4 border-l-2">
                  <div className="flex items-center justify-between">
                    <Label>Questions ({category.items.length})</Label>
                    <Button onClick={() => addItem(catIndex)} size="sm" variant="ghost">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Question
                    </Button>
                  </div>

                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-3 border rounded bg-muted/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Question {itemIndex + 1}</Label>
                        <Button
                          onClick={() => removeItem(catIndex, itemIndex)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Input
                        value={item.question}
                        onChange={(e) => updateItem(catIndex, itemIndex, 'question', e.target.value)}
                        placeholder="Вопрос"
                      />
                      <Textarea
                        value={item.answer}
                        onChange={(e) => updateItem(catIndex, itemIndex, 'answer', e.target.value)}
                        placeholder="Ответ"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Footer</h3>
        <div className="space-y-2">
          <Label>Text</Label>
          <Input
            value={content.footer.text}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, text: e.target.value } })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={content.footer.email}
            onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })}
            type="email"
          />
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
