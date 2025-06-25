
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Basique",
      price: "29",
      period: "/mois",
      description: "Parfait pour les petites entreprises",
      features: [
        "Jusqu'à 3 comptes bancaires",
        "Rapports de base",
        "Support par email",
        "Synchronisation manuelle",
        "Tableau de bord simple"
      ],
      buttonText: "Commencer gratuitement",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "79",
      period: "/mois",
      description: "Idéal pour les entreprises en croissance",
      features: [
        "Comptes bancaires illimités",
        "Rapports avancés et personnalisés",
        "Support prioritaire 24/7",
        "Synchronisation automatique",
        "Prévisions de trésorerie",
        "Collaboration d'équipe",
        "API intégrations"
      ],
      buttonText: "Essayer Pro",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Premium",
      price: "149",
      period: "/mois",
      description: "Solution complète pour grandes entreprises",
      features: [
        "Toutes les fonctionnalités Pro",
        "Analyse prédictive IA",
        "Manager dédié",
        "Formation personnalisée",
        "Intégrations ERP avancées",
        "Audit et conformité",
        "White-label disponible"
      ],
      buttonText: "Contacter les ventes",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plans & Tarifs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond le mieux aux besoins de votre entreprise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl border-2 p-8 shadow-lg hover:shadow-xl transition-all ${
                plan.popular 
                  ? 'border-emerald-500 scale-105' 
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Plus populaire
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                variant={plan.buttonVariant}
                size="lg" 
                className="w-full"
              >
                <Link to="/register">
                  {plan.buttonText}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
