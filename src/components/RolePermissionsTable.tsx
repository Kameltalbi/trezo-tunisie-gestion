
import React from 'react';
import { useRolePermissions, useAllPermissions, useUpdateRolePermission } from '@/hooks/useRolePermissions';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const RolePermissionsTable = () => {
  const { toast } = useToast();
  const { data: allPermissions = [], isLoading: loadingPermissions } = useAllPermissions();
  const { data: rolePermissions = [], isLoading: loadingRolePermissions } = useRolePermissions();
  const updateRolePermissionMutation = useUpdateRolePermission();

  const roles = ['superadmin', 'admin', 'editeur', 'collaborateur'];
  const actions = ['access', 'add', 'edit', 'delete', 'export'];

  const getPageDisplayName = (page: string) => {
    const pageNames: Record<string, string> = {
      'dashboard': 'Tableau de bord',
      'accounts': 'Comptes bancaires',
      'cashflow': 'Flux de trésorerie',
      'income-outgoings': 'Encaissements/Décaissements',
      'transactions': 'Transactions',
      'debtmanagement': 'Gestion des dettes',
      'projects': 'Projets',
      'objectives': 'Objectifs',
      'reports-exports': 'Rapports et exports',
      'settings': 'Paramètres',
      'administration': 'Administration',
      'support': 'Support'
    };
    return pageNames[page] || page;
  };

  const getActionDisplayName = (action: string) => {
    const actionNames: Record<string, string> = {
      'access': 'Accès',
      'add': 'Ajouter',
      'edit': 'Modifier',
      'delete': 'Supprimer',
      'export': 'Export'
    };
    return actionNames[action] || action;
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'superadmin': 'Super Admin',
      'admin': 'Admin',
      'editeur': 'Éditeur',
      'collaborateur': 'Collaborateur'
    };
    return roleNames[role] || role;
  };

  // Organiser les permissions par page
  const permissionsByPage = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.page]) {
      acc[permission.page] = [];
    }
    acc[permission.page].push(permission);
    return acc;
  }, {} as Record<string, any[]>);

  // Créer un map des permissions accordées pour recherche rapide
  const grantedPermissions = new Set(
    rolePermissions
      .filter(rp => rp.granted)
      .map(rp => `${rp.role}-${rp.permission_id}`)
  );

  const isPermissionGranted = (role: string, permissionId: string) => {
    return grantedPermissions.has(`${role}-${permissionId}`);
  };

  const handlePermissionChange = async (role: string, permissionId: string, granted: boolean) => {
    try {
      await updateRolePermissionMutation.mutateAsync({ role, permissionId, granted });
      toast({
        description: granted ? `Permission accordée à ${getRoleDisplayName(role)}` : `Permission révoquée à ${getRoleDisplayName(role)}`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la permission:', error);
      toast({
        description: "Erreur lors de la mise à jour de la permission",
        variant: "destructive"
      });
    }
  };

  if (loadingPermissions || loadingRolePermissions) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Chargement des permissions...</div>
      </div>
    );
  }

  const pages = Object.keys(permissionsByPage).sort();

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Gérez les permissions pour chaque rôle en cochant ou décochant les cases correspondantes.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">
                Page
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">
                Action
              </th>
              {roles.map(role => (
                <th key={role} className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">
                  {getRoleDisplayName(role)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => 
              permissionsByPage[page]
                .sort((a, b) => actions.indexOf(a.action) - actions.indexOf(b.action))
                .map((permission, index) => (
                  <tr key={permission.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {getPageDisplayName(permission.page)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm">
                      {getActionDisplayName(permission.action)}
                    </td>
                    {roles.map(role => (
                      <td key={role} className="border border-gray-300 px-4 py-3 text-center">
                        <Checkbox
                          checked={isPermissionGranted(role, permission.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, permission.id, checked as boolean)
                          }
                          disabled={updateRolePermissionMutation.isPending}
                        />
                      </td>
                    ))}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {pages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune permission trouvée dans le système.
        </div>
      )}
    </div>
  );
};

export default RolePermissionsTable;
