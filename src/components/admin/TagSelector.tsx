import { useState, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAllTags, addTag, removeTag } from '@/lib/blog-utils';
import { toast } from 'sonner';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  className?: string;
}

export const TagSelector = ({ selectedTags, onChange, className = '' }: TagSelectorProps) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  useEffect(() => {
    setAvailableTags(getAllTags());
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    const trimmedTag = newTag.trim();
    
    if (!trimmedTag) {
      toast.error('Введите название тега');
      return;
    }

    if (availableTags.includes(trimmedTag)) {
      toast.error('Такой тег уже существует');
      return;
    }

    if (trimmedTag.length > 20) {
      toast.error('Название тега не должно превышать 20 символов');
      return;
    }

    // Добавляем тег в общий список
    addTag(trimmedTag);
    setAvailableTags([...availableTags, trimmedTag].sort());
    
    // Автоматически выбираем новый тег
    onChange([...selectedTags, trimmedTag]);
    
    setNewTag('');
    setIsAddingTag(false);
    toast.success('Тег добавлен');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (confirm(`Удалить тег "${tagToRemove}" из системы? Он будет удален у всех статей.`)) {
      removeTag(tagToRemove);
      setAvailableTags(availableTags.filter(t => t !== tagToRemove));
      onChange(selectedTags.filter(t => t !== tagToRemove));
      toast.success('Тег удален');
    }
  };

  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Выбранные теги */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Выбранные теги ({selectedTags.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Доступные теги */}
      {unselectedTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Доступные теги
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-border rounded-md">
            {unselectedTags.map((tag) => (
              <div key={tag} className="group relative">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors pr-6"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Удалить тег из системы"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Добавление нового тега */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Создать новый тег
        </label>
        
        {isAddingTag ? (
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Название тега"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewTag();
                } else if (e.key === 'Escape') {
                  setIsAddingTag(false);
                  setNewTag('');
                }
              }}
              autoFocus
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNewTag}
              disabled={!newTag.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingTag(false);
                setNewTag('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            className="w-full"
          >
            <TagIcon className="w-4 h-4 mr-2" />
            Добавить новый тег
          </Button>
        )}
      </div>

      {/* Статистика */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Всего тегов в системе: {availableTags.length}</p>
        <p>• Выбрано для статьи: {selectedTags.length}</p>
        <p>• Клик по тегу добавляет/убирает его из статьи</p>
      </div>
    </div>
  );
};