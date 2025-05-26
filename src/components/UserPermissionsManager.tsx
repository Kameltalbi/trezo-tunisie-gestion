
import React, { useState } from 'react';
import { usePermissions } from '@/hooks/useUserRoles';
import { useAllUserPermissions, useUpdateUserPermission } from '@/hooks/useUserPermissions';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface UserPermissionsManagerProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
}

const UserPermissionsManager = ({ userId, userEmail, onClose }: UserPermissionsManagerProps) => {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  const { data: allPermissions = [] } = usePermissions();
  const { data: userPermissions = [] } = useAllUserPermissions(userId);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Gestion des permissions</h3>
          <p className="text-sm text-gray-600">Utilisateur: {userEmail}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(permissionsByPage).map(([page, permissions]) => {
          const isExpanded = expandedPages.has(page);
          const pagePermissionCount = permissions.length;
          const grantedCount = permissions.filter(p => grantedPermissions.has(p.id)).length;
          
          return (
            <Card key={page}>
              <CardHeader 
                className="cursor-pointer"
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
                    <Badge variant="outline">
                      {grantedCount}/{pagePermissionCount}
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
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isGranted}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                              disabled={updatePermissionMutation.isPending}
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
                                <p className="text-sm text-gray-600">
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
    </div>
  );
};

export default UserPermissionsManager;
