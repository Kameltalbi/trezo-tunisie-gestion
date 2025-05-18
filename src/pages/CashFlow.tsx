
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, ChartBar, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Sample data based on the image
const monthlyData = [
  { name: 'Dec', balance: -247927.79, inflow: 120000, outflow: 85000, month: 'dec' },
  { name: 'Jan', balance: -477729.70, inflow: 145000, outflow: 160000, month: 'jan' },
  { name: 'Feb', balance: -654432.62, inflow: 130000, outflow: 125000, month: 'feb' },
  { name: 'Mar', balance: -671360.46, inflow: 210000, outflow: 180000, month: 'mar' },
  { name: 'Apr', balance: -672186.86, inflow: 230000, outflow: 190000, month: 'apr' },
  { name: 'May', balance: 47736.15, inflow: 180000, outflow: 192000, month: 'may' },
  { name: 'Jun', balance: 142357.87, inflow: 160000, outflow: 145000, month: 'jun' },
  { name: 'Jul', balance: 431846.08, inflow: 150000, outflow: 110000, month: 'jul' },
];

const chartConfig = {
  inflow: { color: "#4F86F7" },
  outflow: { color: "#FF6B6B" },
  line: { color: "#2C7A7B" },
};

const CashFlow = () => {
  const { t } = useTranslation();
  const [showForecast, setShowForecast] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  return (
    <Layout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('cash_flow.title')}</h1>
            <p className="text-gray-600 mt-1">{t('cash_flow.description')}</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="dashboard">{t('cash_flow.dashboard')}</TabsTrigger>
            <TabsTrigger value="planning">{t('cash_flow.planning')}</TabsTrigger>
            <TabsTrigger value="activity">{t('cash_flow.activity_ratios')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">{t('cash_flow.show_forecast')}</span>
            <Switch checked={showForecast} onCheckedChange={setShowForecast} />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} />
            </Button>
            <span className="text-sm font-medium px-3 py-1 border rounded-md">
              {t('cash_flow.current_month')}
            </span>
            <Button variant="outline" size="sm">
              <ArrowRight size={16} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              {t('cash_flow.all_bank_accounts')}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <ExternalLink size={16} className="mr-1" />
              {t('cash_flow.export')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBar size={18} className="text-blue-600" />
                <span className="text-xs font-semibold text-gray-500">{t('cash_flow.treasury_balance')}</span>
              </div>
              <div className="text-2xl font-bold">€224,295.26</div>
              <div className="text-sm text-green-600 font-medium">+17.19%</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBar size={18} className="text-blue-600" />
                <span className="text-xs font-semibold text-gray-500">{t('cash_flow.inflows')}</span>
              </div>
              <div className="text-2xl font-bold">€579,485.59</div>
              <div className="text-sm text-green-600 font-medium">+44.87%</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBar size={18} className="text-red-600" />
                <span className="text-xs font-semibold text-gray-500">{t('cash_flow.outflows')}</span>
              </div>
              <div className="text-2xl font-bold">€458,366.27</div>
              <div className="text-sm text-red-600 font-medium">+19.80%</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBar size={18} className="text-green-600" />
                <span className="text-xs font-semibold text-gray-500">{t('cash_flow.treasury_variation')}</span>
              </div>
              <div className="text-2xl font-bold">€280,052.60</div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600">{t('cash_flow.per_month')}</span>
                <span className="ml-2 text-sm text-red-600 font-medium">-21.75%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white col-span-1 md:col-span-2 lg:col-span-4">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBar size={18} className="text-purple-600" />
                <span className="text-xs font-semibold text-gray-500">{t('cash_flow.vat_credit')}</span>
              </div>
              <div className="text-2xl font-bold">€68,050.00</div>
              
              <div className="text-xs text-gray-600 mt-2">
                {t('cash_flow.period')}: 30 {t('cash_flow.previous_days')}
                <br />
                {t('cash_flow.compared_with')} 30 {t('cash_flow.previous_days')}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white mb-6">
          <CardContent className="p-4">
            <ChartContainer config={chartConfig} className="h-80">
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value === 0) return '0';
                    if (value === 1000) return '1,000€';
                    if (value === -500) return '-500€';
                    if (value === 500) return '500€';
                    if (value === -1000) return '-1,000€';
                    return '';
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="inflow" fill="#4F86F7" barSize={20} />
                <Bar dataKey="outflow" fill="#FF6B6B" barSize={20} />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#2C7A7B" 
                  strokeWidth={3}
                  dot={{ stroke: '#2C7A7B', fill: '#FFFFFF', strokeWidth: 2, r: 6 }}
                  activeDot={{ stroke: '#2C7A7B', fill: '#FFFFFF', strokeWidth: 2, r: 8 }}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-700 mb-4">{t('cash_flow.beginning_of_month')}</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-xs text-gray-500">
                  {monthlyData.map((month) => (
                    <th key={month.month} className="px-2 py-2 text-center font-normal">
                      {t(`cash_flow.${month.month}`)}
                      <br />
                      <span className="text-gray-400 text-[10px]">{month.month}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-sm">
                  {monthlyData.map((month) => (
                    <td key={month.month} className="px-2 py-3 text-center border-t">
                      {month.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })}
                      {month.month === 'dec' && (
                        <div className="mt-2 bg-blue-600 text-white text-xs py-1 rounded text-center">
                          {t('cash_flow.demo')}
                        </div>
                      )}
                      {month.month === 'jul' && (
                        <div className="mt-2 bg-blue-500 text-white text-xs py-1 rounded text-center">
                          {t('cash_flow.forecast')}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper component to create a ComposedChart since it's not directly imported
const ComposedChart = ({ children, data, ...props }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        {...props}
      >
        {children}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashFlow;
