
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DeletePermission {
  id: string;
  page: string;
  hasPermission: boolean;
}

export const useDeletePermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['delete-permissions', user?.id],
    queryFn: async (): Promise<DeletePermission[]> => {
      if (!user) return [];

      // Récupérer toutes les permissions de suppression
      const { data: allPermissions, error: permissionsError } = await supabase
        .from('permissions')
        .select('id, page')
        .eq('action', 'delete');

      if (permissionsError) throw permissionsError;

      // Récupérer les permissions accordées à l'utilisateur
      const { data: userPermissions, error: userPermError } = await supabase
        .from('user_permissions')
        .select('permission_id, granted')
        .eq('user_id', user.id);

      if (userPermError) throw userPermError;

      // Créer un map des permissions accordées
      const grantedPermissions = new Set(
        userPermissions
          ?.filter(up => up.granted)
          .map(up => up.permission_id) || []
      );

      // Combiner les données
      return allPermissions?.map(permission => ({
        id: permission.id,
        page: permission.page,
        hasPermission: grantedPermissions.has(permission.id)
      })) || [];
    },
    enabled: !!user,
  });
};

export const useToggleDeletePermission = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ permissionId, granted }: { permissionId: string; granted: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: user.id,
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
      queryClient.invalidateQueries({ queryKey: ['delete-permissions'] });
    },
  });
};
