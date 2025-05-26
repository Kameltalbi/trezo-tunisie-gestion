
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import TrialBanner from "./TrialBanner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

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
