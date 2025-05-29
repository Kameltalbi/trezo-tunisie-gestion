
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NewPaymentProof {
  id: string;
  account_id: string;
  uploaded_by: string;
  plan: string;
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Adapter les données de la base vers le format NewPaymentProof
      return data.map(proof => ({
        id: proof.id,
        account_id: proof.account_id,
        uploaded_by: proof.user_id,
        plan: proof.plan,
        file_url: proof.file_url,
        status: proof.status as 'pending' | 'accepted' | 'rejected',
        notes: proof.notes,
        submitted_at: proof.submitted_at,
        validated_at: proof.validated_at
      })) as NewPaymentProof[];
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
          user_id: user.id,
          account_id: data.account_id,
          plan: data.plan,
          amount: 0, // Sera déterminé côté serveur basé sur le plan
          currency: 'TND',
          payment_method: 'bank_transfer',
          file_url: data.file_url,
          notes: data.notes,
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
