
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAdminPayments, useValidatePayment, useRejectPayment } from '@/hooks/useAdminPayments';

interface AdminPaymentsTableProps {
  isSuperAdmin: boolean;
}

export const AdminPaymentsTable: React.FC<AdminPaymentsTableProps> = ({ isSuperAdmin }) => {
  const { data: payments, isLoading: paymentsLoading } = useAdminPayments(isSuperAdmin);
  const validatePaymentMutation = useValidatePayment();
  const rejectPaymentMutation = useRejectPayment();

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Validé</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Virement bancaire';
      case 'card':
        return 'Carte bancaire';
      case 'cash':
        return 'Espèces';
      default:
        return method;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des paiements</CardTitle>
        <CardDescription>
          Validation des paiements en attente et historique des transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Montant</th>
                <th className="p-2">Méthode</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Date</th>
                <th className="p-2">Notes</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentsLoading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">Chargement...</td>
                </tr>
              ) : payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t">
                    <td className="p-2">{payment.user_email || '-'}</td>
                    <td className="p-2 font-medium">
                      {payment.amount} {payment.currency}
                    </td>
                    <td className="p-2">{getPaymentMethodLabel(payment.payment_method)}</td>
                    <td className="p-2">{getPaymentStatusBadge(payment.status)}</td>
                    <td className="p-2">
                      {format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="p-2 max-w-xs truncate">
                      {payment.notes || '-'}
                    </td>
                    <td className="p-2">
                      {payment.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => validatePaymentMutation.mutate({
                              paymentId: payment.id,
                              subscriptionId: payment.subscription_id || undefined
                            })}
                            disabled={validatePaymentMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectPaymentMutation.mutate(payment.id)}
                            disabled={rejectPaymentMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Section pour les paiements en attente */}
        {payments && payments.filter(p => p.status === 'pending').length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">
              {payments.filter(p => p.status === 'pending').length} paiement(s) en attente de validation
            </h4>
            <p className="text-sm text-yellow-700">
              Vérifiez votre compte bancaire et validez les paiements reçus pour activer les abonnements.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
