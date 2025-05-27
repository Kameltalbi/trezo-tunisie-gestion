
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  subscription_status?: string;
  plan_name?: string;
  trial_end_date?: string;
  subscription_end_date?: string;
  is_trial?: boolean;
  is_superadmin?: boolean;
  role?: string;
}

export const useAdminUsers = (searchTerm: string, isSuperAdmin: boolean) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-users', searchTerm, user?.id],
    queryFn: async (): Promise<AdminUser[]> => {
      console.log('Récupération des utilisateurs admin...');
      
      try {
        // Récupérer tous les profils avec leurs rôles
        let profileQuery = supabase
          .from('profiles')
          .select(`
            id, 
            email, 
            created_at,
            user_roles (
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (searchTerm) {
          profileQuery = profileQuery.ilike('email', `%${searchTerm}%`);
        }

        const { data: profiles, error: profileError } = await profileQuery;
        
        if (profileError) {
          console.error('Erreur lors de la récupération des profils:', profileError);
          throw profileError;
        }

        console.log('Profils récupérés:', profiles?.length || 0, profiles);

        if (!profiles || profiles.length === 0) {
          return [];
        }

        // Récupérer les abonnements pour ces utilisateurs
        const userIds = profiles.map(p => p.id);
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select(`
            user_id,
            status,
            is_trial,
            trial_end_date,
            end_date,
            plans (
              name
            )
          `)
          .in('user_id', userIds);

        if (subError) {
          console.warn('Erreur abonnements (non bloquante):', subError);
        }

        console.log('Abonnements récupérés:', subscriptions?.length || 0);

        // Mapper les données
        const result = profiles.map((profile: any) => {
          const subscription = subscriptions?.find((sub: any) => sub.user_id === profile.id);
          const userRole = profile.user_roles?.[0]?.role;
          const isSuperAdmin = profile.email === 'kamel.talbi@yahoo.fr' || userRole === 'superadmin';
          const isAdmin = userRole === 'admin';
          
          return {
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            subscription_status: isSuperAdmin ? 'superadmin' : (isAdmin ? 'admin' : subscription?.status),
            plan_name: isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Admin' : subscription?.plans?.name),
            trial_end_date: subscription?.trial_end_date,
            is_trial: subscription?.is_trial,
            subscription_end_date: subscription?.end_date,
            is_superadmin: isSuperAdmin,
            role: userRole,
          };
        });

        console.log('Utilisateurs finaux:', result.length, result);
        return result;

      } catch (error) {
        console.error('Erreur dans la récupération des utilisateurs:', error);
        throw error;
      }
    },
    enabled: !!user && isSuperAdmin,
    retry: 1,
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });
};
