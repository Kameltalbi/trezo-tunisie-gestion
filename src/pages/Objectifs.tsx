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
  const [selectedObjectif, setSelectedObjectif] = useState<Objectif | null>(null);
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

  const handleCardClick = (objectif: Objectif) => {
    setSelectedObjectif(objectif);
    setIsDetailSheetOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("objectifs.title")}</h1>
          <p className="text-muted-foreground">{t("objectifs.description")}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("objectifs.new_objective")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("objectifs.new_objective")}</DialogTitle>
              <DialogDescription>{t("objectifs.description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nom" className="text-right">{t("objectifs.name")}</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">{t("objectifs.type")}</Label>
                <Select onValueChange={handleTypeChange} value={formData.type}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("objectifs.type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encaissement">{t("objectifs.income_target")}</SelectItem>
                    <SelectItem value="reduction_depense">{t("objectifs.expense_reduction")}</SelectItem>
                    <SelectItem value="epargne">{t("objectifs.savings")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valeur_actuelle" className="text-right">{t("objectifs.current_value")}</Label>
                <Input
                  id="valeur_actuelle"
                  name="valeur_actuelle"
                  type="number"
                  value={formData.valeur_actuelle}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valeur_cible" className="text-right">{t("objectifs.target_value")}</Label>
                <Input
                  id="valeur_cible"
                  name="valeur_cible"
                  type="number"
                  value={formData.valeur_cible}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_debut" className="text-right">{t("objectifs.start_date")}</Label>
                <Input
                  id="date_debut"
                  name="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_fin" className="text-right">{t("objectifs.end_date")}</Label>
                <Input
                  id="date_fin"
                  name="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreateSubmit}>
                {t("objectifs.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {objectifs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t("objectifs.no_objectives")}</p>
          <p className="text-sm text-muted-foreground">{t("objectifs.add_first")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objectifs.map((objectif) => (
            <Card key={objectif.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick(objectif)}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{objectif.nom}</span>
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(objectif)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(objectif.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {objectif.type === "encaissement" 
                    ? t("objectifs.income_target")
                    : objectif.type === "reduction_depense"
                    ? t("objectifs.expense_reduction")
                    : t("objectifs.savings")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.current_value")}</div>
                    <div className="font-medium">{formatCurrency(objectif.valeur_actuelle)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.target_value")}</div>
                    <div className="font-medium">{formatCurrency(objectif.valeur_cible)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.progress")}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={calculateProgression(objectif)} className="h-2" />
                      <span className="text-sm font-medium">{calculateProgression(objectif)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {`${t("objectifs.end_date")}: ${formatDate(objectif.date_fin)}`}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("objectifs.edit_objective")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nom" className="text-right">{t("objectifs.name")}</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">{t("objectifs.type")}</Label>
              <Select onValueChange={handleTypeChange} value={formData.type}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("objectifs.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encaissement">{t("objectifs.income_target")}</SelectItem>
                  <SelectItem value="reduction_depense">{t("objectifs.expense_reduction")}</SelectItem>
                  <SelectItem value="epargne">{t("objectifs.savings")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valeur_actuelle" className="text-right">{t("objectifs.current_value")}</Label>
              <Input
                id="valeur_actuelle"
                name="valeur_actuelle"
                type="number"
                value={formData.valeur_actuelle}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valeur_cible" className="text-right">{t("objectifs.target_value")}</Label>
              <Input
                id="valeur_cible"
                name="valeur_cible"
                type="number"
                value={formData.valeur_cible}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_debut" className="text-right">{t("objectifs.start_date")}</Label>
              <Input
                id="date_debut"
                name="date_debut"
                type="date"
                value={formData.date_debut}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_fin" className="text-right">{t("objectifs.end_date")}</Label>
              <Input
                id="date_fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleEditSubmit}>
              {t("objectifs.update")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ObjectifDetailSheet
        objectif={selectedObjectif}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
      />
    </div>
  );
};

export default Objectifs;
