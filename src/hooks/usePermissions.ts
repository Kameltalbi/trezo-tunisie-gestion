
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Permission {
  id: string;
  user_id: string;
  route: string;
  can_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPermissionsGlobales {
  user_id: string;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserPermissions = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['user-permissions', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];

      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('user_id', targetUserId);

      if (error) throw error;
      return data as Permission[];
    },
    enabled: !!targetUserId,
  });
};

export const useUserGlobalPermissions = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['user-global-permissions', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from('user_permissions_globales')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return data as UserPermissionsGlobales | null;
    },
    enabled: !!targetUserId,
  });
};

export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      permissions, 
      globalPermissions 
    }: { 
      userId: string; 
      permissions: { route: string; can_access: boolean }[];
      globalPermissions: { can_delete: boolean };
    }) => {
      // Supprimer les permissions existantes
      await supabase
        .from('permissions')
        .delete()
        .eq('user_id', userId);

      // Ajouter les nouvelles permissions
      if (permissions.length > 0) {
        const { error: permError } = await supabase
          .from('permissions')
          .insert(
            permissions.map(p => ({
              user_id: userId,
              route: p.route,
              can_access: p.can_access
            }))
          );

        if (permError) throw permError;
      }

      // Mettre à jour les permissions globales
      const { error: globalError } = await supabase
        .from('user_permissions_globales')
        .upsert({
          user_id: userId,
          can_delete: globalPermissions.can_delete
        });

      if (globalError) throw globalError;
    },
    onSuccess: () => {
      toast.success("Permissions mises à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-global-permissions'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour des permissions");
      console.error('Erreur mise à jour permissions:', error);
    }
  });
};
