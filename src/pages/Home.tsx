
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Shield, Users, Star, Check, ArrowRight, BarChart3, PieChart, LineChart } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Suivi en temps réel",
      description: "Visualisez vos flux de trésorerie instantanément avec des graphiques interactifs"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Prévisions intelligentes",
      description: "Anticipez vos besoins de financement grâce à nos algorithmes de prédiction"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sécurité maximale",
      description: "Vos données financières sont protégées avec un chiffrement de niveau bancaire"
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Rapports détaillés",
      description: "Générez des rapports complets pour faciliter vos prises de décision"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      role: "CFO, TechStart",
      content: "Trezo a révolutionné notre gestion de trésorerie. Nous avons gagné 5h par semaine et notre visibilité financière s'est considérablement améliorée.",
      rating: 5,
      avatar: "MD"
    },
    {
      name: "Pierre Martin",
      role: "Directeur Financier, InnovCorp",
      content: "L'interface intuitive et les prévisions précises nous permettent de mieux anticiper nos besoins de financement.",
      rating: 5,
      avatar: "PM"
    },
    {
      name: "Sophie Bernard",
      role: "Comptable, ServicePro",
      content: "Excellent outil pour automatiser le suivi des flux. Les rapports sont très professionnels et faciles à comprendre.",
      rating: 5,
      avatar: "SB"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "29€",
      period: "/mois",
      description: "Parfait pour les petites entreprises",
      features: [
        "Jusqu'à 3 comptes bancaires",
        "Prévisions sur 6 mois",
        "Rapports de base",
        "Support email"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "79€",
      period: "/mois",
      description: "Idéal pour les entreprises en croissance",
      features: [
        "Comptes bancaires illimités",
        "Prévisions sur 24 mois",
        "Rapports avancés",
        "Multi-devises",
        "Support prioritaire",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Pour les grandes organisations",
      features: [
        "Tout du plan Professional",
        "Gestion multi-entités",
        "Workflows personnalisés",
        "Intégrations avancées",
        "Support dédié",
        "Formation incluse"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-xl">
                <Coins size={24} />
              </div>
              <span className="text-2xl font-bold">Trezo</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Témoignages</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Commencer gratuitement</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Nouvelle version disponible
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Maîtrisez votre{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                    trésorerie
                  </span>{' '}
                  en temps réel
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Anticipez, analysez et optimisez vos flux financiers avec notre plateforme intelligente de gestion de trésorerie.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Démarrer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Voir la démo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>5000+ entreprises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 étoiles</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-600/10 rounded-3xl p-8">
                <div className="bg-background border rounded-2xl shadow-2xl p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Tableau de bord</h3>
                      <Badge variant="secondary">Temps réel</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Revenus</span>
                          </div>
                          <p className="text-2xl font-bold text-green-500">+24.5%</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <LineChart className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Trésorerie</span>
                          </div>
                          <p className="text-2xl font-bold">247.8K€</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Fonctionnalités puissantes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tous les outils dont vous avez besoin pour une gestion de trésorerie efficace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-none bg-background">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Ce que disent nos clients</h2>
            <p className="text-xl text-muted-foreground">
              Découvrez pourquoi plus de 5000 entreprises nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">Tarifs transparents</h2>
            <p className="text-xl text-muted-foreground">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-emerald-500 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500">
                    Le plus populaire
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Commencer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-2 rounded-xl">
                  <Coins size={20} />
                </div>
                <span className="text-xl font-bold">Trezo</span>
              </Link>
              <p className="text-muted-foreground">
                La plateforme de gestion de trésorerie nouvelle génération pour les entreprises modernes.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Produit</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Formation</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Entreprise</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Presse</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partenaires</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">© 2024 Trezo. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Conditions</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
