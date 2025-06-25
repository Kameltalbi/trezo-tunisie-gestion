
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

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

export const useAccount = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['account', user?.id],
    queryFn: async () => {
      if (!user) return null;

      return {
        id: 'local-account-1',
        name: 'Compte Local',
        plan_id: 'local-plan',
        status: 'active' as const,
        trial_start_date: null,
        trial_end_date: null,
        activation_date: new Date().toISOString(),
        valid_until: null,
        currency_code: 'TND',
        currency_symbol: 'TND',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    enabled: !!user,
  });
};
