
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
      console.log('=== DEBUT useAdminUsers ===');
      console.log('User connecté:', user?.email);
      
      try {
        // Étape 1: Récupérer tous les profils avec une requête simple
        let profileQuery = supabase
          .from('profiles')
          .select('id, email, created_at')
          .order('created_at', { ascending: false });

        if (searchTerm) {
          profileQuery = profileQuery.ilike('email', `%${searchTerm}%`);
        }

        const { data: profiles, error: profileError } = await profileQuery;
        
        if (profileError) {
          console.error('Erreur profiles:', profileError);
          throw profileError;
        }

        console.log('Profils récupérés:', profiles?.length || 0);

        if (!profiles || profiles.length === 0) {
          return [];
        }

        // Étape 2: Récupérer les rôles pour chaque utilisateur
        const userIds = profiles.map(p => p.id);
        console.log('User IDs:', userIds);

        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (rolesError) {
          console.error('Erreur rôles:', rolesError);
          // Continuer même en cas d'erreur sur les rôles
        }

        console.log('Rôles récupérés:', userRoles?.length || 0, userRoles);

        // Étape 3: Récupérer les abonnements
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
          console.warn('Erreur abonnements:', subError);
        }

        console.log('Abonnements récupérés:', subscriptions?.length || 0);

        // Étape 4: Combiner les données
        const result = profiles.map((profile: any) => {
          const userRole = userRoles?.find(ur => ur.user_id === profile.id);
          const subscription = subscriptions?.find((sub: any) => sub.user_id === profile.id);
          
          // Vérification spéciale pour kamel.talbi@yahoo.fr
          const isKamelUser = profile.email === 'kamel.talbi@yahoo.fr';
          const isSuperAdmin = isKamelUser || userRole?.role === 'superadmin';
          const isAdmin = userRole?.role === 'admin';
          
          console.log(`=== UTILISATEUR ${profile.email} ===`);
          console.log('- Rôle trouvé:', userRole?.role || 'aucun');
          console.log('- Est Kamel:', isKamelUser);
          console.log('- isSuperAdmin:', isSuperAdmin);
          
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
            role: userRole?.role || 'utilisateur',
          };
        });

        console.log('=== RESULTAT FINAL ===');
        console.log('Nombre d\'utilisateurs:', result.length);
        console.log('Utilisateurs détaillés:', result);
        console.log('=== FIN useAdminUsers ===');
        
        return result;

      } catch (error) {
        console.error('=== ERREUR DANS useAdminUsers ===', error);
        throw error;
      }
    },
    enabled: !!user,
    retry: 1,
    refetchInterval: 30000,
  });
};
