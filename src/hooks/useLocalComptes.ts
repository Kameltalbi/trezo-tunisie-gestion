
import { useState, useEffect } from 'react';
import { CompteBancaire } from '@/types/local';
import { localStorageService } from '@/services/localStorageService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLocalComptes = () => {
  const [comptes, setComptes] = useState<CompteBancaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComptes = () => {
      try {
        const savedComptes = localStorageService.getComptes();
        setComptes(savedComptes);
      } catch (error) {
        console.error('Erreur lors du chargement des comptes:', error);
        toast.error('Erreur lors du chargement des comptes');
      } finally {
        setIsLoading(false);
      }
    };

    loadComptes();
  }, []);

  const createCompte = async (compteData: Omit<CompteBancaire, 'id' | 'createdAt'>) => {
    try {
      const newCompte: CompteBancaire = {
        ...compteData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      localStorageService.saveCompte(newCompte);
      setComptes(prev => [...prev, newCompte]);
      toast.success('Compte créé avec succès');
      return newCompte;
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error('Erreur lors de la création du compte');
      throw error;
    }
  };

  const updateCompte = async (id: string, updates: Partial<CompteBancaire>) => {
    try {
      const existingCompte = comptes.find(c => c.id === id);
      if (!existingCompte) {
        throw new Error('Compte non trouvé');
      }

      const updatedCompte = { ...existingCompte, ...updates };
      localStorageService.saveCompte(updatedCompte);
      setComptes(prev => prev.map(c => c.id === id ? updatedCompte : c));
      toast.success('Compte mis à jour');
      return updatedCompte;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compte:', error);
      toast.error('Erreur lors de la mise à jour du compte');
      throw error;
    }
  };

  const deleteCompte = async (id: string) => {
    try {
      localStorageService.deleteCompte(id);
      setComptes(prev => prev.filter(c => c.id !== id));
      toast.success('Compte supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error('Erreur lors de la suppression du compte');
      throw error;
    }
  };

  return {
    data: comptes,
    isLoading,
    createCompte,
    updateCompte,
    deleteCompte,
  };
};
