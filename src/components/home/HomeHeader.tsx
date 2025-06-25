
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

const HomeHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-md">
              <Coins size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">Trézo</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#fonctionnalites" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Tarifs
            </a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Bouton de connexion */}
          <Button asChild variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            <Link to="/login">
              Se connecter
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
