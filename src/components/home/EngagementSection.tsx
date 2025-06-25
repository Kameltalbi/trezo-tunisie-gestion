
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EngagementSection = () => {
  const benefits = [
    "Dashboard interactif en temps réel",
    "Gestion complète des flux financiers",
    "Prévisions intelligentes de trésorerie",
    "Rapports automatisés et personnalisés",
    "Interface intuitive et sécurisée"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Titre principal */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Démarrez votre essai gratuit
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Découvrez comment Trézo peut transformer la gestion financière de votre entreprise. 
            Aucune carte de crédit requise pour commencer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Côté gauche - Avantages */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Ce que vous obtenez avec votre essai :
            </h3>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">14</div>
                  <div className="text-sm text-gray-600">Jours d'essai gratuit</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
                  <div className="text-sm text-gray-600">Configuration rapide</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Côté droit - Call to Action */}
          <div className="text-center lg:text-left">
            <Card className="p-8 shadow-xl border-2 border-emerald-200">
              <CardContent className="p-0">
                <div className="mb-6">
                  <Users className="h-16 w-16 text-emerald-600 mx-auto lg:mx-0 mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Prêt à commencer ?
                  </h4>
                  <p className="text-gray-600">
                    Rejoignez des centaines d'entreprises qui font confiance à Trézo
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link to="/register" className="flex items-center justify-center gap-2">
                      Démarrer mon essai gratuit
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/login" 
                      className="text-emerald-600 hover:text-emerald-700 text-sm underline"
                    >
                      Déjà un compte ? Se connecter
                    </Link>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    ✓ Aucune carte bancaire requise<br/>
                    ✓ Accès complet pendant 14 jours<br/>
                    ✓ Support client inclus
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section supplémentaire - Démonstration */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Ou découvrez Trézo en action
          </h3>
          <p className="text-gray-600 mb-8">
            Regardez comment nos clients utilisent Trézo au quotidien
          </p>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4">
            <Play className="h-5 w-5 mr-2" />
            Voir la démonstration
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EngagementSection;
