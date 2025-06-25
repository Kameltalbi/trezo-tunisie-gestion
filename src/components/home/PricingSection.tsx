import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Calendar } from "lucide-react";

const PricingSection = () => {
  // Date de fin de l'offre de lancement (3 mois à partir d'aujourd'hui)
  const launchEndDate = new Date();
  launchEndDate.setMonth(launchEndDate.getMonth() + 3);
  const formattedEndDate = launchEndDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const features = [
    "Gestion de la trésorerie prévisionnelle",
    "Suivi des transactions (recettes, dépenses)",
    "Comptes bancaires & caisses illimités",
    "Gestion multi-projets",
    "Catégories & sous-catégories personnalisées",
    "Visualisation graphique des flux",
    "Objectifs par catégorie",
    "Export PDF / Excel",
    "Gestion des utilisateurs et des permissions",
    "Récapitulatif mensuel automatique",
    "Aucune publicité, aucune limitation"
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tarification Simple et Transparente
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une solution complète pour la gestion de votre trésorerie, sans limitations
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-2xl">
            {/* Badge offre de lancement */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-red-500 text-white px-6 py-2 text-sm font-semibold">
                Offre de lancement - Jusqu'au {formattedEndDate}
              </Badge>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Trézo Pro
              </h3>
              <p className="text-gray-600 mb-6">
                Solution complète de gestion de trésorerie
              </p>

              {/* Essai gratuit */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold">Essai gratuit 14 jours</span>
                </div>
                <p className="text-green-700 text-sm">Sans engagement • Toutes fonctionnalités incluses</p>
              </div>

              {/* Prix Tunisie */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Prix Tunisie :</p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-blue-600">570 DT</span>
                  <span className="text-gray-600 ml-2">/an</span>
                  <span className="text-gray-400 line-through ml-4 text-xl">650 DT</span>
                </div>
                <p className="text-gray-500 text-sm">soit 47,50 DT/mois</p>
              </div>

              {/* Prix International */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Prix International :</p>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-blue-600">250 €</span>
                  <span className="text-gray-600 ml-2">/an</span>
                  <span className="text-gray-400 line-through ml-4 text-xl">290 €</span>
                </div>
                <p className="text-gray-500 text-sm">soit 20,83 €/mois</p>
              </div>

              {/* Bouton principal */}
              <Button 
                asChild 
                size="lg" 
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
              >
                <Link to="/register">
                  Démarrer l'essai gratuit
                </Link>
              </Button>
            </div>

            {/* Fonctionnalités */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Toutes les fonctionnalités incluses :
              </h4>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Méthode de paiement */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-medium text-center mb-2">
                  💳 Paiement uniquement par virement ou chèque
                </p>
                <p className="text-blue-700 text-sm text-center">
                  Processus sécurisé • Facture officielle fournie
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700"
                asChild
              >
                <Link to="/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Souscrire pour une année
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Note supplémentaire */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            * Offre de lancement valable uniquement pour les nouveaux clients
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
