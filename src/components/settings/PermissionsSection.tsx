
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Edit, User, ArrowRight } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import PermissionsManagement from './PermissionsManagement';

const PermissionsSection = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsDetail, setShowPermissionsDetail] = useState(false);

  const { data: users = [] } = useUsers();
  const { data: currentUser } = useCurrentUser();

  // Filtrer les utilisateurs pour exclure les admins et superadmins
  const editableUsers = users.filter(user => 
    user.role !== 'admin' && user.role !== 'superadmin'
  );

  const getRoleBadge = (role: string) => {
    const variants = {
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

  const handleManagePermissions = (user) => {
    setSelectedUser(user);
    setShowPermissionsDetail(true);
  };

  if (showPermissionsDetail && selectedUser) {
    return (
      <PermissionsManagement
        user={selectedUser}
        open={true}
        onOpenChange={() => {
          setShowPermissionsDetail(false);
          setSelectedUser(null);
        }}
        isSection={true}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gestion des permissions
        </CardTitle>
        <CardDescription>
          Configurez les droits d'accès et les permissions de chaque utilisateur de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              <div>
                <p className="font-medium">Contrôle granulaire des accès</p>
                <p className="text-sm">
                  Définissez précisément les sections accessibles et les actions autorisées pour chaque membre de votre équipe.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière modification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => handleManagePermissions(user)}
                      >
                        <Edit className="h-4 w-4" />
                        Gérer les permissions
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {editableUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun utilisateur à configurer</p>
            <p className="text-sm">
              Ajoutez des utilisateurs dans l'onglet "Utilisateurs" pour gérer leurs permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionsSection;
