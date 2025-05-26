import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Users, Star, Check, LayoutDashboard } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png" 
                alt="Trézo" 
                className="h-24 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Fonctionnalités</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Témoignages</a>
              <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">Tarifs</a>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/dashboard">
                <Button variant="ghost">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Créer un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Prenez le contrôle de vos finances avec Trézo
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Gérez facilement votre budget, suivez vos dépenses et atteignez vos objectifs financiers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer gratuitement <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Voir le dashboard
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Découvrir les fonctionnalités
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <img
                src="/lovable-uploads/83bfd5fc-af11-41e7-bd04-ada29ad2b294.png"
                alt="Tableau de bord Trézo"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Fonctionnalités clés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  <span>Suivi des dépenses</span>
                </CardTitle>
                <CardDescription>
                  Visualisez et catégorisez vos dépenses pour une meilleure gestion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Enregistrez facilement vos transactions et suivez l'évolution de vos dépenses au fil du temps.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-emerald-500" />
                  <span>Budgétisation</span>
                </CardTitle>
                <CardDescription>
                  Créez des budgets personnalisés et recevez des alertes en cas de dépassement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Fixez des limites de dépenses pour chaque catégorie et atteignez vos objectifs d'épargne.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span>Analyse financière</span>
                </CardTitle>
                <CardDescription>
                  Obtenez des informations précieuses sur vos habitudes de dépenses et votre santé financière.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Identifiez les domaines où vous pouvez économiser de l'argent et optimiser votre budget.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Ce que nos utilisateurs disent
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Testimonial Card 1 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  "Trézo m'a aidé à prendre le contrôle de mes finances et à atteindre mes objectifs d'épargne. Je le recommande vivement !"
                </p>
                <div className="text-sm font-medium text-gray-900">
                  — Marie Dupont
                </div>
                <div className="text-xs text-gray-500">
                  Étudiante
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Card 2 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  "Grâce à Trézo, je peux suivre mes dépenses en temps réel et identifier les gaspillages. Un outil indispensable pour une gestion financière efficace."
                </p>
                <div className="text-sm font-medium text-gray-900">
                  — Pierre Martin
                </div>
                <div className="text-xs text-gray-500">
                  Entrepreneur
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            Tarifs
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Trial Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">Essai gratuit</CardTitle>
                <CardDescription>
                  Découvrez toutes les fonctionnalités
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">
                    <Check className="h-4 w-4 mr-2" />
                    14 jours d'essai
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  Gratuit
                </div>
                <div className="text-sm text-emerald-600 mb-4">14 jours d'essai complet</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Tableau de bord complet</li>
                  <li>✓ Gestion des encaissements</li>
                  <li>✓ Suivi des dépenses</li>
                  <li>✓ 2 comptes bancaires maximum</li>
                  <li>✓ 3 projets maximum</li>
                  <li>✓ Objectifs financiers de base</li>
                  <li>✓ Support communautaire</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    Commencer l'essai gratuit
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-emerald-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white">
                  Le plus populaire
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">Pro</CardTitle>
                <CardDescription>
                  Pour les particuliers et PME
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    Fonctionnalités avancées
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  450 DT
                </div>
                <div className="text-sm text-gray-500 mb-4">par an</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Toutes les fonctionnalités de l'essai</li>
                  <li>✓ 3 Comptes bancaires</li>
                  <li>✓ Projets 10 projets par an</li>
                  <li>✓ Cash Flow et prévisions</li>
                  <li>✓ Gestion des dettes</li>
                  <li>✓ Rapports PDF/Excel</li>
                  <li>✓ Objectifs financiers illimités</li>
                  <li>✓ Support par email</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    Choisir Pro
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">Entreprise</CardTitle>
                <CardDescription>
                  Pour les grandes organisations
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    Solutions sur mesure
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  599 DT
                </div>
                <div className="text-sm text-gray-500 mb-4">par an</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Toutes les fonctionnalités Pro</li>
                  <li>✓ Multi-utilisateurs (jusqu'à 7)</li>
                  <li>✓ Administration avancée</li>
                  <li>✓ Gestion des rôles et permissions</li>
                  <li>✓ Rapports personnalisés</li>
                  <li>✓ Sauvegarde automatique</li>
                  <li>✓ Support prioritaire</li>
                  <li>✓ Formation personnalisée</li>
                  <li>✓ Conseiller dédié</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    Choisir Entreprise
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">À propos</h3>
              <p className="text-gray-400">
                Trézo est une application de gestion financière conçue pour vous aider à prendre le contrôle de votre argent et à atteindre vos objectifs financiers.
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Suivi des dépenses</a></li>
                <li><a href="#" className="hover:text-white">Budgétisation</a></li>
                <li><a href="#" className="hover:text-white">Analyse financière</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: support@trezo.app
              </p>
              <p className="text-gray-400">
                Téléphone: +33 1 23 45 67 89
              </p>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="text-lg font-semibold mb-4">S'inscrire à la newsletter</h3>
              <p className="text-gray-400 mb-4">
                Recevez les dernières nouvelles et mises à jour de Trézo.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="bg-gray-800 text-gray-400 rounded-l-md py-2 px-4 focus:outline-none"
                />
                <button className="bg-emerald-500 text-white rounded-r-md py-2 px-4 hover:bg-emerald-600 transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400">
            &copy; {new Date().getFullYear()} Trézo. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
