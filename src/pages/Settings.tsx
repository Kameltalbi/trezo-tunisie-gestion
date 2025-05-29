
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Users, Building2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UsersManagement from '@/components/settings/UsersManagement';
import AccountInformation from '@/components/settings/AccountInformation';
import SecuritySettings from '@/components/settings/SecuritySettings';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Vérifier si l'utilisateur a accès aux paramètres (admin ou superadmin)
  const hasAccess = user?.email === 'kamel.talbi@yahoo.fr'; // Pour l'instant, seul kamel a accès

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

  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr';

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
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
