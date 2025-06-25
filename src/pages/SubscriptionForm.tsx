
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Phone, CheckCircle } from "lucide-react";

interface SubscriptionFormData {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  paymentMethod: string;
  billingAddress?: string;
}

const SubscriptionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<SubscriptionFormData>();

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      // Simulation de l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Demande de souscription:', data);
      setIsSubmitted(true);
      toast.success("Demande envoyée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la demande");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Merci pour votre demande !
              </h2>
              <p className="text-gray-600 mb-6">
                Vous recevrez la facture par email sous 24h.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-[#27548a] hover:bg-[#1e4772]"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Souscrire à Trezo Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vous bénéficiez d'un tarif de lancement à 570 DT/an (ou 250 €/an). 
            L'abonnement sera activé dès réception de votre règlement.
          </p>
          <Badge className="mt-4 bg-red-500 text-white px-4 py-2">
            Offre de lancement limitée
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations de souscription</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour recevoir votre facture par email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Nom complet */}
                  <div>
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName", { required: "Le nom complet est requis" })}
                      className="mt-1"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Société */}
                  <div>
                    <Label htmlFor="company">Société *</Label>
                    <Input
                      id="company"
                      {...register("company", { required: "Le nom de la société est requis" })}
                      className="mt-1"
                    />
                    {errors.company && (
                      <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Adresse email invalide"
                        }
                      })}
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      {...register("phone", { required: "Le téléphone est requis" })}
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Pays */}
                  <div>
                    <Label htmlFor="country">Pays *</Label>
                    <Select onValueChange={(value) => setValue("country", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tunisia">Tunisie</SelectItem>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="algeria">Algérie</SelectItem>
                        <SelectItem value="morocco">Maroc</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  {/* Mode de paiement */}
                  <div>
                    <Label htmlFor="paymentMethod">Mode de paiement *</Label>
                    <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez le mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  {/* Adresse de facturation (facultatif) */}
                  <div>
                    <Label htmlFor="billingAddress">Adresse de facturation (facultatif)</Label>
                    <Textarea
                      id="billingAddress"
                      {...register("billingAddress")}
                      rows={3}
                      className="mt-1"
                      placeholder="Adresse complète pour la facturation..."
                    />
                  </div>

                  {/* Bouton d'envoi */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#27548a] hover:bg-[#1e4772] text-white py-3"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Vous recevrez une facture par email avec les coordonnées bancaires.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Encadré contact */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <a 
                    href="mailto:contact@trezo.pro" 
                    className="text-blue-600 hover:underline"
                  >
                    contact@trezo.pro
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a 
                    href="tel:+21655053505" 
                    className="text-blue-600 hover:underline"
                  >
                    +216 55 053 505
                  </a>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Pour toute question, n'hésitez pas à nous contacter.
                </p>
              </CardContent>
            </Card>

            {/* Récapitulatif du plan */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Plan Trezo Pro</span>
                    <span className="font-semibold">1 an</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix Tunisie</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600">570 DT</span>
                      <span className="text-sm text-gray-500 line-through ml-2">650 DT</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix International</span>
                    <div className="text-right">
                      <span className="font-bold text-green-600">250 €</span>
                      <span className="text-sm text-gray-500 line-through ml-2">290 €</span>
                    </div>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">
                      ✅ Essai gratuit 14 jours<br/>
                      ✅ Toutes fonctionnalités incluses<br/>
                      ✅ Support client
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
