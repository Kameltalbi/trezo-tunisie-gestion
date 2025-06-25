
import { TrendingUp, CreditCard, Users, PieChart, Target, FileText, Settings, Building2 } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <TrendingUp className="h-12 w-12 text-emerald-600" />,
      title: "Gestion de Trésorerie",
      description: "Suivi des flux financiers en temps réel, prévisions de trésorerie intelligentes et visualisation des tendances pour une gestion optimale."
    },
    {
      icon: <CreditCard className="h-12 w-12 text-blue-600" />,
      title: "Gestion des Transactions", 
      description: "Encaissements et décaissements avec catégorisation automatique, historique complet et suivi détaillé de toutes vos opérations."
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "Dettes et Créances",
      description: "Suivi des dettes fournisseurs et créances clients avec gestion des échéances, statuts avancés et calculs automatiques des montants restants."
    },
    {
      icon: <Building2 className="h-12 w-12 text-orange-600" />,
      title: "Gestion des Comptes",
      description: "Comptes bancaires multiples, caisses et suivi des soldes en temps réel pour une vision complète de votre trésorerie."
    },
    {
      icon: <Target className="h-12 w-12 text-red-600" />,
      title: "Projets et Objectifs",
      description: "Gestion multi-projets avec suivi financier dédié, objectifs par catégorie et tableaux de bord spécifiques à chaque projet."
    },
    {
      icon: <PieChart className="h-12 w-12 text-green-600" />,
      title: "Rapports et Analyses",
      description: "Rapports automatisés, export PDF/Excel, récapitulatifs mensuels, analyses de tendances et métriques personnalisables."
    },
    {
      icon: <FileText className="h-12 w-12 text-indigo-600" />,
      title: "Tableaux de Bord",
      description: "Dashboards interactifs avec métriques en temps réel, graphiques dynamiques et indicateurs de performance clés."
    },
    {
      icon: <Settings className="h-12 w-12 text-gray-600" />,
      title: "Administration Complète",
      description: "Gestion des utilisateurs, permissions granulaires, paramètres entreprise, configuration des devises et sécurité avancée."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fonctionnalités puissantes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez tous les outils dont vous avez besoin pour gérer efficacement votre trésorerie d'entreprise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Une solution complète pour votre entreprise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-emerald-600 mb-2">💰 Trésorerie</h4>
                <ul className="space-y-1 text-left">
                  <li>• Cash flow en temps réel</li>
                  <li>• Prévisions intelligentes</li>
                  <li>• Visualisation des tendances</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">📊 Suivi Avancé</h4>
                <ul className="space-y-1 text-left">
                  <li>• Multi-projets</li>
                  <li>• Objectifs personnalisés</li>
                  <li>• Métriques en temps réel</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">⚙️ Administration</h4>
                <ul className="space-y-1 text-left">
                  <li>• Gestion multi-utilisateurs</li>
                  <li>• Permissions granulaires</li>
                  <li>• Sécurité renforcée</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
