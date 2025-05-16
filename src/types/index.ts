
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
  userId: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
