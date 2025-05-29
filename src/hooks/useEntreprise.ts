
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
  tva?: string;
  logo_url?: string;
  devise_id?: string;
  created_at: string;
  updated_at: string;
}

export const useEntreprise = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['entreprise', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Entreprise | null;
    },
    enabled: !!user,
  });
};

export const useUpdateEntreprise = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entreprise: Partial<Entreprise> & { nom: string }) => {
      if (!user) throw new Error('Non authentifié');
      
      if (!entreprise.nom) {
        throw new Error('Le nom de l\'entreprise est requis');
      }

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
      toast.success("Entreprise mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['entreprise'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'entreprise");
      console.error('Erreur mise à jour entreprise:', error);
    }
  });
};
