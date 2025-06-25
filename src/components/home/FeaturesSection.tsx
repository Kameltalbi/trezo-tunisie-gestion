
import { BarChart3, Shield, Zap, Users, FileText, Clock } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="h-12 w-12 text-emerald-600" />,
      title: "Tableaux de bord avancés",
      description: "Visualisez vos données financières avec des graphiques interactifs et des métriques en temps réel."
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Sécurité maximale",
      description: "Vos données sont protégées par un chiffrement de niveau bancaire et des sauvegardes automatiques."
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-600" />,
      title: "Synchronisation automatique",
      description: "Connectez vos comptes bancaires pour une mise à jour automatique de vos transactions."
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "Collaboration d'équipe",
      description: "Partagez l'accès avec votre équipe et gérez les permissions selon les rôles."
    },
    {
      icon: <FileText className="h-12 w-12 text-green-600" />,
      title: "Rapports détaillés",
      description: "Générez des rapports personnalisés pour le suivi, l'analyse et la présentation."
    },
    {
      icon: <Clock className="h-12 w-12 text-red-600" />,
      title: "Prévisions intelligentes",
      description: "Anticipez vos besoins de trésorerie grâce à nos algorithmes de prédiction avancés."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
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
      </div>
    </section>
  );
};

export default FeaturesSection;
