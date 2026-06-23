import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface CommandContent {
  title: string;
  description: string;
  terminalSpecs: {
    cpu: string;
    ram: string;
    flash: string;
    os: string;
  };
  cornerLabels: {
    wan: string;
    lan: string;
    storage: string;
    memory: string;
  };
  cardLabel: string;
}

interface Node1CommandEditorProps {
  onClose: () => void;
}

export function Node1CommandEditor({ onClose }: Node1CommandEditorProps) {
  const [content, setContent] = useState<CommandContent>({
    title: 'Прошивка: Ваш командный центр',
    description: 'Интуитивный интерфейс для управления вашей приватной сетью. Переключайте протоколы, мониторьте трафик и настраивайте правила безопасности.',
    terminalSpecs: {
      cpu: 'Quad-core ARM 1.8GHz (Optimized for AES)',
      ram: '2GB DDR4 High-Speed',
      flash: '32GB Secure Storage',
      os: '3WG Custom Hardened Linux',
    },
    cornerLabels: {
      wan: 'WAN',
      lan: 'LAN',
      storage: '32GB',
      memory: '2GB DDR4',
    },
    cardLabel: 'NODE-1 ARCHITECTURE',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<CommandContent>('/settings/blocks/node1_command');
        console.log('Command data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          // Merge with defaults to ensure all fields exist
          setContent({
            title: data.title || content.title,
            description: data.description || content.description,
            terminalSpecs: {
              cpu: data.terminalSpecs?.cpu || content.terminalSpecs.cpu,
              ram: data.terminalSpecs?.ram || content.terminalSpecs.ram,
              flash: data.terminalSpecs?.flash || content.terminalSpecs.flash,
              os: data.terminalSpecs?.os || content.terminalSpecs.os,
            },
            cornerLabels: {
              wan: data.cornerLabels?.wan || content.cornerLabels.wan,
              lan: data.cornerLabels?.lan || content.cornerLabels.lan,
              storage: data.cornerLabels?.storage || content.cornerLabels.storage,
              memory: data.cornerLabels?.memory || content.cornerLabels.memory,
            },
            cardLabel: data.cardLabel || content.cardLabel,
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
      await api.request('/admin/settings/blocks/node1_command', {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Main Content */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Main Content</h3>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Прошивка: Ваш командный центр"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {/* Terminal Specs */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Terminal Specs</h3>
        <div className="space-y-2">
          <Label>CPU</Label>
          <Input
            value={content.terminalSpecs.cpu}
            onChange={(e) => setContent({
              ...content,
              terminalSpecs: { ...content.terminalSpecs, cpu: e.target.value }
            })}
            placeholder="Quad-core ARM 1.8GHz"
          />
        </div>
        <div className="space-y-2">
          <Label>RAM</Label>
          <Input
            value={content.terminalSpecs.ram}
            onChange={(e) => setContent({
              ...content,
              terminalSpecs: { ...content.terminalSpecs, ram: e.target.value }
            })}
            placeholder="2GB DDR4 High-Speed"
          />
        </div>
        <div className="space-y-2">
          <Label>Flash Storage</Label>
          <Input
            value={content.terminalSpecs.flash}
            onChange={(e) => setContent({
              ...content,
              terminalSpecs: { ...content.terminalSpecs, flash: e.target.value }
            })}
            placeholder="32GB Secure Storage"
          />
        </div>
        <div className="space-y-2">
          <Label>Operating System</Label>
          <Input
            value={content.terminalSpecs.os}
            onChange={(e) => setContent({
              ...content,
              terminalSpecs: { ...content.terminalSpecs, os: e.target.value }
            })}
            placeholder="3WG Custom Hardened Linux"
          />
        </div>
      </div>

      {/* Corner Labels */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Corner Labels (Visualization)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>WAN Label</Label>
            <Input
              value={content.cornerLabels.wan}
              onChange={(e) => setContent({
                ...content,
                cornerLabels: { ...content.cornerLabels, wan: e.target.value }
              })}
              placeholder="WAN"
            />
          </div>
          <div className="space-y-2">
            <Label>LAN Label</Label>
            <Input
              value={content.cornerLabels.lan}
              onChange={(e) => setContent({
                ...content,
                cornerLabels: { ...content.cornerLabels, lan: e.target.value }
              })}
              placeholder="LAN"
            />
          </div>
          <div className="space-y-2">
            <Label>Storage Label</Label>
            <Input
              value={content.cornerLabels.storage}
              onChange={(e) => setContent({
                ...content,
                cornerLabels: { ...content.cornerLabels, storage: e.target.value }
              })}
              placeholder="32GB"
            />
          </div>
          <div className="space-y-2">
            <Label>Memory Label</Label>
            <Input
              value={content.cornerLabels.memory}
              onChange={(e) => setContent({
                ...content,
                cornerLabels: { ...content.cornerLabels, memory: e.target.value }
              })}
              placeholder="2GB DDR4"
            />
          </div>
        </div>
      </div>

      {/* Card Label */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Card Label</h3>
        <div className="space-y-2">
          <Label>Architecture Label</Label>
          <Input
            value={content.cardLabel}
            onChange={(e) => setContent({ ...content, cardLabel: e.target.value })}
            placeholder="NODE-1 ARCHITECTURE"
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
