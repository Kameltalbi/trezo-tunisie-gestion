
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
              <Link to="/checkout">
                <Button>{t('home.create_account')}</Button>
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
                <Link to="/checkout">
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
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
            {t('home.pricing')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Free Trial Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.free_trial')}</CardTitle>
                <CardDescription>
                  {t('home.free_trial_desc')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.fourteen_days_trial')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {t('home.free')}
                </div>
                <div className="text-sm text-emerald-600 mb-4">{t('home.fourteen_days_trial_full')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ {t('home.complete_dashboard')}</li>
                  <li>✓ {t('home.income_management')}</li>
                  <li>✓ {t('home.expense_tracking')}</li>
                  <li>✓ {t('home.two_bank_accounts_max')}</li>
                  <li>✓ {t('home.three_projects_max')}</li>
                  <li>✓ {t('home.basic_financial_goals')}</li>
                  <li>✓ {t('home.community_support')}</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/register" className="w-full">
                  <Button className="w-full">
                    {t('home.start_free_trial')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-emerald-500 border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white">
                  {t('home.most_popular')}
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.pro')}</CardTitle>
                <CardDescription>
                  {t('home.pro_desc')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.advanced_features')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  450 DT
                </div>
                <div className="text-sm text-gray-500 mb-4">{t('home.per_year')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ {t('home.all_trial_features')}</li>
                  <li>✓ {t('home.three_bank_accounts')}</li>
                  <li>✓ {t('home.ten_projects_per_year')}</li>
                  <li>✓ {t('home.cash_flow_forecasts')}</li>
                  <li>✓ {t('home.debt_management')}</li>
                  <li>✓ {t('home.pdf_excel_reports')}</li>
                  <li>✓ {t('home.unlimited_financial_goals')}</li>
                  <li>✓ {t('home.email_support')}</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/checkout" className="w-full">
                  <Button className="w-full">
                    {t('home.choose_pro')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{t('home.enterprise')}</CardTitle>
                <CardDescription>
                  {t('home.enterprise_desc')}
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    {t('home.custom_solutions')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  599 DT
                </div>
                <div className="text-sm text-gray-500 mb-4">{t('home.per_year')}</div>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ {t('home.all_pro_features')}</li>
                  <li>✓ {t('home.multi_users_up_to_seven')}</li>
                  <li>✓ {t('home.advanced_administration')}</li>
                  <li>✓ {t('home.role_permission_management')}</li>
                  <li>✓ {t('home.custom_reports')}</li>
                  <li>✓ {t('home.automatic_backup')}</li>
                  <li>✓ {t('home.priority_support')}</li>
                  <li>✓ {t('home.personalized_training')}</li>
                  <li>✓ {t('home.dedicated_advisor')}</li>
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Link to="/checkout" className="w-full">
                  <Button className="w-full">
                    {t('home.choose_enterprise')}
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
