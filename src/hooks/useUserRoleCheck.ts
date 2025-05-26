
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserRoleCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role-check', user?.id],
    queryFn: async () => {
      if (!user) return { role: null, isSuperAdmin: false };

      // Vérification spéciale pour kamel.talbi@yahoo.fr
      if (user.email === 'kamel.talbi@yahoo.fr') {
        return { role: 'superadmin', isSuperAdmin: true };
      }

      // Pour les autres utilisateurs, essayer une requête simple
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la vérification du rôle:', error);
          return { role: 'utilisateur', isSuperAdmin: false };
        }

        const role = data?.role || 'utilisateur';
        return { 
          role, 
          isSuperAdmin: role === 'superadmin' 
        };
      } catch (error) {
        console.error('Erreur catch dans useUserRoleCheck:', error);
        return { role: 'utilisateur', isSuperAdmin: false };
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 30000,
  });
};
