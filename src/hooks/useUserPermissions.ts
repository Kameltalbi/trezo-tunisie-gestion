
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted: boolean;
  created_at: string;
  updated_at: string;
  permission: {
    id: string;
    nom: string;
    description: string | null;
    page: string;
    action: string;
  };
}

export interface UserPermissionUpdate {
  userId: string;
  permissionId: string;
  granted: boolean;
}

export const useUserPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async (): Promise<UserPermissions> => {
      if (!user) throw new Error('User not authenticated');

      // Récupérer le rôle de l'utilisateur (utiliser maybeSingle au lieu de single)
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) throw roleError;

      // Si pas de rôle trouvé, créer un rôle admin par défaut
      let userRole = roleData?.role;
      if (!userRole) {
        console.log('Aucun rôle trouvé pour l\'utilisateur, création du rôle admin...');
        const { data: newRole, error: createError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'admin' })
          .select('role')
          .single();
        
        if (createError) {
          console.error('Erreur lors de la création du rôle:', createError);
          // Fallback: assumer admin si on ne peut pas créer
          userRole = 'admin';
        } else {
          userRole = newRole.role;
        }
      }

      // Récupérer le plan actuel de l'utilisateur
      const { data: planData, error: planError } = await supabase
        .from('user_current_plan')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (planError && planError.code !== 'PGRST116') throw planError;

      // Compter le nombre d'utilisateurs actuels pour cette organisation
      const { count: currentUsers, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const isAdmin = userRole === 'admin';
      const maxUsers = planData?.max_projects || 5; // Utiliser max_projects comme limite d'utilisateurs
      const canAddUsers = isAdmin && (currentUsers || 0) < maxUsers;

      return {
        canAddUsers,
        maxUsers,
        currentUsers: currentUsers || 0,
        isAdmin,
        role: userRole,
      };
    },
    enabled: !!user,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useAllUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['all-user-permissions', userId],
    queryFn: async (): Promise<UserPermission[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          *,
          permission:permissions(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserPermission[];
    },
    enabled: !!userId,
  });
};

export const useUpdateUserPermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, permissionId, granted }: UserPermissionUpdate) => {
      const { data, error } = await supabase
        .from('user_permissions')
        .upsert({ 
          user_id: userId, 
          permission_id: permissionId, 
          granted 
        }, {
          onConflict: 'user_id,permission_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-permissions'] });
    },
  });
};
