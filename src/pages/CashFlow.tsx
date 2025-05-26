
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFluxTresorerie } from '@/hooks/useFluxTresorerie';
import { useEncaissements } from '@/hooks/useEncaissements';
import { useDecaissements } from '@/hooks/useDecaissements';

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

const MONTHS_PER_VIEW = 6;

const CashFlowPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: fluxData } = useFluxTresorerie();
  const { data: encaissements } = useEncaissements();
  const { data: decaissements } = useDecaissements();
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: string } | null>(null);

  // Transform real data into monthly cash flow data
  const yearData = useMemo(() => {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

    return months.map((month, index) => {
      const monthNumber = index + 1;
      
      // Calculate inflow from encaissements for this month/year
      const monthlyInflow = encaissements?.filter(item => {
        const itemDate = new Date(item.date_transaction);
        return itemDate.getFullYear() === selectedYear && itemDate.getMonth() === index;
      }).reduce((sum, item) => sum + Number(item.montant || 0), 0) || 0;

      // Calculate outflow from decaissements for this month/year
      const monthlyOutflow = decaissements?.filter(item => {
        const itemDate = new Date(item.date_transaction);
        return itemDate.getFullYear() === selectedYear && itemDate.getMonth() === index;
      }).reduce((sum, item) => sum + Number(item.montant || 0), 0) || 0;

      return {
        year: selectedYear,
        month,
        monthNumber,
        inflow: monthlyInflow,
        outflow: monthlyOutflow
      };
    });
  }, [selectedYear, encaissements, decaissements]);

  const visibleMonths = useMemo(() => {
    return yearData.slice(startIndex, startIndex + MONTHS_PER_VIEW).map((month) => ({
      ...month,
      balance: month.inflow - month.outflow,
    }));
  }, [startIndex, yearData]);

  const canGoBack = startIndex > 0;
  const canGoForward = startIndex + MONTHS_PER_VIEW < yearData.length;

  // Get details for selected month
  const getMonthDetails = (year: number, month: string) => {
    const monthData = yearData.find(m => m.year === year && m.month === month);
    if (!monthData) return null;

    const monthIndex = yearData.findIndex(m => m.month === month);
    
    // Get real recettes for this month
    const recettes = encaissements?.filter(item => {
      const itemDate = new Date(item.date_transaction);
      return itemDate.getFullYear() === year && itemDate.getMonth() === monthIndex;
    }).map(item => ({
      id: item.id,
      description: item.titre,
      montant: Number(item.montant || 0),
      date: new Date(item.date_transaction).toLocaleDateString('fr-FR')
    })) || [];

    // Get real depenses for this month
    const depenses = decaissements?.filter(item => {
      const itemDate = new Date(item.date_transaction);
      return itemDate.getFullYear() === year && itemDate.getMonth() === monthIndex;
    }).map(item => ({
      id: item.id,
      description: item.titre,
      montant: Number(item.montant || 0),
      date: new Date(item.date_transaction).toLocaleDateString('fr-FR')
    })) || [];

    return {
      ...monthData,
      recettes,
      depenses
    };
  };

  const monthDetails = selectedMonth ? getMonthDetails(selectedMonth.year, selectedMonth.month) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">{t('cash_management.title')}</h2>

        <Select value={selectedYear.toString()} onValueChange={(val) => { setSelectedYear(parseInt(val)); setStartIndex(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('rapports.start_date')} />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" disabled={!canGoBack} onClick={() => setStartIndex(startIndex - MONTHS_PER_VIEW)}>
            <ArrowLeft size={16} className="mr-1" /> {t('nav.dashboard')}
          </Button>
          <Button size="sm" variant="outline" disabled={!canGoForward} onClick={() => setStartIndex(startIndex + MONTHS_PER_VIEW)}>
            {t('nav.dashboard')} <ArrowRight size={16} className="ml-1" />
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
                <Tooltip formatter={(value, name) => [formatCurrency(value as number), name === 'inflow' ? t('recettes.title') : name === 'outflow' ? t('nav.expenses') : t('comptes.current_balance')]} />
                <Legend verticalAlign="top" height={36} formatter={(value) => value === 'inflow' ? t('recettes.title') : value === 'outflow' ? t('nav.expenses') : t('comptes.current_balance')} />
                <Bar yAxisId="left" dataKey="inflow" fill="#4F86F7" name={t('recettes.title')} barSize={20} />
                <Bar yAxisId="left" dataKey="outflow" fill="#FF6B6B" name={t('nav.expenses')} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="#2C7A7B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name={t('comptes.current_balance')} />
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
                  <p className="text-xs text-gray-500">{t('recettes.title')}</p>
                  <p className="text-md font-semibold text-blue-600">{formatCurrency(month.inflow)}</p>
                  <p className="text-xs text-gray-500 mt-2">{t('nav.expenses')}</p>
                  <p className="text-md font-semibold text-red-600">{formatCurrency(month.outflow)}</p>
                  <p className="text-xs text-gray-500 mt-2">{t('comptes.current_balance')}</p>
                  <p className={`text-md font-semibold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(month.balance)}</p>
                </CardContent>
              </Card>
            </SheetTrigger>
            
            <SheetContent className="w-[600px] sm:max-w-[600px]">
              {monthDetails && (
                <>
                  <SheetHeader>
                    <SheetTitle className="capitalize">
                      {t('rapports.preview')} - {monthDetails.month} {monthDetails.year}
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Month summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">{t('recettes.title')}</p>
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
                              <p className="text-xs text-gray-500">{t('nav.expenses')}</p>
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
                              <p className="text-xs text-gray-500">{t('comptes.current_balance')}</p>
                              <p className={`text-lg font-semibold ${monthDetails.inflow - monthDetails.outflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(monthDetails.inflow - monthDetails.outflow)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Income details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-600">{t('recettes.title')}</h3>
                      <div className="space-y-2">
                        {monthDetails.recettes.length > 0 ? monthDetails.recettes.map((recette) => (
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
                        )) : (
                          <div className="text-center text-gray-500 py-4">
                            {t('recettes.empty')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expense details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-600">{t('nav.expenses')}</h3>
                      <div className="space-y-2">
                        {monthDetails.depenses.length > 0 ? monthDetails.depenses.map((depense) => (
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
                        )) : (
                          <div className="text-center text-gray-500 py-4">
                            Aucune dépense ce mois-ci
                          </div>
                        )}
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
