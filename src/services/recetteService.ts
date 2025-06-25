
import { Recette } from "../types";

// Type pour la récurrence
type RecurrenceType = "aucune" | "quotidienne" | "hebdomadaire" | "bimensuelle" | "mensuelle" | "trimestrielle" | "simestrielle" | "annuelle";

// Clé pour le localStorage
const RECETTES_STORAGE_KEY = 'trezo_recettes';

// Récupère toutes les recettes d'un utilisateur depuis le localStorage
export const getRecettesForUser = async (userId: string): Promise<Recette[]> => {
  try {
    const stored = localStorage.getItem(RECETTES_STORAGE_KEY);
    const allRecettes = stored ? JSON.parse(stored) : [];
    
    // Filtrer par utilisateur
    return allRecettes.filter((recette: Recette) => recette.userId === userId);
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    return [];
  }
};

// Ajoute une nouvelle recette dans le localStorage
export const addRecette = async (recette: Omit<Recette, "id">): Promise<Recette> => {
  try {
    const stored = localStorage.getItem(RECETTES_STORAGE_KEY);
    const allRecettes = stored ? JSON.parse(stored) : [];
    
    const newRecette: Recette = {
      ...recette,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    allRecettes.push(newRecette);
    localStorage.setItem(RECETTES_STORAGE_KEY, JSON.stringify(allRecettes));
    
    return newRecette;
  } catch (error) {
    throw new Error(`Erreur lors de l'ajout de la recette: ${error}`);
  }
};

// Met à jour une recette existante dans le localStorage
export const updateRecette = async (id: string, recetteData: Partial<Recette>): Promise<Recette> => {
  try {
    const stored = localStorage.getItem(RECETTES_STORAGE_KEY);
    const allRecettes = stored ? JSON.parse(stored) : [];
    
    const index = allRecettes.findIndex((r: Recette) => r.id === id);
    if (index === -1) {
      throw new Error('Recette non trouvée');
    }
    
    allRecettes[index] = { ...allRecettes[index], ...recetteData };
    localStorage.setItem(RECETTES_STORAGE_KEY, JSON.stringify(allRecettes));
    
    return allRecettes[index];
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de la recette: ${error}`);
  }
};

// Supprime une recette du localStorage
export const deleteRecette = async (id: string): Promise<void> => {
  try {
    const stored = localStorage.getItem(RECETTES_STORAGE_KEY);
    const allRecettes = stored ? JSON.parse(stored) : [];
    
    const filteredRecettes = allRecettes.filter((r: Recette) => r.id !== id);
    localStorage.setItem(RECETTES_STORAGE_KEY, JSON.stringify(filteredRecettes));
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de la recette: ${error}`);
  }
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
  { value: "bimensuelle", label: "Bimensuelle" },
  { value: "mensuelle", label: "Mensuelle" },
  { value: "trimestrielle", label: "Trimestrielle" },
  { value: "simestrielle", label: "Simestrielle" },
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
