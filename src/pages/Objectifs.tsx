
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Objectif } from "@/types/parametres";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

// Mock data for objectives
const mockObjectifs: Objectif[] = [
  {
    id: "1",
    nom: "Augmentation du chiffre d'affaires",
    type: "encaissement",
    valeurActuelle: 15000,
    valeurCible: 25000,
    dateDebut: "2025-01-01",
    dateFin: "2025-12-31",
    progression: 60
  },
  {
    id: "2",
    nom: "Réduction des frais généraux",
    type: "reduction_depense",
    valeurActuelle: 3000,
    valeurCible: 1500,
    dateDebut: "2025-02-01",
    dateFin: "2025-06-30",
    progression: 40
  }
];

const Objectifs = () => {
  const { t } = useTranslation();
  const [objectifs, setObjectifs] = useState<Objectif[]>(mockObjectifs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentObjectif, setCurrentObjectif] = useState<Objectif | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    type: "encaissement",
    valeurActuelle: 0,
    valeurCible: 0,
    dateDebut: "",
    dateFin: ""
  });

  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "valeurActuelle" || name === "valeurCible" ? parseFloat(value) : value
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value as "encaissement" | "reduction_depense"
    });
  };

  // Form submit handler for creating new objective
  const handleCreateSubmit = () => {
    // Validation
    if (!formData.nom || !formData.dateDebut || !formData.dateFin || formData.valeurCible === 0) {
      toast.error(t("objectifs.fill_required"));
      return;
    }

    // Calculate progression
    let progression = 0;
    if (formData.type === "encaissement") {
      progression = Math.floor((formData.valeurActuelle / formData.valeurCible) * 100);
    } else {
      const reductionTarget = formData.valeurCible;
      const initialValue = Math.max(formData.valeurActuelle, formData.valeurCible);
      const currentReduction = initialValue - formData.valeurActuelle;
      progression = Math.floor((currentReduction / (initialValue - reductionTarget)) * 100);
    }

    // Create new objective
    const newObjectif: Objectif = {
      id: Date.now().toString(),
      nom: formData.nom,
      type: formData.type as "encaissement" | "reduction_depense",
      valeurActuelle: formData.valeurActuelle,
      valeurCible: formData.valeurCible,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      progression: Math.min(progression, 100)
    };

    // Add to state
    setObjectifs([...objectifs, newObjectif]);
    toast.success(t("objectifs.created_success"));
    resetForm();
    setIsCreateDialogOpen(false);
  };

  // Form submit handler for editing objective
  const handleEditSubmit = () => {
    if (!currentObjectif) return;

    // Validation
    if (!formData.nom || !formData.dateDebut || !formData.dateFin || formData.valeurCible === 0) {
      toast.error(t("objectifs.fill_required"));
      return;
    }

    // Calculate progression
    let progression = 0;
    if (formData.type === "encaissement") {
      progression = Math.floor((formData.valeurActuelle / formData.valeurCible) * 100);
    } else {
      const reductionTarget = formData.valeurCible;
      const initialValue = Math.max(formData.valeurActuelle, formData.valeurCible);
      const currentReduction = initialValue - formData.valeurActuelle;
      progression = Math.floor((currentReduction / (initialValue - reductionTarget)) * 100);
    }

    // Update objective
    const updatedObjectifs = objectifs.map(obj => 
      obj.id === currentObjectif.id ? 
        {
          ...obj,
          nom: formData.nom,
          type: formData.type as "encaissement" | "reduction_depense",
          valeurActuelle: formData.valeurActuelle,
          valeurCible: formData.valeurCible,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          progression: Math.min(progression, 100)
        } : 
        obj
    );

    // Update state
    setObjectifs(updatedObjectifs);
    toast.success(t("objectifs.updated_success"));
    resetForm();
    setIsEditDialogOpen(false);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    const updatedObjectifs = objectifs.filter(obj => obj.id !== id);
    setObjectifs(updatedObjectifs);
    toast.success(t("objectifs.deleted_success"));
  };

  // Start editing objective
  const startEdit = (objectif: Objectif) => {
    setCurrentObjectif(objectif);
    setFormData({
      nom: objectif.nom,
      type: objectif.type,
      valeurActuelle: objectif.valeurActuelle,
      valeurCible: objectif.valeurCible,
      dateDebut: objectif.dateDebut,
      dateFin: objectif.dateFin
    });
    setIsEditDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nom: "",
      type: "encaissement",
      valeurActuelle: 0,
      valeurCible: 0,
      dateDebut: "",
      dateFin: ""
    });
    setCurrentObjectif(null);
  };

  // Get progress color based on progression value
  const getProgressColor = (progression: number): string => {
    if (progression < 25) return "bg-red-500";
    if (progression < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

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
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("objectifs.new_objective")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
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
                <Select 
                  value={formData.type}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={t("objectifs.type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encaissement">{t("objectifs.income_target")}</SelectItem>
                    <SelectItem value="reduction_depense">{t("objectifs.expense_reduction")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valeurActuelle" className="text-right">{t("objectifs.current_value")}</Label>
                <Input 
                  id="valeurActuelle" 
                  name="valeurActuelle"
                  type="number" 
                  value={formData.valeurActuelle} 
                  onChange={handleChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valeurCible" className="text-right">{t("objectifs.target_value")}</Label>
                <Input 
                  id="valeurCible" 
                  name="valeurCible"
                  type="number" 
                  value={formData.valeurCible} 
                  onChange={handleChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateDebut" className="text-right">{t("objectifs.start_date")}</Label>
                <Input 
                  id="dateDebut" 
                  name="dateDebut"
                  type="date" 
                  value={formData.dateDebut} 
                  onChange={handleChange} 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateFin" className="text-right">{t("objectifs.end_date")}</Label>
                <Input 
                  id="dateFin" 
                  name="dateFin"
                  type="date" 
                  value={formData.dateFin} 
                  onChange={handleChange} 
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}>
                {t("objectifs.cancel")}
              </Button>
              <Button type="button" onClick={handleCreateSubmit}>
                {t("objectifs.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("objectifs.edit_objective")}</DialogTitle>
            <DialogDescription>{t("objectifs.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nom" className="text-right">{t("objectifs.name")}</Label>
              <Input 
                id="edit-nom" 
                name="nom" 
                value={formData.nom} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">{t("objectifs.type")}</Label>
              <Select 
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("objectifs.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="encaissement">{t("objectifs.income_target")}</SelectItem>
                  <SelectItem value="reduction_depense">{t("objectifs.expense_reduction")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-valeurActuelle" className="text-right">{t("objectifs.current_value")}</Label>
              <Input 
                id="edit-valeurActuelle" 
                name="valeurActuelle"
                type="number" 
                value={formData.valeurActuelle} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-valeurCible" className="text-right">{t("objectifs.target_value")}</Label>
              <Input 
                id="edit-valeurCible" 
                name="valeurCible"
                type="number" 
                value={formData.valeurCible} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dateDebut" className="text-right">{t("objectifs.start_date")}</Label>
              <Input 
                id="edit-dateDebut" 
                name="dateDebut"
                type="date" 
                value={formData.dateDebut} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dateFin" className="text-right">{t("objectifs.end_date")}</Label>
              <Input 
                id="edit-dateFin" 
                name="dateFin"
                type="date" 
                value={formData.dateFin} 
                onChange={handleChange} 
                className="col-span-3" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              {t("objectifs.cancel")}
            </Button>
            <Button type="button" onClick={handleEditSubmit}>
              {t("objectifs.update")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Objectives list */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {objectifs.length > 0 ? (
          objectifs.map((objectif) => (
            <Card key={objectif.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{objectif.nom}</span>
                  <div className="flex space-x-2">
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
                    : t("objectifs.expense_reduction")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.current_value")}</div>
                    <div className="font-medium">{formatCurrency(objectif.valeurActuelle)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.target_value")}</div>
                    <div className="font-medium">{formatCurrency(objectif.valeurCible)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t("objectifs.progress")}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={objectif.progression} className="h-2" />
                      <span className="text-sm font-medium">{objectif.progression}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                {`${t("objectifs.end_date")}: ${new Date(objectif.dateFin).toLocaleDateString()}`}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center py-10">
            <h3 className="text-lg font-medium">{t("objectifs.no_objectives")}</h3>
            <p className="text-muted-foreground">{t("objectifs.add_first")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Objectifs;
