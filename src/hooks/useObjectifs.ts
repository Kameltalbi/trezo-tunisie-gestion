

import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";

export interface Objectif {
  id: string;
  user_id: string;
  nom: string;
  type: 'encaissement' | 'reduction_depense' | 'epargne';
  valeur_actuelle: number;
  valeur_cible: number;
  date_debut: string;
  date_fin: string;
  description?: string;
  statut: 'actif' | 'atteint' | 'abandonne';
  created_at: string;
  updated_at: string;
}

export const useObjectifs = () => {
  const { user } = useLocalAuth();
  return useLocalData<Objectif>('trezo_objectifs', user?.id);
};

export const useCreateObjectif = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<Objectif>('trezo_objectifs', user?.id);
  
  const mutationFn = async (data: Omit<Objectif, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await create(data);
  };

  return useLocalMutation(mutationFn);
};

export const useUpdateObjectif = () => {
  const { user } = useLocalAuth();
  const { update } = useLocalData<Objectif>('trezo_objectifs', user?.id);
  
  const mutationFn = async (data: Partial<Objectif> & { id: string }) => {
    const { id, ...updates } = data;
    return await update(id, updates);
  };

  return useLocalMutation(mutationFn);
};

export const useDeleteObjectif = () => {
  const { user } = useLocalAuth();
  const { delete: deleteItem } = useLocalData<Objectif>('trezo_objectifs', user?.id);
  
  const mutationFn = async (id: string) => {
    await deleteItem(id);
  };

  return useLocalMutation(mutationFn);
};

