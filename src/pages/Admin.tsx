
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
import { useQueryClient } from '@tanstack/react-query';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const { user } = useAuth();
  const { data: roleCheck, isLoading: roleLoading } = useUserRoleCheck();
  const queryClient = useQueryClient();

  // Vérification spéciale pour kamel.talbi@yahoo.fr - toujours considéré comme super admin
  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr' || roleCheck?.isSuperAdmin || false;

  console.log('Vérifications Admin - Debug boutons:', {
    userEmail: user?.email,
    roleCheck,
    isSuperAdmin,
    roleLoading,
    showAddAdminForm
  });

  const handleAddAdminSuccess = () => {
    // Rafraîchir toutes les données admin après l'ajout réussi
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    console.log('Données admin rafraîchies après ajout d\'utilisateur');
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
          <p className="text-xs text-green-600 mt-1">
            ✓ Politiques RLS configurées pour l'accès aux données
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={() => {
              console.log('Bouton Ajouter Admin cliqué');
              setShowAddAdminForm(true);
            }}
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

      {/* Debug info pour vérifier l'état */}
      <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
        Debug: isSuperAdmin={isSuperAdmin ? 'true' : 'false'}, 
        userEmail={user?.email}, 
        roleCheck={JSON.stringify(roleCheck)}
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
        onClose={() => {
          console.log('Fermeture du formulaire AddAdmin');
          setShowAddAdminForm(false);
        }}
        onSuccess={handleAddAdminSuccess}
      />
    </div>
  );
};

export default Admin;
