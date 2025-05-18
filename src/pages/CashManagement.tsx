
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';

const CashManagement = () => {
  const { t } = useTranslation();
  
  // Sample data for visualization
  const monthlyData = [
    { name: 'Jan', income: 4000, expenses: 2400, balance: 1600 },
    { name: 'Feb', income: 3000, expenses: 1398, balance: 1602 },
    { name: 'Mar', income: 2000, expenses: 2800, balance: -800 },
    { name: 'Apr', income: 2780, expenses: 3908, balance: -1128 },
    { name: 'May', income: 1890, expenses: 4800, balance: -2910 },
    { name: 'Jun', income: 2390, expenses: 3800, balance: -1410 },
    { name: 'Jul', income: 3490, expenses: 4300, balance: -810 },
    { name: 'Aug', income: 4000, expenses: 2400, balance: 1600 },
    { name: 'Sep', income: 5000, expenses: 3800, balance: 1200 },
    { name: 'Oct', income: 4500, expenses: 4300, balance: 200 },
    { name: 'Nov', income: 6000, expenses: 3500, balance: 2500 },
    { name: 'Dec', income: 5500, expenses: 4800, balance: 700 },
  ];

  // Current summary stats
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('cash_management.title')}</h1>
            <p className="text-gray-600 mt-1">{t('cash_management.description')}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-green-100 p-2">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t('cash_management.total_income')}</span>
                <span className="text-2xl font-bold text-gray-800">{totalIncome.toLocaleString()} €</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-red-100 p-2">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t('cash_management.total_expenses')}</span>
                <span className="text-2xl font-bold text-gray-800">{totalExpenses.toLocaleString()} €</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className={`rounded-full ${netCashFlow >= 0 ? 'bg-blue-100' : 'bg-amber-100'} p-2`}>
                <TrendingUp className={`h-6 w-6 ${netCashFlow >= 0 ? 'text-blue-600' : 'text-amber-600'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">{t('cash_management.net_cash_flow')}</span>
                <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-blue-800' : 'text-amber-800'}`}>
                  {netCashFlow.toLocaleString()} €
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cash Flow Analysis */}
        <Card className="mb-6">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{t('cash_management.cash_flow_analysis')}</h2>
          </div>
          <div className="p-4">
            <Tabs defaultValue="monthly">
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">{t('cash_management.monthly')}</TabsTrigger>
                <TabsTrigger value="quarterly">{t('cash_management.quarterly')}</TabsTrigger>
                <TabsTrigger value="yearly">{t('cash_management.yearly')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name={t('cash_management.income')} fill="#4ade80" />
                    <Bar dataKey="expenses" name={t('cash_management.expenses')} fill="#f87171" />
                    <Bar dataKey="balance" name={t('cash_management.balance')} fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="quarterly">
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-gray-500">{t('cash_management.coming_soon')}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="yearly">
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-gray-500">{t('cash_management.coming_soon')}</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Future Projections */}
        <Card>
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">{t('cash_management.future_projections')}</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">{t('cash_management.projections_coming_soon')}</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CashManagement;
