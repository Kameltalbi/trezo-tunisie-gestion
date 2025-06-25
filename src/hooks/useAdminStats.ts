
import { useQuery } from '@tanstack/react-query';
import { useLocalAuth } from '@/contexts/LocalAuthContext';

interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  trial_users: number;
  revenue_this_month: number;
}

export const useAdminStats = (isSuperAdmin: boolean) => {
  const { user } = useLocalAuth();

  return useQuery({
    queryKey: ['admin-stats', user?.id],
    queryFn: async (): Promise<AdminStats> => {
      // Statistiques simulées pour le mode local
      return {
        total_users: 5,
        active_subscriptions: 3,
        trial_users: 2,
        revenue_this_month: 1500,
      };
    },
    enabled: !!user && isSuperAdmin,
  });
};
