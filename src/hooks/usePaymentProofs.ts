
import { useDisabledQuery, useDisabledMutation } from "./useDisabledHooks";

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
  return useDisabledQuery(['payment-proofs'], 'Payment proofs disabled in local mode');
};

export const useCreatePaymentProof = () => {
  return useDisabledMutation('Create payment proof disabled in local mode');
};
