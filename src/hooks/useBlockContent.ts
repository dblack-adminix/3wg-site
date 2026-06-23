import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useBlockContent<T>(blockKey: string, defaultContent: T) {
  const [content, setContent] = useState<T>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [blockKey]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const data = await api.request<T>(`/settings/blocks/${blockKey}`);
      console.log(`[useBlockContent] ${blockKey} loaded:`, data);
      if (Object.keys(data as object).length > 0) {
        const merged = { ...defaultContent, ...data };
        console.log(`[useBlockContent] ${blockKey} merged:`, merged);
        setContent(merged);
      } else {
        console.log(`[useBlockContent] ${blockKey} empty, using defaults:`, defaultContent);
        setContent(defaultContent);
      }
    } catch (error) {
      console.error(`Failed to load ${blockKey} content:`, error);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  };

  return { content, isLoading };
}
