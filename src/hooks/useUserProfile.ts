
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  account_status: 'trial' | 'pending_activation' | 'active' | 'expired';
  trial_expires_at?: string;
  currency_code?: string;
  currency_symbol?: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;
      
      // Retourner le profil basé sur les données locales
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name || user.email,
        company_name: 'Entreprise locale',
        account_status: 'active',
        currency_code: 'TND',
        currency_symbol: 'TND',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    enabled: !!user,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      console.log('Mise à jour du profil simulée:', updates);
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};
