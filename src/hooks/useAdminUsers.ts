
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
      console.log('=== DEBUT useAdminUsers APRES NETTOYAGE ===');
      console.log('User connecté:', user?.email);
      
      try {
        // Récupérer tous les profils
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

        // Traiter chaque profil
        const result: AdminUser[] = profiles.map(profile => {
          console.log(`Traitement de ${profile.email}`);
          
          // Déterminer le rôle basé sur l'email
          const isKamelUser = profile.email === 'kamel.talbi@yahoo.fr';
          const userRole = isKamelUser ? 'superadmin' : 'utilisateur';
          const isSuperAdminUser = isKamelUser;
          
          return {
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            subscription_status: isSuperAdminUser ? 'superadmin' : 'utilisateur',
            plan_name: isSuperAdminUser ? 'Super Admin' : 'Utilisateur',
            trial_end_date: undefined,
            is_trial: false,
            subscription_end_date: undefined,
            is_superadmin: isSuperAdminUser,
            role: userRole,
          };
        });

        console.log('=== RESULTAT FINAL ===');
        console.log('Nombre d\'utilisateurs:', result.length);
        console.log('Utilisateurs:', result);
        
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
