
import { toast } from 'sonner';
import { useDisabledMutation } from './useDisabledHooks';

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
    console.log('Notification simulée:', notificationData);
    toast.info(`Notification: ${notificationData.type} pour ${notificationData.email}`);
    return { success: true };
  };

  return {
    sendNotification,
  };
};
