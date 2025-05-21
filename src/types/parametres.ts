

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

