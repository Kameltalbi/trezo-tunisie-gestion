
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { ArrowRight, BarChart3 } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t('app.name')}
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Gérez votre trésorerie, suivez vos flux financiers et optimisez la gestion de votre entreprise avec notre solution complète.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Accéder au tableau de bord
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="text-lg px-8 py-4">
                <Link to="/login" className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                <Link to="/register">
                  Créer un compte
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tableau de bord</h3>
            <p className="text-gray-600">Visualisez vos données financières en temps réel</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Flux de trésorerie</h3>
            <p className="text-gray-600">Suivez vos encaissements et décaissements</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Rapports</h3>
            <p className="text-gray-600">Générez des rapports détaillés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
