import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UserStats {
  total_keys: number;
  active_keys: number;
  total_data_used: number; // в байтах
  total_sessions: number;
  uptime_days: number;
  last_connection?: string;
}

const defaultStats: UserStats = {
  total_keys: 0,
  active_keys: 0,
  total_data_used: 0,
  total_sessions: 0,
  uptime_days: 0,
};

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getUserStats();
      // Если API возвращает массив Statistics, преобразуем в UserStats
      if (Array.isArray(data)) {
        // Агрегируем статистику
        const aggregated: UserStats = {
          total_keys: 0,
          active_keys: 0,
          total_data_used: data.reduce((sum, stat) => sum + stat.bytes_sent + stat.bytes_received, 0),
          total_sessions: data.length,
          uptime_days: data.reduce((sum, stat) => sum + stat.connection_time, 0) / (24 * 60 * 60),
        };
        setStats(aggregated);
      } else {
        setStats(data || defaultStats);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
      setError('Ошибка загрузки статистики');
      setStats(defaultStats);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = () => {
    loadStats();
  };

  // Форматирование данных для отображения
  const formatDataUsed = () => {
    const gb = stats.total_data_used / (1024 * 1024 * 1024);
    return gb.toFixed(0);
  };

  const formatUptime = () => {
    const days = Math.floor(stats.uptime_days);
    const hours = Math.floor((stats.uptime_days - days) * 24);
    return `${days}d ${hours}h`;
  };

  return { 
    stats, 
    isLoading, 
    error, 
    refreshStats,
    formatDataUsed,
    formatUptime,
  };
}
