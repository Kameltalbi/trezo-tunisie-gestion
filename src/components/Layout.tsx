
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/useAccount";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TrialBanner from "./TrialBanner";
import TrialMessageBanner from "./TrialMessageBanner";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();
  const { data: accountData, isLoading: accountLoading } = useAccount();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const location = useLocation();

  // Vérifier si l'utilisateur a un abonnement actif
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsCheckingSubscription(false);
        return;
      }

      // Si l'utilisateur est kamel, pas besoin de vérifier l'abonnement
      if (user.email === 'kamel.talbi@yahoo.fr') {
        setHasActiveSubscription(true);
        setIsCheckingSubscription(false);
        return;
      }

      // Vérifier le statut du compte
      if (accountData?.account) {
        const account = accountData.account;
        
        if (account.status === 'active') {
          setHasActiveSubscription(true);
          setIsCheckingSubscription(false);
          return;
        }
        
        if (account.status === 'expired') {
          setHasActiveSubscription(false);
          setIsCheckingSubscription(false);
          return;
        }
        
        if (account.status === 'pending_activation') {
          setHasActiveSubscription(false);
          setIsCheckingSubscription(false);
          return;
        }
        
        // Si en trial, vérifier la date d'expiration
        if (account.status === 'trial' && account.trial_end_date) {
          const trialExpiry = new Date(account.trial_end_date);
          const now = new Date();
          
          if (now > trialExpiry) {
            // Mettre à jour le statut à expiré via profiles
            await supabase
              .from('profiles')
              .update({ account_status: 'expired' })
              .eq('id', user.id);
            
            setHasActiveSubscription(false);
          } else {
            setHasActiveSubscription(true);
          }
          setIsCheckingSubscription(false);
          return;
        }
      }

      setHasActiveSubscription(false);
      setIsCheckingSubscription(false);
    };

    if (user && !accountLoading) {
      checkSubscription();
    }
  }, [user, accountData, accountLoading]);

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div className="bg-background text-foreground">{children}</div>;
  }

  // Si on vérifie encore l'abonnement, afficher un loader
  if (isCheckingSubscription || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Si le compte est expiré, rediriger vers la page de checkout
  if (accountData?.account?.status === 'expired') {
    return <Navigate to="/checkout" replace />;
  }

  // Si le compte est en attente d'activation, afficher une interface limitée
  if (accountData?.account?.status === 'pending_activation') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Activation en cours</h2>
            <p className="text-gray-600 mb-4">
              Votre preuve de paiement a été reçue. Notre équipe procédera à l'activation de votre compte dans les plus brefs délais.
            </p>
            <p className="text-sm text-gray-500">
              Vous recevrez un email de confirmation dès que votre compte sera activé.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Admin users or users with subscriptions can access any page
  if (hasActiveSubscription || user.email === 'kamel.talbi@yahoo.fr') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <TrialMessageBanner />
        <div className="flex">
          <Sidebar onExpandedChange={setIsSidebarExpanded} />
          <main 
            className={`flex-1 p-6 transition-all duration-300 ${
              isSidebarExpanded ? 'ml-60' : 'ml-16'
            }`}
          >
            <TrialBanner />
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Redirect to checkout page if user doesn't have active subscription
  return <Navigate to="/checkout" replace />;
};

export default Layout;
