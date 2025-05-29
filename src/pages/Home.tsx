import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Users, Star, Check } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

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
              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.features')}</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.testimonials')}</a>
              <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.pricing')}</a>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/login">
                <Button variant="ghost">{t('auth.login')}</Button>
              </Link>
              <Link to="/register">
                <Button>{t('home.try_free')}</Button>
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
                {t('home.hero_title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {t('home.hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('home.start_free')} <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    {t('home.discover_features')}
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <img
                src="/lovable-uploads/4a8d58f1-f6be-4700-b29a-87480126f34c.png"
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
            {t('home.key_features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.expense_tracking')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.expense_tracking_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.expense_tracking_detail')}
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.budgeting')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.budgeting_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.budgeting_detail')}
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.financial_analysis')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.financial_analysis_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.financial_analysis_detail')}
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
            {t('home.what_users_say')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Testimonial Card 1 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  {t('home.testimonial_1')}
                </p>
                <div className="text-sm font-medium text-gray-900">
                  {t('home.testimonial_1_author')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('home.testimonial_1_role')}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Card 2 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  {t('home.testimonial_2')}
                </p>
                <div className="text-sm font-medium text-gray-900">
                  {t('home.testimonial_2_author')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('home.testimonial_2_role')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tarification transparente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond le mieux aux besoins de votre entreprise
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Plan Essai Gratuit */}
            <Card className="relative bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
              <CardHeader className="text-center pb-6">
                <div className="mb-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    Essai de 14 jours
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Essai Gratuit
                </CardTitle>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">0</span>
                  <span className="text-xl text-gray-500 ml-1">DT</span>
                </div>
                <CardDescription className="text-gray-600">
                  Découvrez toutes nos fonctionnalités gratuitement
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Tableau de bord complet</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Gestion des revenus et dépenses</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">2 comptes bancaires</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">3 projets</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Objectifs financiers de base</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Support communautaire</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-6 pb-8">
                <div className="w-full space-y-3">
                  <Link to="/checkout" className="w-full block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-xl">
                      Commencer l'essai gratuit
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>

            {/* Plan Pro - Most Popular */}
            <Card className="relative bg-white border-2 border-orange-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-4 py-2 text-sm font-semibold">
                  Recommandé
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Pro
                </CardTitle>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">450</span>
                  <span className="text-xl text-gray-500 ml-1">DT / an</span>
                </div>
                <CardDescription className="text-gray-600">
                  Pour les entreprises en croissance
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Toutes les fonctionnalités de l'essai</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">3 comptes bancaires</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">10 projets</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Suivi de trésorerie & prévisions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Gestion des dettes</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Objectifs illimités</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Exports PDF / Excel</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Support par email</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-6 pb-8">
                <div className="w-full space-y-3">
                  <Link to="/checkout" className="w-full block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-base font-semibold rounded-xl">
                      Essai gratuit 14 jours
                    </Button>
                  </Link>
                  <Link to="/checkout" className="w-full block">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50 py-2 text-base font-semibold rounded-xl">
                      Payer maintenant
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>

            {/* Plan Entreprise */}
            <Card className="relative bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
              <CardHeader className="text-center pb-6">
                <div className="mb-4">
                  <Badge variant="outline" className="border-blue-500 text-blue-700">
                    Pour les PME
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Entreprise
                </CardTitle>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-gray-900">599</span>
                  <span className="text-xl text-gray-500 ml-1">DT / an</span>
                </div>
                <CardDescription className="text-gray-600">
                  Solution complète pour équipes
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Toutes les fonctionnalités du plan Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Jusqu'à 5 utilisateurs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Attribution de rôles (Financier, Éditeur, Collaborateur)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Gestion des accès et autorisations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Rapports personnalisés</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Historique des actions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Conservation des données</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Formation personnalisée</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Conseiller dédié</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="px-6 pb-8">
                <div className="w-full space-y-3">
                  <Link to="/checkout" className="w-full block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 text-base font-semibold rounded-xl">
                      Essai gratuit 14 jours
                    </Button>
                  </Link>
                  <Link to="/checkout" className="w-full block">
                    <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 py-2 text-base font-semibold rounded-xl">
                      Payer maintenant
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Toutes les offres incluent une garantie de remboursement de 30 jours
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.about')}</h3>
              <p className="text-gray-400">
                {t('home.about_desc')}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.features')}</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">{t('home.expense_tracking')}</a></li>
                <li><a href="#" className="hover:text-white">{t('home.budgeting')}</a></li>
                <li><a href="#" className="hover:text-white">{t('home.financial_analysis')}</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.contact')}</h3>
              <p className="text-gray-400">
                Email: support@trezo.app
              </p>
              <p className="text-gray-400">
                {t('home.phone')}: +33 1 23 45 67 89
              </p>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.newsletter_subscribe')}</h3>
              <p className="text-gray-400 mb-4">
                {t('home.newsletter_desc')}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('home.your_email')}
                  className="bg-gray-800 text-gray-400 rounded-l-md py-2 px-4 focus:outline-none"
                />
                <button className="bg-emerald-500 text-white rounded-r-md py-2 px-4 hover:bg-emerald-600 transition-colors">
                  {t('home.subscribe')}
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400">
            &copy; {new Date().getFullYear()} Trézo. {t('home.all_rights_reserved')}.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
