
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNewPlans } from "@/hooks/useNewPlans";
import { useUserProfile } from "@/hooks/useUserProfile";
import PaymentMethodSelection from "@/components/PaymentMethodSelection";
import { Check, Star, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const Checkout = () => {
  const { data: plans, isLoading } = useNewPlans();
  const { data: profile } = useUserProfile();
  const navigate = useNavigate();

  const handleTrialStart = () => {
    toast.success('Votre essai gratuit de 14 jours a commencé !');
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement des plans...</div>
      </div>
    );
  }

  // Si l'utilisateur a déjà un statut pending_activation, afficher un message
  if (profile?.account_status === 'pending_activation') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle>Paiement en cours de validation</CardTitle>
            <CardDescription>
              Votre preuve de paiement a été reçue. Notre équipe procédera à l'activation de votre compte dans les plus brefs délais.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="mb-4">
              Activation en cours ⏳
            </Badge>
            <p className="text-sm text-gray-600">
              Vous recevrez un email de confirmation dès que votre compte sera activé.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si l'utilisateur a un compte expiré, afficher seulement les options de paiement
  if (profile?.account_status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Votre essai est terminé
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pour continuer à utiliser Trezo, veuillez choisir un plan et effectuer votre paiement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans?.filter(plan => !plan.is_trial).map((plan) => (
              <Card key={plan.id} className="relative border-2 hover:border-blue-500 transition-colors">
                {plan.name === 'pro' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-2">
                      Recommandé
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold mb-2">
                    {plan.label}
                  </CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price_dt}</span>
                    <span className="text-xl text-gray-500 ml-1">DT / an</span>
                  </div>
                  <CardDescription>
                    {plan.name === 'pro' ? 'Pour les entreprises en croissance' : 'Solution complète pour équipes'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <PaymentMethodSelection 
                    plan={plan} 
                    showTrialOption={false}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Affichage normal pour les nouveaux utilisateurs
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Commencez avec un essai gratuit de 14 jours ou activez immédiatement votre compte
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 hover:border-blue-500 transition-colors ${
                plan.name === 'pro' ? 'border-orange-500 transform lg:scale-105' : 'border-gray-200'
              }`}
            >
              {plan.is_trial && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-4 py-2">
                    Gratuit 14 jours
                  </Badge>
                </div>
              )}
              
              {plan.name === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-2">
                    Recommandé
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold mb-2">
                  {plan.label}
                </CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{plan.price_dt}</span>
                  <span className="text-xl text-gray-500 ml-1">
                    DT {plan.is_trial ? '' : '/ an'}
                  </span>
                </div>
                <CardDescription>
                  {plan.is_trial ? 'Découvrez toutes nos fonctionnalités' :
                   plan.name === 'pro' ? 'Pour les entreprises en croissance' : 
                   'Solution complète pour équipes'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-6">
                {/* Fonctionnalités de base */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Gestion de trésorerie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Tableaux de bord</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{plan.max_users} utilisateur{plan.max_users > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {/* Actions */}
                {plan.is_trial ? (
                  <PaymentMethodSelection 
                    plan={plan} 
                    showTrialOption={true}
                    onTrialStart={handleTrialStart}
                  />
                ) : (
                  <PaymentMethodSelection 
                    plan={plan} 
                    showTrialOption={true}
                    onTrialStart={handleTrialStart}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
