
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Ce composant n'est plus nécessaire sans Supabase
// Redirection vers une page de contact ou suppression
const PaymentProofForm: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fonctionnalité non disponible</CardTitle>
        <CardDescription>
          Cette fonctionnalité n'est plus disponible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => window.history.back()}>
          Retour
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProofForm;
