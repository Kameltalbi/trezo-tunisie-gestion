
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Afficher un écran de chargement si le statut d'authentification est en cours de vérification
  if (isLoading) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-emerald-500 mb-4"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Rediriger vers la page de login si l'utilisateur n'est pas connecté et que la page nécessite l'authentification
  if (requireAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté et qu'il tente d'accéder à la page de login ou register
  if (!requireAuth && user && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/dashboard" replace />;
  }

  // Pour les pages publiques (home, login, register), ne pas montrer la sidebar ni le header
  if (!requireAuth && !user) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <div className="min-h-screen bg-background">
          {children}
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 ml-[60px]">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
