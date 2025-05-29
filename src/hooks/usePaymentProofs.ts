
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PaymentProof {
  id: string;
  account_id: string;
  user_id: string;
  plan: string;
  amount: number;
  currency: string;
  payment_method: 'bank_transfer' | 'check';
  file_url?: string;
  reference_info?: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  admin_notes?: string;
  submitted_at: string;
  validated_at?: string;
  validated_by?: string;
  created_at: string;
  updated_at: string;
}

export const usePaymentProofs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payment-proofs', user?.id],
    queryFn: async (): Promise<PaymentProof[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaymentProof[];
    },
    enabled: !!user,
  });
};

export const useCreatePaymentProof = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<PaymentProof, 'id' | 'account_id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'submitted_at' | 'validated_at' | 'validated_by'>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Récupérer l'account_id de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('account_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      const { data: result, error } = await supabase
        .from('payment_proofs')
        .insert({
          ...data,
          user_id: user.id,
          account_id: userData.account_id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-proofs'] });
    },
  });
};
