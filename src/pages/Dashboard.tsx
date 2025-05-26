
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { encaissements, soldes, depenses, revenus } = useDashboardData();

  // Transform encaissements data for bar chart
  const barData = React.useMemo(() => {
    if (!encaissements.data) return [];
    
    const monthlyData = encaissements.data.reduce((acc: any, item: any) => {
      const month = new Date(item.date_transaction).toLocaleDateString('fr-FR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, encaissements: 0 };
      }
      acc[month].encaissements += Number(item.montant || 0);
      return acc;
    }, {});
    
    return Object.values(monthlyData);
  }, [encaissements.data]);

  // Transform soldes data for line chart
  const lineData = React.useMemo(() => {
    if (!soldes.data) return [];
    
    const monthlyData = soldes.data.reduce((acc: any, item: any) => {
      const month = new Date(item.date_prevision).toLocaleDateString('fr-FR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, solde: 0 };
      }
      acc[month].solde += Number(item.montant_realise || item.montant_prevu || 0);
      return acc;
    }, {});
    
    return Object.values(monthlyData);
  }, [soldes.data]);

  // Transform depenses data for pie chart
  const expensesData = React.useMemo(() => {
    if (!depenses.data) return [];
    
    const categoryData = depenses.data.reduce((acc: any, item: any) => {
      const category = item.categorie || 'Autres';
      if (!acc[category]) {
        acc[category] = { name: category, amount: 0, color: getColorForCategory(category) };
      }
      acc[category].amount += Number(item.montant || 0);
      return acc;
    }, {});
    
    const totalAmount = Object.values(categoryData).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    
    return Object.values(categoryData).map((item: any) => ({
      ...item,
      amount: Number(item.amount || 0),
      value: totalAmount > 0 ? Math.round((Number(item.amount || 0) / totalAmount) * 100) : 0
    }));
  }, [depenses.data]);

  // Transform revenus data for pie chart
  const revenueData = React.useMemo(() => {
    if (!revenus.data) return [];
    
    const sourceData = revenus.data.reduce((acc: any, item: any) => {
      const source = item.categorie || 'Autres';
      if (!acc[source]) {
        acc[source] = { name: source, amount: 0, color: getColorForCategory(source) };
      }
      acc[source].amount += Number(item.montant || 0);
      return acc;
    }, {});
    
    const totalAmount = Object.values(sourceData).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    
    return Object.values(sourceData).map((item: any) => ({
      ...item,
      amount: Number(item.amount || 0),
      value: totalAmount > 0 ? Math.round((Number(item.amount || 0) / totalAmount) * 100) : 0
    }));
  }, [revenus.data]);

  const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Calculate dashboard summary cards from real data
  const dashboardSummary = React.useMemo(() => {
    const totalEncaissements = encaissements.data?.reduce((sum: number, item: any) => sum + Number(item.montant || 0), 0) || 0;
    const totalDepenses = depenses.data?.reduce((sum: number, item: any) => sum + Number(item.montant || 0), 0) || 0;
    const soldeGlobal = totalEncaissements - totalDepenses;
    
    return {
      soldeGlobal,
      encaissementsPrevus: totalEncaissements,
      depensesAVenir: totalDepenses,
      facturesEnRetard: depenses.data?.filter((d: any) => String(d.statut) === 'en_retard').length || 0
    };
  }, [encaissements.data, depenses.data]);

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

  if (encaissements.isLoading || soldes.isLoading || depenses.isLoading || revenus.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const cards = [
    { 
      title: 'Solde global', 
      value: `${dashboardSummary.soldeGlobal >= 0 ? '+' : ''}${dashboardSummary.soldeGlobal.toLocaleString('fr-TN')} DT`, 
      color: dashboardSummary.soldeGlobal >= 0 ? 'text-green-600' : 'text-red-600'
    },
    { 
      title: 'Encaissements prévus', 
      value: `${dashboardSummary.encaissementsPrevus.toLocaleString('fr-TN')} DT`, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Dépenses à venir', 
      value: `${dashboardSummary.depensesAVenir.toLocaleString('fr-TN')} DT`, 
      color: 'text-red-600' 
    },
    { 
      title: 'Factures en retard', 
      value: dashboardSummary.facturesEnRetard.toString(), 
      color: 'text-orange-600' 
    },
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
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="encaissements" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Aucune donnée d'encaissement disponible
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Solde mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="solde" stroke="#22C55E" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Aucune donnée de flux de trésorerie disponible
              </div>
            )}
          </CardContent>
        </Card>

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
            {expensesData.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Aucune donnée de dépenses disponible
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sources de revenus</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Aucune donnée de revenus disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to assign colors to categories
function getColorForCategory(category: string): string {
  const colors = {
    'Loyer': '#FF8C42',
    'Salaires': '#22C55E', 
    'Services': '#3B82F6',
    'Ventes': '#3B82F6',
    'Consulting': '#FF8C42',
    'default': '#E5E7EB'
  };
  return colors[category as keyof typeof colors] || colors.default;
}

export default DashboardPage;
