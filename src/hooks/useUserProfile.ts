import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UserProfile {
  id: number;
  email: string;
  balance: number;
  telegram_id?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getCurrentUser();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('Ошибка загрузки профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = () => {
    loadProfile();
  };

  return { profile, isLoading, error, refreshProfile };
}
