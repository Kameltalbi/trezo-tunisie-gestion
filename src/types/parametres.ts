export interface Devise {
  id: string;
  nom: string;
  symbole: string;
  decimales: number;
  separateur: string;
}

export interface Langue {
  id: string;
  nom: string;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: string;
}

export interface Periode {
  id: string;
  debut: string;
  fin: string;
}

export interface Permission {
  id: string;
  page: string;
  description: string;
  admin: boolean;
  editeur: boolean;
  collaborateur: boolean;
}

export interface Projet {
  id: string;
  nom: string;
  description: string;
  budgetPrevu: number;
  budgetConsomme: number;
  dateDebut: string;
  dateFin: string | null;
  statut: 'actif' | 'termine' | 'en_attente';
  encaissements: string[]; // IDs of related income entries
  decaissements: string[]; // IDs of related expense entries
}
