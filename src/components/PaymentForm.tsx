import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Building, Banknote } from "lucide-react";
import { Plan } from "@/hooks/usePlans";

interface PaymentFormProps {
  plan: Plan;
  onSubmit: (data: {
    payment_method: 'bank_transfer' | 'card' | 'cash';
    bank_details?: any;
    notes?: string;
  }) => void;
  isLoading: boolean;
}

const PaymentForm = ({ plan, onSubmit, isLoading }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'card' | 'cash'>('bank_transfer');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handlePaymentMethodChange = (value: string) => {
    if (value === 'card') {
      navigate('/payment-unavailable');
      return;
    }
    setPaymentMethod(value as 'bank_transfer' | 'cash');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bankDetails = paymentMethod === 'bank_transfer' ? {
      bank_name: "Banque Internationale Arabe de Tunisie (BIAT)",
      account_number: "08104000013729000038",
      rib: "08 104 0000137290000 38",
      recipient: "ABC SARL"
    } : undefined;

    onSubmit({
      payment_method: paymentMethod,
      bank_details: bankDetails,
      notes: notes || undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finaliser votre commande</CardTitle>
        <CardDescription>
          Plan sélectionné: {plan.name} - {plan.price} {plan.currency}/an
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-medium">Mode de paiement</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
              className="mt-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Building className="h-5 w-5 text-gray-500" />
                <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Virement bancaire</div>
                  <div className="text-sm text-gray-500">Recommandé - Aucun frais supplémentaire</div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-gray-500" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="font-medium">Carte bancaire</div>
                  <div className="text-sm text-gray-500">Bientôt disponible</div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="cash" id="cash" />
                <Banknote className="h-5 w-5 text-gray-500" />
                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                  <div className="font-medium">Espèces</div>
                  <div className="text-sm text-gray-500">Paiement en personne</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3">Informations bancaires :</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Banque :</strong> Banque Internationale Arabe de Tunisie (BIAT)</div>
                  <div><strong>Numéro de compte :</strong> 08104000013729000038</div>
                  <div><strong>RIB :</strong> 08 104 0000137290000 38</div>
                  <div><strong>Bénéficiaire :</strong> ABC SARL</div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <p className="text-yellow-800 text-sm">
                      <strong>Important :</strong> Veuillez mentionner votre email dans la référence du virement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total à payer :</span>
              <span className="text-2xl font-bold text-emerald-600">
                {plan.price} {plan.currency}
              </span>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Traitement..." : "Confirmer la commande"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
