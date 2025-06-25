

import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";

export interface CompteBancaire {
  id: string;
  user_id: string;
  nom: string;
  type: 'courant' | 'epargne' | 'credit';
  banque: string;
  numero_compte?: string;
  solde_initial: number;
  solde_actuel: number;
  devise_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useComptesBancaires = () => {
  const { user } = useLocalAuth();
  return useLocalData<CompteBancaire>('trezo_comptes', user?.id);
};

export const useCreateCompteBancaire = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<CompteBancaire>('trezo_comptes', user?.id);
  
  const mutationFn = async (data: Omit<CompteBancaire, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await create(data);
  };

  return useLocalMutation(mutationFn);
};

