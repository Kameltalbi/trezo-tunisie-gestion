
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recette } from "../types";
import { CATEGORIES, SOUS_CATEGORIES, RECURRENCE_OPTIONS } from "../services/recetteService";
import { Loader2, Repeat, List } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  sousCategorie: string;
  recurrence: string;
}

const RecetteForm = ({ recette, onSubmit, isSubmitting, onCancel }: RecetteFormProps) => {
  const { t } = useTranslation();
  
  const [selectedCategorie, setSelectedCategorie] = useState<string>(recette?.categorie || CATEGORIES[0]);
  const [selectedSousCategorie, setSelectedSousCategorie] = useState<string>(
    recette?.sousCategorie || (SOUS_CATEGORIES[recette?.categorie || CATEGORIES[0]]?.[0] || "")
  );
  const [selectedRecurrence, setSelectedRecurrence] = useState<string>(
    recette?.recurrence || "aucune"
  );

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      titre: recette?.titre || '',
      montant: recette ? String(recette.montant) : '',
      date: recette?.date || new Date().toISOString().split('T')[0],
      categorie: recette?.categorie || CATEGORIES[0],
      sousCategorie: recette?.sousCategorie || (SOUS_CATEGORIES[recette?.categorie || CATEGORIES[0]]?.[0] || ""),
      recurrence: recette?.recurrence || "aucune"
    }
  });

  // Assurer que les valeurs dans le formulaire sont synchronisées avec les états locaux
  useEffect(() => {
    setValue('categorie', selectedCategorie);
    
    // Réinitialiser la sous-catégorie lorsque la catégorie change
    if (SOUS_CATEGORIES[selectedCategorie]) {
      const defaultSousCategorie = SOUS_CATEGORIES[selectedCategorie][0];
      setSelectedSousCategorie(defaultSousCategorie);
      setValue('sousCategorie', defaultSousCategorie);
    }
  }, [selectedCategorie, setValue]);
  
  useEffect(() => {
    setValue('sousCategorie', selectedSousCategorie);
  }, [selectedSousCategorie, setValue]);
  
  useEffect(() => {
    setValue('recurrence', selectedRecurrence);
  }, [selectedRecurrence, setValue]);

  const processSubmit = async (data: FormValues) => {
    const formattedData = {
      titre: data.titre,
      montant: parseFloat(data.montant.replace(',', '.')),
      date: data.date,
      categorie: data.categorie,
      sousCategorie: data.sousCategorie,
      recurrence: data.recurrence as Recette["recurrence"]
    };
    
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6 py-2">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="titre">{t('recette_form.title')}</Label>
          <Input
            id="titre"
            placeholder={t('recette_form.title_placeholder')}
            {...register("titre", { required: t('recette_form.title_required') })}
            className="w-full"
          />
          {errors.titre && (
            <p className="text-sm text-red-500">{errors.titre.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="montant">{t('recette_form.amount')}</Label>
          <Input
            id="montant"
            placeholder={t('recette_form.amount_placeholder')}
            {...register("montant", { 
              required: t('recette_form.amount_required'),
              pattern: {
                value: /^[0-9]+([,.][0-9]{1,3})?$/,
                message: t('recette_form.amount_invalid')
              }
            })}
            className="w-full"
          />
          {errors.montant && (
            <p className="text-sm text-red-500">{errors.montant.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">{t('recette_form.date')}</Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: t('recette_form.date_required') })}
            className="w-full"
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="categorie" className="flex items-center gap-2">
            <List size={16} />
            {t('recette_form.category')}
          </Label>
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
                  {t(`categories.${categorie}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sousCategorie" className="flex items-center gap-2">
            <List size={16} />
            {t('recette_form.subcategory')}
          </Label>
          <Select 
            value={selectedSousCategorie}
            onValueChange={(value) => {
              setSelectedSousCategorie(value);
              setValue('sousCategorie', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {SOUS_CATEGORIES[selectedCategorie]?.map((sousCategorie) => (
                <SelectItem key={sousCategorie} value={sousCategorie}>
                  {t(`subcategories.${sousCategorie}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recurrence" className="flex items-center gap-2">
            <Repeat size={16} />
            {t('recette_form.recurrence')}
          </Label>
          <Select 
            value={selectedRecurrence}
            onValueChange={(value) => {
              setSelectedRecurrence(value);
              setValue('recurrence', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une récurrence" />
            </SelectTrigger>
            <SelectContent>
              {RECURRENCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(`recurrence.${option.value}`)}
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
          {t('recette_form.cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('recette_form.processing')}
            </>
          ) : recette ? (
            t('recette_form.update')
          ) : (
            t('recette_form.add')
          )}
        </Button>
      </div>
    </form>
  );
};

export default RecetteForm;
