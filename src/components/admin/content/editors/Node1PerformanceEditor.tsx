import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface PerformanceContent {
  sectionTitle: string;
  sectionSubtitle: string;
  mainTitle: string;
  mainDescription: string;
  hardwareSpecs: {
    cpu: string;
    ram: string;
    storage: string;
  };
  performanceSpecs: {
    wireguard: string;
    amneziawg: string;
    power: string;
    temperature: string;
  };
}

interface Node1PerformanceEditorProps {
  onClose: () => void;
}

export function Node1PerformanceEditor({ onClose }: Node1PerformanceEditorProps) {
  const [content, setContent] = useState<PerformanceContent>({
    sectionTitle: 'Под Капотом:',
    sectionSubtitle: 'Производительность',
    mainTitle: 'Не просто router.\nВаш личный сервер.',
    mainDescription: 'NODE-1 — это не клиентское устройство. Это выделенный вычислительный узел, созданный для одной цели: обеспечить ваш цифровой суверенитет. Отказоустойчивость, скорость и невидимость — его фундаментальные принципы.',
    hardwareSpecs: {
      cpu: 'Custom ARM Core @ 1.8 GHz',
      ram: '2GB DDR4 ECC (Error-Correcting Code)',
      storage: '32GB eMMC (Secure Flash)',
    },
    performanceSpecs: {
      wireguard: 'Up to 950 Mbps (WireGuard)',
      amneziawg: 'Up to 800 Mbps (AmneziaWG)',
      power: '<10W (optimized 24/7 operation)',
      temperature: '-20°C to +60°C',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await api.request<PerformanceContent>('/settings/blocks/node1_performance');
        console.log('Performance data loaded:', data);
        if (data && Object.keys(data).length > 0) {
          // Merge with defaults to ensure all fields exist
          setContent({
            sectionTitle: data.sectionTitle || content.sectionTitle,
            sectionSubtitle: data.sectionSubtitle || content.sectionSubtitle,
            mainTitle: data.mainTitle || content.mainTitle,
            mainDescription: data.mainDescription || content.mainDescription,
            hardwareSpecs: {
              cpu: data.hardwareSpecs?.cpu || content.hardwareSpecs.cpu,
              ram: data.hardwareSpecs?.ram || content.hardwareSpecs.ram,
              storage: data.hardwareSpecs?.storage || content.hardwareSpecs.storage,
            },
            performanceSpecs: {
              wireguard: data.performanceSpecs?.wireguard || content.performanceSpecs.wireguard,
              amneziawg: data.performanceSpecs?.amneziawg || content.performanceSpecs.amneziawg,
              power: data.performanceSpecs?.power || content.performanceSpecs.power,
              temperature: data.performanceSpecs?.temperature || content.performanceSpecs.temperature,
            },
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
      await api.request('/admin/settings/blocks/node1_performance', {
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
      {/* Section Header */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Section Header</h3>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.sectionTitle}
            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
            placeholder="Под Капотом:"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={content.sectionSubtitle}
            onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
            placeholder="Производительность"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Main Content</h3>
        <div className="space-y-2">
          <Label>Title (use \n for line breaks)</Label>
          <Textarea
            value={content.mainTitle}
            onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
            placeholder="Не просто router.\nВаш личный сервер."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={content.mainDescription}
            onChange={(e) => setContent({ ...content, mainDescription: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      {/* Hardware Specs */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Hardware Specs</h3>
        <div className="space-y-2">
          <Label>CPU</Label>
          <Input
            value={content.hardwareSpecs.cpu}
            onChange={(e) => setContent({
              ...content,
              hardwareSpecs: { ...content.hardwareSpecs, cpu: e.target.value }
            })}
            placeholder="Custom ARM Core @ 1.8 GHz"
          />
        </div>
        <div className="space-y-2">
          <Label>RAM</Label>
          <Input
            value={content.hardwareSpecs.ram}
            onChange={(e) => setContent({
              ...content,
              hardwareSpecs: { ...content.hardwareSpecs, ram: e.target.value }
            })}
            placeholder="2GB DDR4 ECC"
          />
        </div>
        <div className="space-y-2">
          <Label>Storage</Label>
          <Input
            value={content.hardwareSpecs.storage}
            onChange={(e) => setContent({
              ...content,
              hardwareSpecs: { ...content.hardwareSpecs, storage: e.target.value }
            })}
            placeholder="32GB eMMC (Secure Flash)"
          />
        </div>
      </div>

      {/* Performance Specs */}
      <div className="space-y-4 pb-4 border-b">
        <h3 className="font-semibold text-lg">Performance Specs</h3>
        <div className="space-y-2">
          <Label>WireGuard Throughput</Label>
          <Input
            value={content.performanceSpecs.wireguard}
            onChange={(e) => setContent({
              ...content,
              performanceSpecs: { ...content.performanceSpecs, wireguard: e.target.value }
            })}
            placeholder="Up to 950 Mbps (WireGuard)"
          />
        </div>
        <div className="space-y-2">
          <Label>AmneziaWG Throughput</Label>
          <Input
            value={content.performanceSpecs.amneziawg}
            onChange={(e) => setContent({
              ...content,
              performanceSpecs: { ...content.performanceSpecs, amneziawg: e.target.value }
            })}
            placeholder="Up to 800 Mbps (AmneziaWG)"
          />
        </div>
        <div className="space-y-2">
          <Label>Power Draw</Label>
          <Input
            value={content.performanceSpecs.power}
            onChange={(e) => setContent({
              ...content,
              performanceSpecs: { ...content.performanceSpecs, power: e.target.value }
            })}
            placeholder="<10W (optimized 24/7 operation)"
          />
        </div>
        <div className="space-y-2">
          <Label>Operating Temperature</Label>
          <Input
            value={content.performanceSpecs.temperature}
            onChange={(e) => setContent({
              ...content,
              performanceSpecs: { ...content.performanceSpecs, temperature: e.target.value }
            })}
            placeholder="-20°C to +60°C"
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
