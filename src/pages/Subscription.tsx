
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { usePayments } from "@/hooks/usePayments";
import { Link } from "react-router-dom";
import { Calendar, CreditCard, FileText, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Subscription = () => {
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const activeSubscription = subscriptions?.find(sub => sub.status === 'active');

  if (subscriptionsLoading || paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Abonnement</h1>
        {!activeSubscription && (
          <Link to="/checkout">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Souscrire à un plan
            </Button>
          </Link>
        )}
      </div>

      {/* Active Subscription */}
      {activeSubscription ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Abonnement actuel
              </CardTitle>
              <Badge variant="default">Actif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-semibold">{activeSubscription.plan.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prix</p>
                <p className="font-semibold">{activeSubscription.plan.price} {activeSubscription.plan.currency}/an</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expire le</p>
                <p className="font-semibold">
                  {format(new Date(activeSubscription.end_date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun abonnement actif</h3>
            <p className="text-gray-600 mb-4">
              Souscrivez à un plan pour accéder à toutes les fonctionnalités de Trézo
            </p>
            <Link to="/checkout">
              <Button>Voir les plans</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* All Subscriptions */}
      {subscriptions && subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historique des abonnements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscription.plan.name}</p>
                    <p className="text-sm text-gray-600">
                      Du {format(new Date(subscription.start_date), 'dd/MM/yyyy', { locale: fr })} 
                      au {format(new Date(subscription.end_date), 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    >
                      {subscription.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {subscription.plan.price} {subscription.plan.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      {payments && payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Historique des paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.amount} {payment.currency}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(payment.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.payment_method === 'bank_transfer' ? 'Virement bancaire' :
                       payment.payment_method === 'card' ? 'Carte bancaire' : 'Espèces'}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      payment.status === 'completed' ? 'default' :
                      payment.status === 'pending' ? 'secondary' :
                      payment.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {payment.status === 'completed' ? 'Payé' :
                     payment.status === 'pending' ? 'En attente' :
                     payment.status === 'failed' ? 'Échoué' : 'Annulé'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscription;
