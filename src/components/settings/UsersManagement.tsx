
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Edit, Trash2, AlertTriangle, Shield } from 'lucide-react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentAccount } from '@/hooks/useAccounts';
import AddUserDialog from './AddUserDialog';
import PermissionsManagement from './PermissionsManagement';

interface UsersManagementProps {
  isSuperAdmin: boolean;
}

const UsersManagement = ({ isSuperAdmin }: UsersManagementProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const { data: users = [], isLoading } = useUsers();
  const { data: currentUser } = useCurrentUser();
  const { data: currentAccount } = useCurrentAccount();
  const deleteUserMutation = useDeleteUser();

  const getRoleBadge = (role: string) => {
    const variants = {
      'superadmin': { className: 'bg-purple-100 text-purple-800', text: 'Superadmin' },
      'admin': { className: 'bg-blue-100 text-blue-800', text: 'Admin' },
      'financier': { className: 'bg-green-100 text-green-800', text: 'Financier' },
      'editeur': { className: 'bg-orange-100 text-orange-800', text: 'Éditeur' },
      'collaborateur': { className: 'bg-gray-100 text-gray-800', text: 'Collaborateur' }
    };
    
    const config = variants[role] || variants['collaborateur'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      await deleteUserMutation.mutateAsync(userId);
    }
  };

  const handleManagePermissions = (user) => {
    setSelectedUser(user);
    setShowPermissions(true);
  };

  const canAddUser = true; // À implémenter avec les limites du plan
  const filteredUsers = users.filter(user => 
    // Exclure les superadmins pour les comptes normaux
    isSuperAdmin || user.role !== 'superadmin'
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <div className="text-gray-500">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des utilisateurs
        </CardTitle>
        <CardDescription>
          Gérez les utilisateurs de votre compte ({filteredUsers.length} utilisateurs)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Compte: <span className="font-medium">{currentAccount?.name}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddDialog(true)}
              disabled={!canAddUser}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Ajouté le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name}
                    {user.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-gray-500">(Vous)</span>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Bouton gérer les permissions - visible seulement pour les non-admins */}
                      {user.role !== 'admin' && user.role !== 'superadmin' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => handleManagePermissions(user)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.id !== currentUser?.id && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUserMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun utilisateur</p>
            <p className="text-sm">Ajoutez votre premier utilisateur pour commencer.</p>
          </div>
        )}

        <AddUserDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          isSuperAdmin={isSuperAdmin}
        />

        {selectedUser && (
          <PermissionsManagement
            user={selectedUser}
            open={showPermissions}
            onOpenChange={setShowPermissions}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
