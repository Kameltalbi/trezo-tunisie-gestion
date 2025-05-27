
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoleCheck } from '@/hooks/useUserRoleCheck';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { AdminPaymentsTable } from '@/components/admin/AdminPaymentsTable';
import { AddAdminForm } from '@/components/admin/AddAdminForm';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const { user } = useAuth();
  const { data: roleCheck, isLoading: roleLoading } = useUserRoleCheck();

  // Vérification spéciale pour kamel.talbi@yahoo.fr
  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr' || roleCheck?.isSuperAdmin || false;

  console.log('Vérifications Admin:', {
    userEmail: user?.email,
    roleCheck,
    isSuperAdmin,
    roleLoading
  });

  const handleAddAdminSuccess = () => {
    // Cette fonction sera appelée après l'ajout réussi d'un admin
    // pour rafraîchir la liste des utilisateurs
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h2>
          <p className="text-gray-600">
            Vérification des permissions en cours...
          </p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">
            Cette page est réservée aux super-administrateurs uniquement.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Utilisateur connecté: {user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Rôle détecté: {roleCheck?.role || 'non défini'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration (Super Admin)</h1>
          <p className="text-sm text-gray-600">
            Connecté en tant que: {user?.email} - Rôle: {roleCheck?.role || 'superadmin'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => setShowAddAdminForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter Admin
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <AdminStatsCards isSuperAdmin={isSuperAdmin} />

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <AdminUsersTable 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isSuperAdmin={isSuperAdmin}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <AdminPaymentsTable isSuperAdmin={isSuperAdmin} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Gestion des abonnements - Les données réelles seront affichées ici
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddAdminForm
        open={showAddAdminForm}
        onClose={() => setShowAddAdminForm(false)}
        onSuccess={handleAddAdminSuccess}
      />
    </div>
  );
};

export default Admin;
