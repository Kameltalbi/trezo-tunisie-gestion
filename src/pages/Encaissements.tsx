
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const mockData = [
  { name: 'Jan', total: 1500 },
  { name: 'Feb', total: 2300 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 3200 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 3600 },
];

const recentTransactions = [
  { id: 1, date: '2024-05-15', description: 'Paiement client #1205', amount: 350 },
  { id: 2, date: '2024-05-14', description: 'Paiement en espèces', amount: 120 },
  { id: 3, date: '2024-05-12', description: 'Encaissement chèque #4532', amount: 500 },
];

const Encaissements = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('encaissements.title')}</h1>
            <p className="text-muted-foreground">{t('encaissements.description')}</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('encaissements.add')}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('encaissements.total_month')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€3,450.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('encaissements.pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€650.00</div>
              <p className="text-xs text-muted-foreground mt-1">
                3 paiements en attente
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {t('encaissements.avg_transaction')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€215.30</div>
              <p className="text-xs text-muted-foreground mt-1">
                Basé sur 16 transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7 mb-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>{t('encaissements.monthly_trend')}</CardTitle>
              <CardDescription>
                {t('encaissements.trend_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart
                data={mockData}
                index="name"
                categories={["total"]}
                colors={["violet"]}
                valueFormatter={(value) => `€${value}`}
                className="h-72"
              />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>{t('encaissements.recent')}</CardTitle>
              <CardDescription>{t('encaissements.recent_description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="font-medium">€{transaction.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {t('encaissements.view_all')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Encaissements;
