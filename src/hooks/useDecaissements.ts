
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface Decaissement {
  id: string;
  user_id: string;
  compte_id?: string;
  projet_id?: string;
  titre: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  sous_categorie?: string;
  description?: string;
  reference?: string;
  statut: 'confirme' | 'en_attente' | 'annule';
  recurrence?: 'aucune' | 'quotidienne' | 'hebdomadaire' | 'bimensuelle' | 'mensuelle' | 'trimestrielle' | 'semestrielle' | 'annuelle';
  created_at: string;
  updated_at: string;
}

export const useDecaissements = () => {
  const { user } = useLocalAuth();
  return useLocalData<Decaissement>('trezo_decaissements', user?.id);
};

export const useCreateDecaissement = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<Decaissement>('trezo_decaissements', user?.id);
  
  return {
    mutate: create,
    mutateAsync: create,
    isLoading: false,
    error: null,
  };
};
