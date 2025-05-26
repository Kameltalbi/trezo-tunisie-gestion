
import React, { useState } from 'react';
import { usePermissions } from '@/hooks/useUserRoles';
import { useAllUserPermissions, useUpdateUserPermission } from '@/hooks/useUserPermissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronRight, Shield, User } from 'lucide-react';

interface UserPermissionsManagerProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

const UserPermissionsManager = ({ userId, userEmail, onClose }: UserPermissionsManagerProps) => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['dashboard', 'transactions'])); // Expand some by default
  const { toast } = useToast();
  
  const { data: allPermissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: userPermissions = [], isLoading: loadingUserPermissions } = useAllUserPermissions(userId);
  const updatePermissionMutation = useUpdateUserPermission();

  // Grouper les permissions par page
  const permissionsByPage = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.page]) {
      acc[permission.page] = [];
    }
    acc[permission.page].push(permission);
    return acc;
  }, {} as Record<string, typeof allPermissions>);

  // Créer un map des permissions accordées pour recherche rapide
  const grantedPermissions = new Set(
    userPermissions
      .filter(up => up.granted)
      .map(up => up.permission_id)
  );

  const handlePermissionChange = async (permissionId: string, granted: boolean) => {
    try {
      await updatePermissionMutation.mutateAsync({
        userId,
        permissionId,
        granted
      });
      
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

  const togglePageExpansion = (page: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(page)) {
      newExpanded.delete(page);
    } else {
      newExpanded.add(page);
    }
    setExpandedPages(newExpanded);
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view': return 'bg-blue-100 text-blue-800';
      case 'create': return 'bg-green-100 text-green-800';
      case 'edit': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'export': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Instructions:</strong> Cochez les cases pour accorder des permissions à l'utilisateur. 
          Les permissions sont organisées par page de l'application.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(permissionsByPage).map(([page, permissions]) => {
          const isExpanded = expandedPages.has(page);
          const pagePermissionCount = permissions.length;
          const grantedCount = permissions.filter(p => grantedPermissions.has(p.id)).length;
          
          return (
            <Card key={page} className="border-2">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => togglePageExpansion(page)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span>{getPageDisplayName(page)}</span>
                    <Badge variant="outline" className="ml-2">
                      {grantedCount}/{pagePermissionCount} permissions
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              
              {isExpanded && (
                <CardContent>
                  <div className="space-y-3">
                    {permissions.map((permission) => {
                      const isGranted = grantedPermissions.has(permission.id);
                      
                      return (
                        <div 
                          key={permission.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isGranted}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                              disabled={updatePermissionMutation.isPending}
                              className="w-5 h-5"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{permission.nom}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={getActionColor(permission.action)}
                                >
                                  {permission.action}
                                </Badge>
                              </div>
                              {permission.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {Object.keys(permissionsByPage).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune permission trouvée dans le système.
        </div>
      )}
    </div>
  );
};

export default UserPermissionsManager;
