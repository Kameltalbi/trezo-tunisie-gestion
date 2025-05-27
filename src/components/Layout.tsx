
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoleCheck } from "@/hooks/useUserRoleCheck";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TrialBanner from "./TrialBanner";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();
  const { data: roleData, isLoading: isRoleLoading } = useUserRoleCheck();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const location = useLocation();

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur a un abonnement actif (sauf pour les super admins)
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsCheckingSubscription(false);
        return;
      }

      // Si l'utilisateur est super admin, pas besoin de vérifier l'abonnement
      if (roleData?.isSuperAdmin) {
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

    if (user && !isRoleLoading) {
      checkSubscription();
    }
  }, [user, roleData?.isSuperAdmin, isRoleLoading]);

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div className="bg-background text-foreground">{children}</div>;
  }

  // Si on vérifie encore l'abonnement ou le rôle, afficher un loader
  if (isCheckingSubscription || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Rediriger vers checkout si pas d'abonnement actif et pas super admin et pas déjà sur les pages autorisées
  const allowedPagesWithoutSubscription = ['/checkout', '/subscription', '/parametres', '/order-confirmation'];
  if (!hasActiveSubscription && !roleData?.isSuperAdmin && !allowedPagesWithoutSubscription.includes(location.pathname)) {
    return <Navigate to="/checkout" replace />;
  }

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
};

export default Layout;
