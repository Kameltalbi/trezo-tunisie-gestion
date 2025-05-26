
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
      
      // Mapper les données en s'assurant que granted existe
      return (data || []).map(item => ({
        id: item.id,
        role: item.role,
        permission_id: item.permission_id,
        granted: item.granted ?? false,
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
      const { data, error } = await supabase
        .from('role_permissions')
        .upsert({
          role: role as any, // Cast explicite pour éviter l'erreur de type
          permission_id: permissionId,
          granted: granted
        }, {
          onConflict: 'role,permission_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
    },
  });
};
