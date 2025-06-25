
import { useQuery } from "@tanstack/react-query";
import { useLocalAuth } from "@/contexts/LocalAuthContext";

export interface UserLimits {
  has_plan: boolean;
  can_proceed: boolean;
  limit_reached: boolean;
  usage?: number;
  limit?: number | 'unlimited';
  message?: string;
  error?: string;
}

export const useUserLimits = (limitType: 'transactions' | 'reports') => {
  const { user } = useLocalAuth();
  
  return useQuery({
    queryKey: ['user-limits', user?.id, limitType],
    queryFn: async (): Promise<UserLimits> => {
      // Dans le système local, pas de limitations
      return {
        has_plan: true,
        can_proceed: true,
        limit_reached: false,
        usage: 0,
        limit: 'unlimited',
        message: 'Pas de limitation avec le système local'
      };
    },
    enabled: !!user,
  });
};

export const useIncrementUsage = () => {
  return {
    mutate: () => console.log('Usage increment simulé'),
    mutateAsync: async () => console.log('Usage increment async simulé'),
    isLoading: false,
    error: null,
  };
};
