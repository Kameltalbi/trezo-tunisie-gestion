
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";

export interface GestionDette {
  id: string;
  user_id: string;
  type: 'creance' | 'dette';
  nom_tiers: string;
  montant_initial: number;
  montant_restant: number;
  date_echeance?: string;
  description?: string;
  statut: 'active' | 'soldee' | 'en_retard';
  created_at: string;
  updated_at: string;
}

export const useGestionDettes = () => {
  const { user } = useLocalAuth();
  return useLocalData<GestionDette>('trezo_dettes', user?.id);
};

export const useCreateGestionDette = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<GestionDette>('trezo_dettes', user?.id);
  
  const mutationFn = async (data: Omit<GestionDette, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await create(data);
  };

  return useLocalMutation(mutationFn);
};
