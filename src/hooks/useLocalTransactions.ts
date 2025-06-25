
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/local';
import { localStorageService } from '@/services/localStorageService';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useLocalTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const savedTransactions = localStorageService.getTransactions();
        setTransactions(savedTransactions);
      } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error);
        toast.error('Erreur lors du chargement des transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        ...transactionData,
        id: uuidv4(),
        user_id: 'local-user',
        created_at: now,
        updated_at: now,
      };

      localStorageService.saveTransaction(newTransaction);
      setTransactions(prev => [...prev, newTransaction]);
      toast.success('Transaction créée avec succès');
      return newTransaction;
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      toast.error('Erreur lors de la création de la transaction');
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const existingTransaction = transactions.find(t => t.id === id);
      if (!existingTransaction) {
        throw new Error('Transaction non trouvée');
      }

      const updatedTransaction = { 
        ...existingTransaction, 
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorageService.saveTransaction(updatedTransaction);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      toast.success('Transaction mise à jour');
      return updatedTransaction;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      toast.error('Erreur lors de la mise à jour de la transaction');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      localStorageService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      toast.error('Erreur lors de la suppression de la transaction');
      throw error;
    }
  };

  return {
    data: transactions,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
