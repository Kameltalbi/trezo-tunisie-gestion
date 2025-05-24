
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, PieChart, TrendingUp, Users, Star, Check, LayoutDashboard } from "lucide-react";
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
              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.nav.features')}</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.nav.testimonials')}</a>
              <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">{t('home.nav.pricing')}</a>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link to="/dashboard">
                <Button variant="ghost">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">{t('auth.login')}</Button>
              </Link>
              <Link to="/register">
                <Button>{t('home.pricing.free.cta')}</Button>
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
                {t('home.hero.title')}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('home.hero.cta_start')} <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t('home.hero.cta_dashboard')}
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    {t('home.hero.cta_discover')}
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
            {t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.features.expense_tracking.title')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.features.expense_tracking.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.features.expense_tracking.content')}
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.features.budgeting.title')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.features.budgeting.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.features.budgeting.content')}
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span>{t('home.features.analysis.title')}</span>
                </CardTitle>
                <CardDescription>
                  {t('home.features.analysis.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {t('home.features.analysis.content')}
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
            {t('home.testimonials.title')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Testimonial Card 1 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  "{t('home.testimonials.marie.text')}"
                </p>
                <div className="text-sm font-medium text-gray-900">
                  — {t('home.testimonials.marie.name')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('home.testimonials.marie.role')}
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Card 2 */}
            <Card>
              <CardContent className="text-center">
                <Star className="h-6 w-6 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">
                  "{t('home.testimonials.pierre.text')}"
                </p>
                <div className="text-sm font-medium text-gray-900">
                  — {t('home.testimonials.pierre.name')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('home.testimonials.pierre.role')}
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
            {t('home.pricing.title')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Trial Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.pricing.free.title')}</CardTitle>
                <CardDescription>
                  {t('home.pricing.free.description')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.pricing.free.badge')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {t('home.pricing.free.price')}
                </div>
                <div className="text-sm text-emerald-600 mb-4">{t('home.pricing.free.subtitle')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  {t('home.pricing.free.features', { returnObjects: true }).map((feature: string, index: number) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    {t('home.pricing.free.cta')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-emerald-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white">
                  {t('home.pricing.pro.badge')}
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.pricing.pro.title')}</CardTitle>
                <CardDescription>
                  {t('home.pricing.pro.description')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.pricing.pro.badge_feature')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {t('home.pricing.pro.price')}
                </div>
                <div className="text-sm text-gray-500 mb-4">{t('home.pricing.pro.period')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  {t('home.pricing.pro.features', { returnObjects: true }).map((feature: string, index: number) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    {t('home.pricing.pro.cta')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.pricing.enterprise.title')}</CardTitle>
                <CardDescription>
                  {t('home.pricing.enterprise.description')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.pricing.enterprise.badge_feature')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {t('home.pricing.enterprise.price')}
                </div>
                <div className="text-sm text-gray-500 mb-4">{t('home.pricing.enterprise.period')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  {t('home.pricing.enterprise.features', { returnObjects: true }).map((feature: string, index: number) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    {t('home.pricing.enterprise.cta')}
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
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.about.title')}</h3>
              <p className="text-gray-400">
                {t('home.footer.about.content')}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.features_section.title')}</h3>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">{t('home.footer.features_section.expense_tracking')}</a></li>
                <li><a href="#" className="hover:text-white">{t('home.footer.features_section.budgeting')}</a></li>
                <li><a href="#" className="hover:text-white">{t('home.footer.features_section.analysis')}</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.contact.title')}</h3>
              <p className="text-gray-400">
                {t('home.footer.contact.email')}
              </p>
              <p className="text-gray-400">
                {t('home.footer.contact.phone')}
              </p>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.newsletter.title')}</h3>
              <p className="text-gray-400 mb-4">
                {t('home.footer.newsletter.description')}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('home.footer.newsletter.placeholder')}
                  className="bg-gray-800 text-gray-400 rounded-l-md py-2 px-4 focus:outline-none"
                />
                <button className="bg-emerald-500 text-white rounded-r-md py-2 px-4 hover:bg-emerald-600 transition-colors">
                  {t('home.footer.newsletter.button')}
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400">
            &copy; {new Date().getFullYear()} Trézo. {t('home.footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
