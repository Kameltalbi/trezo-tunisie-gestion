
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlans } from "@/hooks/usePlans";
import { useCreateSubscription } from "@/hooks/useSubscriptions";
import { useCreatePayment } from "@/hooks/usePayments";
import { Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "@/components/PaymentForm";

const Checkout = () => {
  const navigate = useNavigate();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const createSubscription = useCreateSubscription();
  const createPayment = useCreatePayment();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const handlePayment = async (paymentData: {
    payment_method: 'bank_transfer' | 'card' | 'cash';
    bank_details?: any;
    notes?: string;
  }) => {
    if (!selectedPlan) return;

    try {
      const plan = plans?.find(p => p.id === selectedPlan);
      if (!plan) throw new Error("Plan non trouvé");

      // Create subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);
      
      const subscription = await createSubscription.mutateAsync({
        plan_id: selectedPlan,
        end_date: endDate.toISOString(),
      });

      // Create payment
      await createPayment.mutateAsync({
        subscription_id: subscription.id,
        amount: plan.price,
        payment_method: paymentData.payment_method,
        bank_details: paymentData.bank_details,
        notes: paymentData.notes,
      });

      toast.success("Commande créée avec succès ! Vous recevrez un email de confirmation.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      toast.error("Erreur lors de la création de la commande");
    }
  };

  if (plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Chargement des plans...</div>
      </div>
    );
  }

  if (showPaymentForm && selectedPlan) {
    const plan = plans?.find(p => p.id === selectedPlan);
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button 
            variant="ghost" 
            onClick={() => setShowPaymentForm(false)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux plans
          </Button>
          
          <PaymentForm 
            plan={plan!}
            onSubmit={handlePayment}
            isLoading={createSubscription.isPending || createPayment.isPending}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans?.map((plan) => (
            <Card key={plan.id} className={plan.name === 'Pro' ? 'border-emerald-500 border-2 relative' : ''}>
              {plan.name === 'Pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white">
                    Le plus populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.name === 'Pro' ? 'Pour les particuliers et PME' : 'Pour les grandes organisations'}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {plan.price} {plan.currency}
                </div>
                <div className="text-sm text-gray-500 mb-6">par an</div>

                <ul className="text-sm text-gray-600 space-y-2 text-left mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  Choisir {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
