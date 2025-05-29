
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Edit, User, ArrowRight } from 'lucide-react';
import PermissionsManagement from './PermissionsManagement';

const PermissionsSection = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionsDetail, setShowPermissionsDetail] = useState(false);

  // Mock data - utilisateurs du compte (sans les super-admins)
  const accountUsers = [
    {
      id: '2',
      name: 'Ahmed Ben Ali',
      email: 'ahmed@entreprise.tn',
      role: 'admin',
      addedAt: '2024-01-20',
      isCurrentUser: false,
      status: 'active'
    },
    {
      id: '3',
      name: 'Fatma Bouaziz',
      email: 'fatma@entreprise.tn',
      role: 'financier',
      addedAt: '2024-01-25',
      isCurrentUser: false,
      status: 'active'
    },
    {
      id: '4',
      name: 'Karim Souissi',
      email: 'karim@entreprise.tn',
      role: 'editeur',
      addedAt: '2024-01-28',
      isCurrentUser: false,
      status: 'active'
    },
    {
      id: '5',
      name: 'Leila Trabelsi',
      email: 'leila@entreprise.tn',
      role: 'collaborateur',
      addedAt: '2024-02-01',
      isCurrentUser: false,
      status: 'active'
    }
  ];

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

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
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
              {accountUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    Jamais modifiées
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Seuls les non-admins peuvent avoir leurs permissions modifiées */}
                      {user.role !== 'admin' ? (
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
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Accès complet par défaut
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {accountUsers.filter(u => u.role !== 'admin').length === 0 && (
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
