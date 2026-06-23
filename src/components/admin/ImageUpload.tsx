import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressImage, createThumbnail, saveImageToFolder, getImageFromStorage } from '@/lib/blog-utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (imagePath: string) => void;
  slug: string;
  className?: string;
}

export const ImageUpload = ({ value, onChange, slug, className = '' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загружаем изображение при изменении value
  useEffect(() => {
    if (value) {
      const imageUrl = getImageFromStorage(value);
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB для localStorage)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Сжимаем изображение для основного использования
      const compressedFile = await compressImage(file, 1200, 0.85);
      
      // Создаем thumbnail для карточек
      const thumbnailFile = await createThumbnail(file);

      // Сохраняем основное изображение
      const mainImagePath = await saveImageToFolder(compressedFile, slug);
      
      // Сохраняем thumbnail
      const thumbnailPath = await saveImageToFolder(thumbnailFile, `${slug}-thumb`);

      // Обновляем состояние
      onChange(mainImagePath);
      
      toast.success('Изображение загружено успешно');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Ошибка при загрузке изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-border">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Заменить
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка изображения...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="relative aspect-video w-full max-w-md rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm">Загрузка изображения...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8" />
                <p className="text-sm font-medium">Загрузить изображение</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG до 5MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Изображение будет автоматически сжато для оптимизации</p>
        <p>• Создается thumbnail для карточек статей</p>
        <p>• Рекомендуемое соотношение сторон: 16:9</p>
        <p>• Изображения сохраняются в localStorage (до 5MB)</p>
      </div>
    </div>
  );
};