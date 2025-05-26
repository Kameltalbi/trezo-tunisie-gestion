
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Building, Banknote, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentUnavailable = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement par carte bientôt disponible
          </h1>
          <p className="text-lg text-gray-600">
            Cette option de paiement sera disponible prochainement
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Modes de paiement disponibles</CardTitle>
            <CardDescription>
              En attendant, vous pouvez utiliser ces méthodes de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Building className="h-8 w-8 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-emerald-700">Virement bancaire</h3>
                <p className="text-sm text-gray-600">Paiement sécurisé sans frais supplémentaires</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Banknote className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-700">Paiement en espèces</h3>
                <p className="text-sm text-gray-600">Paiement en personne dans nos locaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="pt-6">
            <h3 className="font-medium text-blue-900 mb-3">Informations bancaires :</h3>
            <div className="space-y-2 text-sm text-blue-800">
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
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link to="/checkout">
            <Button variant="outline" size="lg" className="px-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au checkout
            </Button>
          </Link>
          
          <div>
            <p className="text-sm text-gray-500">
              Une question ? Contactez notre équipe support à support@trezo.pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUnavailable;
