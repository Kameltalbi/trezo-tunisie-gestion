
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LocalLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const LocalLayout = ({ children, requireAuth = false }: LocalLayoutProps) => {
  const { user, isLoading } = useLocalAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div className="bg-background text-foreground">{children}</div>;
  }

  // Interface pour utilisateur connecté
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

export default LocalLayout;
