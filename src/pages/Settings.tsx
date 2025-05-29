
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, Building2, Shield, Currency } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuth } from '@/contexts/AuthContext';
import UsersManagement from '@/components/settings/UsersManagement';
import PermissionsSection from '@/components/settings/PermissionsSection';
import AccountInformation from '@/components/settings/AccountInformation';
import SecuritySettings from '@/components/settings/SecuritySettings';
import CurrencySettings from '@/components/settings/CurrencySettings';
import EntrepriseForm from '@/components/forms/EntrepriseForm';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { data: currentUser, isLoading } = useCurrentUser();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Vérifier si l'utilisateur a accès aux paramètres
  // kamel.talbi@yahoo.fr est automatiquement superadmin
  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr' || currentUser?.role === 'superadmin';
  const hasAccess = isSuperAdmin || currentUser?.role === 'admin';

  console.log('Debug Settings access:', {
    userEmail: user?.email,
    currentUserRole: currentUser?.role,
    isSuperAdmin,
    hasAccess
  });

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="h-5 w-5" />
              Accès refusé
            </CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder aux paramètres.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-gray-600">Gestion de votre compte et utilisateurs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="entreprise" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Entreprise</span>
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <Currency className="h-4 w-4" />
              <span className="hidden sm:inline">Devise</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compte</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement isSuperAdmin={isSuperAdmin} />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsSection />
          </TabsContent>

          <TabsContent value="entreprise">
            <EntrepriseForm />
          </TabsContent>

          <TabsContent value="currency">
            <CurrencySettings isSuperAdmin={isSuperAdmin} />
          </TabsContent>

          <TabsContent value="account">
            <AccountInformation isSuperAdmin={isSuperAdmin} />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings isSuperAdmin={isSuperAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
