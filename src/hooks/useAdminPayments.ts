
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AdminPayment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  bank_details: any;
  notes: string | null;
  created_at: string;
  subscription_id: string | null;
  user_email?: string;
}

export const useAdminPayments = (isSuperAdmin: boolean) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-payments', user?.id],
    queryFn: async (): Promise<AdminPayment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((payment: any) => ({
        ...payment,
        user_email: payment.profiles?.email
      }));
    },
    enabled: !!user && isSuperAdmin,
  });
};

export const useValidatePayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ paymentId, subscriptionId }: { paymentId: string; subscriptionId?: string }) => {
      // Mettre à jour le statut du paiement
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Si il y a un abonnement associé, l'activer
      if (subscriptionId) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', subscriptionId);

        if (subscriptionError) throw subscriptionError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ description: "Paiement validé avec succès" });
    },
    onError: (error) => {
      console.error('Erreur lors de la validation:', error);
      toast({ 
        description: "Erreur lors de la validation du paiement", 
        variant: "destructive" 
      });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ description: "Paiement rejeté" });
    },
    onError: (error) => {
      console.error('Erreur lors du rejet:', error);
      toast({ 
        description: "Erreur lors du rejet du paiement", 
        variant: "destructive" 
      });
    },
  });
};
