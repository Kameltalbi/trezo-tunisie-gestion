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
  role: "Admin" | "Collaborateur" | "Consultant";
}

export interface Periode {
  id: string;
  debut: string;
  fin: string;
}
