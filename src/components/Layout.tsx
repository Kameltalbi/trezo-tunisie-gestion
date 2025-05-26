
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TrialBanner from "./TrialBanner";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const { user, isLoading } = useAuth();

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher seulement le contenu
  if (!user) {
    return <div>{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <TrialBanner />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
