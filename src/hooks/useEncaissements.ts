
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Encaissement {
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

export const useEncaissements = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['encaissements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('encaissements')
        .select('*')
        .eq('user_id', user.id)
        .order('date_transaction', { ascending: false });

      if (error) throw error;
      return data as Encaissement[];
    },
    enabled: !!user,
  });
};

export const useCreateEncaissement = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<Encaissement, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: encaissement, error } = await supabase
        .from('encaissements')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return encaissement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encaissements'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
