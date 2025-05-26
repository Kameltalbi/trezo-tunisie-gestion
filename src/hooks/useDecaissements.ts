
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Decaissement {
  id: string;
  user_id: string;
  compte_id?: string;
  projet_id?: string;
  titre: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  sous_categorie?: string;
  description?: string;
  reference?: string;
  statut: 'confirme' | 'en_attente' | 'annule';
  recurrence: 'aucune' | 'quotidienne' | 'hebdomadaire' | 'bimensuelle' | 'mensuelle' | 'trimestrielle' | 'semestrielle' | 'annuelle';
  created_at: string;
  updated_at: string;
}

export const useDecaissements = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['decaissements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('decaissements')
        .select('*')
        .eq('user_id', user.id)
        .order('date_transaction', { ascending: false });

      if (error) throw error;
      return data as Decaissement[];
    },
    enabled: !!user,
  });
};

export const useCreateDecaissement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<Decaissement, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: decaissement, error } = await supabase
        .from('decaissements')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return decaissement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decaissements'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
