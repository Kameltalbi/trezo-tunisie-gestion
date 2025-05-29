
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Account {
  id: string;
  name: string;
  plan_id: string;
  status: 'trial' | 'active' | 'expired' | 'pending_activation';
  trial_start_date?: string;
  trial_end_date?: string;
  activation_date?: string;
  valid_until?: string;
  payment_proof_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  label: string;
  price_dt: number;
  max_users: number;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

export const useAccount = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['account', user?.id],
    queryFn: async (): Promise<{ account: Account; plan: Plan } | null> => {
      if (!user) return null;
      
      // D'abord récupérer l'utilisateur avec son compte
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          account_id,
          accounts (
            *,
            plans (*)
          )
        `)
        .eq('id', user.id)
        .single();
      
      if (userError || !userData) {
        console.error('Erreur lors de la récupération des données utilisateur:', userError);
        return null;
      }
      
      return {
        account: userData.accounts as Account,
        plan: userData.accounts.plans as Plan
      };
    },
    enabled: !!user,
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (updates: Partial<Account>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });
};
