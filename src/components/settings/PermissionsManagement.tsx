
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Shield, 
  User, 
  BarChart3, 
  DollarSign, 
  Building2, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Target,
  FileText,
  Settings,
  Trash2,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useUserPermissions, useUserGlobalPermissions, useUpdateUserPermissions } from '@/hooks/usePermissions';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface PermissionsManagementProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSection?: boolean;
}

const availableRoutes = [
  {
    id: 'dashboard',
    route: '/dashboard',
    label: 'Dashboard principal',
    icon: BarChart3,
    description: 'Accès au tableau de bord et aux métriques'
  },
  {
    id: 'cash_flow',
    route: '/cash-flow',
    label: 'Flux de trésorerie',
    icon: DollarSign,
    description: 'Consultation et gestion des flux de trésorerie'
  },
  {
    id: 'accounts',
    route: '/comptes',
    label: 'Comptes bancaires',
    icon: Building2,
    description: 'Gestion des comptes bancaires'
  },
  {
    id: 'transactions',
    route: '/transactions',
    label: 'Transactions',
    icon: CreditCard,
    description: 'Historique et gestion des transactions'
  },
  {
    id: 'encaissements',
    route: '/encaissements',
    label: 'Recettes prévues',
    icon: TrendingUp,
    description: 'Gestion des encaissements prévisionnels'
  },
  {
    id: 'depenses',
    route: '/depenses',
    label: 'Dépenses prévues',
    icon: TrendingDown,
    description: 'Gestion des décaissements prévisionnels'
  },
  {
    id: 'debt_management',
    route: '/debt-management',
    label: 'Gestion des dettes',
    icon: Briefcase,
    description: 'Suivi des créances et dettes'
  },
  {
    id: 'projects',
    route: '/projets',
    label: 'Projets',
    icon: Briefcase,
    description: 'Gestion des projets et budgets'
  },
  {
    id: 'objectives',
    route: '/objectifs',
    label: 'Objectifs',
    icon: Target,
    description: 'Définition et suivi des objectifs'
  },
  {
    id: 'reports',
    route: '/rapports',
    label: 'Rapports',
    icon: FileText,
    description: 'Génération et consultation des rapports'
  },
  {
    id: 'settings',
    route: '/settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Accès aux paramètres du compte'
  }
];

const PermissionsManagement = ({ user, open, onOpenChange, isSection = false }: PermissionsManagementProps) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [canDelete, setCanDelete] = useState(false);

  const { data: userPermissions } = useUserPermissions(user.id);
  const { data: globalPermissions } = useUserGlobalPermissions(user.id);
  const updatePermissionsMutation = useUpdateUserPermissions();

  useEffect(() => {
    if (userPermissions) {
      const permMap = {};
      availableRoutes.forEach(route => {
        const userPerm = userPermissions.find(p => p.route === route.route);
        permMap[route.id] = userPerm?.can_access ?? true;
      });
      setPermissions(permMap);
    }
  }, [userPermissions]);

  useEffect(() => {
    if (globalPermissions) {
      setCanDelete(globalPermissions.can_delete);
    }
  }, [globalPermissions]);

  const togglePermission = (routeId: string) => {
    setPermissions(prev => ({
      ...prev,
      [routeId]: !prev[routeId]
    }));
  };

  const handleSavePermissions = async () => {
    const permissionsArray = availableRoutes.map(route => ({
      route: route.route,
      can_access: permissions[route.id] ?? true
    }));

    await updatePermissionsMutation.mutateAsync({
      userId: user.id,
      permissions: permissionsArray,
      globalPermissions: { can_delete: canDelete }
    });

    onOpenChange(false);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'superadmin': { className: 'bg-purple-100 text-purple-800', text: 'Superadmin' },
      'admin': { className: 'bg-blue-100 text-blue-800', text: 'Admin' },
      'financier': { className: 'bg-green-100 text-green-800', text: 'Financier' },
      'editeur': { className: 'bg-orange-100 text-orange-800', text: 'Éditeur' },
      'collaborateur': { className: 'bg-gray-100 text-gray-800', text: 'Collaborateur' }
    };
    
    const config = variants[role] || variants['collaborateur'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
  };

  const content = (
    <div className="space-y-6">
      {/* Informations utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations de l'utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-lg">{user.full_name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex gap-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.is_active)}
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Définissez précisément ce que <strong>{user.full_name}</strong> est autorisé à consulter ou modifier.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accès aux sections */}
      <Card>
        <CardHeader>
          <CardTitle>Accès aux sections</CardTitle>
          <CardDescription>
            Contrôlez l'accès aux différentes pages et fonctionnalités de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRoutes.map((route) => {
              const IconComponent = route.icon;
              return (
                <div
                  key={route.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{route.label}</p>
                      <p className="text-sm text-gray-500">{route.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={permissions[route.id] ?? true}
                    onCheckedChange={() => togglePermission(route.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Permission spéciale */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Trash2 className="h-5 w-5" />
            Permission spéciale
          </CardTitle>
          <CardDescription>
            Contrôle global des actions de suppression dans toute l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Peut supprimer des éléments</p>
                <p className="text-sm text-orange-700">
                  Autorise la suppression dans toutes les sections : transactions, projets, comptes, objectifs...
                </p>
              </div>
            </div>
            <Switch
              checked={canDelete}
              onCheckedChange={setCanDelete}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={handleSavePermissions}
          disabled={updatePermissionsMutation.isPending}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {updatePermissionsMutation.isPending ? 'Enregistrement...' : 'Enregistrer les permissions'}
        </Button>
      </div>
    </div>
  );

  if (isSection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gérer les permissions - {user.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gérer les permissions
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsManagement;
