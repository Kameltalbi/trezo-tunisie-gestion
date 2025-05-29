
import React, { useState } from 'react';
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
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  enabled: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
}

interface PermissionsManagementProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PermissionsManagement = ({ user, open, onOpenChange }: PermissionsManagementProps) => {
  const { toast } = useToast();

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'dashboard',
      label: 'Dashboard principal',
      icon: BarChart3,
      description: 'Accès au tableau de bord et aux métriques',
      enabled: true
    },
    {
      id: 'cash_flow',
      label: 'Flux de trésorerie',
      icon: DollarSign,
      description: 'Consultation et gestion des flux de trésorerie',
      enabled: true
    },
    {
      id: 'accounts',
      label: 'Comptes bancaires',
      icon: Building2,
      description: 'Gestion des comptes bancaires',
      enabled: true
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: CreditCard,
      description: 'Historique et gestion des transactions',
      enabled: true
    },
    {
      id: 'encaissements',
      label: 'Recettes prévues',
      icon: TrendingUp,
      description: 'Gestion des encaissements prévisionnels',
      enabled: true
    },
    {
      id: 'decaissements',
      label: 'Dépenses prévues',
      icon: TrendingDown,
      description: 'Gestion des décaissements prévisionnels',
      enabled: true
    },
    {
      id: 'debt_management',
      label: 'Gestion des dettes',
      icon: Briefcase,
      description: 'Suivi des créances et dettes',
      enabled: false
    },
    {
      id: 'projects',
      label: 'Projets',
      icon: Briefcase,
      description: 'Gestion des projets et budgets',
      enabled: true
    },
    {
      id: 'objectives',
      label: 'Objectifs',
      icon: Target,
      description: 'Définition et suivi des objectifs',
      enabled: true
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: FileText,
      description: 'Génération et consultation des rapports',
      enabled: false
    },
    {
      id: 'subscription',
      label: 'Abonnement',
      icon: CreditCard,
      description: 'Gestion de l\'abonnement',
      enabled: false
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Accès aux paramètres du compte',
      enabled: false
    }
  ]);

  const [canDelete, setCanDelete] = useState(false);

  const togglePermission = (permissionId: string) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === permissionId 
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  const handleSavePermissions = () => {
    console.log('Saving permissions for user:', user.id, {
      permissions: permissions.filter(p => p.enabled).map(p => p.id),
      canDelete
    });

    toast({
      title: "Permissions mises à jour",
      description: `Les permissions de ${user.name} ont été sauvegardées avec succès.`,
    });

    onOpenChange(false);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': { className: 'bg-blue-100 text-blue-800', text: 'Admin' },
      'financier': { className: 'bg-green-100 text-green-800', text: 'Financier' },
      'editeur': { className: 'bg-orange-100 text-orange-800', text: 'Éditeur' },
      'collaborateur': { className: 'bg-gray-100 text-gray-800', text: 'Collaborateur' }
    };
    
    const config = variants[role] || variants['collaborateur'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gérer les permissions
          </DialogTitle>
        </DialogHeader>

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
                  <p className="font-medium text-lg">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  Définissez précisément ce que <strong>{user.name}</strong> est autorisé à consulter ou modifier.
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
                {permissions.map((permission) => {
                  const IconComponent = permission.icon;
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{permission.label}</p>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={permission.enabled}
                        onCheckedChange={() => togglePermission(permission.id)}
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
              Annuler
            </Button>
            <Button
              onClick={handleSavePermissions}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Enregistrer les permissions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsManagement;
