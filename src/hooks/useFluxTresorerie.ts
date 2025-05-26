
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface FluxTresorerie {
  id: string;
  user_id: string;
  compte_id?: string;
  date_prevision: string;
  type: 'entree' | 'sortie';
  montant_prevu: number;
  montant_realise?: number;
  description?: string;
  categorie?: string;
  statut: 'prevu' | 'realise' | 'annule';
  created_at: string;
  updated_at: string;
}

export const useFluxTresorerie = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['flux-tresorerie', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('flux_tresorerie')
        .select('*')
        .eq('user_id', user.id)
        .order('date_prevision', { ascending: false });

      if (error) throw error;
      return data as FluxTresorerie[];
    },
    enabled: !!user,
  });
};

export const useCreateFluxTresorerie = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<FluxTresorerie, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: flux, error } = await supabase
        .from('flux_tresorerie')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return flux;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flux-tresorerie'] });
    },
  });
};
