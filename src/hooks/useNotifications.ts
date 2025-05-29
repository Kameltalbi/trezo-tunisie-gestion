
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationData {
  type: 'payment_proof_submitted' | 'payment_approved' | 'payment_rejected' | 'trial_expiring' | 'account_activated';
  email: string;
  data: {
    user_name?: string;
    plan_name?: string;
    amount?: number;
    reason?: string;
    days_remaining?: number;
  };
}

export const useNotifications = () => {
  const sendNotification = async (notificationData: NotificationData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch('/functions/v1/send-notification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la notification');
      }

      const result = await response.json();
      console.log('Notification envoyée:', result);
      return result;

    } catch (error) {
      console.error('Erreur notification:', error);
      toast.error('Erreur lors de l\'envoi de la notification');
      return null;
    }
  };

  return {
    sendNotification,
  };
};
