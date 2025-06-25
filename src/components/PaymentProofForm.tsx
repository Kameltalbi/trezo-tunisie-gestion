
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PaymentProofFormProps {
  plan?: any;
  onSuccess?: () => void;
}

// Ce composant n'est plus nécessaire sans Supabase
const PaymentProofForm: React.FC<PaymentProofFormProps> = ({ plan, onSuccess }) => {
  const handleBack = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      window.history.back();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fonctionnalité non disponible</CardTitle>
        <CardDescription>
          Cette fonctionnalité de paiement n'est plus disponible dans la version locale.
          {plan && ` Plan sélectionné: ${plan.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleBack}>
          Retour
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProofForm;
