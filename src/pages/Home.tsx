
import { useLocalAuth } from "../contexts/LocalAuthContext";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

// Import des composants de la page d'accueil
import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import CtaSection from "@/components/home/CtaSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PricingSection from "@/components/home/PricingSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Footer from "@/components/home/Footer";
import EngagementSection from "@/components/home/EngagementSection";

const Home = () => {
  const { user } = useLocalAuth();
  const { t } = useTranslation();

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen">
      <HomeHeader />
      <HeroSection />
      <div id="engagement">
        <EngagementSection />
      </div>
      <CtaSection />
      <div id="fonctionnalites">
        <FeaturesSection />
      </div>
      <div id="tarifs">
        <PricingSection />
      </div>
      <TestimonialsSection />
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
