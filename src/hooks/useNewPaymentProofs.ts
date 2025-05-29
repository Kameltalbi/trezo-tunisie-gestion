
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Adapter les données existantes au nouveau format
      return data.map(proof => ({
        id: proof.id,
        account_id: proof.user_id, // Utiliser user_id comme account_id temporairement
        uploaded_by: proof.user_id,
        plan_id: proof.plan_id,
        file_url: proof.proof_file_url,
        status: proof.status as 'pending' | 'accepted' | 'rejected',
        notes: proof.admin_notes,
        submitted_at: proof.created_at,
        validated_at: proof.approved_at
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
          plan_id: data.plan_id,
          amount: 0, // Sera déterminé côté serveur basé sur le plan
          currency: 'DT',
          payment_method: 'bank_transfer',
          proof_file_url: data.file_url,
          reference_info: data.notes,
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
