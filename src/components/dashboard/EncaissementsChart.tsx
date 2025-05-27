
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from '@/components/ui/chart';
import type { MonthlyBarData } from '@/types/dashboard';

interface EncaissementsChartProps {
  data: MonthlyBarData[];
}

const EncaissementsChart: React.FC<EncaissementsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Encaissements mensuels</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
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
  );
};

export default EncaissementsChart;
