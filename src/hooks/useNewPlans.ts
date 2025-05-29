
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewPlan {
  id: string;
  name: string;
  label: string;
  price_dt: number;
  max_users: number;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

export const useNewPlans = () => {
  return useQuery({
    queryKey: ['new-plans'],
    queryFn: async (): Promise<NewPlan[]> => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      
      // Adapter les données existantes au nouveau format
      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        label: plan.label || plan.name,
        price_dt: plan.price || 0,
        max_users: plan.max_users || 1,
        is_trial: plan.trial_enabled || false,
        created_at: plan.created_at,
        updated_at: plan.updated_at
      })) as NewPlan[];
    },
  });
};
