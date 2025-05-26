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
      // First get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      // Get all user IDs from roles
      const userIds = userRoles.map(role => role.user_id);

      // Get profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, company_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user profiles for easy lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Combine user roles with their profiles
      return userRoles.map(role => {
        const profile = profileMap.get(role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          role: role.role,
          created_at: role.created_at,
          email: profile?.email || null,
          full_name: profile?.full_name || null,
          company_name: profile?.company_name || null,
        };
      }) as UserWithRole[];
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
