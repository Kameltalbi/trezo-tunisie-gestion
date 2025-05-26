
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CompteBancaire {
  id: string;
  user_id: string;
  nom: string;
  type: 'courant' | 'epargne' | 'credit';
  banque: string;
  numero_compte?: string;
  solde_initial: number;
  solde_actuel: number;
  devise_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useComptesBancaires = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['comptes-bancaires', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('comptes_bancaires')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CompteBancaire[];
    },
    enabled: !!user,
  });
};

export const useCreateCompteBancaire = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<CompteBancaire, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: compte, error } = await supabase
        .from('comptes_bancaires')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return compte;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comptes-bancaires'] });
    },
  });
};
