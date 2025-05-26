
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Users, CreditCard, TrendingUp, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  subscription_status?: string;
  plan_name?: string;
  trial_end_date?: string;
  subscription_end_date?: string;
  is_trial?: boolean;
}

interface AdminStats {
  total_users: number;
  active_subscriptions: number;
  trial_users: number;
  revenue_this_month: number;
}

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer les statistiques administrateur
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
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

      // Revenus du mois (approximation)
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
  });

  // Récupérer la liste des utilisateurs
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async (): Promise<AdminUser[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          created_at,
          subscriptions (
            status,
            is_trial,
            trial_end_date,
            end_date,
            plans (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        subscription_status: user.subscriptions?.[0]?.status,
        plan_name: user.subscriptions?.[0]?.plans?.name,
        trial_end_date: user.subscriptions?.[0]?.trial_end_date,
        subscription_end_date: user.subscriptions?.[0]?.end_date,
        is_trial: user.subscriptions?.[0]?.is_trial,
      }));
    },
  });

  const getStatusBadge = (user: AdminUser) => {
    if (user.is_trial) {
      return <Badge variant="secondary">Essai</Badge>;
    }
    if (user.subscription_status === 'active') {
      return <Badge variant="default">Actif</Badge>;
    }
    if (user.subscription_status === 'cancelled') {
      return <Badge variant="destructive">Annulé</Badge>;
    }
    return <Badge variant="outline">Aucun</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration</h1>
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
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
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
                    ) : (
                      users?.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: fr })}
                          </td>
                          <td className="p-2">{user.plan_name || '-'}</td>
                          <td className="p-2">{getStatusBadge(user)}</td>
                          <td className="p-2">
                            {user.is_trial && user.trial_end_date
                              ? format(new Date(user.trial_end_date), 'dd/MM/yyyy', { locale: fr })
                              : user.subscription_end_date
                              ? format(new Date(user.subscription_end_date), 'dd/MM/yyyy', { locale: fr })
                              : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Gestion des abonnements - À implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Historique des paiements - À implémenter
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
