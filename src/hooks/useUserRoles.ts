
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

export interface UserWithRole {
  id: string;
  user_id: string;
  role: UserRole;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
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
  return useQuery({
    queryKey: ['user-roles-with-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles!inner(
            email,
            full_name,
            company_name
          )
        `);

      if (error) throw error;
      
      // Transform the data to flatten the profile information
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        role: item.role,
        created_at: item.created_at,
        email: item.profiles?.email || null,
        full_name: item.profiles?.full_name || null,
        company_name: item.profiles?.company_name || null,
      })) as UserWithRole[];
    },
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
