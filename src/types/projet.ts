
export interface Projet {
  id: string;
  nom: string;
  description?: string;
  budgetPrevu: number;
  budgetConsomme: number;
  dateDebut: string;
  dateFin?: string | null;
  statut: 'actif' | 'termine' | 'en_attente';
  encaissements: string[];
  decaissements: string[];
}
