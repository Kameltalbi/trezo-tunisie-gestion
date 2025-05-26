
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['projets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('projets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Projet[];
    },
    enabled: !!user,
  });
};

export const useCreateProjet = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<Projet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: projet, error } = await supabase
        .from('projets')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return projet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    },
  });
};

export const useUpdateProjet = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Projet> & { id: string }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: projet, error } = await supabase
        .from('projets')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return projet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    },
  });
};

export const useDeleteProjet = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User must be authenticated");

      const { error } = await supabase
        .from('projets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projets'] });
    },
  });
};
