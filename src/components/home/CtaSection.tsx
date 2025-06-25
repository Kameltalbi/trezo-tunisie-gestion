
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, PieChart, DollarSign } from "lucide-react";

interface CtaSectionProps {
  reverse?: boolean;
}

const CtaSection = ({ reverse = false }: CtaSectionProps) => {
  const sections = [
    {
      title: "Visualisez vos données en temps réel",
      description: "Tableaux de bord interactifs et graphiques détaillés pour suivre l'évolution de votre trésorerie et anticiper vos besoins financiers.",
      buttonText: "Voir le dashboard",
      buttonLink: "/dashboard",
      icon: <BarChart3 className="h-64 w-64 text-emerald-500" />,
    },
    {
      title: "Optimisez vos flux financiers",
      description: "Analysez vos encaissements et décaissements, identifiez les tendances et prenez des décisions stratégiques pour améliorer votre rentabilité.",
      buttonText: "Gérer les flux",
      buttonLink: "/cash-flow",
      icon: <TrendingUp className="h-64 w-64 text-blue-500" />,
    }
  ];

  return (
    <div className="py-20 bg-white">
      {sections.map((section, index) => {
        const isReverse = reverse ? index % 2 === 0 : index % 2 === 1;
        return (
          <div key={index} className={`container mx-auto px-4 ${index > 0 ? 'mt-32' : ''}`}>
            <div className={`flex flex-col ${isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
              {/* Texte */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {section.description}
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link to={section.buttonLink}>
                    {section.buttonText}
                  </Link>
                </Button>
              </div>
              
              {/* Illustration */}
              <div className="flex-1 flex justify-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 shadow-lg">
                  {section.icon}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CtaSection;
