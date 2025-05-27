
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from '@/components/ui/chart';
import type { MonthlyLineData } from '@/types/dashboard';

interface SoldeChartProps {
  data: MonthlyLineData[];
}

const SoldeChart: React.FC<SoldeChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Solde mensuel</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
  );
};

export default SoldeChart;
