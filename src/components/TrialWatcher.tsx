
import { useLocalAuth } from '@/contexts/LocalAuthContext';

const TrialWatcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useLocalAuth();
  
  // Pour l'instant, pas de surveillance d'essai avec le système local
  // Tous les utilisateurs ont accès complet
  return <>{children}</>;
};

export default TrialWatcher;
