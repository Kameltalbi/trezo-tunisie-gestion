
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Eye, CheckCircle, XCircle, Filter, Loader2 } from 'lucide-react';
import { useNewPaymentProofs } from '@/hooks/useNewPaymentProofs';
import { toast } from 'sonner';

const PaymentProofsManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: paymentProofs, isLoading, error } = useNewPaymentProofs();

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': { text: 'En attente', className: 'bg-orange-100 text-orange-800' },
      'accepted': { text: 'Accepté', className: 'bg-green-100 text-green-800' },
      'rejected': { text: 'Rejeté', className: 'bg-red-100 text-red-800' }
    };
    
    const config = variants[status] || variants['pending'];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const handleApproveProof = async (proofId: string) => {
    try {
      console.log('Approuver la preuve:', proofId);
      toast.success('Preuve de paiement approuvée');
      // TODO: Implémenter la logique d'approbation
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleRejectProof = async (proofId: string) => {
    try {
      console.log('Rejeter la preuve:', proofId);
      toast.success('Preuve de paiement rejetée');
      // TODO: Implémenter la logique de rejet
    } catch (error) {
      toast.error('Erreur lors du rejet');
    }
  };

  const filteredProofs = statusFilter === 'all' 
    ? paymentProofs 
    : paymentProofs?.filter(proof => proof.status === statusFilter);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestion des Preuves de Paiement
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
            <FileText className="h-5 w-5" />
            Gestion des Preuves de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            Erreur lors du chargement des preuves de paiement
          </div>
        </CardContent>
      </Card>
    );
  }

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

        {filteredProofs && filteredProofs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Fichier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProofs.map((proof: any) => (
                  <TableRow key={proof.id}>
                    <TableCell>{proof.plan}</TableCell>
                    <TableCell>{proof.amount} {proof.currency}</TableCell>
                    <TableCell>{new Date(proof.submitted_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(proof.status)}</TableCell>
                    <TableCell>
                      {proof.file_url && (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      )}
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
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune preuve de paiement trouvée pour ce filtre
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentProofsManagement;
