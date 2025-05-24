
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
  // Données pour les métriques principales
  const portfolioData = [
    { month: 'Jan', value: 45000 },
    { month: 'Fév', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Avr', value: 55000 },
    { month: 'Mai', value: 58000 },
    { month: 'Jun', value: 62000 },
    { month: 'Jul', value: 59000 },
  ];

  const expenseData = [
    { category: 'Alimentation', amount: 1200, color: '#3b82f6' },
    { category: 'Transport', amount: 800, color: '#10b981' },
    { category: 'Loisirs', amount: 600, color: '#f59e0b' },
    { category: 'Santé', amount: 400, color: '#ef4444' },
    { category: 'Autres', amount: 300, color: '#8b5cf6' },
  ];

  const investmentData = [
    { name: 'Actions', value: 45, color: '#3b82f6' },
    { name: 'Obligations', value: 30, color: '#10b981' },
    { name: 'Crypto', value: 15, color: '#f59e0b' },
    { name: 'Immobilier', value: 10, color: '#ef4444' },
  ];

  const recentTransactions = [
    { name: 'Apple Inc.', type: 'Achat', amount: -2500, change: '+2.5%', positive: true },
    { name: 'Google', type: 'Vente', amount: +1800, change: '+1.2%', positive: true },
    { name: 'Microsoft', type: 'Achat', amount: -3200, change: '-0.8%', positive: false },
    { name: 'Tesla', type: 'Vente', amount: +2100, change: '+4.1%', positive: true },
  ];

  const chartConfig = {
    value: {
      label: "Valeur",
      color: "#3b82f6",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* En-tête avec métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Valeur totale du portefeuille */}
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Valeur totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">59 245,30 DT</div>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+5.2% ce mois</span>
              </div>
            </CardContent>
          </Card>

          {/* Revenus mensuels */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenus mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">4 850,00 DT</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12.5%</span>
              </div>
            </CardContent>
          </Card>

          {/* Dépenses mensuelles */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Dépenses mensuelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">3 320,00 DT</div>
              <div className="flex items-center text-sm text-red-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span>-3.2%</span>
              </div>
            </CardContent>
          </Card>

          {/* Épargne */}
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Épargne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-2">1 530,00 DT</div>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+31.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section principale avec graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Graphique principal - Évolution du portefeuille */}
          <Card className="lg:col-span-2 bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Évolution du portefeuille</CardTitle>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">7J</button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded-lg">1M</button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded-lg">3M</button>
                  <button className="px-3 py-1 text-sm text-gray-500 rounded-lg">1A</button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={chartConfig}>
                  <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Répartition des investissements */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Répartition des investissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={investmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {investmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {investmentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section inférieure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Dépenses par catégorie */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Dépenses par catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transactions récentes */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Transactions récentes</CardTitle>
                <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {transaction.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.name}</div>
                        <div className="text-sm text-gray-500">{transaction.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} DT
                      </div>
                      <div className={`text-sm ${transaction.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs financiers */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Objectifs financiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Épargne d'urgence</span>
                  <span className="text-sm text-gray-500">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="text-xs text-gray-500">7 500 DT / 10 000 DT</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Voyage été 2024</span>
                  <span className="text-sm text-gray-500">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="text-xs text-gray-500">2 250 DT / 5 000 DT</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nouvelle voiture</span>
                  <span className="text-sm text-gray-500">20%</span>
                </div>
                <Progress value={20} className="h-2" />
                <div className="text-xs text-gray-500">6 000 DT / 30 000 DT</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
