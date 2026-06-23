import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw, Loader2, Shield, Mail, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface SystemSettings {
  site_name: string;
  site_url: string;
  admin_email: string;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_enabled: boolean;
  registration_enabled: boolean;
  maintenance_mode: boolean;
  max_keys_per_user: number;
  default_key_duration_days: number;
  telegram_bot_token: string;
  telegram_notifications_enabled: boolean;
}

const defaultSettings: SystemSettings = {
  site_name: '3WG VPN',
  site_url: 'https://3wg.ru',
  admin_email: 'admin@3wg.ru',
  smtp_host: '',
  smtp_port: 587,
  smtp_user: '',
  smtp_password: '',
  smtp_enabled: false,
  registration_enabled: true,
  maintenance_mode: false,
  max_keys_per_user: 5,
  default_key_duration_days: 30,
  telegram_bot_token: '',
  telegram_notifications_enabled: false,
};

export function SettingsTab() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<SystemSettings>('/admin/settings/system');
      setSettings(data as SystemSettings);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Ошибка загрузки настроек');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.request('/admin/settings/system', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      toast.success('Настройки сохранены!');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    loadSettings();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono">Настройки системы</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Конфигурация сервиса и интеграций
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="font-mono"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Отменить
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-primary hover:bg-primary/90 text-black font-mono"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono">Основные настройки</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="site_name" className="font-mono text-sm">Название сайта</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="font-mono mt-2"
                />
              </div>
              <div>
                <Label htmlFor="site_url" className="font-mono text-sm">URL сайта</Label>
                <Input
                  id="site_url"
                  value={settings.site_url}
                  onChange={(e) => handleChange('site_url', e.target.value)}
                  className="font-mono mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="admin_email" className="font-mono text-sm">Email администратора</Label>
              <Input
                id="admin_email"
                type="email"
                value={settings.admin_email}
                onChange={(e) => handleChange('admin_email', e.target.value)}
                className="font-mono mt-2"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded border border-border">
              <div>
                <div className="font-mono text-sm font-bold">Регистрация новых пользователей</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  Разрешить регистрацию через форму
                </div>
              </div>
              <Switch
                checked={settings.registration_enabled}
                onCheckedChange={(checked) => handleChange('registration_enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded border border-accent/30 bg-accent/5">
              <div>
                <div className="font-mono text-sm font-bold text-accent">Режим обслуживания</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  Временно отключить доступ к сайту
                </div>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* VPN Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono">Настройки VPN</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_keys" className="font-mono text-sm">Макс. ключей на пользователя</Label>
                <Input
                  id="max_keys"
                  type="number"
                  value={settings.max_keys_per_user}
                  onChange={(e) => handleChange('max_keys_per_user', parseInt(e.target.value))}
                  className="font-mono mt-2"
                />
              </div>
              <div>
                <Label htmlFor="key_duration" className="font-mono text-sm">Срок действия ключа (дни)</Label>
                <Input
                  id="key_duration"
                  type="number"
                  value={settings.default_key_duration_days}
                  onChange={(e) => handleChange('default_key_duration_days', parseInt(e.target.value))}
                  className="font-mono mt-2"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono">Настройки SMTP</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded border border-border mb-4">
              <div>
                <div className="font-mono text-sm font-bold">Email уведомления</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  Отправка писем через SMTP
                </div>
              </div>
              <Switch
                checked={settings.smtp_enabled}
                onCheckedChange={(checked) => handleChange('smtp_enabled', checked)}
              />
            </div>

            {settings.smtp_enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_host" className="font-mono text-sm">SMTP Host</Label>
                    <Input
                      id="smtp_host"
                      value={settings.smtp_host}
                      onChange={(e) => handleChange('smtp_host', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="font-mono mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port" className="font-mono text-sm">SMTP Port</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={settings.smtp_port}
                      onChange={(e) => handleChange('smtp_port', parseInt(e.target.value))}
                      className="font-mono mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_user" className="font-mono text-sm">SMTP User</Label>
                    <Input
                      id="smtp_user"
                      value={settings.smtp_user}
                      onChange={(e) => handleChange('smtp_user', e.target.value)}
                      className="font-mono mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_password" className="font-mono text-sm">SMTP Password</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={settings.smtp_password}
                      onChange={(e) => handleChange('smtp_password', e.target.value)}
                      className="font-mono mt-2"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Telegram Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border border-border bg-card"
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-mono">Telegram интеграция</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded border border-border mb-4">
              <div>
                <div className="font-mono text-sm font-bold">Telegram уведомления</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  Отправка уведомлений через бота
                </div>
              </div>
              <Switch
                checked={settings.telegram_notifications_enabled}
                onCheckedChange={(checked) => handleChange('telegram_notifications_enabled', checked)}
              />
            </div>

            {settings.telegram_notifications_enabled && (
              <div>
                <Label htmlFor="telegram_token" className="font-mono text-sm">Telegram Bot Token</Label>
                <Input
                  id="telegram_token"
                  type="password"
                  value={settings.telegram_bot_token}
                  onChange={(e) => handleChange('telegram_bot_token', e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="font-mono mt-2"
                />
                <p className="text-xs text-muted-foreground font-mono mt-2">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
      >
        <p className="text-sm font-mono text-muted-foreground">
          💡 <span className="text-primary">Совет:</span> После изменения настроек может потребоваться перезапуск сервиса.
        </p>
      </motion.div>
    </div>
  );
}
