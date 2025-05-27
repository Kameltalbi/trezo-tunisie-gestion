
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRoleCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role-check', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('Pas d\'utilisateur connecté');
        return { role: null, isSuperAdmin: false };
      }

      console.log('=== useUserRoleCheck SIMPLIFIE ===');
      console.log('User:', user.email);

      // Vérification spéciale pour kamel.talbi@yahoo.fr
      if (user.email === 'kamel.talbi@yahoo.fr') {
        console.log('Utilisateur Kamel détecté - SuperAdmin automatique');
        return { role: 'superadmin', isSuperAdmin: true };
      }

      // Pour les autres utilisateurs, essayer de récupérer le rôle
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la vérification du rôle:', error);
          return { role: 'admin', isSuperAdmin: false }; // Changé de 'utilisateur' à 'admin'
        }

        let role = data?.role;
        
        // Si pas de rôle trouvé, créer un rôle admin pour le nouvel utilisateur
        if (!role) {
          console.log('Aucun rôle trouvé, création d\'un rôle admin pour le nouvel utilisateur');
          try {
            const { data: newRoleData, error: insertError } = await supabase
              .from('user_roles')
              .insert({ user_id: user.id, role: 'admin' })
              .select('role')
              .single();
            
            if (!insertError && newRoleData) {
              role = newRoleData.role;
            } else {
              console.error('Erreur lors de la création du rôle admin:', insertError);
              role = 'admin'; // Fallback
            }
          } catch (insertErr) {
            console.error('Erreur catch lors de la création du rôle:', insertErr);
            role = 'admin'; // Fallback
          }
        }

        const isSuperAdmin = role === 'superadmin';
        
        console.log('Rôle trouvé/créé:', role, 'isSuperAdmin:', isSuperAdmin);
        
        return { 
          role, 
          isSuperAdmin 
        };
      } catch (error) {
        console.error('Erreur catch dans useUserRoleCheck:', error);
        return { role: 'admin', isSuperAdmin: false }; // Changé de 'utilisateur' à 'admin'
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 30000,
  });
};
