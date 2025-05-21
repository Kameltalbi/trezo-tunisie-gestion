
export type Monnaie = "TND" | "EUR" | "USD" | "XOF";
export type Langue = "fr" | "en";

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: string;
}
