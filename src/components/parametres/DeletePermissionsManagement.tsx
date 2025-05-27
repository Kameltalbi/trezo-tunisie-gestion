
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDeletePermissions, useToggleDeletePermission } from "@/hooks/useDeletePermissions";
import SectionBox from "@/components/SectionBox";

const DeletePermissionsManagement = () => {
  const { toast } = useToast();
  const { data: deletePermissions = [], isLoading: loadingPermissions } = useDeletePermissions();
  const togglePermissionMutation = useToggleDeletePermission();

  const getPageDisplayName = (page: string) => {
    const pageNames: Record<string, string> = {
      'dashboard': 'Tableau de bord',
      'transactions': 'Transactions',
      'encaissements': 'Encaissements',
      'decaissements': 'Décaissements',
      'comptes': 'Comptes bancaires',
      'projets': 'Projets',
      'objectifs': 'Objectifs',
      'cash-flow': 'Flux de trésorerie',
      'debt-management': 'Gestion des dettes',
      'rapports': 'Rapports',
      'parametres': 'Paramètres',
      'admin': 'Administration',
      'support': 'Support'
    };
    return pageNames[page] || page;
  };

  const handlePermissionToggle = async (permissionId: string, granted: boolean) => {
    try {
      await togglePermissionMutation.mutateAsync({ permissionId, granted });
      toast({ 
        description: granted ? "Permission accordée" : "Permission révoquée" 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la permission:', error);
      toast({ 
        description: "Erreur lors de la mise à jour de la permission", 
        variant: "destructive" 
      });
    }
  };

  if (loadingPermissions) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <SectionBox title="Permissions de suppression par page">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Cochez les pages sur lesquelles vous souhaitez avoir le droit de supprimer des éléments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deletePermissions.map((permission) => (
            <div 
              key={permission.id}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={permission.hasPermission}
                onCheckedChange={(checked) => 
                  handlePermissionToggle(permission.id, checked as boolean)
                }
                disabled={togglePermissionMutation.isPending}
              />
              <span className="font-medium">
                {getPageDisplayName(permission.page)}
              </span>
            </div>
          ))}
        </div>

        {deletePermissions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune permission de suppression trouvée.
          </div>
        )}
      </div>
    </SectionBox>
  );
};

export default DeletePermissionsManagement;
