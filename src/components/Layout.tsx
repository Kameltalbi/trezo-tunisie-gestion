
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useLocalAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div className="bg-background text-foreground">{children}</div>;
  }

  // Interface complète pour les utilisateurs connectés
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
