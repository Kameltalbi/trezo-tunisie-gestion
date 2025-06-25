
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useLocalMutation } from "./useLocalMutation";
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
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      return [{
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
      }];
    },
    enabled: !!user,
  });
};

export const useCurrentAccount = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['current-account', user?.id],
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

export const useUpdateAccount = () => {
  const mutationFn = async (data: any) => {
    console.log("Account update simulated:", data);
    return data;
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Compte mis à jour avec succès (simulation)")
  );
};
