
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

  // Logique simplifiée pour déterminer si l'utilisateur est super admin
  const isKamelEmail = user?.email === 'kamel.talbi@yahoo.fr';
  const roleCheckIsSuperAdmin = roleCheck?.isSuperAdmin === true;
  const isSuperAdmin = isKamelEmail || roleCheckIsSuperAdmin;

  console.log('=== ADMIN PAGE - RENDU ===');
  console.log('User:', user?.email);
  console.log('isKamelEmail:', isKamelEmail);
  console.log('roleCheck:', roleCheck);
  console.log('roleLoading:', roleLoading);
  console.log('isSuperAdmin FINAL:', isSuperAdmin);

  const handleAddAdminSuccess = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-sm text-gray-600">
            Connecté en tant que: {user?.email || 'Non connecté'}
          </p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin && (
            <Button 
              variant="default" 
              onClick={() => {
                console.log('=== CLIC BOUTON AJOUTER ADMIN ===');
                console.log('isSuperAdmin au moment du clic:', isSuperAdmin);
                setShowAddAdminForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter Admin
            </Button>
          )}
          
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* SECTION DEBUG */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-bold text-blue-800 mb-3">🔍 Informations de Debug</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Utilisateur:</h4>
              <div className="space-y-1 text-blue-600">
                <p><strong>Email:</strong> {user?.email || 'Non défini'}</p>
                <p><strong>Est Kamel:</strong> {isKamelEmail ? '✅ OUI' : '❌ NON'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Permissions:</h4>
              <div className="space-y-1 text-blue-600">
                <p><strong>RoleCheck:</strong> {JSON.stringify(roleCheck)}</p>
                <p><strong>isSuperAdmin:</strong> {isSuperAdmin ? '✅ OUI' : '❌ NON'}</p>
                <p><strong>Bouton visible:</strong> {isSuperAdmin ? '✅ OUI' : '❌ NON'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          console.log('=== FERMETURE FORMULAIRE ===');
          setShowAddAdminForm(false);
        }}
        onSuccess={handleAddAdminSuccess}
      />
    </div>
  );
};

export default Admin;
