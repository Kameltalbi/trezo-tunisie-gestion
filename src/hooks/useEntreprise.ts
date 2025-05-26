
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Entreprise {
  id: string;
  user_id: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  siret?: string;
  tva?: string;
  logo_url?: string;
  secteur_activite?: string;
  forme_juridique?: string;
  capital?: number;
  devise_id?: string;
}

export const useEntreprise = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['entreprise', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data as Entreprise;
    },
    enabled: !!user,
  });
};

export const useUpdateEntreprise = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entreprise: Partial<Entreprise>) => {
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('entreprises')
        .upsert({
          user_id: user.id,
          ...entreprise,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast("Entreprise mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['entreprise'] });
    },
    onError: (error) => {
      toast("Erreur lors de la mise à jour de l'entreprise");
      console.error('Erreur mise à jour entreprise:', error);
    }
  });
};
