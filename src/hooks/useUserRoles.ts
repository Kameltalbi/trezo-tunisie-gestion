
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = 'admin' | 'editeur' | 'collaborateur' | 'utilisateur';

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Permission {
  id: string;
  nom: string;
  description?: string;
  page: string;
  action: string;
  created_at: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserRoleRecord[];
    },
    enabled: !!user,
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('page', { ascending: true });

      if (error) throw error;
      return data as Permission[];
    },
  });
};

export const useRolePermissions = (role?: UserRole) => {
  return useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => {
      if (!role) return [];
      
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          permission:permissions(*)
        `)
        .eq('role', role);

      if (error) throw error;
      return data;
    },
    enabled: !!role,
  });
};
