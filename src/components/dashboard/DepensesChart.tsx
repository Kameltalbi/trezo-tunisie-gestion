
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { ProcessedChartData } from '@/types/dashboard';

interface DepensesChartProps {
  data: ProcessedChartData[];
  totalExpenses: number;
  chartConfig: any;
}

const DepensesChart: React.FC<DepensesChartProps> = ({ data, totalExpenses, chartConfig }) => {
  return (
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
        {data.length > 0 ? (
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
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
              {data.map((item, index) => (
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
  );
};

export default DepensesChart;
