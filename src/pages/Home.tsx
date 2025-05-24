import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Home = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define features, testimonials, and pricing data locally since t() returns objects for arrays
  const features = [
    {
      key: 'expense_tracking',
      icon: '📊'
    },
    {
      key: 'budgeting', 
      icon: '💰'
    },
    {
      key: 'analysis',
      icon: '📈'
    }
  ];

  const testimonials = [
    {
      key: 'marie'
    },
    {
      key: 'pierre'
    }
  ];

  const pricingPlans = [
    {
      key: 'free',
      features: [
        'Complete dashboard',
        'Income management', 
        'Expense tracking',
        '2 bank accounts maximum',
        '3 projects maximum',
        'Basic financial objectives',
        'Community support'
      ]
    },
    {
      key: 'pro',
      features: [
        'All trial features',
        'Unlimited bank accounts',
        'Unlimited projects', 
        'Advanced treasury management',
        'Cash Flow and forecasts',
        'Debt management',
        'Advanced PDF/Excel reports',
        'Unlimited financial objectives',
        'Email support'
      ]
    },
    {
      key: 'enterprise',
      features: [
        'All Pro features',
        'Multi-users (up to 10)',
        'Advanced administration',
        'Roles and permissions management',
        'Custom reports',
        'API and integrations',
        'Automatic backup',
        'Priority 24/7 support',
        'Personalized training',
        'Dedicated advisor'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-600">{t('app.name')}</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600">{t('home.nav.features')}</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600">{t('home.nav.testimonials')}</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600">{t('home.nav.pricing')}</a>
              <LanguageSwitcher />
              <Button variant="outline">{t('auth.login')}</Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600">{t('home.nav.features')}</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600">{t('home.nav.testimonials')}</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600">{t('home.nav.pricing')}</a>
                <Button variant="outline" className="w-fit">{t('auth.login')}</Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {t('home.hero.cta_start')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              {t('home.hero.cta_dashboard')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.key} className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4">
                    {t(`home.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(`home.features.${feature.key}.description`)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t(`home.features.${feature.key}.content`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.testimonials.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.key}>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4 italic">
                    "{t(`home.testimonials.${testimonial.key}.text`)}"
                  </p>
                  <div className="font-semibold">
                    {t(`home.testimonials.${testimonial.key}.name`)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t(`home.testimonials.${testimonial.key}.role`)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.pricing.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.key} className={plan.key === 'pro' ? 'border-blue-500 border-2' : ''}>
                <CardContent className="p-6">
                  {plan.key === 'pro' && (
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 text-center">
                      {t(`home.pricing.${plan.key}.badge`)}
                    </div>
                  )}
                  {plan.key === 'free' && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 text-center">
                      {t(`home.pricing.${plan.key}.badge`)}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`home.pricing.${plan.key}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t(`home.pricing.${plan.key}.description`)}
                  </p>
                  <div className="text-3xl font-bold mb-2">
                    {t(`home.pricing.${plan.key}.price`)}
                    {plan.key !== 'free' && (
                      <span className="text-sm font-normal text-gray-500">
                        {' '}{t(`home.pricing.${plan.key}.period`)}
                      </span>
                    )}
                  </div>
                  {plan.key === 'free' && (
                    <p className="text-sm text-gray-500 mb-6">
                      {t(`home.pricing.${plan.key}.subtitle`)}
                    </p>
                  )}
                  <Button className="w-full mb-6">
                    {t(`home.pricing.${plan.key}.cta`)}
                  </Button>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span className="text-sm">{t(`home.pricing.${plan.key}.features.${index}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.about.title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('home.footer.about.content')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.features_section.title')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">{t('home.footer.features_section.expense_tracking')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">{t('home.footer.features_section.budgeting')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">{t('home.footer.features_section.analysis')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.contact.title')}</h3>
              <p className="text-gray-400 text-sm mb-2">{t('home.footer.contact.email')}</p>
              <p className="text-gray-400 text-sm">{t('home.footer.contact.phone')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('home.footer.newsletter.title')}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {t('home.footer.newsletter.description')}
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder={t('home.footer.newsletter.placeholder')}
                  className="bg-gray-800 text-white px-3 py-2 rounded-l flex-1"
                />
                <Button className="rounded-l-none">
                  {t('home.footer.newsletter.button')}
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 {t('app.name')}. {t('home.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
