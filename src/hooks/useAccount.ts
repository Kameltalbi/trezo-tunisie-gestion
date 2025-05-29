
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
      
      // Pour l'instant, on utilise la table profiles existante
      // et on simule la structure account jusqu'à ce que les types soient mis à jour
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile) {
        console.error('Erreur lors de la récupération du profil:', profileError);
        return null;
      }

      // Récupérer le plan trial par défaut
      const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .eq('name', 'trial')
        .single();

      if (plansError) {
        console.error('Erreur lors de la récupération du plan:', plansError);
        return null;
      }

      // Simuler un account basé sur le profile existant
      const mockAccount: Account = {
        id: profile.id,
        name: profile.company_name || 'Mon Entreprise',
        plan_id: plans.id,
        status: profile.account_status as Account['status'] || 'trial',
        trial_start_date: profile.created_at.split('T')[0],
        trial_end_date: profile.trial_expires_at ? profile.trial_expires_at.split('T')[0] : undefined,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };

      const mockPlan: Plan = {
        id: plans.id,
        name: plans.name,
        label: plans.label || plans.name,
        price_dt: plans.price || 0,
        max_users: plans.max_users || 1,
        is_trial: plans.trial_enabled || false,
        created_at: plans.created_at,
        updated_at: plans.updated_at
      };
      
      return {
        account: mockAccount,
        plan: mockPlan
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
      
      // Mettre à jour le profile existant
      const { data, error } = await supabase
        .from('profiles')
        .update({
          account_status: updates.status,
          company_name: updates.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
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
