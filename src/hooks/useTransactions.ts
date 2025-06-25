
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface Transaction {
  id: string;
  user_id: string;
  compte_id?: string;
  projet_id?: string;
  type: 'encaissement' | 'decaissement';
  titre: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  sous_categorie?: string;
  description?: string;
  reference?: string;
  statut: 'confirme' | 'en_attente' | 'annule';
  source: 'manuel' | 'prevision' | 'import';
  created_at: string;
  updated_at: string;
}

export const useTransactions = () => {
  const { user } = useLocalAuth();
  return useLocalData<Transaction>('trezo_transactions', user?.id);
};

export const useCreateTransaction = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<Transaction>('trezo_transactions', user?.id);
  
  return {
    mutate: create,
    mutateAsync: create,
    isLoading: false,
    error: null,
  };
};
