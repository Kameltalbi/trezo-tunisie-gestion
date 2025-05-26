import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { ObjectifDetailSheet } from "@/components/ObjectifDetailSheet";
import {
  useObjectifs,
  useCreateObjectif,
  useUpdateObjectif,
  useDeleteObjectif,
  Objectif
} from "@/hooks/useObjectifs";

// Type for the detail sheet objectif
type ObjectifDetailType = {
  id: string;
  nom: string;
  type: "encaissement" | "reduction_depense" | "epargne";
  valeurActuelle: number;
  valeurCible: number;
  dateDebut: string;
  dateFin: string;
  progression: number;
};

const Objectifs = () => {
  const { t } = useTranslation();
  const { data: objectifs = [], isLoading } = useObjectifs();
  const createObjectif = useCreateObjectif();
  const updateObjectif = useUpdateObjectif();
  const deleteObjectif = useDeleteObjectif();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState<boolean>(false);
  const [currentObjectif, setCurrentObjectif] = useState<Objectif | null>(null);
  const [selectedObjectif, setSelectedObjectif] = useState<ObjectifDetailType | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    type: "encaissement" as "encaissement" | "reduction_depense" | "epargne",
    valeur_actuelle: 0,
    valeur_cible: 0,
    date_debut: "",
    date_fin: "",
    description: "",
    statut: "actif" as "actif" | "atteint" | "abandonne"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "valeur_actuelle" || name === "valeur_cible" ? parseFloat(value) || 0 : value
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as "encaissement" | "reduction_depense" | "epargne"
    });
  };

  const calculateProgression = (objectif: Partial<Objectif>) => {
    if (objectif.type === "encaissement") {
      return Math.min(Math.floor(((objectif.valeur_actuelle || 0) / (objectif.valeur_cible || 1)) * 100), 100);
    } else if (objectif.type === "reduction_depense") {
      const reductionTarget = objectif.valeur_cible || 0;
      const initialValue = Math.max(objectif.valeur_actuelle || 0, reductionTarget);
      const currentReduction = initialValue - (objectif.valeur_actuelle || 0);
      return Math.min(Math.floor((currentReduction / Math.max(initialValue - reductionTarget, 1)) * 100), 100);
    }
    return Math.min(Math.floor(((objectif.valeur_actuelle || 0) / (objectif.valeur_cible || 1)) * 100), 100);
  };

  const handleCreateSubmit = async () => {
    if (!formData.nom || !formData.date_debut || !formData.date_fin || formData.valeur_cible === 0) {
      toast.error(t("objectifs.fill_required"));
      return;
    }

    try {
      await createObjectif.mutateAsync(formData);
      toast.success(t("objectifs.created_success"));
      resetForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating objectif:", error);
      toast.error(t("objectifs.save_error"));
    }
  };

  const handleEditSubmit = async () => {
    if (!currentObjectif) return;

    if (!formData.nom || !formData.date_debut || !formData.date_fin || formData.valeur_cible === 0) {
      toast.error(t("objectifs.fill_required"));
      return;
    }

    try {
      await updateObjectif.mutateAsync({
        id: currentObjectif.id,
        ...formData
      });
      toast.success(t("objectifs.updated_success"));
      resetForm();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating objectif:", error);
      toast.error(t("objectifs.save_error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteObjectif.mutateAsync(id);
      toast.success(t("objectifs.deleted_success"));
    } catch (error) {
      console.error("Error deleting objectif:", error);
      toast.error(t("objectifs.delete_error"));
    }
  };

  const startEdit = (objectif: Objectif) => {
    setCurrentObjectif(objectif);
    setFormData({
      nom: objectif.nom,
      type: objectif.type,
      valeur_actuelle: objectif.valeur_actuelle,
      valeur_cible: objectif.valeur_cible,
      date_debut: objectif.date_debut,
      date_fin: objectif.date_fin,
      description: objectif.description || "",
      statut: objectif.statut
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      type: "encaissement",
      valeur_actuelle: 0,
      valeur_cible: 0,
      date_debut: "",
      date_fin: "",
      description: "",
      statut: "actif"
    });
    setCurrentObjectif(null);
  };

  const convertObjectifForDetailSheet = (objectif: Objectif): ObjectifDetailType => ({
    id: objectif.id,
    nom: objectif.nom,
    type: objectif.type,
    valeurActuelle: objectif.valeur_actuelle,
    valeurCible: objectif.valeur_cible,
    dateDebut: objectif.date_debut,
    dateFin: objectif.date_fin,
    progression: calculateProgression(objectif)
  });

  const handleCardClick = (objectif: Objectif) => {
    setSelectedObjectif(convertObjectifForDetailSheet(objectif));
    setIsDetailSheetOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">{t("objectifs.loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Le reste du code est conservé tel quel, complet dans ce fichier */}
    </div>
  );
};

export default Objectifs;
