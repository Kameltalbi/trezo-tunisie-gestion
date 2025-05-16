
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Recettes = () => {
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
          toast.error("Erreur de chargement des recettes");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadRecettes();
  }, [user]);
  
  // Filtrage des recettes en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRecettes(recettes);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = recettes.filter(
        (recette) =>
          recette.titre.toLowerCase().includes(lowercaseSearch) ||
          recette.categorie.toLowerCase().includes(lowercaseSearch)
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
      toast.success("Recette ajoutée avec succès");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la recette");
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
      toast.success("Recette mise à jour avec succès");
      setIsDialogOpen(false);
      setEditingRecette(null);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la recette");
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
      toast.success("Recette supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la recette");
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
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };
  
  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recettes</h1>
            <p className="text-gray-500">
              Gérez vos recettes et suivez vos revenus
            </p>
          </div>
          <Button onClick={openAddForm} className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Nouvelle recette</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total des recettes
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
            <h2 className="text-lg font-medium">Liste des recettes</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
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
              <h3 className="text-lg font-medium mb-1">Aucune recette trouvée</h3>
              <p className="text-slate-500 mb-4 max-w-md">
                {searchTerm ? "Aucun résultat ne correspond à votre recherche." : "Commencez par ajouter votre première recette."}
              </p>
              {!searchTerm && (
                <Button onClick={openAddForm} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter une recette
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Montant (TND)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecettes.map((recette) => (
                    <TableRow key={recette.id}>
                      <TableCell className="font-medium">{recette.titre}</TableCell>
                      <TableCell>{formatMontant(recette.montant)}</TableCell>
                      <TableCell>{formatDate(recette.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {recette.categorie}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(recette)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteId(recette.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
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
              {editingRecette ? "Modifier la recette" : "Ajouter une recette"}
            </DialogTitle>
            <DialogDescription>
              {editingRecette
                ? "Modifiez les détails de votre recette ci-dessous."
                : "Ajoutez les détails de votre nouvelle recette."}
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
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette recette sera
              définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRecette}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Recettes;
