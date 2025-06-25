
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

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
  
  return {
    mutate: create,
    mutateAsync: create,
    isLoading: false,
    error: null,
  };
};

export const useUpdateObjectif = () => {
  const { user } = useLocalAuth();
  const { update } = useLocalData<Objectif>('trezo_objectifs', user?.id);
  
  return {
    mutate: ({ id, ...data }: Partial<Objectif> & { id: string }) => update(id, data),
    mutateAsync: ({ id, ...data }: Partial<Objectif> & { id: string }) => update(id, data),
    isLoading: false,
    error: null,
  };
};

export const useDeleteObjectif = () => {
  const { user } = useLocalAuth();
  const { delete: deleteItem } = useLocalData<Objectif>('trezo_objectifs', user?.id);
  
  return {
    mutate: deleteItem,
    mutateAsync: deleteItem,
    isLoading: false,
    error: null,
  };
};
