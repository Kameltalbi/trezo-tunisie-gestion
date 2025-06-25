
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
  numero_compte?: string;
  solde_initial: number;
  solde_actuel: number;
  devise_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  compte_id?: string;
  titre: string;
  montant: number;
  date_transaction: string;
  categorie: string;
  sous_categorie?: string;
  description?: string;
  type: 'encaissement' | 'decaissement';
  statut: 'confirme' | 'en_attente' | 'annule';
  source?: string;
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
