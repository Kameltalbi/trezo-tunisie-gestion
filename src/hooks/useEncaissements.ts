

import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";

export interface Encaissement {
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

export const useEncaissements = () => {
  const { user } = useLocalAuth();
  return useLocalData<Encaissement>('trezo_encaissements', user?.id);
};

export const useCreateEncaissement = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<Encaissement>('trezo_encaissements', user?.id);
  
  const mutationFn = async (data: Omit<Encaissement, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await create(data);
  };

  return useLocalMutation(mutationFn);
};

