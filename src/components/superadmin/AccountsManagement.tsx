
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Edit, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAccount } from '@/hooks/useAccount';

const AccountsManagement = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const { data: accountData } = useAccount();

  // Mock data - à remplacer par de vraies données
  const accounts = [
    {
      id: '1',
      name: 'Entreprise ABC',
      status: 'active',
      plan: 'Pro',
      startDate: '2024-01-15',
      expiryDate: '2025-01-15',
      usersCount: 5,
      maxUsers: 10
    },
    {
      id: '2',
      name: 'Startup XYZ',
      status: 'trial',
      plan: 'Trial',
      startDate: '2024-01-20',
      expiryDate: '2024-02-03',
      usersCount: 2,
      maxUsers: 3
    },
    {
      id: '3',
      name: 'Société DEF',
      status: 'pending_activation',
      plan: 'Entreprise',
      startDate: null,
      expiryDate: null,
      usersCount: 1,
      maxUsers: 50
    }
  ];

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

  const handleActivateAccount = (accountId: string) => {
    console.log('Activer le compte:', accountId);
    // Logique d'activation
  };

  const handleSuspendAccount = (accountId: string) => {
    console.log('Suspendre le compte:', accountId);
    // Logique de suspension
  };

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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>{account.plan}</TableCell>
                  <TableCell>{account.startDate || '-'}</TableCell>
                  <TableCell>{account.expiryDate || '-'}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {account.usersCount}/{account.maxUsers}
                    </span>
                  </TableCell>
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
      </CardContent>
    </Card>
  );
};

export default AccountsManagement;
