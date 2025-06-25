
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

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
  
  return {
    mutate: create,
    mutateAsync: create,
    isLoading: false,
    error: null,
  };
};

export const useUpdateProjet = () => {
  const { user } = useLocalAuth();
  const { update } = useLocalData<Projet>('trezo_projets', user?.id);
  
  return {
    mutate: ({ id, ...data }: Partial<Projet> & { id: string }) => update(id, data),
    mutateAsync: ({ id, ...data }: Partial<Projet> & { id: string }) => update(id, data),
    isLoading: false,
    error: null,
  };
};

export const useDeleteProjet = () => {
  const { user } = useLocalAuth();
  const { delete: deleteItem } = useLocalData<Projet>('trezo_projets', user?.id);
  
  return {
    mutate: deleteItem,
    mutateAsync: deleteItem,
    isLoading: false,
    error: null,
  };
};
