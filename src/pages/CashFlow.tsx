
import React, { useState, useMemo } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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

// Données détaillées simulées pour chaque mois
const getMonthDetails = (year: number, month: string) => {
  const monthData = allMonthlyData.find(m => m.year === year && m.month === month);
  if (!monthData) return null;

  return {
    ...monthData,
    recettes: [
      { id: 1, description: 'Vente de produits', montant: monthData.inflow * 0.6, date: `15/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
      { id: 2, description: 'Prestations de services', montant: monthData.inflow * 0.3, date: `20/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
      { id: 3, description: 'Autres revenus', montant: monthData.inflow * 0.1, date: `25/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
    ],
    depenses: [
      { id: 1, description: 'Salaires et charges', montant: monthData.outflow * 0.5, date: `01/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
      { id: 2, description: 'Loyer et charges locatives', montant: monthData.outflow * 0.2, date: `05/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
      { id: 3, description: 'Fournisseurs', montant: monthData.outflow * 0.2, date: `10/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
      { id: 4, description: 'Autres charges', montant: monthData.outflow * 0.1, date: `15/${month === 'janvier' ? '01' : month === 'février' ? '02' : '03'}/${year}` },
    ]
  };
};

const CashFlowPage: React.FC = () => {
  const years = Array.from(new Set(allMonthlyData.map((m) => m.year)));
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: string } | null>(null);

  const yearData = useMemo(() => allMonthlyData.filter((m) => m.year === selectedYear), [selectedYear]);

  const visibleMonths = useMemo(() => {
    return yearData.slice(startIndex, startIndex + MONTHS_PER_VIEW).map((month) => ({
      ...month,
      balance: month.inflow - month.outflow,
    }));
  }, [startIndex, yearData]);

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + MONTHS_PER_VIEW < yearData.length;

  const monthDetails = selectedMonth ? getMonthDetails(selectedMonth.year, selectedMonth.month) : null;

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
          <Sheet key={idx}>
            <SheetTrigger asChild>
              <Card 
                className="shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMonth({ year: month.year, month: month.month })}
              >
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
            </SheetTrigger>
            
            <SheetContent className="w-[600px] sm:max-w-[600px]">
              {monthDetails && (
                <>
                  <SheetHeader>
                    <SheetTitle className="capitalize">
                      Détails - {monthDetails.month} {monthDetails.year}
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Résumé du mois */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Recettes</p>
                              <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(monthDetails.inflow)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            <div>
                              <p className="text-xs text-gray-500">Dépenses</p>
                              <p className="text-lg font-semibold text-red-600">
                                {formatCurrency(monthDetails.outflow)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`h-5 w-5 ${monthDetails.inflow - monthDetails.outflow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                            <div>
                              <p className="text-xs text-gray-500">Solde</p>
                              <p className={`text-lg font-semibold ${monthDetails.inflow - monthDetails.outflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(monthDetails.inflow - monthDetails.outflow)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Détail des recettes */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-600">Recettes</h3>
                      <div className="space-y-2">
                        {monthDetails.recettes.map((recette) => (
                          <Card key={recette.id}>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{recette.description}</p>
                                  <p className="text-xs text-gray-500">{recette.date}</p>
                                </div>
                                <p className="font-semibold text-green-600">
                                  {formatCurrency(recette.montant)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Détail des dépenses */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-600">Dépenses</h3>
                      <div className="space-y-2">
                        {monthDetails.depenses.map((depense) => (
                          <Card key={depense.id}>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{depense.description}</p>
                                  <p className="text-xs text-gray-500">{depense.date}</p>
                                </div>
                                <p className="font-semibold text-red-600">
                                  {formatCurrency(depense.montant)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
};

export default CashFlowPage;
