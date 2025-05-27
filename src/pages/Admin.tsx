import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Users, CreditCard, TrendingUp, Settings, CheckCircle, XCircle, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoleCheck } from '@/hooks/useUserRoleCheck';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  subscription_status?: string;
  plan_name?: string;
  trial_end_date?: string;
  subscription_end_date?: string;
  is_trial?: boolean;
  is_superadmin?: boolean;
}

interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  trial_users: number;
  revenue_this_month: number;
}

interface AdminPayment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  bank_details: any;
  notes: string | null;
  created_at: string;
  subscription_id: string | null;
  user_email?: string;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { data: roleCheck, isLoading: roleLoading } = useUserRoleCheck();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Vérification spéciale pour kamel.talbi@yahoo.fr
  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr' || roleCheck?.isSuperAdmin || false;

  console.log('Vérifications Admin:', {
    userEmail: user?.email,
    roleCheck,
    isSuperAdmin,
    roleLoading
  });

  // Move all hooks to the top before any conditional logic
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats', user?.id],
    queryFn: async (): Promise<AdminStats> => {
      // Statistiques des utilisateurs
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Abonnements actifs
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Utilisateurs en essai
      const { count: trialUsers } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_trial', true);

      // Revenus du mois
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', `${currentMonth}-01`)
        .lt('created_at', `${currentMonth}-31`);

      const revenueThisMonth = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        total_users: totalUsers || 0,
        active_subscriptions: activeSubscriptions || 0,
        trial_users: trialUsers || 0,
        revenue_this_month: revenueThisMonth,
      };
    },
    enabled: !!user && isSuperAdmin,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, user?.id],
    queryFn: async (): Promise<AdminUser[]> => {
      console.log('Récupération des utilisateurs admin...');
      
      try {
        // Récupérer tous les profils avec leurs abonnements
        let profileQuery = supabase
          .from('profiles')
          .select(`
            id,
            email,
            created_at
          `)
          .order('created_at', { ascending: false });

        if (searchTerm) {
          profileQuery = profileQuery.ilike('email', `%${searchTerm}%`);
        }

        const { data: profiles, error: profileError } = await profileQuery;
        if (profileError) {
          console.error('Erreur profils:', profileError);
          throw profileError;
        }

        console.log('Profils récupérés:', profiles?.length);

        if (!profiles || profiles.length === 0) {
          return [];
        }

        // Récupérer les abonnements pour ces utilisateurs
        const userIds = profiles.map(p => p.id);
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select(`
            user_id,
            status,
            is_trial,
            trial_end_date,
            end_date,
            plans (
              name
            )
          `)
          .in('user_id', userIds);

        if (subError) {
          console.warn('Erreur abonnements (non bloquante):', subError);
        }

        console.log('Abonnements récupérés:', subscriptions?.length || 0);

        // Mapper les données
        const result = profiles.map((profile: any) => {
          const subscription = subscriptions?.find((sub: any) => sub.user_id === profile.id);
          const isSuperAdmin = profile.email === 'kamel.talbi@yahoo.fr';
          
          return {
            id: profile.id,
            email: profile.email,
            created_at: profile.created_at,
            subscription_status: isSuperAdmin ? 'superadmin' : subscription?.status,
            plan_name: isSuperAdmin ? 'Super Admin' : subscription?.plans?.name,
            trial_end_date: subscription?.trial_end_date,
            is_trial: subscription?.is_trial,
            subscription_end_date: subscription?.end_date,
            is_superadmin: isSuperAdmin,
          };
        });

        console.log('Utilisateurs finaux:', result.length);
        return result;

      } catch (error) {
        console.error('Erreur dans la récupération des utilisateurs:', error);
        throw error;
      }
    },
    enabled: !!user && isSuperAdmin,
    retry: 1,
  });

  // Nouvelle requête pour les paiements
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payments', user?.id],
    queryFn: async (): Promise<AdminPayment[]> => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((payment: any) => ({
        ...payment,
        user_email: payment.profiles?.email
      }));
    },
    enabled: !!user && isSuperAdmin,
  });

  // Mutation pour valider un paiement
  const validatePaymentMutation = useMutation({
    mutationFn: async ({ paymentId, subscriptionId }: { paymentId: string; subscriptionId?: string }) => {
      // Mettre à jour le statut du paiement
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Si il y a un abonnement associé, l'activer
      if (subscriptionId) {
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', subscriptionId);

        if (subscriptionError) throw subscriptionError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ description: "Paiement validé avec succès" });
    },
    onError: (error) => {
      console.error('Erreur lors de la validation:', error);
      toast({ 
        description: "Erreur lors de la validation du paiement", 
        variant: "destructive" 
      });
    },
  });

  // Mutation pour rejeter un paiement
  const rejectPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      toast({ description: "Paiement rejeté" });
    },
    onError: (error) => {
      console.error('Erreur lors du rejet:', error);
      toast({ 
        description: "Erreur lors du rejet du paiement", 
        variant: "destructive" 
      });
    },
  });

  // Now handle the permission check after all hooks are called
  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chargement...</h2>
          <p className="text-gray-600">
            Vérification des permissions en cours...
          </p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">
            Cette page est réservée aux super-administrateurs uniquement.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Utilisateur connecté: {user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Rôle détecté: {roleCheck?.role || 'non défini'}
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (user: AdminUser) => {
    if (user.is_superadmin) {
      return <Badge variant="default" className="bg-purple-600 hover:bg-purple-700">
        <Crown className="w-3 h-3 mr-1" />
        Super Admin
      </Badge>;
    }
    if (user.is_trial) {
      return <Badge variant="secondary">Essai gratuit</Badge>;
    }
    if (user.subscription_status === 'active') {
      return <Badge variant="default">Actif</Badge>;
    }
    if (user.subscription_status === 'cancelled') {
      return <Badge variant="destructive">Annulé</Badge>;
    }
    return <Badge variant="outline">Aucun abonnement</Badge>;
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration (Super Admin)</h1>
          <p className="text-sm text-gray-600">
            Connecté en tant que: {user?.email} - Rôle: {roleCheck?.role || 'superadmin'}
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.total_users || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements actifs</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.active_subscriptions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs en essai</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.trial_users || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : `${stats?.revenue_this_month || 0} DT`}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Vue d'ensemble de tous les utilisateurs et leurs abonnements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="p-2">Email</th>
                      <th className="p-2">Date d'inscription</th>
                      <th className="p-2">Plan</th>
                      <th className="p-2">Statut</th>
                      <th className="p-2">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">Chargement...</td>
                      </tr>
                    ) : users && users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="p-2 flex items-center gap-2">
                            {user.is_superadmin && <Crown className="w-4 h-4 text-purple-600" />}
                            {user.email}
                          </td>
                          <td className="p-2">
                            {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </td>
                          <td className="p-2 font-medium">
                            {user.is_superadmin ? 'Super Admin' : (user.plan_name || 'Aucun plan')}
                          </td>
                          <td className="p-2">{getStatusBadge(user)}</td>
                          <td className="p-2">
                            {user.is_superadmin ? (
                              <span className="text-purple-600 font-medium">∞ Permanent</span>
                            ) : user.is_trial && user.trial_end_date ? (
                              format(new Date(user.trial_end_date), 'dd/MM/yyyy', { locale: fr })
                            ) : user.subscription_end_date ? (
                              format(new Date(user.subscription_end_date), 'dd/MM/yyyy', { locale: fr })
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Gestion des abonnements - Les données réelles seront affichées ici
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
