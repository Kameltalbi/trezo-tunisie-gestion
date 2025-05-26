
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface UserPermissions {
  canAddUsers: boolean;
  maxUsers: number;
  currentUsers: number;
  isAdmin: boolean;
  role: string;
}

export const useUserPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async (): Promise<UserPermissions> => {
      if (!user) throw new Error('User not authenticated');

      // Récupérer le rôle de l'utilisateur
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) throw roleError;

      // Récupérer le plan actuel de l'utilisateur
      const { data: planData, error: planError } = await supabase
        .from('user_current_plan')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (planError && planError.code !== 'PGRST116') throw planError;

      // Compter le nombre d'utilisateurs actuels pour cette organisation
      const { count: currentUsers, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id); // Pour l'instant, chaque user est admin de son propre compte

      if (countError) throw countError;

      const isAdmin = roleData.role === 'admin';
      const maxUsers = planData?.max_projects || 1; // Utiliser max_projects comme limite d'utilisateurs pour l'instant
      const canAddUsers = isAdmin && (currentUsers || 0) < maxUsers;

      return {
        canAddUsers,
        maxUsers,
        currentUsers: currentUsers || 0,
        isAdmin,
        role: roleData.role,
      };
    },
    enabled: !!user,
  });
};
