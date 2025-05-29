
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Edit, RotateCcw, Trash2, Filter } from 'lucide-react';

const UsersManagement = () => {
  const [roleFilter, setRoleFilter] = useState('all');

  // Mock data - à remplacer par de vraies données
  const users = [
    {
      id: '1',
      fullName: 'Ahmed Ben Ali',
      email: 'ahmed@entrepriseabc.tn',
      role: 'admin',
      account: 'Entreprise ABC',
      isActive: true,
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      fullName: 'Fatma Trabelsi',
      email: 'fatma@startupxyz.tn',
      role: 'financier',
      account: 'Startup XYZ',
      isActive: true,
      lastLogin: '2024-01-19'
    },
    {
      id: '3',
      fullName: 'Karim Souissi',
      email: 'karim@societedef.tn',
      role: 'editeur',
      account: 'Société DEF',
      isActive: false,
      lastLogin: '2024-01-10'
    }
  ];

  const getRoleBadge = (role: string) => {
    const variants = {
      'superadmin': { text: 'Superadmin', className: 'bg-purple-100 text-purple-800' },
      'admin': { text: 'Admin', className: 'bg-blue-100 text-blue-800' },
      'financier': { text: 'Financier', className: 'bg-green-100 text-green-800' },
      'editeur': { text: 'Éditeur', className: 'bg-orange-100 text-orange-800' },
      'collaborateur': { text: 'Collaborateur', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = variants[role] || variants['collaborateur'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    console.log('Changer le rôle:', userId, newRole);
    // Logique de changement de rôle
  };

  const handleToggleUser = (userId: string) => {
    console.log('Activer/Désactiver utilisateur:', userId);
    // Logique d'activation/désactivation
  };

  const handleResetPassword = (userId: string) => {
    console.log('Réinitialiser mot de passe:', userId);
    // Logique de réinitialisation
  };

  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === roleFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs
        </CardTitle>
        <CardDescription>
          Vue d'ensemble et gestion de tous les utilisateurs de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="financier">Financier</SelectItem>
                <SelectItem value="editeur">Éditeur</SelectItem>
                <SelectItem value="collaborateur">Collaborateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Compte</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.account}</TableCell>
                  <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={user.isActive ? "destructive" : "default"} 
                        size="sm"
                        onClick={() => handleToggleUser(user.id)}
                      >
                        {user.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun utilisateur trouvé pour ce filtre
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
