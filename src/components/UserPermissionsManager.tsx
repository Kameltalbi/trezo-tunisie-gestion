
import React from 'react';
import { usePermissions } from '@/hooks/useUserRoles';
import { useAllUserPermissions, useUpdateUserPermission } from '@/hooks/useUserPermissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';

interface UserPermissionsManagerProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

const UserPermissionsManager = ({ userId, userEmail, onClose }: UserPermissionsManagerProps) => {
  const { toast } = useToast();
  
  const { data: allPermissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: userPermissions = [], isLoading: loadingUserPermissions } = useAllUserPermissions(userId);
  const updatePermissionMutation = useUpdateUserPermission();

  // Obtenir les pages uniques
  const uniquePages = Array.from(new Set(allPermissions.map(permission => permission.page)));

  // Créer un map des permissions accordées pour recherche rapide
  const grantedPermissions = new Set(
    userPermissions
      .filter(up => up.granted)
      .map(up => up.permission_id)
  );

  const handlePagePermissionChange = async (page: string, granted: boolean) => {
    try {
      // Obtenir toutes les permissions pour cette page
      const pagePermissions = allPermissions.filter(p => p.page === page);
      
      // Mettre à jour toutes les permissions de la page
      for (const permission of pagePermissions) {
        await updatePermissionMutation.mutateAsync({
          userId,
          permissionId: permission.id,
          granted
        });
      }
      
      toast({
        description: granted ? `Accès accordé à ${getPageDisplayName(page)}` : `Accès révoqué à ${getPageDisplayName(page)}`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
      toast({
        description: "Erreur lors de la mise à jour des permissions",
        variant: "destructive"
      });
    }
  };

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

  const isPageGranted = (page: string) => {
    const pagePermissions = allPermissions.filter(p => p.page === page);
    return pagePermissions.some(p => grantedPermissions.has(p.id));
  };

  if (loadingPermissions || loadingUserPermissions) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Gestion des permissions</h3>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
        <div className="text-center py-8">Chargement des permissions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestion des permissions
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            Utilisateur: {userEmail}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accès aux pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uniquePages.map((page) => {
              const isGranted = isPageGranted(page);
              
              return (
                <div 
                  key={page}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isGranted}
                      onCheckedChange={(checked) => 
                        handlePagePermissionChange(page, checked as boolean)
                      }
                      disabled={updatePermissionMutation.isPending}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">{getPageDisplayName(page)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {uniquePages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune page trouvée dans le système.
        </div>
      )}
    </div>
  );
};

export default UserPermissionsManager;
