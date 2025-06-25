
export interface LocalUser {
  id: string;
  email: string;
  nom: string;
  full_name: string; // Added for compatibility
  nomEntreprise: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LocalSession {
  user: LocalUser;
  token: string;
  expiresAt: string;
}

export interface CompteBancaire {
  id: string;
  user_id: string;
  nom: string;
  type: 'courant' | 'epargne' | 'credit';
  banque: string;
  numeroCompte?: string;
  soldeInitial: number;
  soldeActuel: number;
  isActive: boolean;
  createdAt: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  compteId?: string;
  titre: string;
  montant: number;
  dateTransaction: string;
  categorie: string;
  sousCategorie?: string;
  description?: string;
  type: 'encaissement' | 'decaissement';
  statut: 'confirme' | 'en_attente' | 'annule';
  createdAt: string;
  created_at: string;
  updated_at: string;
}

export interface Entreprise {
  id: string;
  user_id: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  tva?: string;
  logoUrl?: string;
  createdAt: string;
  created_at: string;
  updated_at: string;
}

export interface Projet {
  id: string;
  user_id: string;
  nom: string;
  description?: string;
  budget?: number;
  dateDebut?: string;
  dateFin?: string;
  statut: 'en_cours' | 'termine' | 'suspendu';
  createdAt: string;
  created_at: string;
  updated_at: string;
}
