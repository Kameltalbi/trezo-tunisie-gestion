
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-limits', user?.id, limitType],
    queryFn: async (): Promise<UserLimits> => {
      if (!user) throw new Error("User must be authenticated");
      
      const { data, error } = await supabase.rpc('check_user_limits', {
        _user_id: user.id,
        _limit_type: limitType
      });
      
      if (error) throw error;
      return data as unknown as UserLimits;
    },
    enabled: !!user,
  });
};

export const useIncrementUsage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (usageType: 'transactions' | 'reports') => {
      if (!user) throw new Error("User must be authenticated");
      
      const { error } = await supabase.rpc('increment_usage', {
        _user_id: user.id,
        _usage_type: usageType
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalider les requêtes de limitations pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['user-limits'] });
    },
  });
};
