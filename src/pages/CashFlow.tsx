import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, ChevronDown, ExternalLink, Info, ArrowUpRight, ArrowDownRight, Coins } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Sample data based on the image from Pennylane
const monthlyData = [
  { name: 'Décembre', shortName: 'Déc', balance: -347927.79, inflow: 120000, outflow: 185000, month: 'dec' },
  { name: 'Janvier', shortName: 'Jan', balance: -477725.79, inflow: 145000, outflow: 160000, month: 'jan' },
  { name: 'Février', shortName: 'Fév', balance: -564432.62, inflow: 130000, outflow: 125000, month: 'feb' },
  { name: 'Mars', shortName: 'Mar', balance: -671360.46, inflow: 210000, outflow: 180000, month: 'mar' },
  { name: 'Avril', shortName: 'Avr', balance: -672186.86, inflow: 230000, outflow: 190000, month: 'apr' },
  { name: 'Mai', shortName: 'Mai', balance: 47736.15, inflow: 180000, outflow: 192000, month: 'may' },
  { name: 'Juin', shortName: 'Jun', balance: 142357.87, inflow: 160000, outflow: 145000, month: 'jun' },
  { name: 'Juillet', shortName: 'Jul', balance: 431846.08, inflow: 150000, outflow: 110000, month: 'jul' },
];

// Données financières pour les KPIs
const financialData = {
  solde: {
    value: 224295.26,
    percentage: 127.58,
    isPositive: true
  },
  encaissements: {
    value: 579485.69,
    percentage: 44.87,
    isPositive: false
  },
  decaissements: {
    value: 458366.27,
    percentage: 19.60,
    isPositive: true
  },
  variation: {
    value: 280052.60,
    percentage: 71.99,
    isPositive: true
  },
  estimation: {
    value: 68050.00
  }
};

const chartConfig = {
  inflow: { color: "#4F86F7" },
  outflow: { color: "#FF6B6B" },
  line: { color: "#2C7A7B" },
};

