
import { useState, useEffect } from 'react';
import { Entreprise } from '@/types/local';
import { localStorageService } from '@/services/localStorageService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLocalEntreprise = () => {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntreprise = () => {
      try {
        const savedEntreprise = localStorageService.getEntreprise();
        setEntreprise(savedEntreprise);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'entreprise:', error);
        toast.error('Erreur lors du chargement de l\'entreprise');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntreprise();
  }, []);

  const updateEntreprise = async (entrepriseData: Partial<Entreprise> & { nom: string }) => {
    try {
      const updatedEntreprise: Entreprise = {
        id: entreprise?.id || uuidv4(),
        createdAt: entreprise?.createdAt || new Date().toISOString(),
        ...entreprise,
        ...entrepriseData,
      };

      localStorageService.saveEntreprise(updatedEntreprise);
      setEntreprise(updatedEntreprise);
      toast.success('Entreprise mise à jour avec succès');
      return updatedEntreprise;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      toast.error('Erreur lors de la mise à jour de l\'entreprise');
      throw error;
    }
  };

  return {
    data: entreprise,
    isLoading,
    updateEntreprise,
  };
};
