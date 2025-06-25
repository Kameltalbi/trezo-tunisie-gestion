
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomeHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c6044d18-b9a5-4f10-9c00-f04817874a0e.png" 
              alt="Trézo Logo" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#engagement" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Essai gratuit
            </a>
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

          {/* Boutons de connexion */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-emerald-600">
              <Link to="/login">
                Se connecter
              </Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/register">
                Essai gratuit
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
