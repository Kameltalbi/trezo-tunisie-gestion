
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['objectifs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('objectifs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Objectif[];
    },
    enabled: !!user,
  });
};

export const useCreateObjectif = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<Objectif, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: objectif, error } = await supabase
        .from('objectifs')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return objectif;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectifs'] });
    },
  });
};
