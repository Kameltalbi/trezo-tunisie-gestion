
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Currency } from 'lucide-react';
import { toast } from "sonner";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";

interface CurrencyForm {
  currency_code: string;
  currency_symbol: string;
}

interface CurrencySettingsProps {
  isSuperAdmin: boolean;
}

const CurrencySettings = ({ isSuperAdmin }: CurrencySettingsProps) => {
  const { data: profile } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CurrencyForm>({
    defaultValues: {
      currency_code: profile?.currency_code || 'TND',
      currency_symbol: profile?.currency_symbol || 'DT'
    }
  });

  React.useEffect(() => {
    if (profile) {
      reset({
        currency_code: profile.currency_code || 'TND',
        currency_symbol: profile.currency_symbol || 'DT'
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: CurrencyForm) => {
    try {
      await updateProfile.mutateAsync({
        currency_code: data.currency_code.toUpperCase(),
        currency_symbol: data.currency_symbol
      });
      
      toast.success(`✅ La devise a été mise à jour. Tous les montants s'afficheront en ${data.currency_symbol}.`);
      setIsEditing(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la devise");
      console.error('Erreur:', error);
    }
  };

  const canEdit = isSuperAdmin; // Seuls les admins peuvent modifier

  return (
    <Card className="border-blue-200 bg-gray-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Currency className="h-5 w-5 text-blue-600" />
          Devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Affichage de la devise actuelle */}
        <div className="p-4 bg-white rounded-lg border">
          <Label className="text-sm font-medium text-gray-600">Devise actuelle</Label>
          <p className="text-lg font-semibold text-gray-900">
            {profile?.currency_code || 'TND'} ({profile?.currency_symbol || 'DT'})
          </p>
        </div>

        {canEdit ? (
          <>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full"
                variant="outline"
              >
                Modifier la devise
              </Button>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency_code">Code devise</Label>
                    <Input
                      id="currency_code"
                      {...register("currency_code", {
                        required: "Le code devise est requis",
                        maxLength: { value: 5, message: "Maximum 5 caractères" },
                        pattern: {
                          value: /^[A-Z]+$/,
                          message: "Seules les lettres majuscules sont autorisées"
                        }
                      })}
                      placeholder="ex: TND, EUR, USD"
                      className="uppercase"
                      maxLength={5}
                    />
                    {errors.currency_code && (
                      <p className="text-sm text-red-600">{errors.currency_code.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency_symbol">Symbole</Label>
                    <Input
                      id="currency_symbol"
                      {...register("currency_symbol", {
                        required: "Le symbole est requis",
                        maxLength: { value: 10, message: "Maximum 10 caractères" }
                      })}
                      placeholder="ex: DT, €, $, FCFA"
                      maxLength={10}
                    />
                    {errors.currency_symbol && (
                      <p className="text-sm text-red-600">{errors.currency_symbol.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending}
                    className="flex-1"
                  >
                    {updateProfile.isPending ? "Mise à jour..." : "Mettre à jour la devise"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              La devise est définie par l'administrateur du compte.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
