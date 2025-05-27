
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type UserRole = 'superadmin' | 'admin' | 'editeur' | 'collaborateur' | 'utilisateur';

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-roles-with-profiles', user?.id],
    queryFn: async (): Promise<UserWithRole[]> => {
      if (!user) return [];

      console.log('Récupération des utilisateurs avec rôles...');

      try {
        // Récupérer tous les profils d'abord
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name, company_name');

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
          throw profilesError;
        }

        console.log('Profils récupérés:', profiles?.length || 0);

        // Récupérer les rôles d'utilisateurs
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');

        if (rolesError) {
          console.error('Erreur lors de la récupération des rôles:', rolesError);
          // En cas d'erreur, retourner les profils sans rôles
          return (profiles || []).map(profile => ({
            id: profile.id,
            user_id: profile.id,
            role: 'utilisateur' as UserRole,
            created_at: new Date().toISOString(),
            email: profile.email,
            full_name: profile.full_name,
            company_name: profile.company_name,
          }));
        }

        console.log('Rôles récupérés:', userRoles?.length || 0);

        // Créer une map des rôles pour une recherche facile
        const roleMap = new Map<string, any>();
        userRoles?.forEach(role => {
          roleMap.set(role.user_id, role);
        });

        // Combiner tous les profils avec leurs rôles (ou rôle par défaut)
        const result: UserWithRole[] = (profiles || []).map(profile => {
          const userRole = roleMap.get(profile.id);
          return {
            id: userRole?.id || profile.id,
            user_id: profile.id,
            role: userRole?.role || 'utilisateur' as UserRole,
            created_at: userRole?.created_at || new Date().toISOString(),
            email: profile.email,
            full_name: profile.full_name,
            company_name: profile.company_name,
          };
        });

        console.log('Résultat final:', result.length, 'utilisateurs');
        return result;

      } catch (error) {
        console.error('Erreur dans useUserRoles:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: 1,
    staleTime: 30000,
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async (): Promise<Permission[]> => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('page', { ascending: true });

      if (error) throw error;
      return data || [];
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
      return data || [];
    },
    enabled: !!role,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles-with-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};

export const useCreateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles-with-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    },
  });
};
