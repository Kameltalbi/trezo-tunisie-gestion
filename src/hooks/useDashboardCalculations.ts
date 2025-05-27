
import React from 'react';
import type { 
  DashboardEncaissement, 
  DashboardDecaissement, 
  DashboardFluxTresorerie, 
  DashboardRevenu,
  ProcessedChartData,
  MonthlyBarData,
  MonthlyLineData
} from '@/types/dashboard';

// Helper function to assign colors to categories
function getColorForCategory(category: string): string {
  const colors = {
    'Loyer': '#FF8C42',
    'Salaires': '#22C55E', 
    'Services': '#3B82F6',
    'Ventes': '#3B82F6',
    'Consulting': '#FF8C42',
    'default': '#E5E7EB'
  };
  return colors[category as keyof typeof colors] || colors.default;
}

export const useDashboardCalculations = (
  encaissements: DashboardEncaissement[] | undefined,
  soldes: DashboardFluxTresorerie[] | undefined,
  depenses: DashboardDecaissement[] | undefined,
  revenus: DashboardRevenu[] | undefined
) => {
  // Transform encaissements data for bar chart
  const barData: MonthlyBarData[] = React.useMemo(() => {
    if (!encaissements) return [];
    
    const monthlyData = encaissements.reduce((acc: Record<string, MonthlyBarData>, item) => {
      const month = new Date(item.date_transaction).toLocaleDateString('fr-FR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, encaissements: 0 };
      }
      acc[month].encaissements += Number(item.montant || 0);
      return acc;
    }, {});
    
    return Object.values(monthlyData);
  }, [encaissements]);

  // Transform soldes data for line chart
  const lineData: MonthlyLineData[] = React.useMemo(() => {
    if (!soldes) return [];
    
    const monthlyData = soldes.reduce((acc: Record<string, MonthlyLineData>, item) => {
      const month = new Date(item.date_prevision).toLocaleDateString('fr-FR', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, solde: 0 };
      }
      acc[month].solde += Number(item.montant_realise || item.montant_prevu || 0);
      return acc;
    }, {});
    
    return Object.values(monthlyData);
  }, [soldes]);

  // Transform depenses data for pie chart
  const expensesData: ProcessedChartData[] = React.useMemo(() => {
    if (!depenses) return [];
    
    const categoryData = depenses.reduce((acc: Record<string, { name: string; amount: number; color: string }>, item) => {
      const category = item.categorie || 'Autres';
      if (!acc[category]) {
        acc[category] = { name: category, amount: 0, color: getColorForCategory(category) };
      }
      acc[category].amount += Number(item.montant || 0);
      return acc;
    }, {});
    
    const totalAmount = Object.values(categoryData).reduce((sum: number, item) => sum + Number(item.amount || 0), 0);
    
    return Object.values(categoryData).map((item): ProcessedChartData => ({
      ...item,
      amount: Number(item.amount || 0),
      value: totalAmount > 0 ? Math.round((Number(item.amount || 0) / totalAmount) * 100) : 0
    }));
  }, [depenses]);

  // Transform revenus data for pie chart
  const revenueData: ProcessedChartData[] = React.useMemo(() => {
    if (!revenus) return [];
    
    const sourceData = revenus.reduce((acc: Record<string, { name: string; amount: number; color: string }>, item) => {
      const source = item.categorie || 'Autres';
      if (!acc[source]) {
        acc[source] = { name: source, amount: 0, color: getColorForCategory(source) };
      }
      acc[source].amount += Number(item.montant || 0);
      return acc;
    }, {});
    
    const totalAmount = Object.values(sourceData).reduce((sum: number, item) => sum + Number(item.amount || 0), 0);
    
    return Object.values(sourceData).map((item): ProcessedChartData => ({
      ...item,
      amount: Number(item.amount || 0),
      value: totalAmount > 0 ? Math.round((Number(item.amount || 0) / totalAmount) * 100) : 0
    }));
  }, [revenus]);

  // Calculate dashboard summary
  const dashboardSummary = React.useMemo(() => {
    const totalEncaissements = encaissements?.reduce((sum: number, item) => sum + Number(item.montant || 0), 0) || 0;
    const totalDepenses = depenses?.reduce((sum: number, item) => sum + Number(item.montant || 0), 0) || 0;
    const soldeGlobal = totalEncaissements - totalDepenses;
    
    return {
      soldeGlobal,
      encaissementsPrevus: totalEncaissements,
      depensesAVenir: totalDepenses,
      facturesEnRetard: depenses?.filter((d) => String(d.statut) === 'en_retard').length || 0
    };
  }, [encaissements, depenses]);

  const totalExpenses = expensesData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    barData,
    lineData,
    expensesData,
    revenueData,
    dashboardSummary,
    totalExpenses
  };
};
