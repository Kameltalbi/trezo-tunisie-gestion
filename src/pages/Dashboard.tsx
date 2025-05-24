import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage: React.FC = () => {
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Encaissements',
        data: [12000, 15000, 13000, 18000, 16000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Solde mensuel',
        data: [4500, 5000, 4000, 6000, 7000],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  // Données améliorées pour le graphique camembert avec des couleurs modernes
  const investmentData = [
    { name: 'Immobilier', value: 35, amount: 2047.53, color: '#FF8C42' },
    { name: 'Actions', value: 24, amount: 1404.01, color: '#22C55E' },
    { name: 'Crypto', value: 15, amount: 877.51, color: '#3B82F6' },
    { name: 'Autres', value: 26, amount: 1520.95, color: '#E5E7EB' }
  ];

  const totalInvestment = investmentData.reduce((sum, item) => sum + item.amount, 0);

  const chartConfig = {
    immobilier: {
      label: "Immobilier",
      color: "#FF8C42",
    },
    actions: {
      label: "Actions", 
      color: "#22C55E",
    },
    crypto: {
      label: "Crypto",
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
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Encaissements mensuels</h2>
            <Bar data={barData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Solde mensuel</h2>
            <Line data={lineData} />
          </CardContent>
        </Card>

        {/* Graphique Camembert Amélioré */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Investissements</CardTitle>
              <select className="text-sm border border-gray-200 rounded-md px-3 py-1 bg-white">
                <option>Mois</option>
                <option>Année</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
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
                  data={investmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {investmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Total au centre avec style moderne */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalInvestment.toLocaleString('fr-TN', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })} DT
                </div>
              </div>
            </div>
            
            {/* Légende modernisée */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {investmentData.map((item, index) => (
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

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Sources de revenus</h2>
            <Doughnut data={doughnutData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
