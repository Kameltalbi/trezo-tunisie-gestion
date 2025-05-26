
import { useEffect, useState } from 'react';
import { useUserCurrentPlan } from './useUserCurrentPlan';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useTrialExpiration = () => {
  const { data: currentPlan } = useUserCurrentPlan();
  const navigate = useNavigate();
  const [hasShownReminder, setHasShownReminder] = useState(false);

  useEffect(() => {
    if (!currentPlan?.is_trial || !currentPlan.trial_end_date) {
      return;
    }

    const trialEndDate = new Date(currentPlan.trial_end_date);
    const now = new Date();
    const timeUntilExpiry = trialEndDate.getTime() - now.getTime();
    const daysUntilExpiry = Math.ceil(timeUntilExpiry / (1000 * 60 * 60 * 24));

    // Si l'essai a expiré, rediriger vers la page plans
    if (daysUntilExpiry <= 0) {
      toast.error("Votre essai gratuit a expiré. Veuillez choisir un plan pour continuer.");
      navigate('/checkout');
      return;
    }

    // Rappel à 3 jours
    if (daysUntilExpiry <= 3 && !hasShownReminder) {
      const storageKey = `trial-reminder-${currentPlan.subscription_id}`;
      const hasAlreadyShownToday = localStorage.getItem(storageKey) === new Date().toDateString();
      
      if (!hasAlreadyShownToday) {
        toast.warning(
          `Votre essai gratuit expire dans ${daysUntilExpiry} jour${daysUntilExpiry > 1 ? 's' : ''}. Souscrivez à un plan pour continuer.`,
          {
            duration: 5000,
            action: {
              label: "Voir les plans",
              onClick: () => navigate('/checkout')
            }
          }
        );
        localStorage.setItem(storageKey, new Date().toDateString());
        setHasShownReminder(true);
      }
    }

    // Vérifier toutes les heures si l'essai a expiré
    const interval = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= trialEndDate) {
        toast.error("Votre essai gratuit a expiré. Veuillez choisir un plan pour continuer.");
        navigate('/checkout');
        clearInterval(interval);
      }
    }, 60 * 60 * 1000); // Vérifier toutes les heures

    return () => clearInterval(interval);
  }, [currentPlan, navigate, hasShownReminder]);

  return {
    isTrialActive: currentPlan?.is_trial && currentPlan.trial_end_date,
    trialEndDate: currentPlan?.trial_end_date ? new Date(currentPlan.trial_end_date) : null,
    daysLeft: currentPlan?.trial_end_date ? 
      Math.ceil((new Date(currentPlan.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
  };
};
