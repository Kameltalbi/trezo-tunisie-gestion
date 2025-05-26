
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Permission {
  id: string;
  page: string;
  action: string;
  nom: string;
  description: string | null;
}

export interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
  granted: boolean;
  permission: Permission;
}

export const useRolePermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['role-permissions'],
    queryFn: async (): Promise<RolePermission[]> => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          permission:permissions(*)
        `);

      if (error) throw error;
      
      // Mapper les données - si l'enregistrement existe, la permission est accordée
      return (data || []).map(item => ({
        id: item.id,
        role: item.role,
        permission_id: item.permission_id,
        granted: true, // Si l'enregistrement existe, la permission est accordée
        permission: item.permission as Permission
      })) as RolePermission[];
    },
    enabled: !!user,
  });
};

export const useAllPermissions = () => {
  return useQuery({
    queryKey: ['all-permissions'],
    queryFn: async (): Promise<Permission[]> => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('page', { ascending: true })
        .order('action', { ascending: true });

      if (error) throw error;
      return data as Permission[];
    },
  });
};

export const useUpdateRolePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ role, permissionId, granted }: { role: string; permissionId: string; granted: boolean }) => {
      if (granted) {
        // Ajouter la permission (insérer l'enregistrement)
        const { data, error } = await supabase
          .from('role_permissions')
          .insert({
            role: role as any,
            permission_id: permissionId
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Retirer la permission (supprimer l'enregistrement)
        const { data, error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role as any)
          .eq('permission_id', permissionId)
          .select()
          .maybeSingle();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};
