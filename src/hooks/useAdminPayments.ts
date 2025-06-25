
import { useDisabledQuery } from "./useDisabledHooks";

export interface AdminPayment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export const useAdminPayments = () => {
  return useDisabledQuery(['admin-payments'], 'Admin payments disabled in local mode');
};
