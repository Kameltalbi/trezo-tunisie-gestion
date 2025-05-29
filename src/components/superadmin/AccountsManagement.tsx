
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Edit, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { toast } from 'sonner';

const AccountsManagement = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { data: accounts, isLoading, error } = useAccounts();

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { variant: 'default', text: 'Actif', className: 'bg-green-100 text-green-800' },
      'trial': { variant: 'secondary', text: 'Essai', className: 'bg-blue-100 text-blue-800' },
      'expired': { variant: 'destructive', text: 'Expiré', className: 'bg-red-100 text-red-800' },
      'pending_activation': { variant: 'outline', text: 'En attente', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = variants[status] || variants['trial'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const handleActivateAccount = async (accountId: string) => {
    try {
      console.log('Activer le compte:', accountId);
      toast.success('Compte activé avec succès');
      // TODO: Implémenter la logique d'activation
    } catch (error) {
      toast.error('Erreur lors de l\'activation du compte');
    }
  };

  const handleSuspendAccount = async (accountId: string) => {
    try {
      console.log('Suspendre le compte:', accountId);
      toast.success('Compte suspendu avec succès');
      // TODO: Implémenter la logique de suspension
    } catch (error) {
      toast.error('Erreur lors de la suspension du compte');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestion des Comptes Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestion des Comptes Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            Erreur lors du chargement des comptes
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Gestion des Comptes Clients
        </CardTitle>
        <CardDescription>
          Vue d'ensemble et gestion de tous les comptes clients de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        {accounts && accounts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account: any) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell>{account.plan_id}</TableCell>
                    <TableCell>{account.created_at ? new Date(account.created_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{account.valid_until ? new Date(account.valid_until).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {account.status === 'pending_activation' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleActivateAccount(account.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {account.status === 'active' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleSuspendAccount(account.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun compte trouvé
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsManagement;
