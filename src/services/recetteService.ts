
import { Recette } from "../types";

// Données simulées - remplacées par des appels Supabase dans une implémentation réelle
const MOCK_RECETTES: Recette[] = [
  {
    id: "rec-1",
    titre: "Paiement client A",
    montant: 1250.500,
    date: "2024-05-15",
    categorie: "Services",
    sousCategorie: "Conseil",
    recurrence: "mensuelle",
    userId: "user-1"
  },
  {
    id: "rec-2",
    titre: "Vente produit B",
    montant: 730.250,
    date: "2024-05-12",
    categorie: "Ventes",
    sousCategorie: "Produits digitaux",
    recurrence: "aucune",
    userId: "user-1"
  },
  {
    id: "rec-3",
    titre: "Remboursement",
    montant: 450.000,
    date: "2024-05-08",
    categorie: "Divers",
    sousCategorie: "Remboursement fiscale",
    recurrence: "annuelle",
    userId: "user-1"
  },
  {
    id: "rec-4",
    titre: "Contrat mensuel",
    montant: 2000.000,
    date: "2024-05-01",
    categorie: "Abonnements",
    sousCategorie: "Entreprises",
    recurrence: "mensuelle",
    userId: "user-1"
  }
];

// Gestion locale des recettes
let recettes = [...MOCK_RECETTES];

// Génère un ID unique simple
const generateId = () => `rec-${Date.now()}`;

// Récupère toutes les recettes d'un utilisateur
export const getRecettesForUser = async (userId: string): Promise<Recette[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulation délai API
  return recettes.filter(recette => recette.userId === userId);
};

// Ajoute une nouvelle recette
export const addRecette = async (recette: Omit<Recette, "id">): Promise<Recette> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai API
  
  const newRecette: Recette = {
    ...recette,
    id: generateId(),
  };
  
  recettes.push(newRecette);
  return newRecette;
};

// Met à jour une recette existante
export const updateRecette = async (id: string, data: Partial<Recette>): Promise<Recette> => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai API

  const index = recettes.findIndex(recette => recette.id === id);
  
  if (index === -1) {
    throw new Error("Recette non trouvée");
  }
  
  const updatedRecette = {
    ...recettes[index],
    ...data,
  };
  
  recettes[index] = updatedRecette;
  return updatedRecette;
};

// Supprime une recette
export const deleteRecette = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulation délai API

  const index = recettes.findIndex(recette => recette.id === id);
  
  if (index === -1) {
    throw new Error("Recette non trouvée");
  }
  
  recettes.splice(index, 1);
};

// Catégories disponibles
export const CATEGORIES = [
  "Services",
  "Ventes",
  "Abonnements",
  "Remboursement",
  "Divers"
];

// Sous-catégories disponibles par catégorie
export const SOUS_CATEGORIES: Record<string, string[]> = {
  "Services": ["Conseil", "Prestation", "Formation", "Support technique"],
  "Ventes": ["Produits physiques", "Produits digitaux", "Licences", "Abonnements"],
  "Abonnements": ["Particuliers", "Entreprises", "Startups", "Grands comptes"],
  "Remboursement": ["Remboursement fiscale", "Remboursement client", "Autres remboursements"],
  "Divers": ["Don", "Intérêt", "Autre"]
};

// Options de récurrence
export const RECURRENCE_OPTIONS = [
  { value: "aucune", label: "Aucune" },
  { value: "quotidienne", label: "Quotidienne" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuelle", label: "Mensuelle" },
  { value: "trimestrielle", label: "Trimestrielle" },
  { value: "annuelle", label: "Annuelle" }
];

// Formater le montant avec 3 décimales et le symbole TND
export const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(montant);
};
