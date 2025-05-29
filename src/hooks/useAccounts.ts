
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Account {
  id: string;
  name: string;
  plan_id: string;
  status: 'trial' | 'active' | 'expired' | 'pending_activation';
  trial_start_date: string | null;
  trial_end_date: string | null;
  activation_date: string | null;
  valid_until: string | null;
  currency_code: string;
  currency_symbol: string;
  created_at: string;
  updated_at: string;
}

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Account[];
    },
  });
};

export const useCurrentAccount = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['current-account', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      return data as Account;
    },
    enabled: !!user,
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, updates }: { 
      accountId: string; 
      updates: Partial<Account>;
    }) => {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Compte mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['current-account'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du compte");
      console.error('Erreur mise à jour compte:', error);
    }
  });
};
