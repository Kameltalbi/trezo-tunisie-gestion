
export type Monnaie = "TND" | "EUR" | "USD" | "XOF";
export type Langue = "fr" | "en";

export interface Devise {
  id: string;
  nom: string;
  symbole: string;
  decimales: number;
  separateur: string;
}

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: string;
}
