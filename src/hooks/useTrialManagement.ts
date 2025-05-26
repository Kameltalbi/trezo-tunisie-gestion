
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStartTrial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, planId }: { userId: string; planId: string }) => {
      // Vérifier si l'utilisateur a déjà eu un essai gratuit
      const { data: existingSubscriptions, error: checkError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_trial', true);

      if (checkError) throw checkError;

      // Si l'utilisateur a déjà eu un essai, l'empêcher d'en commencer un nouveau
      if (existingSubscriptions && existingSubscriptions.length > 0) {
        throw new Error("Vous avez déjà utilisé votre essai gratuit. Veuillez souscrire à un plan payant.");
      }

      // Récupérer les informations du plan pour l'essai
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('trial_days, trial_enabled')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      if (!plan.trial_enabled || !plan.trial_days) {
        throw new Error("Ce plan ne propose pas d'essai gratuit");
      }

      // Calculer les dates d'essai (14 jours fixes)
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialStartDate.getDate() + 14); // Toujours 14 jours

      // Créer l'abonnement d'essai
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          is_trial: true,
          trial_start_date: trialStartDate.toISOString(),
          trial_end_date: trialEndDate.toISOString(),
          start_date: trialStartDate.toISOString(),
          end_date: trialEndDate.toISOString(),
        })
        .select()
        .single();

      if (subscriptionError) throw subscriptionError;
      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-current-plan'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};

export const useConvertTrialToSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriptionId, endDate }: { subscriptionId: string; endDate: string }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          is_trial: false,
          trial_start_date: null,
          trial_end_date: null,
          end_date: endDate,
          status: 'active',
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-current-plan'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};
