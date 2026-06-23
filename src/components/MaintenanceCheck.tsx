import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

export const MaintenanceCheck = ({ children }: MaintenanceCheckProps) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const settings = await api.request<{ maintenance_mode?: boolean }>('/settings/system');
      setIsMaintenanceMode(settings.maintenance_mode || false);
    } catch (error) {
      console.error('Failed to check maintenance mode:', error);
      setIsMaintenanceMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Если режим обслуживания включен
  if (isMaintenanceMode) {
    // Пропускаем админов
    if (user?.is_admin) {
      return <>{children}</>;
    }
    
    // Пропускаем страницу обслуживания и админ панель
    if (location.pathname === '/maintenance' || location.pathname === '/admin' || location.pathname === '/login') {
      return <>{children}</>;
    }
    
    // Всех остальных редиректим на страницу обслуживания
    return <Navigate to="/maintenance" replace />;
  }

  return <>{children}</>;
};
