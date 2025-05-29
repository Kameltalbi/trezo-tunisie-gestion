
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
        .order('price_dt', { ascending: true });

      if (error) throw error;
      return data as NewPlan[];
    },
  });
};
