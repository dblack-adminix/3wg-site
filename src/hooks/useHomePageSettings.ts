import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface HomePageSettings {
  hero_section: boolean;
  keenetic_section: boolean;
  vpn_section: boolean;
  services_section: boolean;
  pricing_section: boolean;
  hardware_section: boolean;
  infrastructure_section: boolean;
  faq_section: boolean;
  articles_section: boolean;
  telegram_section: boolean;
  status_widget: boolean;
  block_order: string[];
}

const defaultSettings: HomePageSettings = {
  hero_section: true,
  keenetic_section: true,
  vpn_section: true,
  services_section: true,
  pricing_section: true,
  hardware_section: true,
  infrastructure_section: true,
  faq_section: true,
  articles_section: true,
  telegram_section: true,
  status_widget: true,
  block_order: [
    'keenetic_section',
    'vpn_section',
    'pricing_section',
    'services_section',
    'hardware_section',
    'infrastructure_section',
    'faq_section',
    'articles_section',
    'telegram_section',
    'status_widget',
  ],
};

export function useHomePageSettings() {
  const [settings, setSettings] = useState<HomePageSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    
    // Слушаем изменения в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homepage_settings') {
        loadSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Также слушаем кастомное событие для изменений в том же окне
    const handleSettingsUpdate = () => {
      loadSettings();
    };
    
    window.addEventListener('homepage-settings-updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('homepage-settings-updated', handleSettingsUpdate);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getHomePageSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load homepage settings:', error);
      // Используем дефолтные настройки при ошибке
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, reload: loadSettings };
}
