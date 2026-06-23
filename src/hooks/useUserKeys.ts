import { useState, useEffect } from 'react';
import { api, VPNKey } from '@/lib/api';

export function useUserKeys() {
  const [keys, setKeys] = useState<VPNKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);
      const data = await api.getKeys();
      setKeys(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load user keys:', err);
      setError('Ошибка загрузки ключей');
      setKeys([]);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const refreshKeys = (silent = true) => {
    loadKeys(silent);
  };

  return { keys, isLoading, error, refreshKeys };
}
