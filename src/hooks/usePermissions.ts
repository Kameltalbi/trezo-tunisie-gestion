
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
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
  const { user } = useLocalAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['user-permissions', targetUserId],
    queryFn: async () => {
      // Dans le mode local, tous les utilisateurs ont toutes les permissions
      return [];
    },
    enabled: !!targetUserId,
  });
};

export const useUserGlobalPermissions = (userId?: string) => {
  const { user } = useLocalAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: ['user-global-permissions', targetUserId],
    queryFn: async () => {
      // Dans le mode local, tous les utilisateurs peuvent tout faire
      return {
        user_id: targetUserId!,
        can_delete: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    enabled: !!targetUserId,
  });
};

export const useUpdateUserPermissions = () => {
  return {
    mutate: () => toast.success("Permissions mises à jour (simulation)"),
    mutateAsync: async () => console.log("Permissions update simulated"),
    isLoading: false,
    error: null,
  };
};
