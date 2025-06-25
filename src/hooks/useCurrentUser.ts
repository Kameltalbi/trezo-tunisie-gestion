
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface CurrentUser {
  id: string;
  account_id: string;
  full_name: string | null;
  email: string | null;
  role: 'superadmin' | 'admin' | 'financier' | 'editeur' | 'collaborateur';
  is_active: boolean;
}

export const useCurrentUser = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['current-user', user?.id],
    queryFn: async () => {
      if (!user) return null;

      return {
        id: user.id,
        account_id: 'local-account-1',
        full_name: user.nom || user.email,
        email: user.email,
        role: 'admin' as const,
        is_active: true
      };
    },
    enabled: !!user,
  });
};

export const useHasPermission = (route: string) => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['has-permission', user?.id, route],
    queryFn: async () => {
      return true;
    },
    enabled: !!user,
  });
};

export const useCanDelete = () => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['can-delete', user?.id],
    queryFn: async () => {
      return true;
    },
    enabled: !!user,
  });
};
