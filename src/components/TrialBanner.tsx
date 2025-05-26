
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Crown, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrialExpiration } from "@/hooks/useTrialExpiration";

const TrialBanner: React.FC = () => {
  const { isTrialActive, trialEndDate, daysLeft } = useTrialExpiration();

  if (!isTrialActive || !trialEndDate) {
    return null;
  }

  if (daysLeft <= 0) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex justify-between items-center">
            <span>Votre essai gratuit a expiré. Souscrivez à un plan pour continuer.</span>
            <Link to="/checkout">
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
            {isUrgent ? (
              <strong>⚠️ Attention : </strong>
            ) : null}
            Essai gratuit : {daysLeft} jour{daysLeft > 1 ? 's' : ''} restant{daysLeft > 1 ? 's' : ''}
            {isUrgent && (
              <span className="block text-sm mt-1">
                Votre essai expire le {trialEndDate.toLocaleDateString('fr-FR')}. 
                Souscrivez maintenant pour éviter toute interruption.
              </span>
            )}
          </span>
          <Link to="/checkout">
            <Button variant={isUrgent ? "default" : "outline"} size="sm">
              <Crown className="mr-2 h-4 w-4" />
              {isUrgent ? "Souscrire maintenant" : "Voir les plans"}
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner;
