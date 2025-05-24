
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';

const DashboardPage: React.FC = () => {
  // Data for bar chart (Recharts format)
  const barData = [
    { month: 'Jan', encaissements: 12000 },
    { month: 'Feb', encaissements: 15000 },
    { month: 'Mar', encaissements: 13000 },
    { month: 'Apr', encaissements: 18000 },
    { month: 'May', encaissements: 16000 },
  ];

  // Data for line chart (Recharts format)
  const lineData = [
    { month: 'Jan', solde: 4500 },
    { month: 'Feb', solde: 5000 },
    { month: 'Mar', solde: 4000 },
    { month: 'Apr', solde: 6000 },
    { month: 'May', solde: 7000 },
  ];

  // Data for expenses by category pie chart
  const expensesData = [
    { name: 'Loyer', value: 35, amount: 2500, color: '#FF8C42' },
    { name: 'Salaires', value: 30, amount: 2143, color: '#22C55E' },
    { name: 'Services', value: 20, amount: 1428, color: '#3B82F6' },
    { name: 'Autres', value: 15, amount: 1071, color: '#E5E7EB' }
  ];

  // Data for revenue sources doughnut chart
  const revenueData = [
    { name: 'Ventes', value: 45, color: '#3B82F6' },
    { name: 'Services', value: 30, color: '#22C55E' },
    { name: 'Consulting', value: 15, color: '#FF8C42' },
    { name: 'Autres', value: 10, color: '#E5E7EB' }
  ];

  const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);

  const chartConfig = {
    loyer: {
      label: "Loyer",
      color: "#FF8C42",
    },
    salaires: {
      label: "Salaires", 
      color: "#22C55E",
    },
    services: {
      label: "Services",
      color: "#3B82F6",
    },
    autres: {
      label: "Autres",
      color: "#E5E7EB",
    },
  };

  const cards = [
    { title: 'Solde global', value: '+12 450 DT', color: 'text-green-600' },
    { title: 'Encaissements prévus', value: '8 200 DT', color: 'text-blue-600' },
    { title: 'Dépenses à venir', value: '6 800 DT', color: 'text-red-600' },
    { title: 'Factures en retard', value: '4', color: 'text-orange-600' },
    { title: 'Clients actifs', value: '35', color: 'text-indigo-600' },
    { title: 'Fournisseurs actifs', value: '22', color: 'text-yellow-600' },
    { title: 'Dettes restantes', value: '15 000 DT', color: 'text-rose-600' },
    { title: 'Projets en cours', value: '7', color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className={`text-xl font-semibold ${card.color}`}>{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Encaissements mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="encaissements" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Solde mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Line type="monotone" dataKey="solde" stroke="#22C55E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by Category Pie Chart */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Dépenses par catégorie</CardTitle>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 bg-white">
                <option>Mois</option>
                <option>Année</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={expensesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Total au centre */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalExpenses.toLocaleString('fr-TN', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} DT
                </div>
              </div>
            </div>
            
            {/* Légende */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {expensesData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Sources Doughnut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sources de revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <ChartTooltip />
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
