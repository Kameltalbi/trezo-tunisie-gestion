
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/local';
import { localStorageService } from '@/services/localStorageService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLocalDecaissements = () => {
  const [decaissements, setDecaissements] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDecaissements = () => {
      try {
        const savedTransactions = localStorageService.getTransactions();
        const filteredDecaissements = savedTransactions.filter(t => t.type === 'decaissement');
        setDecaissements(filteredDecaissements);
      } catch (error) {
        console.error('Erreur lors du chargement des décaissements:', error);
        toast.error('Erreur lors du chargement des décaissements');
      } finally {
        setIsLoading(false);
      }
    };

    loadDecaissements();
  }, []);

  const createDecaissement = async (decaissementData: Omit<Transaction, 'id' | 'createdAt' | 'type'>) => {
    try {
      const newDecaissement: Transaction = {
        ...decaissementData,
        id: uuidv4(),
        type: 'decaissement',
        createdAt: new Date().toISOString(),
      };

      localStorageService.saveTransaction(newDecaissement);
      setDecaissements(prev => [...prev, newDecaissement]);
      toast.success('Décaissement créé avec succès');
      return newDecaissement;
    } catch (error) {
      console.error('Erreur lors de la création du décaissement:', error);
      toast.error('Erreur lors de la création du décaissement');
      throw error;
    }
  };

  const updateDecaissement = async (id: string, updates: Partial<Transaction>) => {
    try {
      const existingDecaissement = decaissements.find(d => d.id === id);
      if (!existingDecaissement) {
        throw new Error('Décaissement non trouvé');
      }

      const updatedDecaissement = { ...existingDecaissement, ...updates };
      localStorageService.saveTransaction(updatedDecaissement);
      setDecaissements(prev => prev.map(d => d.id === id ? updatedDecaissement : d));
      toast.success('Décaissement mis à jour');
      return updatedDecaissement;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du décaissement:', error);
      toast.error('Erreur lors de la mise à jour du décaissement');
      throw error;
    }
  };

  const deleteDecaissement = async (id: string) => {
    try {
      localStorageService.deleteTransaction(id);
      setDecaissements(prev => prev.filter(d => d.id !== id));
      toast.success('Décaissement supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du décaissement:', error);
      toast.error('Erreur lors de la suppression du décaissement');
      throw error;
    }
  };

  return {
    data: decaissements,
    isLoading,
    createDecaissement,
    updateDecaissement,
    deleteDecaissement,
  };
};
