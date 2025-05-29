
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCurrentPlan } from './useUserCurrentPlan';

interface TrialMessage {
  day: number;
  icon: string;
  title: string;
  message: string;
  actionText?: string;
  variant: 'info' | 'warning' | 'urgent';
}

const trialMessages: TrialMessage[] = [
  {
    day: 0,
    icon: '🎉',
    title: 'Bienvenue sur Trézo !',
    message: 'Votre essai gratuit de 14 jours commence. Découvrez toutes nos fonctionnalités.',
    actionText: 'Découvrir',
    variant: 'info'
  },
  {
    day: 3,
    icon: '📊',
    title: 'Créez vos premières prévisions',
    message: 'Découvrez comment anticiper votre trésorerie avec nos outils de prévision.',
    actionText: 'Voir les prévisions',
    variant: 'info'
  },
  {
    day: 5,
    icon: '💡',
    title: 'Pensez à votre futur',
    message: 'Choisissez dès maintenant un plan pour continuer après votre essai gratuit.',
    actionText: 'Voir les plans',
    variant: 'info'
  },
  {
    day: 7,
    icon: '⏰',
    title: 'Plus que 7 jours d\'essai',
    message: 'Votre trésorerie vous dira merci ! Explorez toutes nos fonctionnalités avancées.',
    actionText: 'Choisir un plan',
    variant: 'warning'
  },
  {
    day: 10,
    icon: '⚠️',
    title: 'Plus que 4 jours',
    message: 'Votre essai se termine bientôt. Sécurisez votre accès en choisissant un plan.',
    actionText: 'Souscrire maintenant',
    variant: 'warning'
  },
  {
    day: 13,
    icon: '🚨',
    title: 'Dernier jour d\'essai !',
    message: 'Demain, votre essai se termine. Choisissez un plan pour éviter toute interruption.',
    actionText: 'Activer maintenant',
    variant: 'urgent'
  },
  {
    day: 14,
    icon: '🔒',
    title: 'Essai terminé',
    message: 'Votre essai est terminé. Activez votre compte pour continuer à utiliser Trézo.',
    actionText: 'Activer mon compte',
    variant: 'urgent'
  }
];

export const useTrialMessages = () => {
  const { user } = useAuth();
  const { data: currentPlan } = useUserCurrentPlan();
  const [currentMessage, setCurrentMessage] = useState<TrialMessage | null>(null);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!user || !currentPlan?.is_trial || !currentPlan.trial_start_date) {
      setCurrentMessage(null);
      setShouldShow(false);
      return;
    }

    const trialStartDate = new Date(currentPlan.trial_start_date);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));

    // Trouver le message approprié pour ce jour
    const messageForToday = trialMessages
      .filter(msg => msg.day <= daysSinceStart)
      .sort((a, b) => b.day - a.day)[0];

    if (messageForToday) {
      // Vérifier si ce message a déjà été affiché aujourd'hui
      const storageKey = `trial-message-shown-${user.id}-${messageForToday.day}`;
      const lastShownDate = localStorage.getItem(storageKey);
      const todayString = today.toDateString();

      if (lastShownDate !== todayString) {
        setCurrentMessage(messageForToday);
        setShouldShow(true);
      }
    }
  }, [user, currentPlan]);

  const dismissMessage = () => {
    if (currentMessage && user) {
      const storageKey = `trial-message-shown-${user.id}-${currentMessage.day}`;
      localStorage.setItem(storageKey, new Date().toDateString());
      setShouldShow(false);
    }
  };

  return {
    currentMessage,
    shouldShow,
    dismissMessage,
    isTrialUser: currentPlan?.is_trial || false
  };
};
