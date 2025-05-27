
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
      console.log('=== DEBUT useAdminUsers SIMPLIFIE ===');
      console.log('User connecté:', user?.email);
      
      try {
        // Étape 1: Récupérer UNIQUEMENT les profils
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
          console.log('Aucun profil trouvé');
          return [];
        }

        // Étape 2: Pour chaque profil, essayer de récupérer le rôle individuellement
        const result: AdminUser[] = [];
        
        for (const profile of profiles) {
          console.log(`=== TRAITEMENT ${profile.email} ===`);
          
          // Vérification spéciale pour kamel.talbi@yahoo.fr
          const isKamelUser = profile.email === 'kamel.talbi@yahoo.fr';
          let userRole = 'utilisateur';
          let isSuperAdmin = isKamelUser;
          
          if (isKamelUser) {
            console.log('- Utilisateur Kamel détecté -> SuperAdmin');
            userRole = 'superadmin';
          } else {
            // Essayer de récupérer le rôle pour les autres utilisateurs
            try {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', profile.id)
                .maybeSingle();
              
              if (roleData?.role) {
                userRole = roleData.role;
                isSuperAdmin = roleData.role === 'superadmin';
                console.log('- Rôle trouvé:', roleData.role);
              } else {
                console.log('- Aucun rôle trouvé, utilisateur par défaut');
              }
            } catch (roleError) {
              console.log('- Erreur lors de la récupération du rôle:', roleError);
            }
          }

          // Essayer de récupérer l'abonnement
          let subscription = null;
          try {
            const { data: subData } = await supabase
              .from('subscriptions')
              .select(`
                status,
                is_trial,
                trial_end_date,
                end_date,
                plans (
                  name
                )
              `)
              .eq('user_id', profile.id)
              .maybeSingle();
            
            subscription = subData;
          } catch (subError) {
            console.log('- Erreur lors de la récupération de l\'abonnement:', subError);
          }

          const adminUser: AdminUser = {
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            subscription_status: isSuperAdmin ? 'superadmin' : (userRole === 'admin' ? 'admin' : subscription?.status),
            plan_name: isSuperAdmin ? 'Super Admin' : (userRole === 'admin' ? 'Admin' : subscription?.plans?.name),
            trial_end_date: subscription?.trial_end_date,
            is_trial: subscription?.is_trial,
            subscription_end_date: subscription?.end_date,
            is_superadmin: isSuperAdmin,
            role: userRole,
          };

          result.push(adminUser);
          console.log('- Utilisateur ajouté:', adminUser);
        }

        console.log('=== RESULTAT FINAL ===');
        console.log('Nombre d\'utilisateurs:', result.length);
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
