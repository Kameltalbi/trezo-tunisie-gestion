
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Edit, CheckCircle, XCircle, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAccounts, useUpdateAccount } from '@/hooks/useAccounts';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AccountsManagement = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { user } = useAuth();
  const { data: accounts, isLoading, error } = useAccounts();
  const updateAccountMutation = useUpdateAccount();

  console.log('AccountsManagement - Debug:', {
    userEmail: user?.email,
    accountsData: accounts,
    isLoading,
    error: error?.message
  });

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
      console.log('Activation du compte:', accountId);
      
      const today = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const validUntil = nextYear.toISOString().split('T')[0];

      await updateAccountMutation.mutateAsync({
        accountId,
        updates: {
          status: 'active',
          activation_date: today,
          valid_until: validUntil
        }
      });

      toast.success('Compte activé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      toast.error('Erreur lors de l\'activation du compte');
    }
  };

  const handleSuspendAccount = async (accountId: string) => {
    try {
      console.log('Suspension du compte:', accountId);
      
      await updateAccountMutation.mutateAsync({
        accountId,
        updates: {
          status: 'expired'
        }
      });

      toast.success('Compte suspendu avec succès');
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
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
    console.error('Erreur dans AccountsManagement:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gestion des Comptes Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-red-600">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Erreur lors du chargement des comptes</p>
              <p className="text-sm text-gray-500 mt-1">{error.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                Utilisateur: {user?.email || 'Non connecté'}
              </p>
            </div>
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
                            disabled={updateAccountMutation.isPending}
                          >
                            {updateAccountMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {account.status === 'active' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleSuspendAccount(account.id)}
                            disabled={updateAccountMutation.isPending}
                          >
                            {updateAccountMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
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
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Aucun compte trouvé</p>
            <p className="text-sm text-gray-400 mt-1">
              Les comptes clients apparaîtront ici une fois créés.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountsManagement;
