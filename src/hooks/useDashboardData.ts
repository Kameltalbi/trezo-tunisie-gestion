
import { useState, useEffect } from 'react';
import { localStorageService } from '@/services/localStorageService';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import type { 
  DashboardEncaissement, 
  DashboardDecaissement, 
  DashboardFluxTresorerie, 
  DashboardRevenu
} from '@/types/dashboard';

export const useDashboardData = () => {
  const { user } = useLocalAuth();
  const [encaissements, setEncaissements] = useState<{ data: DashboardEncaissement[] | undefined; isLoading: boolean }>({ data: undefined, isLoading: true });
  const [soldes, setSoldes] = useState<{ data: DashboardFluxTresorerie[] | undefined; isLoading: boolean }>({ data: undefined, isLoading: true });
  const [depenses, setDepenses] = useState<{ data: DashboardDecaissement[] | undefined; isLoading: boolean }>({ data: undefined, isLoading: true });
  const [revenus, setRevenus] = useState<{ data: DashboardRevenu[] | undefined; isLoading: boolean }>({ data: undefined, isLoading: true });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Récupérer les transactions (encaissements et décaissements)
        const transactions = localStorageService.getTransactions();
        const fiveMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 5));
        const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));

        // Filtrer les encaissements des 5 derniers mois
        const encaissementsData = transactions
          .filter(t => t.type === 'encaissement' && new Date(t.dateTransaction) >= fiveMonthsAgo)
          .map(t => ({
            id: t.id,
            montant: t.montant,
            date_transaction: t.dateTransaction,
            categorie: t.categorie || 'Autres',
            user_id: user.id
          } as DashboardEncaissement));

        // Filtrer les décaissements du dernier mois
        const depensesData = transactions
          .filter(t => t.type === 'decaissement' && new Date(t.dateTransaction) >= oneMonthAgo)
          .map(t => ({
            id: t.id,
            montant: t.montant,
            date_transaction: t.dateTransaction,
            categorie: t.categorie || 'Autres',
            statut: t.statut || 'paye',
            user_id: user.id
          } as DashboardDecaissement));

        // Créer des données de flux de trésorerie simulées basées sur les comptes
        const comptes = localStorageService.getComptes();
        const soldesData = comptes.map((compte, index) => ({
          id: `flux-${compte.id}`,
          montant_prevu: compte.soldeActuel,
          montant_realise: compte.soldeActuel,
          date_prevision: new Date(new Date().setMonth(new Date().getMonth() - index)).toISOString(),
          user_id: user.id
        } as DashboardFluxTresorerie));

        // Les revenus sont les mêmes que les encaissements du dernier mois
        const revenusData = transactions
          .filter(t => t.type === 'encaissement' && new Date(t.dateTransaction) >= oneMonthAgo)
          .map(t => ({
            id: t.id,
            montant: t.montant,
            date_transaction: t.dateTransaction,
            categorie: t.categorie || 'Autres',
            user_id: user.id
          } as DashboardRevenu));

        // Mettre à jour les états
        setEncaissements({ data: encaissementsData, isLoading: false });
        setSoldes({ data: soldesData, isLoading: false });
        setDepenses({ data: depensesData, isLoading: false });
        setRevenus({ data: revenusData, isLoading: false });

      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard:', error);
        setEncaissements({ data: [], isLoading: false });
        setSoldes({ data: [], isLoading: false });
        setDepenses({ data: [], isLoading: false });
        setRevenus({ data: [], isLoading: false });
      }
    };

    loadData();
  }, [user]);

  return {
    encaissements,
    soldes,
    depenses,
    revenus,
  };
};
