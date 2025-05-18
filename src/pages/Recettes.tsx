
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Recette } from "../types";
import {
  getRecettesForUser,
  addRecette,
  updateRecette,
  deleteRecette,
  formatMontant,
} from "../services/recetteService";
import RecetteForm from "../components/RecetteForm";
import Layout from "../components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Coins,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  Info,
  Search,
  Repeat,
  List,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Recettes = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [filteredRecettes, setFilteredRecettes] = useState<Recette[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRecette, setEditingRecette] = useState<Recette | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Chargement initial des recettes
  useEffect(() => {
    const loadRecettes = async () => {
      if (user) {
        try {
          const data = await getRecettesForUser(user.id);
          setRecettes(data);
          setFilteredRecettes(data);
        } catch (error) {
          toast.error(t("recettes.error_loading"));
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadRecettes();
  }, [user, t]);
  
  // Filtrage des recettes en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecettes(recettes);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = recettes.filter(
        (recette) =>
          recette.titre.toLowerCase().includes(lowercaseSearch) ||
          recette.categorie.toLowerCase().includes(lowercaseSearch) ||
          (recette.sousCategorie && recette.sousCategorie.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredRecettes(filtered);
    }
  }, [searchTerm, recettes]);
  
  // Calculer le total des recettes
  const total = filteredRecettes.reduce((sum, recette) => sum + recette.montant, 0);
  
  // Gérer l'ajout d'une nouvelle recette
  const handleAddRecette = async (data: Omit<Recette, "id" | "userId">) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const newRecette = await addRecette({
        ...data,
        userId: user.id
      });
      
      setRecettes([newRecette, ...recettes]);
      toast.success(t("recettes.add_success"));
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(t("recettes.error_adding"));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gérer la mise à jour d'une recette
  const handleUpdateRecette = async (data: Omit<Recette, "id" | "userId">) => {
    if (!editingRecette) return;
    
    setIsSubmitting(true);
    try {
      const updatedRecette = await updateRecette(editingRecette.id, data);
      
      setRecettes(recettes.map(r => r.id === updatedRecette.id ? updatedRecette : r));
      toast.success(t("recettes.modify_success"));
      setIsDialogOpen(false);
      setEditingRecette(null);
    } catch (error) {
      toast.error(t("recettes.error_updating"));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gérer la suppression d'une recette
  const handleDeleteRecette = async () => {
    if (!deleteId) return;
    
    try {
      await deleteRecette(deleteId);
      setRecettes(recettes.filter(r => r.id !== deleteId));
      toast.success(t("recettes.delete_success"));
    } catch (error) {
      toast.error(t("recettes.error_deleting"));
    } finally {
      setDeleteId(null);
    }
  };
  
  // Ouvrir le formulaire d'édition
  const openEditForm = (recette: Recette) => {
    setEditingRecette(recette);
    setIsDialogOpen(true);
  };
  
  // Ouvrir le formulaire d'ajout
  const openAddForm = () => {
    setEditingRecette(null);
    setIsDialogOpen(true);
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(
      i18n.language === 'en' ? 'en-US' : 'fr-FR'
    ).format(date);
  };
  
  // Rendre une icône pour la récurrence
  const renderRecurrenceIcon = (recurrence?: string) => {
    if (!recurrence || recurrence === "aucune") return null;
    
    return (
      <span title={t(`recurrence.${recurrence}`)}>
        <Repeat size={14} className="inline text-blue-500 ml-1" />
      </span>
    );
  };
  
  const { i18n } = useTranslation();
  
  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t("recettes.title")}</h1>
            <p className="text-gray-500">
              {t("recettes.description")}
            </p>
          </div>
          <Button onClick={openAddForm} className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>{t("recettes.new")}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("recettes.total")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Coins className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="text-2xl font-bold">{formatMontant(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b">
            <h2 className="text-lg font-medium">{t("recettes.list_title")}</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("recettes.search")}
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredRecettes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-slate-100 p-3 rounded-full mb-4">
                <Info className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">{t("recettes.empty")}</h3>
              <p className="text-slate-500 mb-4 max-w-md">
                {searchTerm ? t("recettes.empty_search") : t("recettes.start_add")}
              </p>
              {!searchTerm && (
                <Button onClick={openAddForm} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("recettes.add")}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("recette_form.title")}</TableHead>
                    <TableHead>{t("recette_form.amount")}</TableHead>
                    <TableHead>{t("recette_form.date")}</TableHead>
                    <TableHead>{t("recette_form.category")} / {t("recette_form.subcategory")}</TableHead>
                    <TableHead>{t("recette_form.recurrence")}</TableHead>
                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecettes.map((recette) => (
                    <TableRow key={recette.id}>
                      <TableCell className="font-medium">{recette.titre}</TableCell>
                      <TableCell>{formatMontant(recette.montant)}</TableCell>
                      <TableCell>{formatDate(recette.date)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <Badge variant="outline" className="capitalize w-fit">
                            {t(`categories.${recette.categorie}`)}
                          </Badge>
                          {recette.sousCategorie && (
                            <Badge variant="secondary" className="capitalize text-xs w-fit">
                              {t(`subcategories.${recette.sousCategorie}`)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {recette.recurrence && recette.recurrence !== "aucune" ? (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            {t(`recurrence.${recette.recurrence}`)}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(recette)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">{t("recettes.edit")}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteId(recette.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t("delete_confirmation.confirm")}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter/modifier une recette */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRecette ? t("recettes.edit") : t("recettes.add")}
            </DialogTitle>
            <DialogDescription>
              {editingRecette
                ? t("recettes.modify_details")
                : t("recettes.add_details")}
            </DialogDescription>
          </DialogHeader>
          <RecetteForm
            recette={editingRecette || undefined}
            onSubmit={editingRecette ? handleUpdateRecette : handleAddRecette}
            isSubmitting={isSubmitting}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete_confirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_confirmation.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("delete_confirmation.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecette}
              className="bg-red-500 hover:bg-red-600"
            >
              {t("delete_confirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Recettes;
