
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TrialBanner from "./TrialBanner";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();
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

      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        setHasActiveSubscription(!!subscription);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
        setHasActiveSubscription(false);
      } finally {
        setIsCheckingSubscription(false);
      }
    };

    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div className="bg-background text-foreground">{children}</div>;
  }

  // Si on vérifie encore l'abonnement, afficher un loader
  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Admin users or users with subscriptions can access any page
  if (hasActiveSubscription || user.email === 'kamel.talbi@yahoo.fr') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
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

  // Redirect to subscription page if user doesn't have active subscription
  return <Navigate to="/subscription" replace />;
};

export default Layout;
