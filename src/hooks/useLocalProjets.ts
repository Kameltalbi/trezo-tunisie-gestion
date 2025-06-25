
import { useState, useEffect } from 'react';
import { Projet } from '@/types/local';
import { localStorageService } from '@/services/localStorageService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLocalProjets = () => {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjets = () => {
      try {
        const savedProjets = localStorageService.getProjets();
        setProjets(savedProjets);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
        toast.error('Erreur lors du chargement des projets');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjets();
  }, []);

  const createProjet = async (projetData: Omit<Projet, 'id' | 'createdAt'>) => {
    try {
      const newProjet: Projet = {
        ...projetData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      localStorageService.saveProjet(newProjet);
      setProjets(prev => [...prev, newProjet]);
      toast.success('Projet créé avec succès');
      return newProjet;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      toast.error('Erreur lors de la création du projet');
      throw error;
    }
  };

  const updateProjet = async (id: string, updates: Partial<Projet>) => {
    try {
      const existingProjet = projets.find(p => p.id === id);
      if (!existingProjet) {
        throw new Error('Projet non trouvé');
      }

      const updatedProjet = { ...existingProjet, ...updates };
      localStorageService.saveProjet(updatedProjet);
      setProjets(prev => prev.map(p => p.id === id ? updatedProjet : p));
      toast.success('Projet mis à jour');
      return updatedProjet;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      toast.error('Erreur lors de la mise à jour du projet');
      throw error;
    }
  };

  const deleteProjet = async (id: string) => {
    try {
      localStorageService.deleteProjet(id);
      setProjets(prev => prev.filter(p => p.id !== id));
      toast.success('Projet supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
      throw error;
    }
  };

  return {
    data: projets,
    isLoading,
    createProjet,
    updateProjet,
    deleteProjet,
  };
};
