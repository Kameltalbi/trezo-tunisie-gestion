
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plan } from '@/hooks/usePlans';
import PaymentProofForm from './PaymentProofForm';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';

interface PaymentMethodSelectionProps {
  plan: Plan;
  showTrialOption?: boolean;
  onTrialStart?: () => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({ 
  plan, 
  showTrialOption = true, 
  onTrialStart 
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="space-y-4">
      {showTrialOption && (
        <Button 
          onClick={onTrialStart}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Clock className="mr-2 h-4 w-4" />
          Commencer l'essai gratuit (14 jours)
        </Button>
      )}

      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Payer maintenant par chèque ou virement
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Paiement du plan {plan.name}</DialogTitle>
            <DialogDescription>
              Envoyez votre paiement et téléchargez la preuve pour activer votre compte immédiatement.
            </DialogDescription>
          </DialogHeader>
          <PaymentProofForm 
            plan={plan} 
            onSuccess={() => setShowPaymentForm(false)} 
          />
        </DialogContent>
      </Dialog>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Activation manuelle sous 24h après réception du paiement
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
