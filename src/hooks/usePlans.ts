
import { useDisabledQuery } from "./useDisabledHooks";

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration_months: number;
  max_bank_accounts: number | null;
  max_projects: number | null;
  max_transactions_per_month: number | null;
  max_reports_per_month: number | null;
  features: string[];
  advanced_features: any[];
  is_active: boolean;
  trial_enabled: boolean;
  trial_days: number;
}

export const usePlans = () => {
  return useDisabledQuery(['plans'], 'Plans functionality disabled - using local storage');
};
