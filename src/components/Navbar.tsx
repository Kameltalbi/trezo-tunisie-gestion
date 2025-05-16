
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/recettes" className="flex items-center">
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-md mr-3">
              <Coins size={20} />
            </div>
            <span className="text-xl font-semibold text-gray-900">Trezo</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/recettes"
            className={`px-4 py-2 rounded-lg transition-colors ${
              isActive("/recettes")
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Recettes
          </Link>
          <Link
            to="/parametres"
            className={`px-4 py-2 rounded-lg transition-colors ${
              isActive("/parametres")
                ? "bg-emerald-50 text-emerald-600 font-medium"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Paramètres
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {user?.nom || user?.email}
          </div>
        </div>

        {/* Version mobile */}
        <div className="md:hidden flex space-x-2">
          <Link
            to="/recettes"
            className={`p-2 rounded-md ${
              isActive("/recettes") ? "bg-emerald-50 text-emerald-600" : "text-gray-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </Link>
          <Link
            to="/parametres"
            className={`p-2 rounded-md ${
              isActive("/parametres") ? "bg-emerald-50 text-emerald-600" : "text-gray-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
