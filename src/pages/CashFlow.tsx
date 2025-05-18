import React, { useState, useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import { formatCurrency } from '@/lib/utils';

const allMonthlyData = [
  { year: 2024, month: 'janvier', inflow: 145000, outflow: 160000 },
  { year: 2024, month: 'février', inflow: 130000, outflow: 125000 },
  { year: 2024, month: 'mars', inflow: 210000, outflow: 180000 },
  { year: 2024, month: 'avril', inflow: 230000, outflow: 190000 },
  { year: 2024, month: 'mai', inflow: 180000, outflow: 192000 },
  { year: 2024, month: 'juin', inflow: 160000, outflow: 145000 },
  { year: 2024, month: 'juillet', inflow: 150000, outflow: 110000 },
  { year: 2024, month: 'août', inflow: 170000, outflow: 130000 },
  { year: 2024, month: 'septembre', inflow: 160000, outflow: 120000 },
  { year: 2024, month: 'octobre', inflow: 190000, outflow: 140000 },
  { year: 2024, month: 'novembre', inflow: 200000, outflow: 160000 },
  { year: 2024, month: 'décembre', inflow: 120000, outflow: 185000 },
  { year: 2025, month: 'janvier', inflow: 155000, outflow: 140000 },
  { year: 2025, month: 'février', inflow: 165000, outflow: 150000 },
  { year: 2025, month: 'mars', inflow: 170000, outflow: 160000 },
  { year: 2025, month: 'avril', inflow: 185000, outflow: 170000 },
  { year: 2025, month: 'mai', inflow: 190000, outflow: 180000 },
  { year: 2025, month: 'juin', inflow: 200000, outflow: 185000 },
];

const MONTHS_PER_VIEW = 6;

const CashFlowPage: React.FC = () => {
  const years = Array.from(new Set(allMonthlyData.map((m) => m.year)));
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [startIndex, setStartIndex] = useState(0);

  const yearData = useMemo(() => allMonthlyData.filter((m) => m.year === selectedYear), [selectedYear]);

  const visibleMonths = useMemo(() => {
    return yearData.slice(startIndex, startIndex + MONTHS_PER_VIEW).map((month) => ({
      ...month,
      balance: month.inflow - month.outflow,
    }));
  }, [startIndex, yearData]);

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + MONTHS_PER_VIEW < yearData.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Plan de trésorerie</h2>

        <Select value={selectedYear.toString()} onValueChange={(val) => { setSelectedYear(parseInt(val)); setStartIndex(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" disabled={!canGoBack} onClick={() => setStartIndex(startIndex - MONTHS_PER_VIEW)}>
            <ArrowLeft size={16} className="mr-1" /> Mois précédents
          </Button>
          <Button size="sm" variant="outline" disabled={!canGoForward} onClick={() => setStartIndex(startIndex + MONTHS_PER_VIEW)}>
            Mois suivants <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visibleMonths} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${v / 1000}k`} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value, name) => [formatCurrency(value as number), name === 'inflow' ? 'Encaissements' : name === 'outflow' ? 'Décaissements' : 'Solde']} />
                <Legend verticalAlign="top" height={36} formatter={(value) => value === 'inflow' ? 'Encaissements' : value === 'outflow' ? 'Décaissements' : 'Solde'} />
                <Bar yAxisId="left" dataKey="inflow" fill="#4F86F7" name="Encaissements" barSize={20} />
                <Bar yAxisId="left" dataKey="outflow" fill="#FF6B6B" name="Décaissements" barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#2C7A7B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Solde" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {visibleMonths.map((month, idx) => (
          <Card key={idx} className="shadow-sm border border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">{month.month} {month.year}</h3>
              <p className="text-xs text-gray-500">Encaissements</p>
              <p className="text-md font-semibold text-blue-600">{formatCurrency(month.inflow)}</p>
              <p className="text-xs text-gray-500 mt-2">Décaissements</p>
              <p className="text-md font-semibold text-red-600">{formatCurrency(month.outflow)}</p>
              <p className="text-xs text-gray-500 mt-2">Solde</p>
              <p className={`text-md font-semibold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(month.balance)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CashFlowPage;