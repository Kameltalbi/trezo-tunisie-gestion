
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

  // Debug logs détaillés
  console.log('=== ADMIN PAGE DEBUG ===');
  console.log('User object:', user);
  console.log('User email:', user?.email);
  console.log('isKamelEmail:', isKamelEmail);
  console.log('roleCheck object:', roleCheck);
  console.log('roleCheckIsSuperAdmin:', roleCheckIsSuperAdmin);
  console.log('roleLoading:', roleLoading);
  console.log('Final isSuperAdmin:', isSuperAdmin);
  console.log('showAddAdminForm:', showAddAdminForm);

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
          {/* Bouton toujours visible avec condition explicite */}
          <Button 
            variant="default" 
            onClick={() => {
              console.log('=== BOUTON AJOUTER ADMIN CLIQUÉ ===');
              console.log('isSuperAdmin au moment du clic:', isSuperAdmin);
              console.log('isKamelEmail au moment du clic:', isKamelEmail);
              console.log('Setting showAddAdminForm to true');
              setShowAddAdminForm(true);
            }}
            className="bg-green-600 hover:bg-green-700"
            style={{ display: 'flex' }} // Force l'affichage
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

      {/* Section de debug visible */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-bold text-blue-800 mb-2">Informations de Debug (Toujours visible):</h3>
        <div className="space-y-1 text-sm text-blue-700">
          <p><strong>Email utilisateur:</strong> {user?.email || 'Non connecté'}</p>
          <p><strong>Est Kamel (isKamelEmail):</strong> {isKamelEmail ? 'OUI' : 'NON'}</p>
          <p><strong>RoleCheck isSuperAdmin:</strong> {roleCheckIsSuperAdmin ? 'OUI' : 'NON'}</p>
          <p><strong>RoleCheck loading:</strong> {roleLoading ? 'OUI' : 'NON'}</p>
          <p><strong>Final isSuperAdmin:</strong> {isSuperAdmin ? 'OUI' : 'NON'}</p>
          <p><strong>showAddAdminForm:</strong> {showAddAdminForm ? 'OUI' : 'NON'}</p>
        </div>
      </div>

      {/* Test bouton simple pour vérifier l'affichage */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">Test d'affichage bouton:</h3>
        <Button 
          onClick={() => alert('Test bouton fonctionne!')}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          🔴 BOUTON TEST - Si vous voyez ceci, les boutons fonctionnent
        </Button>
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
          console.log('=== FERMETURE FORMULAIRE ===');
          console.log('Setting showAddAdminForm to false');
          setShowAddAdminForm(false);
        }}
        onSuccess={handleAddAdminSuccess}
      />
    </div>
  );
};

export default Admin;
