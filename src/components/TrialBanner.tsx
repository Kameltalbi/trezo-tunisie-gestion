
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserCurrentPlan } from "@/hooks/useUserCurrentPlan";

const TrialBanner: React.FC = () => {
  const { data: currentPlan } = useUserCurrentPlan();

  if (!currentPlan?.is_trial || !currentPlan.trial_end_date) {
    return null;
  }

  const trialEndDate = new Date(currentPlan.trial_end_date);
  const now = new Date();
  const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <Clock className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex justify-between items-center">
            <span>Votre essai gratuit a expiré. Souscrivez à un plan pour continuer.</span>
            <Link to="/subscription">
              <Button variant="default" size="sm">
                <Crown className="mr-2 h-4 w-4" />
                Choisir un plan
              </Button>
            </Link>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const isUrgent = daysLeft <= 3;

  return (
    <Alert className={`mb-4 ${isUrgent ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <Clock className={`h-4 w-4 ${isUrgent ? 'text-orange-600' : 'text-blue-600'}`} />
      <AlertDescription className={isUrgent ? 'text-orange-800' : 'text-blue-800'}>
        <div className="flex justify-between items-center">
          <span>
            Essai gratuit : {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
            {currentPlan.plan_name && ` (Plan ${currentPlan.plan_name})`}
          </span>
          <Link to="/subscription">
            <Button variant={isUrgent ? "default" : "outline"} size="sm">
              <Crown className="mr-2 h-4 w-4" />
              Souscrire maintenant
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner;
