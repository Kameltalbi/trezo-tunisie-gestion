
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Currency, Plus } from 'lucide-react';
import { toast } from "sonner";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";

interface CurrencyForm {
  currency_code: string;
  currency_symbol: string;
}

interface CurrencySettingsProps {
  isSuperAdmin: boolean;
}

const PREDEFINED_CURRENCIES = [
  { code: 'TND', symbol: 'DT', name: 'Dinar Tunisien' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar Américain' },
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA Ouest Africain' },
  { code: 'MAD', symbol: 'د.م.', name: 'Dirham Marocain' },
  { code: 'DZD', symbol: 'د.ج', name: 'Dinar Algérien' },
  { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' }
];

const CurrencySettings = ({ isSuperAdmin }: CurrencySettingsProps) => {
  const { data: profile } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CurrencyForm>({
    defaultValues: {
      currency_code: '',
      currency_symbol: ''
    }
  });

  const currentCurrency = profile?.currency_code || 'TND';
  const currentSymbol = profile?.currency_symbol || 'DT';

  const handlePredefinedCurrencySelect = async (currency: typeof PREDEFINED_CURRENCIES[0]) => {
    try {
      await updateProfile.mutateAsync({
        currency_code: currency.code,
        currency_symbol: currency.symbol
      });
      
      toast.success(`✅ Devise mise à jour vers ${currency.name} (${currency.symbol})`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la devise");
      console.error('Erreur:', error);
    }
  };

  const onSubmitCustom = async (data: CurrencyForm) => {
    try {
      await updateProfile.mutateAsync({
        currency_code: data.currency_code.toUpperCase(),
        currency_symbol: data.currency_symbol
      });
      
      toast.success(`✅ Devise personnalisée ajoutée : ${data.currency_code} (${data.currency_symbol})`);
      setShowCustomForm(false);
      reset();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la devise personnalisée");
      console.error('Erreur:', error);
    }
  };

  const canEdit = isSuperAdmin;

  return (
    <Card className="border-blue-200 bg-gray-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Currency className="h-5 w-5 text-blue-600" />
          Devise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Devise actuelle */}
        <div className="p-4 bg-white rounded-lg border">
          <Label className="text-sm font-medium text-gray-600">Devise actuelle</Label>
          <p className="text-lg font-semibold text-gray-900">
            {currentCurrency} ({currentSymbol})
          </p>
        </div>

        {canEdit ? (
          <>
            {/* Liste des devises prédéfinies */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800">Devises populaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PREDEFINED_CURRENCIES.map((currency) => (
                  <div
                    key={currency.code}
                    className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                      currentCurrency === currency.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {currency.code} ({currency.symbol})
                      </div>
                      <div className="text-sm text-gray-600">{currency.name}</div>
                    </div>
                    {currentCurrency === currency.code ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Actuelle
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePredefinedCurrencySelect(currency)}
                        disabled={updateProfile.isPending}
                      >
                        Utiliser par défaut
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton pour ajouter une devise personnalisée */}
            {!showCustomForm ? (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomForm(true)}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une devise personnalisée
                </Button>
              </div>
            ) : (
              /* Formulaire devise personnalisée */
              <div className="pt-4 border-t space-y-4">
                <h3 className="text-md font-semibold text-gray-800">Ajouter votre devise</h3>
                <form onSubmit={handleSubmit(onSubmitCustom)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency_code">Code devise *</Label>
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
                        placeholder="ex: CAD, AUD, JPY"
                        className="uppercase"
                        maxLength={5}
                      />
                      {errors.currency_code && (
                        <p className="text-sm text-red-600">{errors.currency_code.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency_symbol">Symbole *</Label>
                      <Input
                        id="currency_symbol"
                        {...register("currency_symbol", {
                          required: "Le symbole est requis",
                          maxLength: { value: 10, message: "Maximum 10 caractères" }
                        })}
                        placeholder="ex: C$, A$, ¥"
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
                      {updateProfile.isPending ? "Ajout en cours..." : "Ajouter cette devise"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowCustomForm(false);
                        reset();
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </div>
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
