
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

      try {
        let userRole;
        
        // Vérifier si l'utilisateur est kamel.talbi@yahoo.fr pour le superadmin
        if (user.email === 'kamel.talbi@yahoo.fr') {
          userRole = 'superadmin';
        } else {
          // Pour les autres utilisateurs, essayer une requête simple
          const { data: simpleRoleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
          
          userRole = simpleRoleData?.role || 'utilisateur';
        }

        // Si pas de rôle trouvé et que c'est kamel.talbi@yahoo.fr, créer le rôle superadmin
        if (!userRole && user.email === 'kamel.talbi@yahoo.fr') {
          try {
            const { data: newRole, error: createError } = await supabase
              .from('user_roles')
              .insert({ user_id: user.id, role: 'superadmin' })
              .select('role')
              .single();
            
            if (!createError && newRole) {
              userRole = newRole.role;
            } else {
              userRole = 'superadmin'; // Forcer superadmin pour kamel.talbi@yahoo.fr
            }
          } catch (err) {
            console.error('Erreur lors de la création du rôle:', err);
            userRole = 'superadmin'; // Forcer superadmin pour kamel.talbi@yahoo.fr
          }
        }

        // Si toujours pas de rôle, vérifier s'il y a des superadmins existants
        if (!userRole) {
          const { count: superAdminCount } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'superadmin');

          userRole = (superAdminCount === 0) ? 'superadmin' : 'utilisateur';
          
          if (userRole === 'superadmin') {
            try {
              await supabase
                .from('user_roles')
                .insert({ user_id: user.id, role: userRole });
            } catch (err) {
              console.error('Erreur lors de la création du premier superadmin:', err);
            }
          }
        }

        // Récupérer le plan actuel de l'utilisateur avec les vraies limites
        const { data: planData, error: planError } = await supabase
          .from('user_current_plan')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (planError && planError.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération du plan:', planError);
        }

        // Compter le nombre d'utilisateurs actuels
        const { count: currentUsers, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Erreur lors du comptage des utilisateurs:', countError);
        }

        const isAdmin = userRole === 'admin';
        const isSuperAdmin = userRole === 'superadmin';
        
        // Déterminer les vraies limites basées sur le plan
        let maxUsers = 1; // Par défaut pour les comptes gratuits/sans plan
        
        if (planData) {
          // Utiliser max_projects comme limite d'utilisateurs (c'est ce qui semble être configuré)
          maxUsers = planData.max_projects || 1;
        }

        // Les superadmins ont des droits illimités
        if (isSuperAdmin) {
          maxUsers = 1000;
        }

        const canAddUsers = (isAdmin || isSuperAdmin) && (currentUsers || 0) < maxUsers;

        console.log('Permissions calculées:', {
          userRole,
          isAdmin,
          isSuperAdmin,
          maxUsers,
          currentUsers,
          planData,
          userEmail: user.email
        });

        return {
          canAddUsers,
          maxUsers,
          currentUsers: currentUsers || 0,
          isAdmin,
          isSuperAdmin,
          role: userRole || 'utilisateur',
        };
      } catch (error) {
        console.error('Erreur dans useUserPermissions:', error);
        
        // En cas d'erreur, si c'est kamel.talbi@yahoo.fr, donner les droits superadmin
        if (user.email === 'kamel.talbi@yahoo.fr') {
          return {
            canAddUsers: true,
            maxUsers: 1000,
            currentUsers: 0,
            isAdmin: false,
            isSuperAdmin: true,
            role: 'superadmin',
          };
        }
        
        // Pour les autres, droits utilisateur par défaut avec limite réelle
        return {
          canAddUsers: false,
          maxUsers: 1, // Limite réelle pour les comptes gratuits
          currentUsers: 0,
          isAdmin: false,
          isSuperAdmin: false,
          role: 'utilisateur',
        };
      }
    },
    enabled: !!user,
    retry: 1,
    retryDelay: 500,
    staleTime: 30000,
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
