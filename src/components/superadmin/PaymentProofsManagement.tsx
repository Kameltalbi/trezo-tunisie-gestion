
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Eye, CheckCircle, XCircle, Filter } from 'lucide-react';
import { useNewPaymentProofs } from '@/hooks/useNewPaymentProofs';

const PaymentProofsManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: paymentProofs, isLoading } = useNewPaymentProofs();

  // Mock data - à remplacer par de vraies données
  const proofs = [
    {
      id: '1',
      clientName: 'Entreprise ABC',
      plan: 'Pro',
      amount: 2400,
      submittedAt: '2024-01-20',
      status: 'pending',
      fileUrl: '/uploads/proof1.pdf',
      notes: 'Virement bancaire effectué le 20/01/2024'
    },
    {
      id: '2',
      clientName: 'Startup XYZ',
      plan: 'Entreprise',
      amount: 4800,
      submittedAt: '2024-01-18',
      status: 'accepted',
      fileUrl: '/uploads/proof2.pdf',
      notes: 'Chèque reçu et validé'
    },
    {
      id: '3',
      clientName: 'Société DEF',
      plan: 'Pro',
      amount: 2400,
      submittedAt: '2024-01-15',
      status: 'rejected',
      fileUrl: '/uploads/proof3.pdf',
      notes: 'Montant incorrect, demande de rectification'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': { text: 'En attente', className: 'bg-orange-100 text-orange-800' },
      'accepted': { text: 'Accepté', className: 'bg-green-100 text-green-800' },
      'rejected': { text: 'Rejeté', className: 'bg-red-100 text-red-800' }
    };
    
    const config = variants[status] || variants['pending'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const handleApproveProof = (proofId: string) => {
    console.log('Approuver la preuve:', proofId);
    // Logique d'approbation
  };

  const handleRejectProof = (proofId: string) => {
    console.log('Rejeter la preuve:', proofId);
    // Logique de rejet
  };

  const filteredProofs = statusFilter === 'all' 
    ? proofs 
    : proofs.filter(proof => proof.status === statusFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gestion des Preuves de Paiement
        </CardTitle>
        <CardDescription>
          Validation et gestion des preuves de paiement envoyées par les clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Acceptés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Fichier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProofs.map((proof) => (
                <TableRow key={proof.id}>
                  <TableCell className="font-medium">{proof.clientName}</TableCell>
                  <TableCell>{proof.plan}</TableCell>
                  <TableCell>{proof.amount} DT</TableCell>
                  <TableCell>{proof.submittedAt}</TableCell>
                  <TableCell>{getStatusBadge(proof.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {proof.status === 'pending' && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApproveProof(proof.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRejectProof(proof.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProofs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune preuve de paiement trouvée pour ce filtre
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentProofsManagement;
