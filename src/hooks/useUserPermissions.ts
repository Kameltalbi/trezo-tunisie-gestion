
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

export interface UserPermissionsData {
  canAddUsers: boolean;
  maxUsers: number;
  currentUsers: number;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string;
}

export const useUserPermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async (): Promise<UserPermissionsData> => {
      if (!user) throw new Error('User not authenticated');

      // Récupérer le rôle de l'utilisateur
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du rôle:', roleError);
        throw roleError;
      }

      let userRole = roleData?.role;

      // Si pas de rôle trouvé, créer un rôle superadmin par défaut pour le premier utilisateur
      if (!userRole) {
        console.log('Aucun rôle trouvé pour l\'utilisateur, vérification si c\'est le premier utilisateur...');
        
        // Vérifier s'il y a déjà des superadmins dans le système
        const { count: superAdminCount, error: countError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'superadmin');

        if (countError) {
          console.error('Erreur lors du comptage des superadmins:', countError);
        }

        // Si aucun superadmin existe, créer cet utilisateur comme superadmin
        const roleToAssign = (superAdminCount === 0) ? 'superadmin' : 'utilisateur';
        
        try {
          const { data: newRole, error: createError } = await supabase
            .from('user_roles')
            .insert({ user_id: user.id, role: roleToAssign })
            .select('role')
            .single();
          
          if (createError) {
            console.error('Erreur lors de la création du rôle:', createError);
            // Si on ne peut pas créer le rôle, assumer utilisateur par défaut
            userRole = 'utilisateur';
          } else {
            userRole = newRole.role;
            console.log(`Rôle ${roleToAssign} créé avec succès`);
          }
        } catch (err) {
          console.error('Erreur catch lors de la création du rôle:', err);
          userRole = 'utilisateur';
        }
      }

      // Récupérer le plan actuel de l'utilisateur
      const { data: planData, error: planError } = await supabase
        .from('user_current_plan')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (planError && planError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du plan:', planError);
      }

      // Compter le nombre d'utilisateurs actuels pour cette organisation
      const { count: currentUsers, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Erreur lors du comptage des utilisateurs:', countError);
      }

      const isAdmin = userRole === 'admin';
      const isSuperAdmin = userRole === 'superadmin';
      const maxUsers = planData?.max_projects || 5; // Utiliser max_projects comme limite d'utilisateurs
      const canAddUsers = (isAdmin || isSuperAdmin) && (currentUsers || 0) < maxUsers;

      return {
        canAddUsers,
        maxUsers,
        currentUsers: currentUsers || 0,
        isAdmin,
        isSuperAdmin,
        role: userRole || 'utilisateur',
      };
    },
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // Cache pendant 30 secondes
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
