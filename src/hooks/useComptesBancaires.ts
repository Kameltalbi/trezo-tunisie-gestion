
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

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
  
  return {
    mutate: create,
    mutateAsync: create,
    isLoading: false,
    error: null,
  };
};
