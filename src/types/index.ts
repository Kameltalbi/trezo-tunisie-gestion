
export interface User {
  id: string;
  email: string;
  nom?: string;
  role: "admin" | "utilisateur";
}

export interface Recette {
  id: string;
  titre: string;
  montant: number;
  date: string;
  categorie: string;
  sousCategorie?: string;
  recurrence?: "aucune" | "quotidienne" | "hebdomadaire" | "bimensuelle" | "mensuelle" | "trimestrielle" | "simestrielle" | "annuelle";
  userId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type AccountType = 'checking' | 'savings' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
}
