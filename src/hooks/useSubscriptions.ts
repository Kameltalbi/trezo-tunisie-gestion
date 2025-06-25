
import { useDisabledQuery, useDisabledMutation } from "./useDisabledHooks";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  plan: {
    name: string;
    price: number;
    currency: string;
  };
}

export const useSubscriptions = () => {
  return useDisabledQuery(['subscriptions'], 'Subscriptions disabled in local mode');
};

export const useCreateSubscription = () => {
  return useDisabledMutation('Create subscription disabled in local mode');
};
