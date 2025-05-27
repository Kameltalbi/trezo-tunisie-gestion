import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Fonction pour appeler l'API intermédiaire sécurisée
const fetchAdminUsers = async () => {
  const res = await fetch('/api/admin-users');
  if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return res.json();
};

interface AdminUsersTableProps {
  searchTerm: string;
  onSearchChange?: (value: string) => void;
  isSuperAdmin: boolean;
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ searchTerm, isSuperAdmin }) => {
  const { data: users = [], isLoading, isError } = useQuery(['admin-users'], fetchAdminUsers);

  if (isLoading) {
    return <div className="text-center py-6">Chargement des utilisateurs...</div>;
  }

  if (isError) {
    return <div className="text-center py-6 text-red-600">Erreur lors du chargement des utilisateurs.</div>;
  }

  const filteredUsers = users.filter((user: any) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500">Aucun utilisateur trouvé.</div>
      ) : (
        filteredUsers.map((user: any) => (
          <div key={user.id} className="border p-4 rounded shadow-sm bg-white">
            <p className="font-semibold">{user.email}</p>
            <p className="text-sm text-gray-500">Créé le : {new Date(user.created_at).toLocaleDateString()}</p>
            {isSuperAdmin && (
              <p className="text-sm text-green-700 font-medium">(Super Admin Visible)</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};
