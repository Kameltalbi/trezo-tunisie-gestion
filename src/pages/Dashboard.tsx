
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Line,
  Doughnut,
  Bar
} from 'react-chartjs-2';
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
  // Données pour le graphique de dépenses
  const spendingData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Dépenses',
        data: [2000, 2200, 1800, 2400, 2100, 2600, 2300],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Données pour le doughnut des investissements
  const investmentData = {
    labels: ['Google', 'Apple', 'Meta'],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ['#ff9500', '#10b981', '#3b82f6'],
        borderWidth: 0,
      },
    ],
  };

  // Données pour le graphique des revenus
  const incomeData = {
    labels: ['Technologie', 'Voitures', 'Avions', 'Énergie', 'Technologie', 'Marques automobiles'],
    datasets: [
      {
        label: 'Revenus',
        data: [30, 65, 45, 90, 55, 75],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f1f5f9',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dépenses */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Dépenses</CardTitle>
              <select className="text-xs border-none bg-transparent">
                <option>Mois</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-4">2 500 DT</div>
            <div className="h-20">
              <Line data={spendingData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Réalisations */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Réalisations</CardTitle>
              <span className="text-xs text-gray-500">Collecté 5/24</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Objectif mensuel</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Épargne cible</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget respecté</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Comptes */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Comptes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Valeur nette</span>
                <span className="text-lg font-bold">18 531,54 DT</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Banque</span>
                <span className="font-medium">8 681,49 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Espèces & Chèques</span>
                <span className="font-medium">9 669,69 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compte d'épargne</span>
                <span className="font-medium">200,00 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Solde disponible</span>
                <span className="font-medium">980,00 DT</span>
              </div>
            </div>
            <div className="pt-3 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Investissements</span>
                <span className="font-bold">5 850,05 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Retraites</span>
                <span className="font-bold">5 850,05 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Actifs</span>
                <span className="font-bold">1 000,00 DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Immobilier</span>
                <span className="font-bold">1 000,00 DT</span>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-red-600">Passifs</span>
                <span className="text-blue-600 text-sm">+ Comptes de passif</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investissements */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Investissements</CardTitle>
              <select className="text-sm border border-gray-200 rounded px-2 py-1">
                <option>Mois</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-40 w-40">
                  <Doughnut data={investmentData} options={doughnutOptions} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">5850,05</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm">Google</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Apple</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Meta</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenus */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenus</CardTitle>
              <select className="text-sm border border-gray-200 rounded px-2 py-1">
                <option>Mois</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <Bar data={incomeData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section investissements détaillés */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Investissements</CardTitle>
          <p className="text-sm text-gray-500">Dernière mise à jour Mar 08,2023 · 5:53 PM ET</p>
          <p className="text-xs text-gray-400">Valeur totale / Changement quotidien</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">GM</span>
                </div>
                <div>
                  <div className="font-semibold">Globus Medical Inc</div>
                  <div className="text-sm text-gray-500">GMED · 40 actions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">2 073,20 DT</div>
                <div className="text-sm text-red-500">-200,00 (-1,28%)</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">A</span>
                </div>
                <div>
                  <div className="font-semibold">Alphabet CIA</div>
                  <div className="text-sm text-gray-500">Google · 20 actions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">2 847,60 DT</div>
                <div className="text-sm text-green-500">+524,80 (+0,88%)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
