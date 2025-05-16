
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recette } from "../types";
import { CATEGORIES } from "../services/recetteService";
import { Loader2 } from "lucide-react";

interface RecetteFormProps {
  recette?: Recette;
  onSubmit: (data: Omit<Recette, "id" | "userId">) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

interface FormValues {
  titre: string;
  montant: string;
  date: string;
  categorie: string;
}

const RecetteForm = ({ recette, onSubmit, isSubmitting, onCancel }: RecetteFormProps) => {
  const [selectedCategorie, setSelectedCategorie] = useState<string>(recette?.categorie || CATEGORIES[0]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      titre: recette?.titre || '',
      montant: recette ? String(recette.montant) : '',
      date: recette?.date || new Date().toISOString().split('T')[0],
      categorie: recette?.categorie || CATEGORIES[0]
    }
  });

  // Assurer que la catégorie dans le formulaire est synchronisée avec l'état local
  useEffect(() => {
    setValue('categorie', selectedCategorie);
  }, [selectedCategorie, setValue]);
  
  const watchCategorie = watch('categorie');

  const processSubmit = async (data: FormValues) => {
    const formattedData = {
      titre: data.titre,
      montant: parseFloat(data.montant.replace(',', '.')),
      date: data.date,
      categorie: data.categorie
    };
    
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 py-2">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="titre">Titre</Label>
          <Input
            id="titre"
            placeholder="Titre de la recette"
            {...register("titre", { required: "Le titre est requis" })}
            className="w-full"
          />
          {errors.titre && (
            <p className="text-sm text-red-500">{errors.titre.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="montant">Montant (TND)</Label>
          <Input
            id="montant"
            placeholder="0.000"
            {...register("montant", { 
              required: "Le montant est requis",
              pattern: {
                value: /^[0-9]+([,.][0-9]{1,3})?$/,
                message: "Format invalide. Utiliser le format 0.000"
              }
            })}
            className="w-full"
          />
          {errors.montant && (
            <p className="text-sm text-red-500">{errors.montant.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "La date est requise" })}
            className="w-full"
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="categorie">Catégorie</Label>
          <Select 
            value={selectedCategorie}
            onValueChange={(value) => {
              setSelectedCategorie(value);
              setValue('categorie', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((categorie) => (
                <SelectItem key={categorie} value={categorie}>
                  {categorie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : recette ? (
            "Mettre à jour"
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </form>
  );
};

export default RecetteForm;
