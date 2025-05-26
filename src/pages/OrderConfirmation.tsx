
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Merci pour votre commande !
          </h1>
          <p className="text-lg text-gray-600">
            Votre demande d'abonnement a été créée avec succès
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Prochaines étapes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium">Confirmation par email</h3>
                <p className="text-sm text-gray-600">
                  Vous recevrez un email de confirmation avec tous les détails de votre commande dans quelques minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium">Traitement du paiement</h3>
                <p className="text-sm text-gray-600">
                  Dès réception de votre virement bancaire, notre équipe procédera à l'activation de votre compte.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium">Activation du compte</h3>
                <p className="text-sm text-gray-600">
                  Vous serez notifié par email dès que votre compte sera activé et vous pourrez accéder à toutes les fonctionnalités.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Rappel des informations bancaires</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Banque :</strong> Banque Internationale Arabe de Tunisie (BIAT)</div>
                  <div><strong>Numéro de compte :</strong> 08104000013729000038</div>
                  <div><strong>RIB :</strong> 08 104 0000137290000 38</div>
                  <div><strong>Bénéficiaire :</strong> ABC SARL</div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <p className="text-yellow-800 text-sm">
                    <strong>Important :</strong> N'oubliez pas de mentionner votre email dans la référence du virement
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/">
            <Button size="lg" className="px-8">
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Une question ? Contactez notre équipe support à support@trezo.pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