const CashFlow = () => {
  const { t } = useTranslation();
  const [showForecast, setShowForecast] = useState(true);
  const [currentTab, setCurrentTab] = useState('tresorerie');
  
  // Formater les montants en euros
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Formater les pourcentages
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pilotage et trésorerie</h1>
          </div>
        </div>

        <Tabs defaultValue="tresorerie" value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="border-b border-gray-200 w-full bg-transparent">
            <TabsTrigger value="tableau" className="px-4 py-2 text-sm font-medium">
              Tableau de bord
              <Badge variant="outline" className="ml-2 text-xs">Bêta</Badge>
            </TabsTrigger>
            <TabsTrigger value="tresorerie" className="px-4 py-2 text-sm font-medium">
              Plan de trésorerie
              <Badge variant="outline" className="ml-2 text-xs">Bêta</Badge>
            </TabsTrigger>
            <TabsTrigger value="activite" className="px-4 py-2 text-sm font-medium">
              Ratios d'activité
              <Badge variant="outline" className="ml-2 text-xs">Bêta</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Afficher le prévisionnel</span>
            <Switch checked={showForecast} onCheckedChange={setShowForecast} />
            <div className="ml-1 text-gray-500 cursor-help">
              <Info size={16} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <ArrowLeft size={16} />
            </Button>
            <span className="text-sm font-medium px-3 py-1 border rounded-md">
              Mois courant
            </span>
            <Button variant="outline" size="sm" className="h-8">
              <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[220px] h-8 text-sm">
                <SelectValue placeholder="Tous les comptes bancaires" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les comptes bancaires</SelectItem>
                <SelectItem value="main">Compte principal</SelectItem>
                <SelectItem value="savings">Compte d'épargne</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="flex items-center h-8">
              <ExternalLink size={16} className="mr-1" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Solde de trésorerie */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Solde de trésorerie</h3>
                <Info size={16} className="text-gray-400" />
              </div>
              
              <div className="mt-2">
                <p className="text-2xl font-bold">{formatCurrency(financialData.solde.value)}</p>
                <div className="flex items-center mt-1">
                  <div 
                    className={cn(
                      "text-xs rounded-sm font-medium px-2 py-0.5 inline-flex items-center",
                      financialData.solde.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {financialData.solde.isPositive ? 
                      <ArrowUpRight size={12} className="mr-1" /> : 
                      <ArrowDownRight size={12} className="mr-1" />
                    }
                    {formatPercentage(financialData.solde.percentage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encaissements */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Encaissements</h3>
                <Info size={16} className="text-gray-400" />
              </div>
              
              <div className="mt-2">
                <p className="text-2xl font-bold">{formatCurrency(financialData.encaissements.value)}</p>
                <div className="flex items-center mt-1">
                  <div 
                    className={cn(
                      "text-xs rounded-sm font-medium px-2 py-0.5 inline-flex items-center",
                      financialData.encaissements.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {financialData.encaissements.isPositive ? 
                      <ArrowUpRight size={12} className="mr-1" /> : 
                      <ArrowDownRight size={12} className="mr-1" />
                    }
                    {formatPercentage(financialData.encaissements.percentage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Décaissements */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Décaissements</h3>
                <Info size={16} className="text-gray-400" />
              </div>
              
              <div className="mt-2">
                <p className="text-2xl font-bold">{formatCurrency(financialData.decaissements.value)}</p>
                <div className="flex items-center mt-1">
                  <div 
                    className={cn(
                      "text-xs rounded-sm font-medium px-2 py-0.5 inline-flex items-center",
                      financialData.decaissements.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {financialData.decaissements.isPositive ? 
                      <ArrowUpRight size={12} className="mr-1" /> : 
                      <ArrowDownRight size={12} className="mr-1" />
                    }
                    {formatPercentage(financialData.decaissements.percentage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variation de trésorerie */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Variation de trésorerie</h3>
                <Info size={16} className="text-gray-400" />
              </div>
              
              <div className="mt-2">
                <p className="text-2xl font-bold">{formatCurrency(financialData.variation.value)}</p>
                <div className="flex items-center mt-1">
                  <div 
                    className={cn(
                      "text-xs rounded-sm font-medium px-2 py-0.5 inline-flex items-center",
                      financialData.variation.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}
                  >
                    {financialData.variation.isPositive ? 
                      <ArrowUpRight size={12} className="mr-1" /> : 
                      <ArrowDownRight size={12} className="mr-1" />
                    }
                    {formatPercentage(financialData.variation.percentage)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estimation de crédit de TVA */}
          <Card className="bg-white border-0 shadow-sm overflow-hidden col-span-1 lg:col-span-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase">Estimation de crédit de TVA</h3>
                <Info size={16} className="text-gray-400" />
              </div>
              
              <div className="mt-2">
                <p className="text-2xl font-bold">{formatCurrency(financialData.estimation.value)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphique de trésorerie */}
        <Card className="bg-white border-0 shadow-sm overflow-hidden mb-6">
          <CardContent className="p-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="shortName" tickLine={false} axisLine={false} />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    tickFormatter={(value) => {
                      if (value === 0) return '0';
                      if (value === 50000) return '50k';
                      if (value === 100000) return '100k';
                      if (value === -50000) return '-50k';
                      if (value === -100000) return '-100k';
                      return '';
                    }}
                    axisLine={false}
                    tickLine={false}
                    domain={[-100000, 100000]}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => {
                      if (value === 0) return '0';
                      if (value === 500000) return '500k';
                      if (value === -500000) return '-500k';
                      if (value === 1000000) return '1M';
                      if (value === -1000000) return '-1M';
                      return '';
                    }}
                    axisLine={false}
                    tickLine={false}
                    domain={[-1000000, 1000000]}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'inflow') return [formatCurrency(value as number), 'Encaissements'];
                      if (name === 'outflow') return [formatCurrency(value as number), 'Décaissements'];
                      if (name === 'balance') return [formatCurrency(value as number), 'Solde'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(value) => {
                      if (value === 'inflow') return 'Encaissements';
                      if (value === 'outflow') return 'Décaissements';
                      if (value === 'balance') return 'Solde';
                      return value;
                    }}
                  />
                  <defs>
                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F86F7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4F86F7" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <Bar yAxisId="left" dataKey="inflow" fill="url(#colorInflow)" barSize={20} name="inflow" />
                  <Bar yAxisId="left" dataKey="outflow" fill="url(#colorOutflow)" barSize={20} name="outflow" />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#2C7A7B" 
                    strokeWidth={2}
                    dot={{ stroke: '#2C7A7B', fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: '#2C7A7B', fill: '#FFFFFF', strokeWidth: 2, r: 6 }}
                    name="balance"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tableau de trésorerie en début de mois */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">TRÉSORERIE EN DÉBUT DE MOIS</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-xs text-gray-500 border-b">
                  {monthlyData.map((month) => (
                    <th key={month.month} className="px-2 py-2 text-center font-normal">
                      {month.shortName}
                      <br />
                      <span className="text-gray-400 text-[10px]">{month.month}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm">
                  {monthlyData.map((month) => (
                    <td key={month.month} className="px-2 py-3 text-center">
                      <span className={month.balance < 0 ? 'text-red-600' : ''}>
                        {formatCurrency(month.balance)}
                      </span>
                      
                      {month.month === 'dec' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          DÉMONSTRATION
                        </div>
                      )}
                      {month.month === 'jan' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          DÉMONSTRATION
                        </div>
                      )}
                      {month.month === 'feb' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          DÉMONSTRATION
                        </div>
                      )}
                      {month.month === 'mar' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          DÉMONSTRATION
                        </div>
                      )}
                      {month.month === 'apr' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          DÉMONSTRATION
                        </div>
                      )}
                      {month.month === 'may' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          PLANIFICATION
                        </div>
                      )}
                      {month.month === 'jun' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          PLANIFICATION
                        </div>
                      )}
                      {month.month === 'jul' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 px-2 rounded text-center">
                          PLANIFICATION
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Période de comparaison */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm text-xs text-gray-600">
          <p>Période: 30 derniers jours (du 1 mai au 31 mai)</p>
          <p>comparée avec les 30 jours précédents (du 31 mars au 30 avril)</p>
        </div>
      </div>
    </Layout>
  );
};

export default CashFlow;
