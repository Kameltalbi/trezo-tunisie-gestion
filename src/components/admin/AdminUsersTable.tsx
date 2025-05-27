
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Shield, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAdminUsers, type AdminUser } from '@/hooks/useAdminUsers';

interface AdminUsersTableProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSuperAdmin: boolean;
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  searchTerm,
  onSearchChange,
  isSuperAdmin
}) => {
  const { data: users, isLoading: usersLoading, error } = useAdminUsers(searchTerm, isSuperAdmin);

  const getStatusBadge = (user: AdminUser) => {
    if (user.is_superadmin) {
      return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
        <Crown className="w-3 h-3 mr-1" />
        Super Admin
      </Badge>;
    }
    if (user.role === 'admin') {
      return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
        <Shield className="w-3 h-3 mr-1" />
        Admin
      </Badge>;
    }
    return <Badge variant="outline">
      <User className="w-3 h-3 mr-1" />
      Utilisateur
    </Badge>;
  };

  if (error) {
    console.error('Erreur AdminUsersTable:', error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des utilisateurs</CardTitle>
        <CardDescription>
          Vue d'ensemble de tous les utilisateurs et leurs abonnements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {error && (
          <div className="p-4 text-center text-red-600 bg-red-50 rounded-md mb-4">
            Erreur lors du chargement des utilisateurs: {error.message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Date d'inscription</th>
                <th className="p-2">Plan</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Expiration</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">Chargement...</td>
                </tr>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 flex items-center gap-2">
                      {user.is_superadmin && <Crown className="w-4 h-4 text-purple-600" />}
                      {user.role === 'admin' && !user.is_superadmin && <Shield className="w-4 h-4 text-blue-600" />}
                      {user.role === 'utilisateur' && <User className="w-4 h-4 text-gray-600" />}
                      {user.email}
                    </td>
                    <td className="p-2">
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="p-2 font-medium">
                      {user.is_superadmin ? 'Super Admin' : (user.role === 'admin' ? 'Admin' : 'Utilisateur')}
                    </td>
                    <td className="p-2">{getStatusBadge(user)}</td>
                    <td className="p-2">
                      {user.is_superadmin ? (
                        <span className="text-purple-600 font-medium">∞ Permanent</span>
                      ) : user.role === 'admin' ? (
                        <span className="text-blue-600 font-medium">∞ Permanent</span>
                      ) : (
                        <span className="text-gray-600">Standard</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {users && users.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Total: {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
