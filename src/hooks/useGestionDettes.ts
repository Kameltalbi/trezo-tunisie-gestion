
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GestionDette {
  id: string;
  user_id: string;
  type: 'creance' | 'dette';
  nom_tiers: string;
  montant_initial: number;
  montant_restant: number;
  date_echeance?: string;
  description?: string;
  statut: 'active' | 'soldee' | 'en_retard';
  created_at: string;
  updated_at: string;
}

export const useGestionDettes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['gestion-dettes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('gestion_dettes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GestionDette[];
    },
    enabled: !!user,
  });
};

export const useCreateGestionDette = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<GestionDette, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: dette, error } = await supabase
        .from('gestion_dettes')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return dette;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestion-dettes'] });
    },
  });
};
