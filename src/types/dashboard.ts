
export interface DashboardEncaissement {
  id: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  user_id: string;
}

export interface DashboardDecaissement {
  id: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  statut: string;
  user_id: string;
}

export interface DashboardFluxTresorerie {
  id: string;
  montant_prevu: number;
  montant_realise: number | null;
  date_prevision: string;
  user_id: string;
}

export interface DashboardRevenu {
  id: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  user_id: string;
}

export interface ProcessedChartData {
  name: string;
  amount: number;
  color: string;
  value: number;
}

export interface MonthlyBarData {
  month: string;
  encaissements: number;
}

export interface MonthlyLineData {
  month: string;
  solde: number;
}
