
// Hook générique pour gérer les données locales
import { useState, useEffect } from 'react';

export interface LocalDataHook<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
  create: (item: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  refetch: () => void;
}

export const useLocalData = <T extends { id: string; user_id?: string }>(
  storageKey: string,
  userId?: string
): LocalDataHook<T> => {
  const [data, setData] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = () => {
    try {
      setIsLoading(true);
      const stored = localStorage.getItem(storageKey);
      const allData = stored ? JSON.parse(stored) : [];
      
      // Filtrer par utilisateur si un userId est fourni
      const filteredData = userId 
        ? allData.filter((item: T) => item.user_id === userId)
        : allData;
      
      setData(filteredData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur de chargement'));
    } finally {
      setIsLoading(false);
    }
  };

  const create = async (item: Omit<T, 'id'>): Promise<T> => {
    try {
      const stored = localStorage.getItem(storageKey);
      const allData = stored ? JSON.parse(stored) : [];
      
      const newItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as unknown as T;
      
      allData.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(allData));
      
      loadData(); // Recharger les données
      return newItem;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur de création');
    }
  };

  const update = async (id: string, updates: Partial<T>): Promise<T> => {
    try {
      const stored = localStorage.getItem(storageKey);
      const allData = stored ? JSON.parse(stored) : [];
      
      const index = allData.findIndex((item: T) => item.id === id);
      if (index === -1) {
        throw new Error('Élément non trouvé');
      }
      
      allData[index] = { 
        ...allData[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      };
      
      localStorage.setItem(storageKey, JSON.stringify(allData));
      
      loadData(); // Recharger les données
      return allData[index];
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur de mise à jour');
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    try {
      const stored = localStorage.getItem(storageKey);
      const allData = stored ? JSON.parse(stored) : [];
      
      const filteredData = allData.filter((item: T) => item.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(filteredData));
      
      loadData(); // Recharger les données
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur de suppression');
    }
  };

  useEffect(() => {
    loadData();
  }, [storageKey, userId]);

  return {
    data,
    isLoading,
    error,
    create,
    update,
    delete: deleteItem,
    refetch: loadData
  };
};
