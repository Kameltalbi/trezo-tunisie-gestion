
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboardCalculations } from '@/hooks/useDashboardCalculations';
import { Loader2 } from 'lucide-react';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import EncaissementsChart from '@/components/dashboard/EncaissementsChart';
import SoldeChart from '@/components/dashboard/SoldeChart';
import DepensesChart from '@/components/dashboard/DepensesChart';
import RevenusChart from '@/components/dashboard/RevenusChart';
import type { 
  DashboardEncaissement, 
  DashboardDecaissement, 
  DashboardFluxTresorerie, 
  DashboardRevenu
} from '@/types/dashboard';

const DashboardPage: React.FC = () => {
  const { encaissements, soldes, depenses, revenus } = useDashboardData();

  const {
    barData,
    lineData,
    expensesData,
    revenueData,
    dashboardSummary,
    totalExpenses
  } = useDashboardCalculations(
    encaissements.data as DashboardEncaissement[] | undefined,
    soldes.data as DashboardFluxTresorerie[] | undefined,
    depenses.data as DashboardDecaissement[] | undefined,
    revenus.data as DashboardRevenu[] | undefined
  );

  const chartConfig = {
    loyer: {
      label: "Loyer",
      color: "#FF8C42",
    },
    salaires: {
      label: "Salaires", 
      color: "#22C55E",
    },
    services: {
      label: "Services",
      color: "#3B82F6",
    },
    autres: {
      label: "Autres",
      color: "#E5E7EB",
    },
  };

  if (encaissements.isLoading || soldes.isLoading || depenses.isLoading || revenus.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const cards = [
    { 
      title: 'Solde global', 
      value: `${dashboardSummary.soldeGlobal >= 0 ? '+' : ''}${dashboardSummary.soldeGlobal.toLocaleString('fr-TN')} DT`, 
      color: dashboardSummary.soldeGlobal >= 0 ? 'text-green-600' : 'text-red-600'
    },
    { 
      title: 'Encaissements prévus', 
      value: `${dashboardSummary.encaissementsPrevus.toLocaleString('fr-TN')} DT`, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Dépenses à venir', 
      value: `${dashboardSummary.depensesAVenir.toLocaleString('fr-TN')} DT`, 
      color: 'text-red-600' 
    },
    { 
      title: 'Factures en retard', 
      value: dashboardSummary.facturesEnRetard.toString(), 
      color: 'text-orange-600' 
    },
    { title: 'Clients actifs', value: '35', color: 'text-indigo-600' },
    { title: 'Fournisseurs actifs', value: '22', color: 'text-yellow-600' },
    { title: 'Dettes restantes', value: '15 000 DT', color: 'text-rose-600' },
    { title: 'Projets en cours', value: '7', color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tableau de bord</h1>

      <DashboardSummaryCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EncaissementsChart data={barData} />
        <SoldeChart data={lineData} />
        <DepensesChart 
          data={expensesData} 
          totalExpenses={totalExpenses} 
          chartConfig={chartConfig} 
        />
        <RevenusChart data={revenueData} />
      </div>
    </div>
  );
};

export default DashboardPage;
