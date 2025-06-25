
import { useDisabledQuery, useDisabledMutation } from "./useDisabledHooks";

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
  return useDisabledQuery(['payments'], 'Payments disabled in local mode');
};

export const useCreatePayment = () => {
  return useDisabledMutation('Create payment disabled in local mode');
};
