
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserCurrentPlan {
  user_id: string;
  subscription_id?: string;
  subscription_status?: string;
  is_trial?: boolean;
  trial_end_date?: string;
  subscription_end_date?: string;
  plan_name?: string;
  max_bank_accounts?: number;
  max_projects?: number;
  max_transactions_per_month?: number;
  max_reports_per_month?: number;
  advanced_features?: any[];
  trial_days?: number;
  trial_enabled?: boolean;
}

export const useUserCurrentPlan = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-current-plan', user?.id],
    queryFn: async (): Promise<UserCurrentPlan | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_current_plan')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserCurrentPlan | null;
    },
    enabled: !!user,
  });
};
