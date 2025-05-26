
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const supportFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  subject: z.string().min(5, {
    message: "Le sujet doit comporter au moins 5 caractères",
  }),
  message: z.string().min(10, {
    message: "Le message doit comporter au moins 10 caractères",
  }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

const Support = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulation d'envoi (à remplacer par l'intégration réelle avec Supabase)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.");
      form.reset();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du message.");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <LifeBuoy className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-500">Contactez-nous pour toute question ou assistance</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Formulaire de contact</CardTitle>
            <CardDescription>
              Envoyez-nous un message et nous vous répondrons dans les plus brefs délais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="votre@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sujet</FormLabel>
                      <FormControl>
                        <Input placeholder="Sujet de votre message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Détaillez votre demande ici..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Autres moyens de contact</CardTitle>
            <CardDescription>
              Choisissez le moyen de communication qui vous convient le mieux
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Notre équipe vous répondra sous 24-48h ouvrées
                </p>
                <a 
                  href="mailto:support@trezo.app" 
                  className="text-blue-600 hover:underline mt-1 block"
                >
                  support@trezo.app
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Disponible du lundi au vendredi, 9h-17h
                </p>
                <a 
                  href="tel:+21671000000" 
                  className="text-blue-600 hover:underline mt-1 block"
                >
                  +216 71 000 000
                </a>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <MessageSquare className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Chat en direct</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Notre équipe est disponible pour un chat en direct durant les heures ouvrables
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => toast.info("Le chat en direct sera disponible prochainement")}
                >
                  Démarrer un chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
          <CardDescription>
            Consultez notre FAQ pour trouver rapidement des réponses à vos questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Comment puis-je modifier mon abonnement ?</h3>
            <p className="text-gray-600 mt-2">
              Vous pouvez modifier votre abonnement à tout moment en vous rendant dans la section "Paramètres" puis "Abonnement". Vous pourrez y choisir le forfait qui correspond le mieux à vos besoins.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Comment ajouter un nouvel utilisateur à mon organisation ?</h3>
            <p className="text-gray-600 mt-2">
              En tant qu'administrateur, rendez-vous dans la section "Admin" pour gérer les utilisateurs de votre organisation. Vous pourrez y inviter de nouveaux membres et définir leurs rôles et permissions.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Mes données sont-elles sécurisées ?</h3>
            <p className="text-gray-600 mt-2">
              Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous utilisons les dernières technologies de sécurité pour protéger vos informations et respectons strictement les normes RGPD.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
