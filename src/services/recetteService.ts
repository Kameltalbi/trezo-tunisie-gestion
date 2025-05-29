
import { Recette } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Récupère toutes les recettes d'un utilisateur depuis Supabase
export const getRecettesForUser = async (userId: string): Promise<Recette[]> => {
  const { data, error } = await supabase
    .from('encaissements')
    .select('*')
    .eq('user_id', userId)
    .order('date_transaction', { ascending: false });

  if (error) {
    throw new Error(`Erreur lors de la récupération des recettes: ${error.message}`);
  }

  // Transformation des données pour correspondre au type Recette
  return data.map(item => ({
    id: item.id,
    titre: item.titre,
    montant: Number(item.montant),
    date: item.date_transaction,
    categorie: item.categorie,
    sousCategorie: item.sous_categorie || '',
    recurrence: item.recurrence || 'aucune',
    userId: item.user_id
  }));
};

// Ajoute une nouvelle recette dans Supabase
export const addRecette = async (recette: Omit<Recette, "id">): Promise<Recette> => {
  const { data, error } = await supabase
    .from('encaissements')
    .insert({
      titre: recette.titre,
      montant: recette.montant,
      date_transaction: recette.date,
      categorie: recette.categorie,
      sous_categorie: recette.sousCategorie,
      recurrence: recette.recurrence,
      user_id: recette.userId,
      statut: 'confirme'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de l'ajout de la recette: ${error.message}`);
  }

  return {
    id: data.id,
    titre: data.titre,
    montant: Number(data.montant),
    date: data.date_transaction,
    categorie: data.categorie,
    sousCategorie: data.sous_categorie || '',
    recurrence: data.recurrence || 'aucune',
    userId: data.user_id
  };
};

// Met à jour une recette existante dans Supabase
export const updateRecette = async (id: string, recetteData: Partial<Recette>): Promise<Recette> => {
  const updateData: any = {};
  
  if (recetteData.titre) updateData.titre = recetteData.titre;
  if (recetteData.montant) updateData.montant = recetteData.montant;
  if (recetteData.date) updateData.date_transaction = recetteData.date;
  if (recetteData.categorie) updateData.categorie = recetteData.categorie;
  if (recetteData.sousCategorie) updateData.sous_categorie = recetteData.sousCategorie;
  if (recetteData.recurrence) updateData.recurrence = recetteData.recurrence;

  const { data, error } = await supabase
    .from('encaissements')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la recette: ${error.message}`);
  }

  return {
    id: data.id,
    titre: data.titre,
    montant: Number(data.montant),
    date: data.date_transaction,
    categorie: data.categorie,
    sousCategorie: data.sous_categorie || '',
    recurrence: data.recurrence || 'aucune',
    userId: data.user_id
  };
};

// Supprime une recette de Supabase
export const deleteRecette = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('encaissements')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Erreur lors de la suppression de la recette: ${error.message}`);
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
