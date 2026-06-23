import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Server {
  id: number;
  name: string;
  location: string;
  country: string;
  country_code: string;
  ip_address: string;
  port: number;
  protocol: string;
  status: string;
  max_users: number;
  current_users: number;
  created_at: string;
  updated_at: string;
}

export function useServers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getServers();
      setServers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load servers:', err);
      setError('Ошибка загрузки серверов');
      setServers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshServers = () => {
    loadServers();
  };

  return { servers, isLoading, error, refreshServers };
}
