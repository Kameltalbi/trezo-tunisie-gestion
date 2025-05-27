
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown } from 'lucide-react';
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
  const { data: users, isLoading: usersLoading } = useAdminUsers(searchTerm, isSuperAdmin);

  const getStatusBadge = (user: AdminUser) => {
    if (user.is_superadmin) {
      return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
        <Crown className="w-3 h-3 mr-1" />
        Super Admin
      </Badge>;
    }
    if (user.is_trial) {
      return <Badge variant="secondary">Essai gratuit</Badge>;
    }
    if (user.subscription_status === 'active') {
      return <Badge variant="default">Actif</Badge>;
    }
    if (user.subscription_status === 'cancelled') {
      return <Badge variant="destructive">Annulé</Badge>;
    }
    return <Badge variant="outline">Aucun abonnement</Badge>;
  };

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
                      {user.email}
                    </td>
                    <td className="p-2">
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="p-2 font-medium">
                      {user.is_superadmin ? 'Super Admin' : (user.plan_name || 'Aucun plan')}
                    </td>
                    <td className="p-2">{getStatusBadge(user)}</td>
                    <td className="p-2">
                      {user.is_superadmin ? (
                        <span className="text-purple-600 font-medium">∞ Permanent</span>
                      ) : user.is_trial && user.trial_end_date ? (
                        format(new Date(user.trial_end_date), 'dd/MM/yyyy', { locale: fr })
                      ) : user.subscription_end_date ? (
                        format(new Date(user.subscription_end_date), 'dd/MM/yyyy', { locale: fr })
                      ) : (
                        '-'
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
      </CardContent>
    </Card>
  );
};
