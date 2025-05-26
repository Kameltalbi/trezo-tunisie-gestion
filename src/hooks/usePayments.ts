
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  payment_method: 'bank_transfer' | 'card' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transaction_reference: string | null;
  bank_details: any;
  notes: string | null;
  created_at: string;
}

export const usePayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: {
      subscription_id?: string;
      amount: number;
      payment_method: 'bank_transfer' | 'card' | 'cash';
      bank_details?: any;
      notes?: string;
    }) => {
      if (!user) throw new Error("User must be authenticated");

      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          subscription_id: data.subscription_id,
          amount: data.amount,
          payment_method: data.payment_method,
          status: 'pending',
          bank_details: data.bank_details,
          notes: data.notes,
          currency: 'DT'
        })
        .select()
        .single();

      if (error) throw error;
      return payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
