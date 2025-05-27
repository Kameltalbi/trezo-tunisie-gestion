
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

  console.log('=== DEBUG ADMIN PAGE ===');
  console.log('User:', user);
  console.log('User email:', user?.email);
  console.log('RoleCheck data:', roleCheck);
  console.log('RoleCheck loading:', roleLoading);
  console.log('isSuperAdmin calculation:', {
    isKamelEmail: user?.email === 'kamel.talbi@yahoo.fr',
    roleCheckIsSuperAdmin: roleCheck?.isSuperAdmin,
    finalIsSuperAdmin: isSuperAdmin
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

  // Pour le debug, on va temporairement permettre l'accès même si pas super admin
  // if (!isSuperAdmin) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
  //         <p className="text-gray-600">
  //           Cette page est réservée aux super-administrateurs uniquement.
  //         </p>
  //         <p className="text-sm text-gray-500 mt-2">
  //           Utilisateur connecté: {user?.email}
  //         </p>
  //         <p className="text-sm text-gray-500">
  //           Rôle détecté: {roleCheck?.role || 'non défini'}
  //         </p>
  //       </div>
  //     );
  //   }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration (Debug Mode)</h1>
          <p className="text-sm text-gray-600">
            Connecté en tant que: {user?.email} - Rôle: {roleCheck?.role || 'non défini'}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Bouton toujours visible pour le debug */}
          <Button 
            variant="default" 
            onClick={() => {
              console.log('Bouton Ajouter Admin cliqué - Mode Debug');
              setShowAddAdminForm(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter Admin (Debug)
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Section de debug détaillée */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">Informations de Debug:</h3>
        <div className="space-y-1 text-sm text-yellow-700">
          <p><strong>Email utilisateur:</strong> {user?.email || 'Non connecté'}</p>
          <p><strong>Est Kamel:</strong> {user?.email === 'kamel.talbi@yahoo.fr' ? 'OUI' : 'NON'}</p>
          <p><strong>RoleCheck data:</strong> {JSON.stringify(roleCheck)}</p>
          <p><strong>RoleCheck loading:</strong> {roleLoading ? 'OUI' : 'NON'}</p>
          <p><strong>isSuperAdmin final:</strong> {isSuperAdmin ? 'OUI' : 'NON'}</p>
          <p><strong>showAddAdminForm:</strong> {showAddAdminForm ? 'OUI' : 'NON'}</p>
        </div>
      </div>

      {/* Statistiques */}
      <AdminStatsCards isSuperAdmin={true} />

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
            isSuperAdmin={true}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <AdminPaymentsTable isSuperAdmin={true} />
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
