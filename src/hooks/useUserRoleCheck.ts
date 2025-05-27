
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Hook simplifié sans système de rôles
export const useUserRoleCheck = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role-check', user?.id],
    queryFn: async () => {
      if (!user) return { isSuperAdmin: false, role: null };
      
      // Pour l'instant, on considère que l'utilisateur kamel est super admin
      const isSuperAdmin = user.email === 'kamel.talbi@yahoo.fr';
      
      return {
        isSuperAdmin,
        role: isSuperAdmin ? 'admin' : 'user',
      };
    },
    enabled: !!user,
  });
};
