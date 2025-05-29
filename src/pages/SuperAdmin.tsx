
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, CreditCard, FileText, Settings, Shield } from 'lucide-react';
import AccountsManagement from '@/components/superadmin/AccountsManagement';
import PaymentProofsManagement from '@/components/superadmin/PaymentProofsManagement';
import UsersManagement from '@/components/superadmin/UsersManagement';
import PlansManagement from '@/components/superadmin/PlansManagement';
import PlatformSettings from '@/components/superadmin/PlatformSettings';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Superadmin</h1>
              <p className="text-gray-600">Gestion de la plateforme Trezo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Comptes Clients</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Preuves de paiement</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <AccountsManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentProofsManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="plans">
            <PlansManagement />
          </TabsContent>

          <TabsContent value="settings">
            <PlatformSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdmin;
