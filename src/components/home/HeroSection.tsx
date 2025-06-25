
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const scrollToEngagement = () => {
    const engagementSection = document.getElementById('engagement');
    if (engagementSection) {
      engagementSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Maîtrisez votre <span className="text-emerald-600">trésorerie</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
          La solution complète pour gérer vos flux financiers, optimiser votre trésorerie et prendre des décisions éclairées pour votre entreprise.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-12 py-6 text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <Link to="/register" className="flex items-center gap-2">
              Démarrer l'essai gratuit de 14 jours
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={scrollToEngagement}
          >
            En savoir plus
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          ✓ Essai gratuit • ✓ Aucune carte bancaire • ✓ Configuration en 5 minutes
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
