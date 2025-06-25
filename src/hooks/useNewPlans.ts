
import { useDisabledQuery } from "./useDisabledHooks";

export interface NewPlan {
  id: string;
  name: string;
  label: string;
  price_dt: number;
  max_users: number;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

export const useNewPlans = () => {
  return useDisabledQuery(['new-plans'], 'New plans functionality disabled - using local storage');
};
