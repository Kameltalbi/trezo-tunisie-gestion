
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  trial_users: number;
  revenue_this_month: number;
}

export const useAdminStats = (isSuperAdmin: boolean) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-stats', user?.id],
    queryFn: async (): Promise<AdminStats> => {
      // Statistiques des utilisateurs
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Abonnements actifs
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Utilisateurs en essai
      const { count: trialUsers } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_trial', true);

      // Revenus du mois
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-31`);

      const revenueThisMonth = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        total_users: totalUsers || 0,
        active_subscriptions: activeSubscriptions || 0,
        trial_users: trialUsers || 0,
        revenue_this_month: revenueThisMonth,
      };
    },
    enabled: !!user && isSuperAdmin,
  });
};
