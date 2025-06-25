
import { useDisabledMutation } from "./useDisabledHooks";

export const useStartTrial = () => {
  return useDisabledMutation('Trial management disabled in local mode');
};

export const useConvertTrialToSubscription = () => {
  return useDisabledMutation('Trial conversion disabled in local mode');
};
