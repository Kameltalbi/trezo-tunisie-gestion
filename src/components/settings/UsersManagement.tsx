import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AddUserDialog from './AddUserDialog';

interface UsersManagementProps {
  isSuperAdmin: boolean;
}

const UsersManagement = ({ isSuperAdmin }: UsersManagementProps) => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock data - à remplacer par de vraies données
  // Exclure les super-administrateurs de la liste des utilisateurs du compte
  const accountUsers = [
    {
      id: '2',
      name: 'Ahmed Ben Ali',
      email: 'ahmed@entreprise.tn',
      role: 'admin',
      addedAt: '2024-01-20',
      isCurrentUser: false
    },
    {
      id: '3',
      name: 'Fatma Bouaziz',
      email: 'fatma@entreprise.tn',
      role: 'financier',
      addedAt: '2024-01-25',
      isCurrentUser: false
    }
  ];

  // Données du plan (mock)
  const currentPlan = {
    name: 'Pro',
    maxUsers: 10,
    currentUsers: accountUsers.length
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': { variant: 'default', text: 'Admin', className: 'bg-blue-100 text-blue-800' },
      'financier': { variant: 'secondary', text: 'Financier', className: 'bg-green-100 text-green-800' },
      'editeur': { variant: 'outline', text: 'Éditeur', className: 'bg-orange-100 text-orange-800' },
      'collaborateur': { variant: 'outline', text: 'Collaborateur', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = variants[role] || variants['collaborateur'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const canAddUser = currentPlan.currentUsers < currentPlan.maxUsers;
  const isLimitReached = !canAddUser;

  const handleDeleteUser = (userId: string) => {
    console.log('Supprimer utilisateur:', userId);
    // Logique de suppression
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des utilisateurs
        </CardTitle>
        <CardDescription>
          Gérez les utilisateurs de votre compte ({currentPlan.currentUsers}/{currentPlan.maxUsers} utilisés)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Plan actuel: <span className="font-medium">{currentPlan.name}</span>
          </div>
          <div className="flex gap-2">
            {isLimitReached && (
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md text-sm">
                <AlertTriangle className="h-4 w-4" />
                Limite atteinte
              </div>
            )}
            <Button 
              onClick={() => setShowAddDialog(true)}
              disabled={isLimitReached}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        {isLimitReached && (
          <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-medium">Limite d'utilisateurs atteinte</p>
                <p className="text-sm">
                  Vous avez atteint la limite de votre plan. 
                  <Button variant="link" className="p-0 h-auto text-orange-600 underline">
                    Découvrez les plans supérieurs
                  </Button>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Ajouté le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountUsers.map((accountUser) => (
                <TableRow key={accountUser.id}>
                  <TableCell className="font-medium">
                    {accountUser.name}
                    {accountUser.isCurrentUser && (
                      <span className="ml-2 text-xs text-gray-500">(Vous)</span>
                    )}
                  </TableCell>
                  <TableCell>{accountUser.email}</TableCell>
                  <TableCell>{getRoleBadge(accountUser.role)}</TableCell>
                  <TableCell>{accountUser.addedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!accountUser.isCurrentUser && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteUser(accountUser.id)}
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

        <AddUserDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          isSuperAdmin={isSuperAdmin}
        />
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
