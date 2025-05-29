
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NewPaymentProof {
  id: string;
  account_id: string;
  uploaded_by: string;
  plan_id: string;
  file_url?: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  submitted_at: string;
  validated_at?: string;
}

export const useNewPaymentProofs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['new-payment-proofs', user?.id],
    queryFn: async (): Promise<NewPaymentProof[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payment_proofs')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data as NewPaymentProof[];
    },
    enabled: !!user,
  });
};

export const useCreateNewPaymentProof = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: Omit<NewPaymentProof, 'id' | 'uploaded_by' | 'status' | 'submitted_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase
        .from('payment_proofs')
        .insert({
          ...data,
          uploaded_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-payment-proofs'] });
    },
  });
};
