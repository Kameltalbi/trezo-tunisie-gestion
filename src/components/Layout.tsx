
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();

  // Afficher un écran de chargement si le statut d'authentification est en cours de vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-emerald-500 mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de login si l'utilisateur n'est pas connecté et que la page nécessite l'authentification
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers la page des recettes si l'utilisateur est déjà connecté et qu'il tente d'accéder à la page de login
  if (!requireAuth && user) {
    return <Navigate to="/recettes" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {user && <Sidebar />}
      <main className={`flex-1 ${user ? 'sm:ml-[60px]' : ''} transition-all duration-300`}>
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
