
import { useLocalData } from "./useLocalData";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";
import { toast } from "sonner";

export interface Entreprise {
  id: string;
  user_id: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  tva?: string;
  logo_url?: string;
  devise_id?: string;
  created_at: string;
  updated_at: string;
}

export const useEntreprise = () => {
  const { user } = useLocalAuth();
  const { data } = useLocalData<Entreprise>('trezo_entreprises', user?.id);
  
  return {
    data: data && data.length > 0 ? data[0] : null,
    isLoading: false,
    error: null
  };
};

export const useUpdateEntreprise = () => {
  const { user } = useLocalAuth();
  const { create, update, data } = useLocalData<Entreprise>('trezo_entreprises', user?.id);

  const mutationFn = async (entreprise: Omit<Entreprise, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { nom: string }) => {
    if (!user) throw new Error('Non authentifié');
    
    if (!entreprise.nom) {
      throw new Error('Le nom de l\'entreprise est requis');
    }

    // Si aucune entreprise n'existe, en créer une nouvelle
    if (!data || data.length === 0) {
      return await create(entreprise);
    } else {
      // Mettre à jour l'entreprise existante
      return await update(data[0].id, entreprise);
    }
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Entreprise mise à jour avec succès"),
    (error) => {
      toast.error("Erreur lors de la mise à jour de l'entreprise");
      console.error('Erreur mise à jour entreprise:', error);
    }
  );
};
