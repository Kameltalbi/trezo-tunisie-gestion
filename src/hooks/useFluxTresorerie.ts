
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface FluxTresorerie {
  id: string;
  user_id: string;
  date: string;
  type: 'entree' | 'sortie';
  montant: number;
  description: string;
  categorie: string;
  created_at: string;
  updated_at: string;
}

export const useFluxTresorerie = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['flux-tresorerie', user?.id],
    queryFn: async () => {
      // Retourner des données simulées ou vides
      return [];
    },
    enabled: !!user,
  });
};
