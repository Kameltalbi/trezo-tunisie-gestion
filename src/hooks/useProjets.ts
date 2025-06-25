
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";

export interface Projet {
  id: string;
  user_id: string;
  nom: string;
  description?: string;
  budget_prevu: number;
  budget_consomme: number;
  date_debut: string;
  date_fin?: string;
  statut: 'actif' | 'termine' | 'en_attente' | 'annule';
  created_at: string;
  updated_at: string;
}

export const useProjets = () => {
  const { user } = useLocalAuth();
  return useLocalData<Projet>('trezo_projets', user?.id);
};

export const useCreateProjet = () => {
  const { user } = useLocalAuth();
  const { create } = useLocalData<Projet>('trezo_projets', user?.id);
  
  const mutationFn = async (data: Omit<Projet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    return await create(data);
  };

  return useLocalMutation(mutationFn);
};

export const useUpdateProjet = () => {
  const { user } = useLocalAuth();
  const { update } = useLocalData<Projet>('trezo_projets', user?.id);
  
  const mutationFn = async ({ id, ...data }: Partial<Projet> & { id: string }) => {
    return await update(id, data);
  };

  return useLocalMutation(mutationFn);
};

export const useDeleteProjet = () => {
  const { user } = useLocalAuth();
  const { delete: deleteItem } = useLocalData<Projet>('trezo_projets', user?.id);
  
  const mutationFn = async (id: string) => {
    await deleteItem(id);
  };

  return useLocalMutation(mutationFn);
};
