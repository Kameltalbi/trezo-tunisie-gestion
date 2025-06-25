
import { useDisabledQuery, useDisabledMutation } from "./useDisabledHooks";

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
  return useDisabledQuery(['new-payment-proofs'], 'New payment proofs disabled in local mode');
};

export const useCreateNewPaymentProof = () => {
  return useDisabledMutation('Create new payment proof disabled in local mode');
};
