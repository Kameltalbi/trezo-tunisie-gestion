
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CurrentUser {
  id: string;
  account_id: string;
  full_name: string | null;
  email: string | null;
  role: 'superadmin' | 'admin' | 'financier' | 'editeur' | 'collaborateur';
  is_active: boolean;
}

export const useCurrentUser = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as CurrentUser;
    },
    enabled: !!user,
  });
};

export const useHasPermission = (route: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['has-permission', user?.id, route],
    queryFn: async () => {
      if (!user) return false;

      // Vérifier d'abord le rôle
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      // Superadmin et admin ont accès à tout
      if (userData?.role === 'superadmin' || userData?.role === 'admin') {
        return true;
      }

      // Vérifier les permissions spécifiques
      const { data: permission } = await supabase
        .from('permissions')
        .select('can_access')
        .eq('user_id', user.id)
        .eq('route', route)
        .maybeSingle();

      // Si pas de permission spécifique, accorder l'accès par défaut
      return permission?.can_access ?? true;
    },
    enabled: !!user,
  });
};

export const useCanDelete = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['can-delete', user?.id],
    queryFn: async () => {
      if (!user) return false;

      // Vérifier d'abord le rôle
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      // Superadmin et admin peuvent tout supprimer
      if (userData?.role === 'superadmin' || userData?.role === 'admin') {
        return true;
      }

      // Vérifier les permissions globales
      const { data: globalPerm } = await supabase
        .from('user_permissions_globales')
        .select('can_delete')
        .eq('user_id', user.id)
        .maybeSingle();

      return globalPerm?.can_delete ?? false;
    },
    enabled: !!user,
  });
};
