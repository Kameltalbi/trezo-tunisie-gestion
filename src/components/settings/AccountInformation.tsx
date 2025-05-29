
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Users, Crown, Settings } from 'lucide-react';
import { useAccount } from '@/hooks/useAccount';

interface AccountInformationProps {
  isSuperAdmin: boolean;
}

const AccountInformation = ({ isSuperAdmin }: AccountInformationProps) => {
  const { data: accountData } = useAccount();

  // Mock data - à remplacer par de vraies données
  const accountInfo = {
    companyName: 'Entreprise Exemple SARL',
    plan: 'Pro',
    status: 'active',
    usersUsed: 3,
    maxUsers: 10,
    activationDate: '2024-01-15',
    expirationDate: '2025-01-15',
    features: [
      'Transactions illimitées',
      'Rapports avancés',
      'Support prioritaire',
      'Gestion multi-projets'
    ]
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { text: 'Actif', className: 'bg-green-100 text-green-800' },
      'trial': { text: 'Essai', className: 'bg-blue-100 text-blue-800' },
      'expired': { text: 'Expiré', className: 'bg-red-100 text-red-800' },
      'pending_activation': { text: 'En attente', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = variants[status] || variants['trial'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const handleModifyPlan = () => {
    console.log('Modifier le plan');
    // Logique de modification du plan
  };

  const handleSuspendAccount = () => {
    console.log('Suspendre le compte');
    // Logique de suspension
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations du compte
          </CardTitle>
          <CardDescription>
            Détails de votre compte entreprise et abonnement actuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Nom de l'entreprise</Label>
                <p className="text-lg font-medium">{accountInfo.companyName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Plan actuel</Label>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-lg font-medium">{accountInfo.plan}</span>
                  {getStatusBadge(accountInfo.status)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Utilisateurs</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-medium">
                    {accountInfo.usersUsed} / {accountInfo.maxUsers}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Date d'activation</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-lg font-medium">{accountInfo.activationDate}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Date d'expiration</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-medium">{accountInfo.expirationDate}</span>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleModifyPlan}>
                    Modifier le plan
                  </Button>
                  <Button variant="destructive" onClick={handleSuspendAccount}>
                    Suspendre
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités incluses</CardTitle>
          <CardDescription>
            Votre plan {accountInfo.plan} inclut les fonctionnalités suivantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accountInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default AccountInformation;
