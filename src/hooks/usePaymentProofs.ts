
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PaymentProof {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_method: 'bank_transfer' | 'check';
  proof_file_url?: string;
  reference_info?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
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
    mutationFn: async (data: Omit<PaymentProof, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase
        .from('payment_proofs')
        .insert({
          ...data,
          user_id: user.id,
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
