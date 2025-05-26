
import { useTrialExpiration } from '@/hooks/useTrialExpiration';
import { useAuth } from '@/contexts/AuthContext';

const TrialWatcher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Le hook useTrialExpiration gère automatiquement les rappels et redirections
  useTrialExpiration();

  // Ce composant n'affiche rien visuellement, il surveille juste l'expiration
  return <>{children}</>;
};

export default TrialWatcher;
